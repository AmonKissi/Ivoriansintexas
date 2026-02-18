import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import cultureImage from "@/assets/culture-celebration.jpg";
import { Link } from "react-router-dom"; // Added Link import
import { Button } from "@/components/ui/button"; // Optional: if you want a styled button

const Events = () => {
  const events = [
    {
      title: "Independence Day Celebration 2026",
      date: "August 7, 2026",
      location: "Dallas Convention Center, Dallas, TX",
      description: "Join us for a grand celebration of Ivorian independence with traditional food, music, dance performances, and cultural exhibitions. Bring the whole family!",
      attendees: 250,
      image: cultureImage,
    },
    {
      title: "Monthly Community Meetup - March",
      date: "March 15, 2026",
      location: "Houston Community Hall, Houston, TX",
      description: "Connect with fellow Ivorians, share experiences, and discuss community initiatives. Open forum and networking session.",
      attendees: 80,
    },
    {
      title: "Cultural Night Gala",
      date: "April 20, 2026",
      location: "Austin Ballroom, Austin, TX",
      description: "An elegant evening showcasing Ivorian art, fashion, and culinary excellence. Formal attire requested.",
      attendees: 150,
    },
    {
      title: "Youth Mentorship Program Kickoff",
      date: "May 5, 2026",
      location: "San Antonio Youth Center, San Antonio, TX",
      description: "Launch event for our new mentorship program connecting young Ivorians with community leaders and professionals.",
      attendees: 60,
    },
    {
      title: "Summer Cookout & Family Day",
      date: "June 15, 2026",
      location: "Fort Worth City Park, Fort Worth, TX",
      description: "Relax and enjoy good food, games, and quality time with the AIT family. Traditional Ivorian dishes and BBQ.",
      attendees: 200,
    },
    {
      title: "Business & Entrepreneurship Workshop",
      date: "July 10, 2026",
      location: "Dallas Business Hub, Dallas, TX",
      description: "Learn from successful Ivorian entrepreneurs, network with business owners, and explore resources for starting your own business.",
      attendees: 45,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Community Events
            </h1>
            <p className="text-xl text-muted-foreground">
              Join us at our vibrant gatherings, cultural celebrations, and community activities
            </p>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <EventCard key={index} {...event} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Want to Host an Event?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              AIT welcomes member-organized events. If you have an idea for a gathering, 
              workshop, or cultural activity, we'd love to hear from you!
            </p>
            {/* Fixed the typo: Changed <a> to <Link> and corrected the path */}
            <Link to="/contact">
              <Button className="bg-gradient-primary text-white font-semibold px-8 py-6 text-lg rounded-xl hover:opacity-90 transition-opacity">
                Contact Us About Your Event Idea
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;