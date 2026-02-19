import { useState, useEffect } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { Menu, X, LogIn, UserPlus, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/events", label: "Events" },
    { to: "/gallery", label: "Gallery" },
    { to: "/news", label: "News" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled 
          ? "bg-background/95 backdrop-blur-md py-2 shadow-md border-border" 
          : "bg-transparent py-4 border-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* 1. BRAND LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-green-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <img 
                src="/ait-logo.png" 
                alt="AIT Logo" 
                className="relative w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-background object-cover transition-transform duration-500 group-hover:rotate-[360deg]" 
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black tracking-tighter text-foreground leading-none">AIT</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Texas</p>
            </div>
          </Link>

          {/* 2. DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <RouterNavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => cn(
                  "px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 hover:bg-primary/5",
                  isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </RouterNavLink>
            ))}
          </nav>

          {/* 3. AUTH ACTIONS */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" className="gap-2 font-bold hover:bg-primary/5 text-foreground">
                  <LogIn size={16} />
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold px-6 rounded-full shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 gap-2">
                  <UserPlus size={16} />
                  Join Us
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-xl bg-muted/50 text-foreground hover:bg-primary/10 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b shadow-2xl animate-in slide-in-from-top-4 duration-300">
            <nav className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <RouterNavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "text-lg font-bold py-2 border-l-4 pl-4 transition-all",
                    isActive ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground"
                  )}
                >
                  {link.label}
                </RouterNavLink>
              ))}
              
              <hr className="border-border my-2" />
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full font-bold h-12 rounded-xl border-2">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full font-bold h-12 rounded-xl bg-orange-600 shadow-lg shadow-orange-500/20">
                    Join Us
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;