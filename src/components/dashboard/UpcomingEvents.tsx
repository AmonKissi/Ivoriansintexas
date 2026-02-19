// src/components/dashboard/UpcomingEvents.tsx
// src/components/dashboard/UpcomingEvents.tsx
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Loader2,
  ArrowUpRight,
  Trash2,
} from "lucide-react";
import API, { ENDPOINTS } from "@/lib/api-configs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import CreateEventModal from "./CreateEventModal";
import defaultProfile from "@/assets/default.png";

const UpcomingEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchEvents = async () => {
    try {
      const { data } = await API.get(ENDPOINTS.EVENTS.BASE);
      // Log this to your browser console to verify 'eventImage' exists in the data
      console.log("Event Data received:", data); 
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

  const handleRSVP = async (eventId: string) => {
    try {
      await API.post(ENDPOINTS.EVENTS.RSVP(eventId));
      toast({
        title: "You're on the list! 🇨🇮",
        description: "Successfully RSVP'd for this event.",
      });
      fetchEvents();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Action failed",
        description: err.response?.data?.message || "Could not complete RSVP.",
      });
    }
  };

  const handleDelete = async (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation(); // Prevents clicking the card
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await API.delete(ENDPOINTS.EVENTS.DELETE(eventId));
      toast({
        title: "Event Deleted",
        description: "The meetup has been removed.",
      });
      fetchEvents(); 
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "You are not authorized to delete this event.",
      });
    }
  };

  if (loading)
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-2" size={32} />
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Loading Texas Meetups...
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/50 p-6 rounded-3xl border border-border/40 backdrop-blur-sm">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter uppercase text-foreground">
            Texas Meetups
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            Connect with Ivorians across the Lone Star State.
          </p>
        </div>
        <CreateEventModal onEventCreated={fetchEvents} />
      </div>

      {/* 2. GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.length === 0 ? (
          <Card className="col-span-full p-16 text-center border-2 border-dashed bg-muted/10 rounded-3xl">
            <Calendar size={48} className="mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-lg font-bold">No upcoming gatherings</h3>
          </Card>
        ) : (
          events.map((event: any) => {
            // Owner Check Fix: Compare as Strings
            const organizerId = event.organizer?._id || event.organizer;
            const currentUserId = user?.id || user?._id;
            const isOwner = currentUserId && organizerId && String(currentUserId) === String(organizerId);

            return (
              <Card
                key={event._id}
                className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-3xl bg-card relative"
              >
                {/* Event Image Banner */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={event.eventImage || event.imageUrl || "https://images.unsplash.com/photo-1528605276204-43573a1cf091?q=80&w=1000&auto=format&fit=crop"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={event.title}
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1528605276204-43573a1cf091?q=80&w=1000&auto=format&fit=crop";
                    }}
                  />
                  
                  {/* DELETE BUTTON - Elevated with z-50 */}
                  {isOwner && (
                    <button
                      onClick={(e) => handleDelete(e, event._id)}
                      className="absolute top-3 left-3 z-50 p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-2xl transition-all active:scale-90"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20">
                    {event.category || "General"}
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-black text-xl italic tracking-tighter text-foreground group-hover:text-primary transition-colors truncate uppercase">
                      {event.title}
                    </h3>

                    <div className="flex flex-col gap-1.5 mt-3">
                      <div className="flex items-center gap-2 text-muted-foreground text-[11px] font-bold uppercase tracking-wider">
                        <Calendar size={14} className="text-orange-500" />
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-[11px] font-bold uppercase tracking-wider">
                        <MapPin size={14} className="text-green-600" />
                        {event.location}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                    {event.description}
                  </p>

                  {/* Footer */}
                  <div className="pt-4 flex items-center justify-between border-t border-border/60">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {event.attendees?.slice(0, 3).map((a: any) => (
                          <div key={a._id} className="w-7 h-7 rounded-full border-2 border-card bg-muted overflow-hidden">
                            <img 
                              src={a.profileImage || defaultProfile} 
                              className="w-full h-full object-cover" 
                              alt="Attendee" 
                            />
                          </div>
                        ))}
                      </div>
                      {event.attendees?.length > 0 && (
                        <span className="text-[10px] font-black text-muted-foreground uppercase">
                          {event.attendees.length} Joined
                        </span>
                      )}
                    </div>

                    <Button
                      onClick={() => handleRSVP(event._id)}
                      variant="ghost"
                      size="sm"
                      className="h-8 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 rounded-full"
                    >
                      RSVP <ArrowUpRight size={12} className="ml-1" />
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