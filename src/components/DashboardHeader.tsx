import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Bell, Check, X, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import API, { ENDPOINTS } from "@/lib/api-configs";
import { useToast } from "@/hooks/use-toast";

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications and unread count
  const fetchNotifications = async () => {
    try {
      const { data } = await API.get(ENDPOINTS.USERS.PROFILE);
      const userNotifications = data.notifications || [];
      setNotifications(userNotifications.reverse()); // Newest first
      setUnreadCount(userNotifications.filter((n: any) => !n.read).length);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAcceptRequest = async (requesterId: string) => {
    try {
      await API.post(`${ENDPOINTS.USERS.ACCEPT}/${requesterId}`);
      toast({ title: "Connected!", description: "You have a new connection." });
      fetchNotifications();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Could not accept request." });
    }
  };

  const markAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await API.patch(ENDPOINTS.USERS.NOTIFICATIONS);
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark notifications read");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="text-2xl font-bold text-primary tracking-tighter">
              AIT <span className="text-foreground text-sm font-medium">Portal</span>
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Notifications Popover */}
            <Popover onOpenChange={(open) => open && markAsRead()}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-card animate-pulse"></span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b">
                  <h3 className="font-bold text-sm">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-8 text-center text-xs text-muted-foreground">No notifications yet.</p>
                  ) : (
                    notifications.map((n, i) => (
                      <div key={i} className={`p-4 border-b flex flex-col gap-2 ${!n.read ? 'bg-primary/5' : ''}`}>
                        <div className="flex gap-3">
                          <div className="mt-1">
                            {n.type === 'friend_request' ? <UserPlus size={16} className="text-primary" /> : <Bell size={16} />}
                          </div>
                          <div>
                            <p className="text-xs leading-tight">{n.message}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        {n.type === 'friend_request' && !n.read && (
                          <div className="flex gap-2 mt-1 ml-7">
                            <Button size="sm" className="h-7 px-3 text-[10px]" onClick={() => handleAcceptRequest(n.senderId)}>
                              <Check size={12} className="mr-1" /> Accept
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 px-3 text-[10px]">
                              <X size={12} />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
            
            <div className="h-8 w-[1px] bg-border mx-1"></div>

            {/* Profile Link */}
            <Link to="/profile" className="flex items-center gap-3 group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none group-hover:text-primary transition-colors">
                  {user?.firstName}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                  Level {user?.level}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary transition-all overflow-hidden">
                {user?.profileImage ? (
                  <img src={user.profileImage} className="w-full h-full object-cover" />
                ) : (
                  <User size={18} className="text-primary" />
                )}
              </div>
            </Link>

            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut size={20} className="text-muted-foreground hover:text-destructive transition-colors" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;