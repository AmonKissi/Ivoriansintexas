import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import EventCard from "@/components/EventCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Heart, ArrowRight } from "lucide-react";
import cultureImage from "@/assets/culture-celebration.jpg";

const Home = () => {
  const upcomingEvents = [
    {
      title: "Independence Day Celebration",
      date: "August 7, 2025",
      location: "Dallas Convention Center",
      description: "Join us for a grand celebration of Ivorian independence with traditional food, music, and dance.",
      attendees: 250,
      image: cultureImage,
    },
    {
      title: "Monthly Community Meetup",
      date: "March 15, 2025",
      location: "Houston Community Hall",
      description: "Connect with fellow Ivorians, share experiences, and discuss community initiatives.",
      attendees: 80,
    },
    {
      title: "Cultural Night Gala",
      date: "April 20, 2025",
      location: "Austin Ballroom",
      description: "An elegant evening showcasing Ivorian art, fashion, and culinary excellence.",
      attendees: 150,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <Hero />

      {/* Mission Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12">
              The Association des Ivoiriens au Texas (AIT) is dedicated to bringing Ivorians together 
              as one united family. We foster connection, provide mutual support, and celebrate our 
              rich cultural heritage while building a strong, vibrant community in Texas.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="bg-card p-8 rounded-xl shadow-elegant hover:shadow-warm transition-all duration-300 border border-border">
                <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-3xl font-bold text-foreground mb-2">500+</h3>
                <p className="text-muted-foreground">Active Members</p>
              </div>
              
              <div className="bg-card p-8 rounded-xl shadow-elegant hover:shadow-warm transition-all duration-300 border border-border">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-secondary" />
                <h3 className="text-3xl font-bold text-foreground mb-2">50+</h3>
                <p className="text-muted-foreground">Events Annually</p>
              </div>
              
              <div className="bg-card p-8 rounded-xl shadow-elegant hover:shadow-warm transition-all duration-300 border border-border">
                <Heart className="w-12 h-12 mx-auto mb-4 text-accent" />
                <h3 className="text-3xl font-bold text-foreground mb-2">10+</h3>
                <p className="text-muted-foreground">Years Serving</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join us at our vibrant community gatherings and cultural celebrations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {upcomingEvents.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity">
              View All Events
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </div>
      </section>

      {/* Community Highlights Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                  A Community That Feels Like Home
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  AIT is a lively mix of Ivorians from all over Texas — students, families, professionals. 
                  We share good vibes, help one another when needed, and create spaces where people feel at home.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Whether it's a party, a community event, or just a moment to talk about home, 
                  AIT is where Ivorians come together to celebrate our heritage and support each other's growth.
                </p>
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity">
                  Learn More About Us
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </div>

              <div className="relative">
                <img
                  src={cultureImage}
                  alt="Ivorian cultural celebration"
                  className="rounded-2xl shadow-elegant w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-overlay rounded-2xl opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <NewsletterSignup />

      <Footer />
    </div>
  );
};

export default Home;
