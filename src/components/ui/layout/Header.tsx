
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-nav py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-2xl font-bold transition-opacity duration-300 hover:opacity-80"
        >
          <Heart className="text-kwecare-primary h-7 w-7" />
          <span className="bg-gradient-to-r from-kwecare-primary to-kwecare-secondary bg-clip-text text-transparent">
            KweCare
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-kwecare-primary ${
              isActive("/") ? "text-kwecare-primary" : "text-foreground/80"
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors hover:text-kwecare-primary ${
              isActive("/about") ? "text-kwecare-primary" : "text-foreground/80"
            }`}
          >
            About
          </Link>
          <Link
            to="/features"
            className={`text-sm font-medium transition-colors hover:text-kwecare-primary ${
              isActive("/features") ? "text-kwecare-primary" : "text-foreground/80"
            }`}
          >
            Features
          </Link>
          <Link
            to="/dashboard"
            className={`text-sm font-medium transition-colors hover:text-kwecare-primary ${
              isActive("/dashboard") ? "text-kwecare-primary" : "text-foreground/80"
            }`}
          >
            Dashboard
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="font-medium">
              Log in
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="bg-kwecare-primary hover:bg-kwecare-primary/90 font-medium">
              Sign up
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-nav animate-fade-in border-t border-gray-200/50">
          <div className="container mx-auto px-6 py-4 space-y-4">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-2 text-sm font-medium transition-colors hover:text-kwecare-primary ${
                isActive("/") ? "text-kwecare-primary" : "text-foreground/80"
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-2 text-sm font-medium transition-colors hover:text-kwecare-primary ${
                isActive("/about") ? "text-kwecare-primary" : "text-foreground/80"
              }`}
            >
              About
            </Link>
            <Link
              to="/features"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-2 text-sm font-medium transition-colors hover:text-kwecare-primary ${
                isActive("/features") ? "text-kwecare-primary" : "text-foreground/80"
              }`}
            >
              Features
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-2 text-sm font-medium transition-colors hover:text-kwecare-primary ${
                isActive("/dashboard") ? "text-kwecare-primary" : "text-foreground/80"
              }`}
            >
              Dashboard
            </Link>
            <div className="pt-2 flex flex-col space-y-3">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center">
                  Log in
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full justify-center bg-kwecare-primary hover:bg-kwecare-primary/90">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
