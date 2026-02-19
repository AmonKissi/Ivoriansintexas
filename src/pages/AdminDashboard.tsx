import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, Newspaper, Calendar, ShieldCheck, 
  ArrowUpRight, UserCog, MoreHorizontal, Loader2,
  Ghost, Trash2, MailCheck, KeyRound, ArrowLeft, LayoutDashboard,
  Ban, RefreshCcw, Info,
  ShieldAlert
} from "lucide-react";
import API, { ENDPOINTS } from "@/lib/api-configs";
import { useUserRole, getRoleName, getRoleColor } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import defaultProfile from "@/assets/default.png";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";


const AdminDashboard = () => {
  const { checkUser } = useAuth(); 
  const { roleNumber, isOwner } = useUserRole();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [reportedPosts, setReportedPosts] = useState<any[]>([]);
  const [isMaintenance, setIsMaintenance] = useState(false);

  // Add to your initCommandCenter or a separate useEffect to fetch current status
const fetchSystemStatus = async () => {
  try {
    const { data } = await API.get('/admin/system-status'); // You'll need this endpoint
    setIsMaintenance(data.maintenance);
  } catch (err) {
    console.error("Failed to fetch system status");
  }
};

const handleToggleMaintenance = async () => {
  const action = isMaintenance ? "DEACTIVATE LOCKOUT" : "INITIATE SYSTEM MAINTENANCE";
  const desc = isMaintenance 
    ? "This will restore public access to the Texas Registry." 
    : "This will block all users below Level 4 Clearance. Only Admins will be able to log in.";

  if (!confirmAction(action, desc)) return;

  try {
    const { data } = await API.patch('/admin/system-status', { maintenance: !isMaintenance });
    setIsMaintenance(data.maintenance);
    toast({ 
      title: data.maintenance ? "System Locked" : "System Online", 
      description: data.maintenance ? "Maintenance protocol active." : "Public access restored." 
    });
  } catch (err) {
    toast({ variant: "destructive", title: "Protocol Error", description: "Could not update system status." });
  }
};

  const fetchReportedContent = async () => {
  try {
    const { data } = await API.get(ENDPOINTS.POSTS.FEED);
    // Filter posts that have at least one report in the array
    const flagged = data.filter((post: any) => post.reports && post.reports.length > 0);
    setReportedPosts(flagged);
  } catch (err) {
    console.error("Failed to fetch reports", err);
  }
};

const handleDismiss = async (postId: string) => {
  try {
    await API.put(ENDPOINTS.POSTS.DISMISS_REPORTS(postId));
    toast({ title: "Reports Dismissed", description: "Post cleared from queue." });
    fetchReportedContent(); // Refresh the list
  } catch (err) {
    toast({ variant: "destructive", title: "Action Failed" });
  }
};

  // 1. Initial Load: Sync User Permissions then Fetch Stats
 useEffect(() => {
  const initCommandCenter = async () => {
    try {
      await checkUser(); // Force sync Level 6 status
      await fetchStats();
      await fetchReportedContent(); 
      await fetchSystemStatus();
    } catch (err) {
      console.error("Initialization failed", err);
    }
  };
  initCommandCenter();
}, []);

  const fetchStats = async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);
    try {
      const { data } = await API.get(ENDPOINTS.ADMIN.STATS);
      setStats(data);
    } catch (err) {
      toast({ variant: "destructive", title: "Sync Failed", description: "Could not fetch administrative data." });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // --- SECURITY WRAPPER ---
  const confirmAction = (message: string, description: string) => {
    return window.confirm(`⚠️ SECURITY CHECK\n\nACTION: ${message}\n\nEFFECT: ${description}\n\nDo you wish to proceed?`);
  };

  // --- ADMINISTRATIVE ACTIONS ---

  const handleGhostLogin = async (userId: string) => {
    if (!confirmAction("GHOST LOGIN", "Infiltrating user account. Your current session will be replaced by theirs.")) return;
    try {
      const { data } = await API.post(ENDPOINTS.ADMIN.GHOST_LOGIN, { userId });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast({ title: "Ghost Mode Active", description: `Assuming identity: ${data.user.firstName}` });
      window.location.href = "/dashboard";
    } catch (err) {
      toast({ variant: "destructive", title: "Infiltration Failed" });
    }
  };

  const handleBanUserIP = async (userId: string) => {
    const reason = window.prompt("Enter reason for permanent IP Blacklist:");
    if (!reason) return;

    if (!confirmAction("PERMANENT IP BAN", "This will block this user's entire network access to AIT. This is a hard-block at the firewall level.")) return;

    try {
      await API.post(ENDPOINTS.ADMIN.BAN_IP, { userId, reason });
      toast({ variant: "destructive", title: "IP BLACKLISTED", description: "Network access revoked." });
      fetchStats(true);
    } catch (err) {
      toast({ variant: "destructive", title: "Ban Protocol Failed" });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirmAction("PURGE USER", "Irreversible deletion. All posts, events, and profile data will be erased from the registry.")) return;
    try {
      await API.delete(ENDPOINTS.ADMIN.DELETE_USER(userId));
      toast({ title: "Citizen Purged", description: "All records erased." });
      fetchStats(true);
    } catch (err) {
      toast({ variant: "destructive", title: "Purge Failed" });
    }
  };

  const handleDeletePost = async (postId: string) => {
  if (!window.confirm("CRITICAL: Permanently delete this reported post?")) return;
  try {
    await API.delete(`${ENDPOINTS.POSTS.BASE}/${postId}`);
    toast({ title: "Post Purged", description: "The reported content has been removed." });
    fetchReportedContent(); // Refresh the reports list
  } catch (err) {
    toast({ variant: "destructive", title: "Delete Failed" });
  }
};

  const handleResendVerification = async (userId: string) => {
    try {
      await API.post(ENDPOINTS.ADMIN.RESEND_VERIFY, { userId });
      toast({ title: "Email Sent", description: "Verification dispatch complete." });
    } catch (err) {
      toast({ variant: "destructive", title: "Dispatch Failed" });
    }
  };

  const handleTriggerReset = async (userId: string) => {
    if (!confirmAction("FORCE PASSWORD RESET", "User will be locked out until they complete the email-based reset process.")) return;
    try {
      await API.post(ENDPOINTS.ADMIN.TRIGGER_RESET, { userId });
      toast({ title: "Reset Link Sent", description: "Password override initiated." });
    } catch (err) {
      toast({ variant: "destructive", title: "Reset Failed" });
    }
  };

  const handleUpdateRole = async (userId: string, currentLevel: number) => {
    const nextLevel = currentLevel >= 5 ? 1 : currentLevel + 1;
    if (!confirmAction("ROLE TRANSITION", `Cycling user clearance to Level ${nextLevel} (${getRoleName(nextLevel)}).`)) return;
    try {
      await API.patch(ENDPOINTS.ADMIN.UPDATE_ROLE, { userId, newLevel: nextLevel });
      toast({ title: "Clearance Updated", description: `User is now ${getRoleName(nextLevel)}.` });
      fetchStats(true);
    } catch (err) {
      toast({ variant: "destructive", title: "Transition Failed" });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">Decrypting Secure Channels...</p>
      </div>
    );
  }

 return (
  <div className="p-6 max-w-7xl mx-auto space-y-8 pb-20">
    {/* 1. Header Section - EXACTLY AS YOU HAVE IT */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-center gap-4">
         <Button variant="outline" size="icon" className="rounded-full border-primary/20" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
         </Button>
         <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Command Center</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">
            {getRoleName(roleNumber)} Clearance: Active
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="rounded-full border-primary/20 text-[10px] font-bold uppercase tracking-widest gap-2"
          onClick={() => fetchStats(true)}
          disabled={isRefreshing}
        >
          <RefreshCcw size={14} className={isRefreshing ? "animate-spin" : ""} />
          Refresh Pulse
        </Button>
        <Link to="/dashboard">
          <Button className="rounded-full text-[10px] font-bold uppercase tracking-widest gap-2 px-6">
            <LayoutDashboard size={14} /> Exit to App
          </Button>
        </Link>
      </div>
    </div>

    {/* 2. Key Metrics Grid - EXACTLY AS YOU HAVE IT */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Total Citizens" value={stats?.summary?.totalUsers || 0} icon={<Users size={20}/>} trend={`${stats?.summary?.verifiedUsers || 0} Verified`} />
      <StatCard title="System Pulse" value={stats?.summary?.totalPosts || 0} icon={<Newspaper size={20}/>} trend="User Posts" />
      <StatCard title="TX Schedule" value={stats?.summary?.totalEvents || 0} icon={<Calendar size={20}/>} trend="Upcoming Events" />
      <StatCard title="Registry Health" value={`${stats?.summary?.verificationRate || 0}%`} icon={<ShieldCheck size={20}/>} trend="Security Audit" />
    </div>

    {/* --- NEW TABS WRAPPER --- */}
    <Tabs defaultValue="registry" className="w-full">
      <TabsList className="bg-muted/50 p-1 rounded-full mb-6 inline-flex border border-border/40">
        <TabsTrigger value="registry" className="rounded-full px-6 text-[10px] font-black uppercase tracking-widest gap-2">
          <Users size={14} /> Citizen Registry
        </TabsTrigger>
        <TabsTrigger value="reports" className="rounded-full px-6 text-[10px] font-black uppercase tracking-widest gap-2 relative">
          <ShieldAlert size={14} className={reportedPosts.length > 0 ? "text-amber-500 animate-pulse" : ""} />
          Flagged Content
          {reportedPosts.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] h-4 w-4 rounded-full flex items-center justify-center">
              {reportedPosts.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      {/* TAB 1: YOUR ORIGINAL CONTENT (Registry) */}
      <TabsContent value="registry">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* YOUR EXISTING CITIZEN TABLE CARD */}
          <Card className="lg:col-span-2 border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-card/50 backdrop-blur-md border border-border/40">
            <CardHeader className="border-b border-border/40 p-6">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 opacity-60">
                <Users className="text-primary" size={16}/> Identity Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-muted/30 text-[9px] uppercase font-black tracking-widest opacity-40">
                      <th className="px-6 py-4">Citizen</th>
                      <th className="px-6 py-4">Clearance</th>
                      <th className="px-6 py-4 text-right">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/10">
                    {stats?.recentUsers?.map((u: any) => (
                      <tr key={u._id} className="hover:bg-primary/5 transition-colors group">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-primary/10">
                            <AvatarImage src={u.profileImage || defaultProfile} />
                            <AvatarFallback className="font-bold">{u.firstName?.[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-black text-xs uppercase italic tracking-tight">{u.firstName} {u.lastName}</p>
                            <p className="text-[9px] opacity-40 font-mono uppercase">{u.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn("px-3 py-1 rounded-full text-[8px] font-black uppercase border tracking-tighter", getRoleColor(u.level))}>
                            {getRoleName(u.level)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-primary transition-all">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 rounded-2xl font-bold uppercase text-[9px] p-2 shadow-2xl">
                              <DropdownMenuLabel className="flex items-center gap-2 px-3 py-2 opacity-50 italic">
                                Command Protocol
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <CommandItem icon={<MailCheck size={14} className="text-blue-500" />} label="Resend Verify" desc="Re-trigger identity verification email." onClick={() => handleResendVerification(u._id)} />
                              <CommandItem icon={<KeyRound size={14} className="text-amber-500" />} label="Force Reset" desc="Invalidate password and send reset link." onClick={() => handleTriggerReset(u._id)} />
                              {isOwner && (
                                <>
                                  <DropdownMenuSeparator />
                                  <CommandItem icon={<UserCog size={14} className="text-primary" />} label="Cycle Role" desc="Increase clearance level or reset to level 1." onClick={() => handleUpdateRole(u._id, u.level)} />
                                  <CommandItem icon={<Ghost size={14} className="text-orange-600" />} label="Ghost Mode" desc="Login and operate as this citizen." onClick={() => handleGhostLogin(u._id)} />
                                  <DropdownMenuSeparator />
                                  <CommandItem icon={<Ban size={14} className="text-red-600" />} label="IP Ban (Critical)" desc="Permanent network blacklist for this user." onClick={() => handleBanUserIP(u._id)} className="text-red-600 bg-red-50 hover:bg-red-100" />
                                  <CommandItem icon={<Trash2 size={14} className="text-destructive" />} label="Purge Citizen" desc="Delete all trace of user from servers." onClick={() => handleDeleteUser(u._id)} className="text-destructive hover:bg-red-50" />
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* YOUR EXISTING HIERARCHY SIDEBAR */}
<div className="space-y-6">
  {/* NEW: SYSTEM PROTOCOL (MAINTENANCE TOGGLE) */}
  {isOwner && (
    <Card className="border-none shadow-xl rounded-[2rem] bg-slate-900 text-white p-6 overflow-hidden relative border border-white/10">
      {/* Background Graphic */}
      <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12">
        <ShieldAlert size={120} />
      </div>
      
      <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-2 relative z-10">
        <LayoutDashboard size={14}/> System Protocol
      </CardTitle>
      
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5">
          <span className="text-[9px] font-black uppercase italic text-white/70">Registry Status</span>
          <span className={cn(
            "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter",
            isMaintenance ? "bg-red-500 text-white animate-pulse" : "bg-green-500 text-white"
          )}>
            {isMaintenance ? "Maintenance Active" : "Fully Operational"}
          </span>
        </div>
        
        <Button 
          variant={isMaintenance ? "default" : "destructive"}
          className={cn(
            "w-full rounded-xl font-black uppercase text-[9px] tracking-[0.2em] h-12 transition-all shadow-lg",
            isMaintenance ? "bg-white text-slate-900 hover:bg-white/90" : "bg-red-600 hover:bg-red-700"
          )}
          onClick={handleToggleMaintenance}
        >
          {isMaintenance ? "Disable Lockout" : "Initiate Lockout"}
        </Button>
      </div>
    </Card>
  )}

  {/* EXISTING: NODE DISTRIBUTION */}
  <Card className="border-none shadow-xl rounded-[2rem] bg-card/50 backdrop-blur-md border border-border/40 p-6">
    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-6 flex items-center gap-2">
      <UserCog size={14}/> Node Distribution
    </CardTitle>
    <div className="space-y-6">
      {stats?.usersByLevel?.map((lg: any) => (
        <div key={lg._id} className="space-y-2">
          <div className="flex justify-between text-[9px] font-black uppercase italic">
            <span>{getRoleName(lg._id)}</span>
            <span className="text-primary font-mono">{lg.count}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${(lg.count / (stats?.summary?.totalUsers || 1)) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  </Card>

  {/* EXISTING: SESSION INFO */}
  <Card className="border-none shadow-xl rounded-[2rem] bg-amber-500/5 p-6 border border-dashed border-amber-500/20 text-center">
    <p className="text-[9px] font-black uppercase opacity-60 leading-relaxed italic">
      Level 6 Session Active. <br/> All administrative protocols are logged.
    </p>
  </Card>
</div>
        </div>
      </TabsContent>

      {/* TAB 2: NEW REPORTED CONTENT SECTION */}
      <TabsContent value="reports" className="space-y-4">
        {reportedPosts.length === 0 ? (
          <Card className="p-20 text-center border-dashed border-2 bg-muted/20 rounded-[2.5rem]">
            <ShieldCheck className="mx-auto mb-4 opacity-10" size={64} />
            <p className="text-xs font-black uppercase tracking-[0.3em] opacity-30 italic text-primary">
              All Clear. Texas Registry is Secure.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportedPosts.map((post) => (
              <Card key={post._id} className="p-6 border-none shadow-xl rounded-[2rem] bg-amber-500/5 border border-amber-500/20 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10 border border-amber-500/20">
                      <AvatarImage src={post.author?.profileImage || defaultProfile} />
                    </Avatar>
                    <div>
                      <p className="text-[10px] font-black uppercase italic tracking-tight leading-none">
                        {post.author?.firstName} {post.author?.lastName}
                      </p>
                      <p className="text-[8px] opacity-40 font-bold uppercase mt-1">
                        Reported Transmission
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
  <Button 
    variant="ghost" 
    size="icon" 
    className="h-8 w-8 rounded-full hover:bg-amber-500/20 text-amber-600" 
    onClick={() => handleDismiss(post._id)}
  >
    <RefreshCcw size={14} />
  </Button>
  
  {/* THIS NOW HAS A VALID FUNCTION TO CALL */}
  <Button 
    variant="ghost" 
    size="icon" 
    className="h-8 w-8 rounded-full hover:bg-red-500/20 text-red-600" 
    onClick={() => handleDeletePost(post._id)}
  >
    <Trash2 size={14} />
  </Button>
</div>
                </div>
                <p className="text-xs font-medium bg-white/50 p-4 rounded-2xl border border-white/40 mb-4 italic shadow-inner">
                  "{post.content}"
                </p>
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase text-amber-600 tracking-widest">Incident Reports:</p>
                  {post.reports?.map((r: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-[9px] bg-white/80 p-2 rounded-lg border border-amber-100 font-bold uppercase shadow-sm">
                      <ShieldAlert size={10} className="text-amber-500" />
                      {r.reason || "Unspecified Violation"}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  </div>
);
};

// --- HELPERS ---

const StatCard = ({ title, value, icon, trend }: any) => (
  <Card className="border-none shadow-md rounded-[2.5rem] bg-card p-8 relative group transition-all hover:-translate-y-2 border border-border/20">
    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-primary">
      {icon}
    </div>
    <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">{title}</p>
    <div className="flex items-baseline gap-2">
      <h3 className="text-4xl font-black italic tracking-tighter leading-none">{value}</h3>
      <span className="text-[8px] font-black text-primary flex items-center gap-0.5">
        <ArrowUpRight size={10}/> {trend}
      </span>
    </div>
  </Card>
);

const CommandItem = ({ icon, label, desc, onClick, className }: any) => (
  <DropdownMenuItem onClick={onClick} className={cn("flex flex-col items-start gap-1 py-3 px-3 rounded-xl cursor-pointer", className)}>
    <div className="flex items-center gap-2 font-black italic">
      {icon}
      <span>{label}</span>
    </div>
    <span className="text-[8px] opacity-50 lowercase font-medium leading-none">{desc}</span>
  </DropdownMenuItem>
);

export default AdminDashboard;