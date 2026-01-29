// src/pages/SignUp.tsx

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { UserPlus, Mail, Lock, User, MapPin, ArrowRight, CheckCircle2, Phone } from "lucide-react";

const SignUp = () => {
  const benefits = [
    "Access to exclusive community events",
    "Professional networking opportunities",
    "Support during life transitions",
    "Cultural preservation initiatives"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-20 px-4 mt-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Value Proposition */}
          <div className="hidden lg:block space-y-8 mt=12">
            <h1 className="text-5xl font-bold text-foreground leading-tight">
              Join the <span className="text-primary">AIT</span> Family
            </h1>
            <p className="text-xl text-muted-foreground">
              Be part of a vibrant community dedicated to mutual support and celebrating our Ivorian heritage, no matter where you are.
            </p>
            
            <ul className="space-y-4">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-center text-foreground font-medium">
                  <CheckCircle2 className="text-secondary mr-3" size={24} />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side: Sign Up Form */}
          <div className="bg-card p-8 rounded-2xl shadow-elegant border border-border w-full max-w-md mx-auto">
            <div className="text-center mb-8 lg:text-left">
              <div className="inline-flex items-center justify-center lg:hidden w-12 h-12 rounded-full bg-muted mb-4 text-primary">
                <UserPlus size={24} />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
              <p className="text-muted-foreground mt-2">Connect with the Ivorian diaspora</p>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground ml-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input type="text" placeholder="Jean" className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground ml-1">Last Name</label>
                  <input type="text" placeholder="Kouadio" className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input type="email" placeholder="jean.k@example.com" className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" />
                </div>
              </div>

              {/* Phone Number Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input type="tel" placeholder="+1 (555) 000-0000" className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" />
                </div>
              </div>

              {/* City Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground ml-1">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input type="text" placeholder="Your current city" className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input type="password" placeholder="••••••••" className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" />
                </div>
              </div>

              <div className="pt-2">
                <Button size="lg" className="w-full bg-gradient-primary hover:opacity-90 transition-all shadow-md">
                  Get Started
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-muted-foreground">
                Already a member?{" "}
                <a href="/login" className="text-primary font-semibold hover:underline">
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignUp;