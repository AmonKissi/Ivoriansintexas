import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Target, Heart, Star } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Users,
      title: "Unity",
      description: "We bring Ivorians together as one family, fostering strong bonds and mutual support.",
    },
    {
      icon: Target,
      title: "Progress",
      description: "We support each other's growth and success, helping new arrivals settle and thrive.",
    },
    {
      icon: Heart,
      title: "Culture",
      description: "We celebrate and preserve our rich Ivorian heritage through events and traditions.",
    },
    {
      icon: Star,
      title: "Excellence",
      description: "We promote education, professional development, and community leadership.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center gap-2 mb-6">
              <div className="w-16 h-1 bg-primary rounded-full"></div>
              <div className="w-16 h-1 bg-muted rounded-full"></div>
              <div className="w-16 h-1 bg-secondary rounded-full"></div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              About AIT
            </h1>
            <p className="text-xl text-muted-foreground italic font-medium">
              "Together we rise — Unity, Culture, and Progress"
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-8 text-center">
              Our Mission
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
              <p className="text-lg leading-relaxed">
                The Association des Ivoiriens au Texas (AIT) is all about bringing Ivorians in Texas 
                together as one big family. Our goal is to stay connected, support each other, and 
                celebrate our beautiful Ivorian culture while building a strong community here in the U.S.
              </p>
              <p className="text-lg leading-relaxed">
                We help new arrivals settle in, promote education and professional development, and make 
                sure our culture shines wherever we go. Through regular events, cultural celebrations, 
                and community support initiatives, we create spaces where every Ivorian can feel at home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-12 text-center">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="bg-card p-8 rounded-xl shadow-elegant hover:shadow-warm transition-all duration-300 border border-border text-center group"
                  >
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Community Description Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-8 text-center">
              Our Community
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                AIT is a lively mix of Ivorians from all over Texas — students, families, professionals — 
                everyone! We share good vibes, help one another when needed, and create spaces where people 
                feel at home.
              </p>
              <p>
                Whether it's a party, a community event, or just a moment to talk about home, AIT is where 
                Ivorians come together. We celebrate our Independence Day with grand festivals, host monthly 
                meetups for networking and support, and organize cultural nights showcasing our art, fashion, 
                and cuisine.
              </p>
              <p>
                Our community extends beyond social gatherings. We provide mentorship for students, support 
                for new arrivals navigating life in Texas, and opportunities for professional growth. We're 
                building bridges not just among Ivorians, but with other African communities across Texas.
              </p>
              <p className="text-xl font-semibold text-foreground italic">
                Join us in keeping Ivorians everywhere connected and proud of our roots!
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
