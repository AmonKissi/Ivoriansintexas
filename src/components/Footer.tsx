// src/components/Footer.tsx

import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {/* <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-xl font-bold text-white">AIT</span>
              </div> */}
              <img src="/ait-logo.png" alt="AIT Logo" className="w-16 h-16 rounded-full shadow-warm transition-transform duration-300 group-hover:scale-110" />
              <div>
                <h3 className="text-lg font-bold text-foreground">AIT</h3>
                <p className="text-xs text-muted-foreground">Ivorians in Texas</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Together we rise — Unity, Culture, and Progress.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
               </Link>
              </li>
              <li>
                <Link to="/events" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Events
               </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Gallery
               </Link>
              </li>
              <li>
                <Link to="/news" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  News
               </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={16} className="text-primary" />
                <span>info@ivoriansintexas.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={16} className="text-primary" />
                <span>Contact via WhatsApp</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <Link
                to="https://facebook.com/ivoriansintexas"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted hover:bg-primary transition-colors flex items-center justify-center group"
                aria-label="Facebook"
              >
                <Facebook size={20} className="text-foreground group-hover:text-primary-foreground" />
             </Link>
              <Link
                to="https://instagram.com/ivoriansintexas"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted hover:bg-primary transition-colors flex items-center justify-center group"
                aria-label="Instagram"
              >
                <Instagram size={20} className="text-foreground group-hover:text-primary-foreground" />
             </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
  <p className="text-sm text-muted-foreground">
    © {new Date().getFullYear()} Association des Ivoiriens au Texas. All rights reserved.
  </p>

  <p className="text-xs text-muted-foreground mt-2">
    Designed by{" "}
    <Link
      to="https://buildandrun.net"
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:text-primary transition-colors"
    >
      Build and Run
   </Link>
  </p>
</div>

      </div>
    </footer>
  );
};

export default Footer;
