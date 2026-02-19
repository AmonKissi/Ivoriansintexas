import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Added Tabs
import {
  Calendar,
  MapPin,
  Loader2,
  ArrowUpRight,
  Trash2,
  Users,
} from "lucide-react";
import API, { ENDPOINTS } from "@/lib/api-configs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import CreateEventModal from "./CreateEventModal";
import defaultProfile from "@/assets/default.png";

const UpcomingEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all" or "mine"
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Make sure this endpoint in your config is just "/events" and NOT "/events/user"
      const { data } = await API.get(ENDPOINTS.EVENTS.BASE);
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter logic for the UI
  const currentUserId = user?.id || user?._id;
  const filteredEvents = filter === "all" 
    ? events 
    : events.filter(ev => String(ev.organizer?._id || ev.organizer) === String(currentUserId));

  const handleRSVP = async (eventId: string) => {
    try {
      await API.post(ENDPOINTS.EVENTS.RSVP(eventId));
      toast({ title: "You're on the list! 🇨🇮", description: "Successfully RSVP'd." });
      fetchEvents();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Action failed", description: "Could not RSVP." });
    }
  };

  const handleDelete = async (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    if (!window.confirm("Delete this event?")) return;
    try {
      await API.delete(ENDPOINTS.EVENTS.DELETE(eventId));
      toast({ title: "Event Deleted" });
      fetchEvents(); 
    } catch (err: any) {
      toast({ variant: "destructive", title: "Delete failed" });
    }
  };

  if (loading) return (
    <div className="py-20 flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-primary mb-2" size={32} />
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Loading Texas Meetups...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 1. HEADER & FILTER */}
      <div className="bg-card/50 p-6 rounded-3xl border border-border/40 backdrop-blur-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase text-foreground">Texas Meetups</h2>
            <p className="text-sm text-muted-foreground font-medium">Join gatherings in your area.</p>
          </div>
          <CreateEventModal onEventCreated={fetchEvents} />
        </div>

        {/* Filter Switcher */}
        <div className="flex gap-2 border-t pt-4">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter("all")}
            className="rounded-full text-[10px] font-bold uppercase"
          >
            All Meetups
          </Button>
          <Button 
            variant={filter === "mine" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter("mine")}
            className="rounded-full text-[10px] font-bold uppercase"
          >
            My Events
          </Button>
        </div>
      </div>

      {/* 2. GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.length === 0 ? (
          <Card className="col-span-full p-16 text-center border-2 border-dashed bg-muted/10 rounded-3xl">
            <Calendar size={48} className="mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-lg font-bold">No meetups found</h3>
            <p className="text-sm text-muted-foreground">Be the first to host one!</p>
          </Card>
        ) : (
          filteredEvents.map((event: any) => {
            const organizerId = event.organizer?._id || event.organizer;
            const isOwner = currentUserId && organizerId && String(currentUserId) === String(organizerId);

            return (
              <Card key={event._id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all rounded-3xl bg-card">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={event.eventImage || event.imageUrl || "https://images.unsplash.com/photo-1528605276204-43573a1cf091"}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    alt={event.title}
                  />
                  {isOwner && (
                    <button onClick={(e) => handleDelete(e, event._id)} className="absolute top-3 left-3 z-10 p-2 bg-red-600 text-white rounded-lg shadow-lg">
                      <Trash2 size={14} />
                    </button>
                  )}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20">
                    {event.category || "General"}
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-black text-xl italic tracking-tighter text-foreground group-hover:text-primary transition-colors uppercase truncate">
                      {event.title}
                    </h3>
                    <div className="flex flex-col gap-1.5 mt-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                        <Calendar size={12} className="text-orange-500" />
                        {new Date(event.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                        <MapPin size={12} className="text-green-600" />
                        {event.location}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed h-8">
                    {event.description}
                  </p>

                  <div className="pt-4 flex items-center justify-between border-t border-border/60">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-1">
                         <Users size={12} /> {event.attendees?.length || 0} Joined
                       </span>
                    </div>

                    <Button
                      onClick={() => handleRSVP(event._id)}
                      variant="ghost"
                      size="sm"
                      className="h-8 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 rounded-full"
                    >
                      {event.attendees?.some((a: any) => (a._id || a) === currentUserId) ? "Joined ✓" : "RSVP +"}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;