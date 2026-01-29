import { useState } from "react";
import { NavLink } from "./NavLink";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/events", label: "Events" },
    { to: "/gallery", label: "Gallery" },
    { to: "/news", label: "News" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            {/* <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-warm transition-transform duration-300 group-hover:scale-110">
              <span className="text-2xl font-bold text-white">AIT</span>
            </div> */}
            <img src="/ait-logo.png" alt="AIT Logo" className="w-16 h-16 rounded-full shadow-warm transition-transform duration-300 group-hover:scale-110" />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-foreground">AIT</h1>
              <p className="text-xs text-muted-foreground">Ivorians in Texas</p>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
                activeClassName="text-primary border-b-2 border-primary"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a href="/signup">
            <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
              Join Us
            </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border bg-background">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="text-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
                  activeClassName="text-primary font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              <a  href="/signup">
              <Button className="bg-gradient-primary hover:opacity-90 transition-opacity w-full">
                Join Us
              </Button>
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
