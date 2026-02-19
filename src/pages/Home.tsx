import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Calendar, Heart, ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react";
import cultureImage from "@/assets/culture-celebration.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* 1. Hero Section - Public Welcome */}
      <Hero />

      {/* 2. Mission Section - Who we are */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tighter uppercase italic">
              Our Mission
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              The Association des Ivoiriens au Texas (AIT) is dedicated to bringing Ivorians together 
              as one united family. We foster connection, provide mutual support, and celebrate our 
              rich cultural heritage while building a strong, vibrant community in the Lone Star State.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="group bg-card p-10 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-border/50">
                <div className="bg-orange-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-4xl font-black text-foreground mb-2">500+</h3>
                <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest">Active Members</p>
              </div>
              
              <div className="group bg-card p-10 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-border/50">
                <div className="bg-green-600/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="text-4xl font-black text-foreground mb-2">50+</h3>
                <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest">Events Annually</p>
              </div>
              
              <div className="group bg-card p-10 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-border/50">
                <div className="bg-red-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-4xl font-black text-foreground mb-2">10+</h3>
                <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest">Years Serving</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Value Propositions - What makes us unique */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="relative">
              <img
                src={cultureImage}
                alt="Ivorian cultural celebration"
                className="rounded-[2.5rem] shadow-2xl w-full h-[600px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-8 rounded-3xl shadow-xl hidden md:block border border-border">
                <div className="flex items-center gap-4">
                  <div className="bg-primary p-3 rounded-full text-white">
                    <Zap size={24} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-foreground">100%</p>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-tighter">Community Driven</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-black text-foreground leading-[0.9] tracking-tighter uppercase italic">
                  A Community That <br /> 
                  <span className="text-primary underline decoration-orange-500/30">Feels Like Home.</span>
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  AIT is a lively mix of Ivorians from all over Texas — students, families, and professionals. 
                  We share good vibes, help one another when needed, and create spaces where our culture thrives.
                </p>
              </div>
              
              <div className="grid gap-4">
                {[
                  { title: "Cultural Heritage", desc: "Preserving Ivorian traditions for the next generation.", icon: Sparkles },
                  { title: "Mutual Support", desc: "A network that stands together during life's transitions.", icon: ShieldCheck }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl border border-transparent hover:border-border hover:bg-background transition-all">
                    <div className="bg-primary/10 p-3 rounded-xl h-fit text-primary">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/about">
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white font-bold h-14 px-10 rounded-full shadow-lg transition-all hover:scale-105">
                    Learn More About Us
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="lg" variant="outline" className="h-14 px-10 rounded-full font-bold border-2">
                    Join AIT Today
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Newsletter Signup - Public Interaction */}
      <NewsletterSignup />

      <Footer />
    </div>
  );
};

export default Home;