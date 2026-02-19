// src/components/dashboard/MemberDirectory.tsx

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  UserPlus, 
  Users, 
  UserCheck, 
  UserMinus, 
  Clock,
  MapPin,
  Loader2,
  Check,
  X
} from "lucide-react";
import API, { ENDPOINTS } from "@/lib/api-configs";
import { useSocial } from "@/hooks/useSocial";
import defaultProfile from "@/assets/default.png";

const MemberDirectory = () => {
  const [members, setMembers] = useState([]);
  const [friends, setFriends] = useState([]);
  
  // Use the state and functions directly from our optimized hook
  const { 
    sendRequest, 
    acceptRequest, 
    declineRequest,
    removeFriend, 
    fetchPendingRequests, 
    pendingRequests,
    loading: socialLoading 
  } = useSocial();

  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  // 1. Fetch Friends (Custom fetch for this component)
  const fetchFriends = async () => {
    try {
      const { data } = await API.get(`${ENDPOINTS.USERS.BASE}/friends`);
      setFriends(data || []);
    } catch (err) {
      console.error("Friends fetch failed", err);
    }
  };

  // 2. Search Members
  const fetchMembers = async (query = "") => {
    setSearching(true);
    try {
      const { data } = await API.get(`${ENDPOINTS.USERS.SEARCH}?query=${query}`);
      setMembers(data || []);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMembers(search);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  useEffect(() => {
    fetchFriends();
    fetchPendingRequests(); // Hook handles the state for this
  }, []);

  // Optimized Action Handler
  const handleSocialAction = async (action: Function, id: string) => {
    const success = await action(id);
    if (success) {
      // Re-sync local component data
      fetchFriends();
      fetchPendingRequests();
      fetchMembers(search);
    }
  };

  // Helper to determine relationship status
  const getButtonState = (memberId: string) => {
    if (friends.some((f: any) => f._id === memberId)) return "friends";
    // Check if we sent a request or if one is pending for us
    if (pendingRequests.some((r: any) => r._id === memberId)) return "pending_received";
    return "none";
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-foreground">
          Ivorian Connect
        </h2>
        <p className="text-muted-foreground font-medium">Build your Texas-Ivorian circle.</p>
      </div>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-full bg-muted/50 p-1 mb-8">
          <TabsTrigger value="search" className="rounded-full gap-2 uppercase text-[10px] font-bold">
            <Search size={14} /> Discover
          </TabsTrigger>
          <TabsTrigger value="friends" className="rounded-full gap-2 uppercase text-[10px] font-bold">
            <Users size={14} /> Friends ({friends.length})
          </TabsTrigger>
          <TabsTrigger value="requests" className="rounded-full gap-2 uppercase text-[10px] font-bold relative">
            <Clock size={14} /> Requests
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center border-2 border-background animate-pulse">
                {pendingRequests.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search by name or city..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-2xl border-muted bg-card shadow-sm h-12"
            />
            {searching && <Loader2 className="absolute right-3 top-3 animate-spin text-primary" size={18} />}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((member: any) => {
              const status = getButtonState(member._id);
              return (
                <MemberCard key={member._id} member={member}>
                  {status === "friends" ? (
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase">Friends</span>
                  ) : status === "pending_received" ? (
                    <Button 
                      size="sm" 
                      className="bg-orange-500 hover:bg-orange-600 rounded-full text-[10px] font-bold"
                      onClick={() => handleSocialAction(acceptRequest, member._id)}
                    >
                      Accept Request
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant={member.connectionStatus === 'pending_sent' ? "outline" : "default"}
                      disabled={member.connectionStatus === 'pending_sent'}
                      className="rounded-full gap-2"
                      onClick={() => handleSocialAction(sendRequest, member._id)}
                    >
                      {member.connectionStatus === 'pending_sent' ? <Clock size={14}/> : <UserPlus size={14} />}
                      {member.connectionStatus === 'pending_sent' ? "Sent" : "Add"}
                    </Button>
                  )}
                </MemberCard>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="friends">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friends.length === 0 ? (
              <EmptyState icon={<Users size={40}/>} text="No friends yet. Start connecting!" />
            ) : (
              friends.map((friend: any) => (
                <MemberCard key={friend._id} member={friend}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-red-500 rounded-full"
                    onClick={() => handleSocialAction(removeFriend, friend._id)}
                  >
                    <UserMinus size={18} />
                  </Button>
                </MemberCard>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="requests">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.length === 0 ? (
              <EmptyState icon={<Clock size={40}/>} text="No pending requests." />
            ) : (
              pendingRequests.map((sender: any) => (
                <MemberCard key={sender._id} member={sender}>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 h-8"
                      onClick={() => handleSocialAction(acceptRequest, sender._id)}
                    >
                      <Check size={14} className="mr-1"/> Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="text-muted-foreground hover:text-destructive h-8 w-8 p-0 rounded-full"
                      onClick={() => handleSocialAction(declineRequest, sender._id)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </MemberCard>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Updated Card to handle images properly
const MemberCard = ({ member, children }: { member: any, children: React.ReactNode }) => (
  <div className="bg-card p-4 rounded-3xl border border-border shadow-sm flex items-center justify-between transition-all hover:shadow-md">
    <div className="flex items-center gap-3">
      <Avatar className="h-12 w-12 border-2 border-primary/10">
        <AvatarImage 
            src={member.profileImage?.startsWith('http') ? member.profileImage : undefined} 
        />
        <AvatarFallback className="font-bold bg-muted">
            {member.firstName?.[0]}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-black italic uppercase tracking-tighter text-sm leading-tight">
          {member.firstName} {member.lastName}
        </p>
        <p className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase">
          <MapPin size={10} className="text-primary" /> {member.city || "Texas"}
        </p>
      </div>
    </div>
    {children}
  </div>
);

const EmptyState = ({ icon, text }: { icon: any, text: string }) => (
  <div className="col-span-full py-16 text-center flex flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-[2rem] border-2 border-dashed">
    <div className="opacity-20 mb-4">{icon}</div>
    <p className="text-xs font-bold uppercase tracking-widest">{text}</p>
  </div>
);

export default MemberDirectory;