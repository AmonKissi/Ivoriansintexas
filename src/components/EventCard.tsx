import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface EventCardProps {
  _id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  attendees?: any[]; // Array of user IDs
  image?: string;
}

const EventCard = ({ _id, title, date, location, description, attendees, image }: EventCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAction = () => {
    if (!user) {
      toast({
        title: "Join the Community!",
        description: "Please login or register to see event details and RSVP.",
      });
      navigate("/login");
      return;
    }
    // If logged in, go to the full event detail page
    navigate(`/events/${_id}`);
  };

  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col h-full bg-card">
      <div className="relative h-52 overflow-hidden">
        <img
          src={image || "/placeholder-event.jpg"} // Add a fallback image
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
           <p className="text-[10px] font-black uppercase text-primary tracking-wider">Upcoming</p>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <h3 className="text-xl font-bold text-foreground leading-tight line-clamp-2">
          {title}
        </h3>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {description}
        </p>
        
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center gap-3 text-sm font-medium text-foreground/80">
            <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
              <Calendar size={14} />
            </div>
            <span>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm font-medium text-foreground/80">
            <div className="bg-orange-500/10 p-1.5 rounded-lg text-orange-600">
              <MapPin size={14} />
            </div>
            <span className="truncate">{location}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm font-medium text-foreground/80">
            <div className="bg-green-500/10 p-1.5 rounded-lg text-green-600">
              <Users size={14} />
            </div>
            <span>{attendees?.length || 0} Attending</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          onClick={handleAction}
          className="w-full bg-foreground text-background hover:bg-primary hover:text-white font-bold h-11 rounded-xl transition-all gap-2"
        >
          {user ? "View Details" : "Login to Learn More"}
          <ArrowRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;