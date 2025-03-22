
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import Appointments from "./pages/Appointments";
import HealthRecords from "./pages/HealthRecords";
import AIDiagnostics from "./pages/AIDiagnostics";
import Features from "./pages/Features";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { useState, useEffect, createContext } from "react";

// Create context for auth state
export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => {},
  userType: "",
  setUserType: (value: string) => {}
});

const queryClient = new QueryClient();

const App = () => {
  // In a real app, this would check localStorage, cookies, or an API
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState("");
  
  // Check if user is logged in when app loads
  useEffect(() => {
    // This is a simplified example - real apps would verify tokens, etc.
    const checkAuth = () => {
      const hasSession = localStorage.getItem("kwecare_session") || sessionStorage.getItem("kwecare_session");
      const userTypeValue = localStorage.getItem("kwecare_user_type") || sessionStorage.getItem("kwecare_user_type") || "patient";
      
      setIsAuthenticated(!!hasSession);
      setUserType(userTypeValue);
    };
    
    checkAuth();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userType, setUserType }}>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes - Accessible to everyone */}
              <Route path="/" element={<Index />} />
              <Route path="/features" element={<Features />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={isAuthenticated ? 
                (userType === "provider" ? <Navigate to="/provider-dashboard" /> : <Navigate to="/dashboard" />)
                : <Login />} 
              />
              <Route path="/signup" element={isAuthenticated ? 
                (userType === "provider" ? <Navigate to="/provider-dashboard" /> : <Navigate to="/dashboard" />)
                : <SignUp />} 
              />
              
              {/* Protected Patient Routes */}
              <Route 
                path="/dashboard" 
                element={isAuthenticated ? 
                  (userType === "provider" ? <Navigate to="/provider-dashboard" /> : <Dashboard />)
                  : <Navigate to="/login" />} 
              />
              <Route 
                path="/appointments" 
                element={isAuthenticated ? 
                  (userType === "provider" ? <Navigate to="/provider-dashboard" /> : <Appointments />)
                  : <Navigate to="/login" />} 
              />
              <Route 
                path="/health-records" 
                element={isAuthenticated ? 
                  (userType === "provider" ? <Navigate to="/provider-dashboard" /> : <HealthRecords />)
                  : <Navigate to="/login" />} 
              />
              <Route 
                path="/ai-diagnostics" 
                element={isAuthenticated ? 
                  (userType === "provider" ? <Navigate to="/provider-dashboard" /> : <AIDiagnostics />)
                  : <Navigate to="/login" />} 
              />
              
              {/* Protected Provider Routes */}
              <Route 
                path="/provider-dashboard" 
                element={isAuthenticated ? 
                  (userType === "provider" ? <ProviderDashboard /> : <Navigate to="/dashboard" />)
                  : <Navigate to="/login" />} 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
