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
  Loader2
} from "lucide-react";
import API, { ENDPOINTS } from "@/lib/api-configs";
import { useSocial } from "@/hooks/useSocial";
import { useToast } from "@/hooks/use-toast";

const MemberDirectory = () => {
  const [members, setMembers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { sendRequest, acceptRequest, removeFriend } = useSocial();
  const { toast } = useToast();

  const fetchSocialData = async () => {
    try {
      const [friendsRes, requestsRes] = await Promise.all([
        API.get(`${ENDPOINTS.USERS.BASE}/friends`),
        API.get(`${ENDPOINTS.USERS.BASE}/requests/pending`)
      ]);
      setFriends(friendsRes.data || []);
      setRequests(requestsRes.data || []);
    } catch (err) {
      console.error("Social fetch failed", err);
    }
  };

  const fetchMembers = async (query = "") => {
    setLoading(true);
    try {
      const { data } = await API.get(`${ENDPOINTS.USERS.SEARCH}?query=${query}`);
      setMembers(data || []);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMembers(search);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  useEffect(() => {
    fetchSocialData();
  }, []);

  const handleAction = async (action: Function, id: string, message: string) => {
    try {
      await action(id);
      toast({ title: "Success", description: message });
      // Refresh everything
      await fetchSocialData();
      await fetchMembers(search);
    } catch (err) {
      toast({ variant: "destructive", title: "Action failed" });
    }
  };

  // Helper to determine relationship status for the Discover tab
  const getButtonState = (memberId: string) => {
    if (friends.some((f: any) => f._id === memberId)) return "friends";
    if (requests.some((r: any) => r.from?._id === memberId || r.to === memberId)) return "pending";
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
            {requests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center border-2 border-background">
                {requests.length}
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
            {loading && <Loader2 className="absolute right-3 top-3 animate-spin text-primary" size={18} />}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((member: any) => {
              const status = getButtonState(member._id);
              return (
                <MemberCard key={member._id} member={member}>
                  {status === "friends" ? (
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase">Friends</span>
                  ) : status === "pending" ? (
                    <Button disabled size="sm" variant="outline" className="rounded-full gap-2 italic">
                      <Clock size={14} /> Pending
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      className="rounded-full gap-2"
                      onClick={() => handleAction(sendRequest, member._id, "Request Sent!")}
                    >
                      <UserPlus size={14} /> Add
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
                    onClick={() => handleAction(removeFriend, friend._id, "Friend Removed")}
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
            {requests.length === 0 ? (
              <EmptyState icon={<Clock size={40}/>} text="No pending requests." />
            ) : (
              requests.map((request: any) => (
                <MemberCard key={request._id} member={request.from}>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4"
                      onClick={() => handleAction(acceptRequest, request._id, "Friendship Accepted!")}
                    >
                      Accept
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

const MemberCard = ({ member, children }: { member: any, children: React.ReactNode }) => (
  <div className="bg-card p-4 rounded-3xl border border-border shadow-sm flex items-center justify-between transition-all hover:shadow-md">
    <div className="flex items-center gap-3">
      <Avatar className="h-12 w-12 border-2 border-primary/10">
        <AvatarImage src={member.profileImage} />
        <AvatarFallback className="font-bold bg-muted">{member.firstName?.[0]}</AvatarFallback>
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