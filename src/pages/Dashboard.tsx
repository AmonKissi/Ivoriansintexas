// src/pages/Dashboard.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import API, { ENDPOINTS } from "@/lib/api-configs";
import DashboardHeader from "@/components/DashboardHeader";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast"; // Path may vary based on your shadcn setup
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, 
  Users, 
  Calendar, 
  MessageSquare, 
  MapPin, 
  Search, 
  UserIcon, 
  Newspaper, 
  ShieldAlert, 
  ShieldCheck, // Added this
  ArrowUpRight, 
  CheckCircle2,
  TrendingUp, 
  Info,
  Plus // Useful for the "Create Post" button
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getRoleName, getRoleColor } from '@/hooks/useUserRole';

// Sub-components
import CommunityFeed from "@/components/dashboard/CommunityFeed";
import MemberDirectory from "@/components/dashboard/MemberDirectory";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast(); // 1. INITIALIZE TOAST HERE
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feed");

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

  // 2. DEFINE THE FUNCTION HERE (Inside the component)
  const handleResendEmail = async () => {
    try {
      // Use your API helper instead of raw axios to ensure Auth headers are sent
      await API.post('/auth/resend-verification', { 
        email: profile?.email 
      });
      
      toast({
        title: "Email Sent! 🇨🇮",
        description: "Please check your inbox (and spam folder).",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Could not resend email.",
      });
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-background">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  const isLevel1 = profile?.level === 1;

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: User Quick Info */}
          <div className="w-full lg:w-1/4 space-y-6">
            <Card className="p-6 text-center border-none shadow-lg bg-card relative overflow-hidden">
              {/* Rank Background Glow */}
              <div className={cn("absolute -top-12 -right-12 w-24 h-24 rounded-full blur-3xl opacity-20", isLevel1 ? "bg-orange-500" : "bg-green-500")} />
              
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 p-1 border-2 border-primary/20 shadow-inner overflow-hidden">
                  {profile?.profileImage ? (
                    <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary">
                      <UserIcon size={40} />
                    </div>
                  )}
                </div>
                {profile?.level > 1 && (
                  <div className="absolute bottom-4 right-1/3 bg-green-500 text-white rounded-full p-1 border-2 border-card shadow-sm">
                    <CheckCircle2 size={14} />
                  </div>
                )}
              </div>

              <h2 className="font-bold text-xl text-foreground">
                {profile?.firstName} {profile?.lastName}
              </h2>
              
              <span className={cn(
                "inline-block mt-2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                getRoleColor(profile?.level)
              )}>
                {getRoleName(profile?.level)}
              </span>

              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-3">
                <MapPin size={12} className="text-primary" /> 
                {profile?.city || "Texas"}, TX
              </p>

              <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-2">
                <div>
                  <p className="text-lg font-black text-foreground">{profile?.connections?.length || 0}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">Friends</p>
                </div>
                <div className="border-l border-border">
                  <p className="text-lg font-black text-foreground">{profile?.level}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">Level</p>
                </div>
              </div>
            </Card>

            {/* Navigation Menu */}
            <Card className="p-2 border-none shadow-sm bg-card/80 backdrop-blur-sm">
              <nav className="space-y-1">
                {[
                  { id: "feed", icon: Newspaper, label: "Community Feed" },
                  { id: "members", icon: Users, label: "Member Directory" },
                  { id: "events", icon: Calendar, label: "Events & Meetups" }
                ].map((item) => (
                  <Button 
                    key={item.id}
                    variant={activeTab === item.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-11 rounded-lg transition-all",
                      activeTab === item.id ? "bg-primary/10 text-primary font-bold shadow-sm" : "text-muted-foreground"
                    )}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <item.icon size={18} /> {item.label}
                  </Button>
                ))}
              </nav>
            </Card>
          </div>

          {/* CENTER COLUMN: Content */}
          {/* CENTER COLUMN: Content */}
