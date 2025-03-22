
import React from "react";
import { Link } from "react-router-dom";
import { Heart, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2">
              <Heart className="text-kwecare-primary h-6 w-6" />
              <span className="font-display text-xl font-bold gradient-text">
                KweCare
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Bridging healthcare gaps for remote Indigenous communities through technology and cultural sensitivity.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-kwecare-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-kwecare-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-sm text-muted-foreground hover:text-kwecare-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-kwecare-primary transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-kwecare-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-kwecare-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-sm text-muted-foreground hover:text-kwecare-primary transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:contact@kwecare.org" className="text-sm flex items-center gap-2 text-muted-foreground hover:text-kwecare-primary transition-colors">
                  <Mail className="h-4 w-4" />
                  <span>contact@kwecare.org</span>
                </a>
              </li>
              <li>
                <a href="tel:+1234567890" className="text-sm flex items-center gap-2 text-muted-foreground hover:text-kwecare-primary transition-colors">
                  <Phone className="h-4 w-4" />
                  <span>+1 (234) 567-890</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-sm flex items-center gap-2 text-muted-foreground hover:text-kwecare-primary transition-colors">
                  <MapPin className="h-4 w-4" />
                  <span>Vancouver, Canada</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} KweCare. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-2 md:mt-0">
              Made with respect for Indigenous wisdom and modern technology
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
