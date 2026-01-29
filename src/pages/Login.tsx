// src/pages/Login.tsx

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { LogIn, Mail, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-card p-8 rounded-2xl shadow-elegant border border-border mt-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4 text-primary">
                <LogIn size={32} />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
              <p className="text-muted-foreground mt-2">
                Sign in to your AIT community account
              </p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <a href="#" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              <Button size="lg" className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
                Sign In
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <a href="/signup" className="text-primary font-semibold hover:underline">
                  Join the Association
                </a>
              </p>
            </div>
          </div>

          {/* Optional: Return Home Link */}
          <div className="text-center mt-6">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to homepage
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;