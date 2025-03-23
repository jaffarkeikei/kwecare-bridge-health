import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, LogOut } from "lucide-react";
import LanguageSelector from "@/components/cultural-safety/LanguageSelector";
import { AuthContext } from "@/App";
import { toast } from "sonner";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, setIsAuthenticated, userType } = useContext(AuthContext);

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

  const handleLogout = () => {
    localStorage.removeItem("kwecare_session");
    sessionStorage.removeItem("kwecare_session");
    localStorage.removeItem("kwecare_user_type");
    sessionStorage.removeItem("kwecare_user_type");
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
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
          
          {isAuthenticated && userType === "provider" && (
            <>
              <Link
                to="/provider-dashboard"
                className={`text-sm font-medium transition-colors hover:text-kwecare-primary ${
                  isActive("/provider-dashboard") ? "text-kwecare-primary" : "text-foreground/80"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/patient/P123456"
                className={`text-sm font-medium transition-colors hover:text-kwecare-primary ${
                  isActive("/patient") ? "text-kwecare-primary" : "text-foreground/80"
                }`}
              >
                Patient Records
              </Link>
              <Link
                to="/treatment-plan"
                className={`text-sm font-medium transition-colors hover:text-kwecare-primary ${
                  isActive("/treatment-plan") ? "text-kwecare-primary" : "text-foreground/80"
                }`}
              >
                Treatment Plans
              </Link>
            </>
          )}
          
          {isAuthenticated && userType === "patient" && (
            <>
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-kwecare-primary ${
                  isActive("/dashboard") ? "text-kwecare-primary" : "text-foreground/80"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/appointments"
                className={`text-sm font-medium transition-colors hover:text-kwecare-primary ${
                  isActive("/appointments") ? "text-kwecare-primary" : "text-foreground/80"
                }`}
              >
                Appointments
              </Link>
              <Link
                to="/health-records"
                className={`text-sm font-medium transition-colors hover:text-kwecare-primary ${
                  isActive("/health-records") ? "text-kwecare-primary" : "text-foreground/80"
                }`}
              >
                Records
              </Link>
            </>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <LanguageSelector />
          
          {isAuthenticated ? (
            <Button variant="outline" size="sm" className="font-medium gap-1" onClick={handleLogout}>
              <LogOut className="h-3.5 w-3.5" />
              Log out
            </Button>
          ) : (
            <>
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
            </>
          )}
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
            
            {isAuthenticated && userType === "provider" && (
              <>
                <Link
                  to="/provider-dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-sm font-medium transition-colors hover:text-kwecare-primary ${
                    isActive("/provider-dashboard") ? "text-kwecare-primary" : "text-foreground/80"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/patient/P123456"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-sm font-medium transition-colors hover:text-kwecare-primary ${
                    isActive("/patient") ? "text-kwecare-primary" : "text-foreground/80"
                  }`}
                >
                  Patient Records
                </Link>
                <Link
                  to="/treatment-plan"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-sm font-medium transition-colors hover:text-kwecare-primary ${
                    isActive("/treatment-plan") ? "text-kwecare-primary" : "text-foreground/80"
                  }`}
                >
                  Treatment Plans
                </Link>
              </>
            )}
            
            {isAuthenticated && userType === "patient" && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-sm font-medium transition-colors hover:text-kwecare-primary ${
                    isActive("/dashboard") ? "text-kwecare-primary" : "text-foreground/80"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/appointments"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-sm font-medium transition-colors hover:text-kwecare-primary ${
                    isActive("/appointments") ? "text-kwecare-primary" : "text-foreground/80"
                  }`}
                >
                  Appointments
                </Link>
                <Link
                  to="/health-records"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-sm font-medium transition-colors hover:text-kwecare-primary ${
                    isActive("/health-records") ? "text-kwecare-primary" : "text-foreground/80"
                  }`}
                >
                  Health Records
                </Link>
              </>
            )}
            
            <div className="py-2 flex justify-center">
              <LanguageSelector />
            </div>
            
            <div className="pt-2 flex flex-col space-y-3">
              {isAuthenticated ? (
                <Button variant="outline" className="w-full justify-center gap-1" onClick={handleLogout}>
                  <LogOut className="h-3.5 w-3.5" />
                  Log out
                </Button>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
