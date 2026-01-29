// src/components/Hero.tsx

import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-community.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay - Lowered Z-Index */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Ivorian community celebration in Texas"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>

      {/* Content - Increased Z-Index to 20 to ensure it's above everything */}
      <div className="container mx-auto px-4 relative z-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Flag Colors Accent */}
          <div className="flex justify-center gap-2 mb-6">
            <div className="w-16 h-1 bg-primary rounded-full"></div>
            <div className="w-16 h-1 bg-white rounded-full"></div>
            <div className="w-16 h-1 bg-secondary rounded-full"></div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Welcome to AIT
          </h1>

          <p className="text-xl md:text-2xl text-white/95 font-medium mb-4">
            Association des Ivoiriens au Texas
          </p>

          <p className="text-2xl md:text-3xl text-white font-semibold mb-8 italic">
            "Together we rise — Unity, Culture, and Progress"
          </p>

          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-12">
            Bringing Ivorians in Texas together as one big family. Stay
            connected, support each other, and celebrate our beautiful culture
            while building a strong community.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Fix: Using asChild ensures the Link is the actual clickable element */}
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-elegant font-semibold px-8 py-6 text-lg cursor-pointer"
            >
              <Link to="/signup">
                Become a Member
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="px-8 py-6 text-lg font-semibold bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary transition-all cursor-pointer"
            >
              {/* Added temporary link for Events */}
              <Link to="/events">
                Upcoming Events
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Wave - Lowered Z-Index */}
      <div className="absolute bottom-0 left-0 right-0 z-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;