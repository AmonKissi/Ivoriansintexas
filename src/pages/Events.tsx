import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import API, { ENDPOINTS } from "@/lib/api-configs";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarDays } from "lucide-react";

const Events = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Now that GET_ALL is in your config, this will work
        const { data } = await API.get(ENDPOINTS.EVENTS.GET_ALL); 
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-20 bg-gradient-to-br from-orange-500/10 via-background to-green-600/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-foreground mb-6 tracking-tighter italic uppercase">
            Community Events
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover cultural celebrations and social meetups across Texas.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-primary mb-4" size={48} />
              <p className="text-muted-foreground font-medium">Loading upcoming events...</p>
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard key={event._id} {...event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-3xl">
              <CalendarDays className="mx-auto text-muted-foreground/20 mb-4" size={64} />
              <h3 className="text-xl font-bold">No upcoming events</h3>
              <p className="text-muted-foreground">Check back soon for new community gatherings!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;