<div className="flex-1 space-y-6">
  
  {/* 1. URGENT VERIFICATION ALERT (Only shows if NOT verified) */}
  {!profile?.isVerified && (
    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl shadow-sm animate-in slide-in-from-top duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-full text-orange-600">
            <ShieldAlert size={20} className="animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-orange-900 text-sm">Action Required: Verify your Email</h4>
            <p className="text-xs text-orange-700">Check your inbox to unlock Level 2 features and start posting.</p>
          </div>
        </div>
       <Button 
  variant="ghost" 
  size="sm" 
  onClick={handleResendEmail} // Add this line
  className="text-orange-700 hover:bg-orange-100 font-bold text-xs"
>
  Resend Link
</Button>
      </div>
    </div>
  )}

  {/* 2. DYNAMIC WELCOME BANNER */}
  <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-green-600 p-8 rounded-3xl text-white shadow-xl">
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
          Level {profile?.level || 1} Member
        </span>
      </div>
      
      <h1 className="text-4xl font-black tracking-tighter italic">Akwaba, {profile?.firstName}!</h1>
      
      <p className="mt-2 text-white/90 font-medium max-w-md">
        {!profile?.isVerified 
          ? "Your account is currently restricted. Verify your email to join the conversation."
          : "Great to see you again. Your community is growing today!"}
      </p>

      <div className="flex gap-3 mt-6">
        {/* Only allow posting if verified (Level 2+) */}
        {profile?.isVerified ? (
          <Button className="bg-white text-orange-600 hover:bg-white/90 font-bold rounded-full px-8 shadow-lg transition-transform hover:scale-105">
            Create Post
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="border-white/40 text-white hover:bg-white/10 rounded-full backdrop-blur-sm font-bold flex gap-2 items-center"
            onClick={() => {/* Open Verification Info Modal */}}
          >
            <ShieldCheck size={18} />
            Verify Identity
          </Button>
        )}
      </div>
    </div>

    {/* Decorative background shapes */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse" />
    <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-green-400/20 rounded-full blur-2xl" />
  </div>

  {/* 3. TABS SECTION */}
  <Tabs value={activeTab} className="w-full">
    <TabsContent value="feed" className="mt-0 focus-visible:outline-none">
      {/* If not verified, show a blurred or limited feed state */}
      <CommunityFeed currentUser={profile} />
    </TabsContent>
    
    <TabsContent value="members" className="mt-0 focus-visible:outline-none">
      <MemberDirectory />
    </TabsContent>
    
    <TabsContent value="events" className="mt-0 focus-visible:outline-none">
      <UpcomingEvents />
    </TabsContent>
  </Tabs>
</div>

          {/* RIGHT COLUMN: Sidebar */}
          <div className="hidden xl:block w-1/4 space-y-6">
            {/* Level 1 Warning/Prompt */}
            {isLevel1 ? (
              <Card className="p-5 border-2 border-dashed border-orange-200 bg-orange-50/50 rounded-2xl">
                <div className="flex items-center gap-2 text-orange-700 font-bold mb-3">
                  <ShieldAlert size={18} />
                  <span>Level Up Required</span>
                </div>
                <p className="text-xs text-orange-800/80 leading-relaxed mb-4">
                  Verify your account to access <strong>Job Boards</strong>, <strong>VIP Events</strong>, and <strong>Business Directories</strong>.
                </p>
                <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700 text-xs font-bold shadow-lg shadow-orange-200">
                  Start Verification <ArrowUpRight size={14} className="ml-1" />
                </Button>
              </Card>
            ) : (
              <Card className="p-5 border-none shadow-sm bg-green-50/50 rounded-2xl">
                <div className="flex items-center gap-2 text-green-700 font-bold mb-3">
                  <TrendingUp size={18} />
                  <span>Community Insights</span>
                </div>
                <p className="text-xs text-green-800/80 leading-relaxed">
                  You are a verified member. Your posts now appear at the top of the community feed.
                </p>
              </Card>
            )}

            {/* Quick Stats Card */}
            <Card className="p-6 border-none shadow-sm bg-card rounded-2xl">
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2 uppercase tracking-tighter">
                <Info size={16} className="text-primary" />
                Community Update
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                    <span>Profile Strength</span>
                    <span>{isLevel1 ? '35%' : '85%'}</span>
                  </div>
                  <div className="bg-muted h-1.5 w-full rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-1000", isLevel1 ? "bg-orange-500 w-[35%]" : "bg-green-500 w-[85%]")} 
                    />
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground italic leading-tight">
                  "The Texas Ivorian Portal grows stronger every time a member completes their profile."
                </p>
              </div>
            </Card>

            <Card className="p-6 border-none shadow-sm bg-blue-50/30 rounded-2xl">
              <h3 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">
                <Calendar size={16} />
                Quick RSVP
              </h3>
              <p className="text-[11px] text-blue-800/70 mb-4">
                Texas Ivorian Summer BBQ - July 15th
              </p>
              <Button size="sm" variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-100 text-[10px] font-bold">
                View Event Details
              </Button>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;