// src/pages/Dashboard.tsx

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import API, { ENDPOINTS } from "@/lib/api-configs";
import DashboardHeader from "@/components/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, Users, Calendar, MessageSquare, 
  MapPin, Search, UserIcon, Newspaper 
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Sub-components (We will create these next)
import CommunityFeed from "@/components/dashboard/CommunityFeed";
import MemberDirectory from "@/components/dashboard/MemberDirectory";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feed");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Updated to use the correct endpoint from our new config
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
          
          {/* LEFT COLUMN: User Quick Info */}
          <div className="w-full lg:w-1/4 space-y-6">
            <Card className="p-6 text-center border-none shadow-sm bg-card">
              <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center border-2 border-primary/20 overflow-hidden">
                {profile?.profileImage && !profile.profileImage.includes('placeholder') ? (
                  <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={32} className="text-primary" />
                )}
              </div>

              <h2 className="font-bold text-lg text-foreground">
                {profile?.firstName} {profile?.lastName}
              </h2>
              
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                <MapPin size={12} className="text-primary" /> 
                {profile?.city || "Texas"}, TX
              </p>

              <div className="mt-4 pt-4 border-t border-border flex justify-between text-center">
                <div className="flex-1">
                  <p className="text-lg font-bold text-foreground">{profile?.connections?.length || 0}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Friends</p>
                </div>
                <div className="w-[1px] bg-border mx-2"></div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-foreground">Level</p>
                  <p className="text-[10px] text-muted-foreground uppercase">{profile?.level}</p>
                </div>
              </div>
            </Card>

            {/* Quick Navigation Buttons (Syncs with Tabs) */}
            <nav className="hidden lg:block space-y-1 bg-card/50 p-2 rounded-xl border border-border/50">
              <Button 
                variant={activeTab === "feed" ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
                onClick={() => setActiveTab("feed")}
              >
                <Newspaper size={18} /> Feed
              </Button>
              <Button 
                variant={activeTab === "members" ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
                onClick={() => setActiveTab("members")}
              >
                <Users size={18} /> Find Members
              </Button>
              <Button 
                variant={activeTab === "events" ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
                onClick={() => setActiveTab("events")}
              >
                <Calendar size={18} /> Events
              </Button>
            </nav>
          </div>

          {/* CENTER COLUMN: Tabs Content */}
          <div className="flex-1 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Mobile Tab List */}
              <TabsList className="lg:hidden grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="feed"><Newspaper size={16} /></TabsTrigger>
                <TabsTrigger value="members"><Users size={16} /></TabsTrigger>
                <TabsTrigger value="events"><Calendar size={16} /></TabsTrigger>
              </TabsList>

              <TabsContent value="feed" className="mt-0 space-y-6">
                <div className="bg-gradient-to-r from-orange-500 to-green-600 p-8 rounded-2xl text-white shadow-md">
                  <h1 className="text-3xl font-bold italic">Akwaba, {profile?.firstName}!</h1>
                  <p className="mt-2 opacity-90">Share your latest news with the Texas community.</p>
                </div>
                <CommunityFeed currentUser={profile} />
              </TabsContent>
              
              <TabsContent value="members" className="mt-0">
                <MemberDirectory />
              </TabsContent>
              
              <TabsContent value="events" className="mt-0">
                <UpcomingEvents />
              </TabsContent>
            </Tabs>
          </div>

          {/* RIGHT COLUMN: Sidebar info */}
          <div className="hidden xl:block w-1/4 space-y-6">
            <Card className="p-6 border-none shadow-sm bg-orange-50/50">
              <h3 className="font-bold flex items-center gap-2 mb-4 text-orange-700">
                <Calendar size={18} />
                Next Event
              </h3>
              <div className="text-sm text-muted-foreground italic">
                Check the Events tab for upcoming Ivorian gatherings.
              </div>
            </Card>

            <Card className="p-6 border-none shadow-sm">
              <h3 className="font-bold mb-4 text-sm">Community Progress</h3>
              <div className="space-y-4">
                <div className="bg-muted h-2 w-full rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-1/3"></div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  You are a <strong>Level {profile?.level}</strong> member. Verify your ID to reach Level 2 for job boards.
                </p>
              </div>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;