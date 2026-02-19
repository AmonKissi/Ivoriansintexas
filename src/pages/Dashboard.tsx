// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import API, { ENDPOINTS } from "@/lib/api-configs";
import DashboardHeader from "@/components/DashboardHeader";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
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
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getRoleColor } from "@/hooks/useUserRole";

// Sub-components
import CommunityFeed from "@/components/dashboard/CommunityFeed";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import defaultProfile from "@/assets/default.png";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feed");
  const [feedFilter, setFeedFilter] = useState("all"); // "all" or "mine"
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get(ENDPOINTS.USERS.PROFILE);
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // --- LOGIC: Profile Strength ---
  const calculateStrength = () => {
    if (!profile) return 0;
    let score = 0;
    if (profile.isVerified) score += 85;
    if (profile.profileImage && profile.profileImage !== "") score += 10;
    if (profile.bio || profile.city) score += 5;
    return score;
  };

  const strength = calculateStrength();
  const isVerified = profile?.isVerified;

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

  // --- ACTION: Create Post Button ---
  const handleCreatePostAction = () => {
    setActiveTab("feed");
    setFeedFilter("all");
    // Scroll to the top of the feed where the input is
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast({
      title: "What's on your mind?",
      description: "Use the post box at the top of the feed to share with Texas!",
    });
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-background">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: Profile Quick Card */}
          <div className="w-full lg:w-1/4 space-y-6">
            <Card className="p-6 text-center border-none shadow-lg bg-card relative overflow-hidden">
              <div className={cn("absolute -top-12 -right-12 w-24 h-24 rounded-full blur-3xl opacity-20", isVerified ? "bg-green-500" : "bg-orange-500")} />
              
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-orange-100 mx-auto p-1 border-2 border-primary/20 shadow-inner overflow-hidden flex items-center justify-center">
                  <img
                    src={profile?.profileImage || defaultProfile}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => (e.currentTarget.src = defaultProfile)}
                  />
                </div>
              </div>

              {/* Verified Icon next to Name (Cleaner) */}
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <h2 className="font-bold text-xl text-foreground">
                  {profile?.firstName} {profile?.lastName}
                </h2>
                {isVerified && <CheckCircle2 size={18} className="text-green-500 fill-green-500/10" />}
              </div>
              
              <span className={cn("inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", getRoleColor(profile?.level))}>
                {profile?.level === 1 ? "Member" : "Verified Member"}
              </span>

              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-3">
                <MapPin size={12} className="text-primary" /> {profile?.city || "Texas"}, TX
              </p>

              <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-2">
                <div>
                  <p className="text-lg font-black text-foreground">{profile?.connections?.length || 0}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">Friends</p>
                </div>
                <div className="border-l border-border">
                  <p className="text-lg font-black text-foreground">{profile?.level || 1}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">Tier</p>
                </div>
              </div>
            </Card>

            {/* Navigation Menu */}
            <Card className="p-2 border-none shadow-sm bg-card/80 backdrop-blur-sm">
              <nav className="space-y-1">
                {[
                  { id: "feed", icon: Newspaper, label: "Community Feed" },
                  { id: "friends", icon: UserCheck, label: "My Friends" },
                  { id: "events", icon: Calendar, label: "Events & Meetups" }
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

          {/* CENTER COLUMN: Content */}
          <div className="flex-1 space-y-6">
            {!isVerified && (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl shadow-sm animate-in slide-in-from-top duration-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldAlert size={20} className="text-orange-600 animate-pulse" />
                    <div>
                      <h4 className="font-bold text-orange-900 text-sm">Action Required: Verify Email</h4>
                      <p className="text-xs text-orange-700">Unlock Level 2 features to start posting.</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleResendEmail} disabled={isSending} className="text-orange-700 font-bold text-xs">
                    {isSending ? "Sending..." : "Resend Link"}
                  </Button>
                </div>
              </div>
            )}

            {/* Banner with Active Create Post Button */}
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-green-600 p-8 rounded-3xl text-white shadow-xl">
              <div className="relative z-10">
                <h1 className="text-4xl font-black tracking-tighter italic">Akwaba, {profile?.firstName}!</h1>
                <p className="mt-2 text-white/90 font-medium max-w-md">
                  {isVerified ? "Your Texas community is waiting for your next post." : "Verify your account to join the conversation."}
                </p>

                <div className="flex gap-3 mt-6">
                  {isVerified && (
                    <Button 
                      onClick={handleCreatePostAction}
                      className="bg-white text-orange-600 hover:bg-white/90 font-bold rounded-full px-8 shadow-lg transition-transform hover:scale-105"
                    >
                      Create Post
                    </Button>
                  )}
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse" />
            </div>

            {/* DYNAMIC TABS CONTENT */}
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="feed" className="mt-0 space-y-4">
                {/* Feed Sub-filters */}
                <div className="flex gap-2 pb-2">
                  <Button 
                    size="sm" 
                    variant={feedFilter === "all" ? "default" : "outline"} 
                    onClick={() => setFeedFilter("all")}
                    className="rounded-full text-xs font-bold"
                  >
                    All Posts
                  </Button>
                  <Button 
                    size="sm" 
                    variant={feedFilter === "mine" ? "default" : "outline"} 
                    onClick={() => setFeedFilter("mine")}
                    className="rounded-full text-xs font-bold"
                  >
                    My Posts
                  </Button>
                </div>
                <CommunityFeed currentUser={profile} />
              </TabsContent>
              
              <TabsContent value="friends" className="mt-0">
                {/* Pass the profile's connections to a friend list view */}
                <Card className="p-8 text-center border-none shadow-sm">
                  <Users className="mx-auto text-muted-foreground mb-4" size={48} />
                  <h3 className="font-bold text-lg">My Friends</h3>
                  <p className="text-sm text-muted-foreground">Manage your community connections here.</p>
                </Card>
              </TabsContent>

              <TabsContent value="events" className="mt-0">
                <UpcomingEvents />
              </TabsContent>
            </Tabs>
          </div>

          {/* RIGHT COLUMN: Stats & Strength */}
          <div className="hidden xl:block w-1/4 space-y-6">
            <Card className="p-6 border-none shadow-sm bg-card rounded-2xl">
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2 uppercase tracking-tighter text-blue-900">
                <Info size={16} /> Profile Strength
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold uppercase text-blue-800">
                  <span>Completion</span>
                  <span>{strength}%</span>
                </div>
                <div className="bg-blue-100 h-2 w-full rounded-full overflow-hidden">
                  <div className={cn("h-full transition-all duration-1000", strength === 100 ? "bg-green-500" : "bg-blue-500")} style={{ width: `${strength}%` }} />
                </div>
                
                {strength < 100 && (
                  <div className="p-3 bg-muted/50 rounded-xl space-y-2 border border-border/50">
                    <p className="text-[10px] font-black uppercase text-muted-foreground">Next Steps:</p>
                    {strength < 85 && <p className="text-[10px] flex items-center gap-2 font-medium"><ShieldAlert size={12} className="text-orange-500"/> Verify Email (+85%)</p>}
                    {!profile?.profileImage && <p className="text-[10px] flex items-center gap-2 font-medium text-primary"><PlusCircle size={12}/> Upload Photo (+10%)</p>}
                    {!profile?.bio && <p className="text-[10px] flex items-center gap-2 font-medium"><Info size={12} className="text-blue-500"/> Add a Bio (+5%)</p>}
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-5 border-none shadow-sm bg-green-50/50 rounded-2xl border-l-4 border-green-500">
              <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
                <Calendar size={18} />
                <span>Hosting?</span>
              </div>
              <p className="text-xs text-green-800/80 mb-4 leading-relaxed">Planning a BBQ or Meetup? Create an event for the community.</p>
              <Button onClick={() => setActiveTab("events")} size="sm" className="w-full bg-green-600 hover:bg-green-700 text-xs font-bold shadow-md shadow-green-200">
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
