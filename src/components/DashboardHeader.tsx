import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LogOut, User, Bell, Check, X, UserPlus, 
  LayoutDashboard, UserCircle, Settings, Search, 
  Calendar, Users, Command, ShieldCheck, Loader2
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import API, { ENDPOINTS } from "@/lib/api-configs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { getRoleName, getRoleColor } from '@/hooks/useUserRole';
import { useSocial } from "@/hooks/useSocial";
import defaultProfile from "@/assets/default.png";


const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Social Hook for Live Search
  const { 
    searchUsers, 
    searchEvents, 
    searchResults, 
    eventResults, 
    loading: searchLoading,
    sendRequest,
    rsvpToEvent 
  } = useSocial();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const isDashboard = location.pathname === "/dashboard";
  const isProfile = location.pathname === "/profile";

  // --- LIVE SEARCH LOGIC (Debounced) ---
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchUsers(searchQuery);
        searchEvents(searchQuery);
      }
    }, 400); // 400ms delay to save backend resources

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // --- NOTIFICATIONS LOGIC ---
  const fetchNotifications = async () => {
    try {
      const { data } = await API.get(ENDPOINTS.USERS.PROFILE);
      const userNotifications = data.notifications || [];
      setNotifications(userNotifications.reverse());
      setUnreadCount(userNotifications.filter((n: any) => !n.read).length);
    } catch (err) {
      console.error("Notification sync failed");
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await API.patch(ENDPOINTS.USERS.NOTIFICATIONS);
      setUnreadCount(0);
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          
          {/* 1. BRAND LOGO */}
          <div className="flex items-center gap-6 shrink-0">
            <Link to="/dashboard" className="group flex items-center gap-2.5">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-green-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-black text-white px-3 py-1.5 rounded-lg font-black text-xl tracking-tighter border border-white/10 shadow-xl">
                  AIT
                </div>
              </div>
              <div className="hidden lg:flex flex-col -space-y-1">
                <span className="text-sm font-bold tracking-tight text-foreground">PORTAL</span>
                <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-[0.2em]">Texas Community</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link to="/dashboard">
                <Button variant="ghost" className={cn("gap-2 h-9 px-3 transition-all", isDashboard ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:text-foreground")}>
                  <LayoutDashboard size={16} /> Dashboard
                </Button>
              </Link>
            </nav>
          </div>

          {/* 2. GLOBAL SEARCH BAR WITH LIVE RESULTS */}
          <div className="flex-1 max-w-md hidden sm:block relative">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
              <Input 
                placeholder="Search users or events..." 
                className="pl-10 h-10 bg-muted/40 border-border/50 focus:bg-background transition-all rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {searchLoading && <Loader2 size={14} className="animate-spin text-muted-foreground" />}
                <div className="hidden md:flex items-center gap-1 text-[10px] font-mono text-muted-foreground/50 border rounded px-1.5 bg-background">
                  <Command size={10} /> K
                </div>
              </div>
            </div>

            {/* LIVE SEARCH DROPDOWN */}
            {isSearchFocused && searchQuery.length >= 2 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-card border rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="max-h-[400px] overflow-y-auto p-2">
                  
                  {/* Users Section */}
                  <div className="mb-4">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-2">Members</h4>
                    {searchResults.length === 0 && !searchLoading ? (
                      <p className="text-xs text-muted-foreground px-3">No members found.</p>
                    ) : (
                      searchResults.map((res) => (
                        <div key={res._id} className="flex items-center justify-between p-2 hover:bg-muted rounded-xl transition-colors group">
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 border border-border flex items-center justify-center">
      {res.profileImage && res.profileImage.trim() !== "" ? (
        <img 
          src={res.profileImage} 
          className="w-full h-full object-cover" 
          alt={`${res.firstName}'s profile`}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = defaultProfile;
          }}
        />
      ) : (
        /* Fallback to your default asset */
        <img 
          src={defaultProfile} 
          className="w-full h-full object-cover opacity-80" 
          alt="Default Profile" 
        />
      )}
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-bold leading-none">{res.firstName} {res.lastName}</span>
      <span className="text-[10px] text-muted-foreground">{res.city || "Texas"}</span>
    </div>
  </div>
  <Button 
    size="sm" 
    variant="ghost" 
    onClick={() => sendRequest(res._id)} 
    className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 text-primary"
  >
    <UserPlus size={14} />
  </Button>
</div>
                      ))
                    )}
                  </div>

                  {/* Events Section */}
                  <div>
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-2">Events</h4>
                    {eventResults.length === 0 && !searchLoading ? (
                      <p className="text-xs text-muted-foreground px-3">No events found.</p>
                    ) : (
                      eventResults.map((event) => (
                        <div key={event._id} className="flex items-center justify-between p-2 hover:bg-muted rounded-xl transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600">
                              <Calendar size={14} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold leading-none">{event.title}</span>
                              <span className="text-[10px] text-muted-foreground">{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => rsvpToEvent(event._id)} className="h-7 text-[10px] font-bold">
                            RSVP
                          </Button>
                        </div>
                      ))
                    )}
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* 3. USER ACTIONS */}
          <div className="flex items-center gap-2">
            
            <Popover onOpenChange={(open) => open && markAsRead()}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-muted">
                  <Bell size={20} className="text-muted-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-orange-600 rounded-full border-2 border-card animate-pulse"></span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 shadow-2xl border-border/50 rounded-xl" align="end">
                <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
                  <h3 className="font-bold text-sm">Notifications</h3>
                  {unreadCount > 0 && <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center text-muted-foreground">No alerts yet.</div>
                  ) : (
                    notifications.map((n, i) => (
                      <div key={i} className={cn("p-4 border-b flex flex-col gap-2 transition-colors", !n.read ? 'bg-primary/5' : 'hover:bg-muted/30')}>
                        <div className="flex gap-3">
                           {n.type === 'friend_request' ? <UserPlus size={16} className="text-blue-500" /> : <Bell size={16} className="text-orange-500" />}
                           <div className="space-y-1">
                             <p className="text-xs font-medium leading-tight">{n.message}</p>
                             <p className="text-[10px] text-muted-foreground">{new Date(n.createdAt).toLocaleDateString()}</p>
                           </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <div className="h-6 w-[1px] bg-border mx-1"></div>

            {/* Profile Dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 p-1 pl-2 pr-1 rounded-full border border-transparent hover:border-border hover:bg-muted transition-all outline-none group">
                  <p className="hidden sm:block text-xs font-bold leading-none">{user?.firstName}</p>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                    {user?.profileImage ? (
                      <img src={user.profileImage} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary text-[10px] font-bold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </div>
                    )}
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3 rounded-2xl shadow-2xl border-border/60" align="end">
                <div className="flex items-center gap-3 px-1 py-2 mb-2">
                  <div className="w-12 h-12 rounded-full bg-muted border-2 border-background shadow-sm overflow-hidden shrink-0">
                    {user?.profileImage ? (
                      <img src={user.profileImage} className="w-full h-full object-cover" alt="Avatar" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-sm font-bold">
                        {user?.firstName?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-bold text-foreground truncate leading-none mb-1.5">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <div className="flex items-center">
                       <span className={cn(
                         "text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border shadow-sm",
                         getRoleColor(user?.level || 1)
                       )}>
                         {getRoleName(user?.level || 1)}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <Link to="/profile">
                    <Button variant="ghost" className="w-full justify-start h-11 text-sm gap-3 rounded-xl px-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <div className="flex flex-col items-start leading-none">
                        <span className="font-semibold">My Profile</span>
                        <span className="text-[10px] text-muted-foreground font-normal mt-0.5">Edit personal info</span>
                      </div>
                    </Button>
                  </Link>

                  <Link to="/profile">
                    <Button variant="ghost" className="w-full justify-start h-11 text-sm gap-3 rounded-xl px-2.5">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                        <ShieldCheck size={16} className="text-orange-600" />
                      </div>
                      <div className="flex flex-col items-start leading-none">
                        <span className="font-semibold">Security</span>
                        <span className="text-[10px] text-muted-foreground font-normal mt-0.5">Password & Privacy</span>
                      </div>
                    </Button>
                  </Link>
                  
                  <div className="border-t border-border/50 my-2 mx-1"></div>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start h-10 text-sm gap-3 text-destructive hover:bg-destructive/10 rounded-xl px-2.5" 
                    onClick={handleLogout}
                  >
                    <LogOut size={17} /> 
                    <span className="font-medium">Sign Out</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;