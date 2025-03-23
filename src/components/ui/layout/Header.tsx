import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, LogOut, User, Settings, Shield, Bell, Lock, UserCog, BookOpen, LayoutDashboard, HelpCircle, Languages, FileText, BadgeHelp, Leaf, Globe } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import LanguageSelector from "@/components/cultural-safety/LanguageSelector";
import { AuthContext } from "@/App";
import { toast } from "sonner";
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const {
    isAuthenticated,
    setIsAuthenticated,
    userType
  } = useContext(AuthContext);
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

  // Mock user data - in a real app this would come from authentication context
  const mockUserData = {
    patient: {
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      profileImage: null,
      initials: "SJ",
      notifications: 2
    },
    provider: {
      name: "Dr. Rebecca Taylor",
      email: "dr.taylor@healthcare.org",
      profileImage: null,
      initials: "RT",
      notifications: 5
    }
  };

  // Get user data based on user type
  const userData = userType === "provider" ? mockUserData.provider : mockUserData.patient;
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass-nav py-3" : "bg-transparent py-5"}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-2xl font-bold transition-opacity duration-300 hover:opacity-80">
          <Heart className="text-kwecare-primary h-7 w-7" />
          <span className="bg-gradient-to-r from-kwecare-primary to-kwecare-secondary bg-clip-text text-transparent">
            KweCare
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`text-sm font-medium transition-colors hover:text-kwecare-primary ${isActive("/") ? "text-kwecare-primary" : "text-foreground/80"}`}>
            Home
          </Link>
          
          <Link to="/about" className={`text-sm font-medium transition-colors hover:text-kwecare-primary ${isActive("/about") ? "text-kwecare-primary" : "text-foreground/80"}`}>
            About
          </Link>
          
          <Link to="/features" className={`text-sm font-medium transition-colors hover:text-kwecare-primary ${isActive("/features") ? "text-kwecare-primary" : "text-foreground/80"}`}>
            Features
          </Link>
          
          {isAuthenticated && userType === "provider" && <>
              <Link to="/provider-dashboard" className={`text-sm font-medium transition-colors hover:text-kwecare-primary ${isActive("/provider-dashboard") ? "text-kwecare-primary" : "text-foreground/80"}`}>
                Dashboard
              </Link>
              <Link to="/patient/P123456" className={`text-sm font-medium transition-colors hover:text-kwecare-primary ${isActive("/patient") ? "text-kwecare-primary" : "text-foreground/80"}`}>
                Patient Records
              </Link>
              <Link to="/treatment-plan" className={`text-sm font-medium transition-colors hover:text-kwecare-primary ${isActive("/treatment-plan") ? "text-kwecare-primary" : "text-foreground/80"}`}>
                Treatment Plans
              </Link>
            </>}
          
          {isAuthenticated && userType === "patient" && <>
              <Link to="/dashboard" className={`text-sm font-medium transition-colors hover:text-kwecare-primary ${isActive("/dashboard") ? "text-kwecare-primary" : "text-foreground/80"}`}>
                Dashboard
              </Link>
              <Link to="/appointments" className={`text-sm font-medium transition-colors hover:text-kwecare-primary ${isActive("/appointments") ? "text-kwecare-primary" : "text-foreground/80"}`}>
          </Link>
              <Link to="/health-records" className={`text-sm font-medium transition-colors hover:text-kwecare-primary ${isActive("/health-records") ? "text-kwecare-primary" : "text-foreground/80"}`}>
          </Link>
            </>}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <LanguageSelector />
          
          {isAuthenticated ? <div className="flex items-center gap-3">
              {/* Notifications Button */}
              {userData.notifications > 0 && <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                        {userData.notifications}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[300px]">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userType === "provider" ? <>
                        <DropdownMenuItem>
                          <div className="flex flex-col">
                            <span className="font-medium">Critical Patient Alert</span>
                            <span className="text-xs text-muted-foreground">David Wilson reports increased chest pain</span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <div className="flex flex-col">
                            <span className="font-medium">New appointment request</span>
                            <span className="text-xs text-muted-foreground">Sarah Johnson requested a video consultation</span>
                          </div>
                        </DropdownMenuItem>
                      </> : <>
                        <DropdownMenuItem>
                          <div className="flex flex-col">
                            <span className="font-medium">Appointment Reminder</span>
                            <span className="text-xs text-muted-foreground">Your checkup is tomorrow at 10:00 AM</span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <div className="flex flex-col">
                            <span className="font-medium">Lab Results Available</span>
                            <span className="text-xs text-muted-foreground">Your recent blood test results are ready</span>
                          </div>
                        </DropdownMenuItem>
                      </>}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="justify-center">
                      View all notifications
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>}
              
              {/* Settings Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Lock className="mr-2 h-4 w-4" />
                      <span>Privacy & Security</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Languages className="mr-2 h-4 w-4" />
                      <span>Language Preferences</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Notification Settings</span>
                    </DropdownMenuItem>
                    {userType === "provider" && <DropdownMenuItem>
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Data Sharing Policies</span>
                      </DropdownMenuItem>}
                    {userType === "patient" && <DropdownMenuItem>
                        <Leaf className="mr-2 h-4 w-4" />
                        <span>Cultural Preferences</span>
                      </DropdownMenuItem>}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative flex items-center gap-2 pl-2 pr-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userData.profileImage || ''} alt={userData.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {userData.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden sm:block">
                      {userData.name.split(' ')[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">{userData.name}</p>
                    <p className="text-xs text-muted-foreground">{userData.email}</p>
                    {userType === "provider" && <Badge className="w-fit mt-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                        Healthcare Provider
                      </Badge>}
                    {userType === "patient" && <Badge className="w-fit mt-1 bg-blue-100 text-blue-800 hover:bg-blue-100">
                        Patient
                      </Badge>}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </DropdownMenuItem>
                    {userType === "provider" && <>
                        <DropdownMenuItem>
                          <UserCog className="mr-2 h-4 w-4" />
                          <span>Provider Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Globe className="mr-2 h-4 w-4" />
                          <span>Cultural Training</span>
                        </DropdownMenuItem>
                      </>}
                    {userType === "patient" && <>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          <span>My Health Summary</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BookOpen className="mr-2 h-4 w-4" />
                          <span>Health Education</span>
                        </DropdownMenuItem>
                      </>}
                    <DropdownMenuItem>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>{userType === "provider" ? "Provider Dashboard" : "Patient Dashboard"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div> : <>
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
            </>}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Toggle menu">
          {isMobileMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && <div className="md:hidden glass-nav animate-fade-in border-t border-gray-200/50">
          <div className="container mx-auto px-6 py-4 space-y-4">
            {/* Show user profile at top of mobile menu when logged in */}
            {isAuthenticated && <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userData.profileImage || ''} alt={userData.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {userData.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{userData.name}</p>
                  <p className="text-xs text-muted-foreground">{userData.email}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>}
            
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`block py-2 text-sm font-medium transition-colors hover:text-kwecare-primary ${isActive("/") ? "text-kwecare-primary" : "text-foreground/80"}`}>
              Home
            </Link>
            
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={`block py-2 text-sm font-medium transition-colors hover:text-kwecare-primary ${isActive("/about") ? "text-kwecare-primary" : "text-foreground/80"}`}>
              About
            </Link>
            
            <Link to="/features" onClick={() => setIsMobileMenuOpen(false)} className={`block py-2 text-sm font-medium transition-colors hover:text-kwecare-primary ${isActive("/features") ? "text-kwecare-primary" : "text-foreground/80"}`}>
              Features
            </Link>
            
            {isAuthenticated && userType === "provider" && <>
                <Link to="/provider-dashboard" onClick={() => setIsMobileMenuOpen(false)} className={`block py-2 text-sm font-medium transition-colors hover:text-kwecare-primary ${isActive("/provider-dashboard") ? "text-kwecare-primary" : "text-foreground/80"}`}>
                  Dashboard
                </Link>
                <Link to="/patient/P123456" onClick={() => setIsMobileMenuOpen(false)} className={`block py-2 text-sm font-medium transition-colors hover:text-kwecare-primary ${isActive("/patient") ? "text-kwecare-primary" : "text-foreground/80"}`}>
                  Patient Records
                </Link>
                <Link to="/treatment-plan" onClick={() => setIsMobileMenuOpen(false)} className={`block py-2 text-sm font-medium transition-colors hover:text-kwecare-primary ${isActive("/treatment-plan") ? "text-kwecare-primary" : "text-foreground/80"}`}>
                  Treatment Plans
                </Link>
                
                {/* Provider-specific profile and settings in mobile menu */}
                <div className="border-t border-border/50 my-2 pt-2">
                  <div className="text-xs font-medium text-muted-foreground py-2">Provider Options</div>
                  <Link to="/settings/provider" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm flex items-center gap-2 text-foreground/80">
                    <UserCog className="h-4 w-4" />
                    Provider Settings
                  </Link>
                  <Link to="/settings/privacy" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm flex items-center gap-2 text-foreground/80">
                    <Shield className="h-4 w-4" />
                    Data Sharing Policies
                  </Link>
                  <Link to="/settings/cultural-training" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm flex items-center gap-2 text-foreground/80">
                    <Globe className="h-4 w-4" />
                    Cultural Training
                  </Link>
                </div>
              </>}
            
            {isAuthenticated && userType === "patient" && <>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={`block py-2 text-sm font-medium transition-colors hover:text-kwecare-primary ${isActive("/dashboard") ? "text-kwecare-primary" : "text-foreground/80"}`}>
                  Dashboard
                </Link>
                <Link to="/appointments" onClick={() => setIsMobileMenuOpen(false)} className={`block py-2 text-sm font-medium transition-colors hover:text-kwecare-primary ${isActive("/appointments") ? "text-kwecare-primary" : "text-foreground/80"}`}>
                  Appointments
                </Link>
                <Link to="/health-records" onClick={() => setIsMobileMenuOpen(false)} className={`block py-2 text-sm font-medium transition-colors hover:text-kwecare-primary ${isActive("/health-records") ? "text-kwecare-primary" : "text-foreground/80"}`}>
                  Health Records
                </Link>
                
                {/* Patient-specific profile and settings in mobile menu */}
                <div className="border-t border-border/50 my-2 pt-2">
                  <div className="text-xs font-medium text-muted-foreground py-2">Patient Options</div>
                  <Link to="/settings/profile" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm flex items-center gap-2 text-foreground/80">
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                  <Link to="/health-summary" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm flex items-center gap-2 text-foreground/80">
                    <FileText className="h-4 w-4" />
                    Health Summary
                  </Link>
                  <Link to="/settings/cultural" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm flex items-center gap-2 text-foreground/80">
                    <Leaf className="h-4 w-4" />
                    Cultural Preferences
                  </Link>
                </div>
              </>}
            
            <div className="py-2 flex justify-center">
              <LanguageSelector />
            </div>
            
            {!isAuthenticated && <div className="pt-2 flex flex-col space-y-3">
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
              </div>}
            
            {/* Help and Support for both account types */}
            {isAuthenticated && <Link to="/help" onClick={() => setIsMobileMenuOpen(false)} className="mt-4 block py-2 text-sm flex items-center gap-2 text-foreground/80 border-t border-border/50 pt-4">
                <HelpCircle className="h-4 w-4" />
                Help & Support
              </Link>}
          </div>
        </div>}
    </header>;
};
export default Header;