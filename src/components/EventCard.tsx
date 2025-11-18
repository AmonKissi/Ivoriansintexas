import { Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  description: string;
  attendees?: number;
  image?: string;
}

const EventCard = ({ title, date, location, description, attendees, image }: EventCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-warm transition-all duration-300 group">
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-overlay opacity-60"></div>
        </div>
      )}
      
      <CardHeader>
        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-muted-foreground">{description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={16} className="text-primary" />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={16} className="text-primary" />
            <span>{location}</span>
          </div>
          
          {attendees && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users size={16} className="text-secondary" />
              <span>{attendees} attendees</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
          Learn More
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
