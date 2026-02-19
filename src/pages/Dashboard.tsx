import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import API, { ENDPOINTS } from "@/lib/api-configs";
import DashboardHeader from "@/components/DashboardHeader";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Users,
  Calendar,
  MapPin,
  Newspaper,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  Info,
  ArrowUpRight,
  PlusCircle,
  UserCheck,
  UserPlus,
  X,
  Check,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getRoleColor } from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";

// Sub-components
import CommunityFeed from "@/components/dashboard/CommunityFeed";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import defaultProfile from "@/assets/default.png";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feed");
  const [isSending, setIsSending] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get(ENDPOINTS.USERS.PROFILE());
      setProfile(data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // --- SOCIAL ACTIONS ---
  const handleAcceptRequest = async (requesterId: string) => {
    try {
      await API.post(ENDPOINTS.USERS.ACCEPT(requesterId));
      toast({ title: "Connected!", description: "You have a new friend." });
      fetchProfile(); // Refresh lists
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Could not accept request." });
    }
  };

  const handleUnfriend = async (targetId: string) => {
    if (!confirm("Are you sure you want to remove this connection?")) return;
    try {
      await API.delete(ENDPOINTS.USERS.UNFRIEND(targetId));
      toast({ title: "Removed", description: "Connection removed." });
      fetchProfile();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to remove friend." });
    }
  };

  const handleResendEmail = async () => {
    if (isSending) return;
    setIsSending(true);
    try {
      await API.post(ENDPOINTS.AUTH.RESEND_VERIFICATION, { email: profile?.email });
      toast({ title: "Email Sent! 🇨🇮", description: "Please check your inbox." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: "Could not resend email." });
    } finally {
      setIsSending(false);
    }
  };

  const strength = (() => {
    if (!profile) return 0;
    let score = 0;
    if (profile.isVerified) score += 85;
    if (profile.profileImage) score += 10;
    if (profile.bio || profile.city) score += 5;
    return score;
  })();

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-background">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN */}
          <div className="w-full lg:w-1/4 space-y-6">
            <Card className="p-6 text-center border-none shadow-lg bg-card relative overflow-hidden">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-orange-100 mx-auto p-1 border-2 border-primary/20 shadow-inner overflow-hidden flex items-center justify-center">
                  <img
                    src={profile?.profileImage || defaultProfile}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 mb-1">
                <h2 className="font-bold text-xl text-foreground truncate max-w-[150px]">
                  {profile?.firstName} {profile?.lastName}
                </h2>
                {profile?.isVerified && <CheckCircle2 size={18} className="text-green-500" />}
              </div>

              <span className={cn("inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", getRoleColor(profile?.level))}>
                {profile?.level >= 5 ? "Admin" : "Member"}
              </span>

              <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-2">
                <div>
                  <p className="text-lg font-black text-foreground">{profile?.connections?.length || 0}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-tighter">Friends</p>
                </div>
                <div className="border-l border-border">
                  <p className="text-lg font-black text-foreground">{profile?.level || 1}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-tighter">Tier</p>
                </div>
              </div>
            </Card>

            {/* Navigation Menu */}
            <Card className="p-2 border-none shadow-sm bg-card/80 backdrop-blur-sm">
              <nav className="space-y-1">
                {[
                  { id: "feed", icon: Newspaper, label: "Community Feed" },
                  { id: "friends", icon: UserCheck, label: `My Friends (${profile?.connections?.length || 0})` },
                  { id: "events", icon: Calendar, label: "Events" },
                ].map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "secondary" : "ghost"}
                    className={cn("w-full justify-start gap-3 h-11 rounded-lg transition-all", activeTab === item.id ? "bg-primary/10 text-primary font-bold shadow-sm" : "text-muted-foreground")}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <item.icon size={18} /> {item.label}
                  </Button>
                ))}
              </nav>
            </Card>
          </div>

          {/* CENTER COLUMN */}
          <div className="flex-1 space-y-6">
            {!profile?.isVerified && (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldAlert size={20} className="text-orange-600 animate-pulse" />
                    <p className="text-xs text-orange-900 font-medium">Verify your email to unlock level 2 and start posting.</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleResendEmail} disabled={isSending} className="text-orange-700 font-bold text-xs">
                    {isSending ? "Sending..." : "Resend Link"}
                  </Button>
                </div>
              </div>
            )}

            <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-green-600 p-8 rounded-3xl text-white shadow-xl">
              <div className="relative z-10">
                <h1 className="text-4xl font-black tracking-tighter italic">Akwaba, {profile?.firstName}!</h1>
                <p className="mt-2 text-white/90 font-medium max-w-md">Join the conversation and connect with Ivorians across Texas.</p>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
            </div>

            <Tabs value={activeTab} className="w-full">
              <TabsContent value="feed" className="mt-0">
                <CommunityFeed currentUser={profile} />
              </TabsContent>

              <TabsContent value="friends" className="mt-0 space-y-6">
                {/* 1. Pending Requests Section (Only shows if there are some) */}
                {profile?.friendRequestsReceived?.length > 0 && (
                   <Card className="p-6 border-none shadow-md bg-blue-50/50">
                      <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-blue-900 uppercase tracking-widest">
                        <UserPlus size={16} /> Pending Requests
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.notifications?.filter((n:any) => n.type === 'friend_request' && !n.read).map((n:any) => (
                          <div key={n.senderId} className="bg-white p-3 rounded-xl border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                                <img src={defaultProfile} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-sm font-bold truncate max-w-[120px]">{n.message.split(' sent')[0]}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8 px-2" onClick={() => handleAcceptRequest(n.relatedUser)}>
                                <Check size={14} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                   </Card>
                )}

                {/* 2. Friends Grid */}
                <Card className="p-6 border-none shadow-sm min-h-[400px]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg">Your Friends</h3>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full font-medium">{profile?.connections?.length || 0} Connections</span>
                  </div>

                  {profile?.connections?.length === 0 ? (
                    <div className="text-center py-20">
                      <Users className="mx-auto text-muted-foreground/30 mb-4" size={48} />
                      <p className="text-muted-foreground text-sm">No friends yet. Search for people to connect!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {profile.connections.map((friend: any) => (
                        <div key={friend._id} className="group p-4 border rounded-2xl hover:border-primary/50 transition-all bg-card hover:shadow-md">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-muted group-hover:border-primary/20 transition-colors">
                              <img src={friend.profileImage || defaultProfile} className="w-full h-full object-cover" />
                            </div>
                            <h4 className="font-bold text-sm leading-tight">{friend.firstName} {friend.lastName}</h4>
                            <p className="text-[10px] text-muted-foreground mb-3">{friend.city || "Texas Member"}</p>
                            
                            <div className="flex gap-2 w-full mt-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 h-8 text-[10px] font-bold gap-1 rounded-lg"
                                onClick={() => navigate(`/profile/${friend._id}`)}
                              >
                                <ExternalLink size={12} /> Profile
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                                onClick={() => handleUnfriend(friend._id)}
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="events" className="mt-0">
                <UpcomingEvents />
              </TabsContent>
            </Tabs>
          </div>

          {/* RIGHT COLUMN */}
          <div className="hidden xl:block w-1/4 space-y-6">
            <Card className="p-6 border-none shadow-sm bg-card rounded-2xl">
              <h3 className="font-bold text-xs mb-4 flex items-center gap-2 uppercase tracking-tighter text-blue-900">
                <Info size={16} /> Profile Strength
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold uppercase text-blue-800">
                  <span>Completion</span>
                  <span>{strength}%</span>
                </div>
                <div className="bg-blue-100 h-2 w-full rounded-full overflow-hidden">
                  <div
                    className={cn("h-full transition-all duration-1000", strength === 100 ? "bg-green-500" : "bg-blue-500")}
                    style={{ width: `${strength}%` }}
                  />
                </div>
                {strength < 100 && (
                  <div className="p-3 bg-muted/50 rounded-xl space-y-2 border border-border/50">
                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Boost your profile:</p>
                    {strength < 85 && <p className="text-[10px] flex items-center gap-2 font-medium text-orange-600"><ShieldAlert size={12}/> Verify Email (+85%)</p>}
                    {!profile?.profileImage && <p className="text-[10px] flex items-center gap-2 font-medium text-primary"><PlusCircle size={12}/> Profile Picture (+10%)</p>}
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-5 border-none shadow-sm bg-green-50/50 rounded-2xl border-l-4 border-green-500">
                <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
                    <Calendar size={18} />
                    <span>Post an Event?</span>
                </div>
                <p className="text-xs text-green-800/80 mb-4 leading-relaxed">Planning a community BBQ or business mixer?</p>
                <Button onClick={() => setActiveTab("events")} size="sm" className="w-full bg-green-600 hover:bg-green-700 text-xs font-bold rounded-xl shadow-lg shadow-green-200">
                    Create Event <ArrowUpRight size={14} className="ml-1" />
                </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;