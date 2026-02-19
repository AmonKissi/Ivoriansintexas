import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Use this instead of next/navigation
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2, CalendarDays, Lock, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data (replace with your API call)
const MOCK_EVENTS = [
  {
    _id: "1",
    title: "Independence Day Gala",
    date: "August 7, 2025",
    time: "7:00 PM",
    location: "Downtown Dallas, TX",
    description: "Celebrating Ivorian culture with food, music, and community."
  }
];

const Events = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in localStorage (common React SPA pattern)
    const token = localStorage.getItem("token");
    
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
    } else {
      setIsAuthenticated(true);
      // Simulate API fetch
      setTimeout(() => {
        setEvents(MOCK_EVENTS);
        setLoading(false);
      }, 1000);
    }
  }, []);

  // Show "Members Only" view if not logged in - prevents 404
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <section className="pt-40 pb-20 container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto bg-card p-10 rounded-[2.5rem] border shadow-2xl">
            <div className="bg-orange-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="text-orange-600" size={32} />
            </div>
            <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-4">Members Only</h2>
            <p className="text-muted-foreground mb-8 font-medium">
              To view and RSVP for community events, please sign in to your AIT account.
            </p>
            <Button 
              onClick={() => navigate("/login")} 
              className="w-full bg-foreground text-background font-bold py-6 rounded-2xl hover:bg-green-600 hover:text-white transition-all uppercase tracking-widest text-xs"
            >
              Sign In to Access
            </Button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-orange-500/10 via-background to-green-600/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6 tracking-tighter italic uppercase">
            Upcoming Events
          </h1>
          <p className="text-xl text-muted-foreground font-medium">Don't miss out on what's happening in the community.</p>
        </div>
      </section>

      {/* Events List */}
      <section className="py-20 container mx-auto px-4 max-w-6xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary mb-4" size={48} />
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Loading Events...</p>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Card key={event._id} className="rounded-[2rem] overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all">
                <CardHeader className="bg-foreground text-background p-8">
                  <h3 className="text-xl font-black uppercase italic tracking-tight">{event.title}</h3>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-tighter text-orange-600">
                      <CalendarDays size={18} /> {event.date}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                      <Clock size={18} /> {event.time}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                      <MapPin size={18} /> {event.location}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">{event.description}</p>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest text-[10px] rounded-xl py-5">
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-[3rem] border-muted">
            <CalendarDays className="mx-auto text-muted-foreground/20 mb-4" size={64} />
            <h3 className="text-xl font-bold text-muted-foreground uppercase tracking-widest">No upcoming events</h3>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Events;