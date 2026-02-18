import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock } from "lucide-react";
import API, { ENDPOINTS } from "@/lib/api-configs";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await API.get(ENDPOINTS.EVENTS.BASE);
        setEvents(data);
      } catch (err) { console.error(err); }
    };
    fetchEvents();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.length === 0 ? (
        <div className="col-span-full p-12 text-center text-muted-foreground">
          <Calendar size={48} className="mx-auto mb-4 opacity-20" />
          <p>No upcoming events yet. Check back soon for the next gathering!</p>
        </div>
      ) : (
        events.map((event: any) => (
          <Card key={event._id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
            <div className="h-32 bg-slate-200 bg-cover bg-center" style={{ backgroundImage: `url(${event.imageUrl || '/placeholder.svg'})` }} />
            <div className="p-4 space-y-3">
              <h3 className="font-bold text-lg">{event.title}</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><Calendar size={14} className="text-primary" /> {new Date(event.date).toLocaleDateString()}</p>
                <p className="flex items-center gap-2"><MapPin size={14} className="text-primary" /> {event.location}</p>
              </div>
              <Button className="w-full" variant="outline">View Details / RSVP</Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default UpcomingEvents;