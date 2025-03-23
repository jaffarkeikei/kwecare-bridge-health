import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PatientDashboard from "./pages/PatientDashboard";
import { ProviderDashboardWrapper } from "./components/provider-dashboard";
import Appointments from "./pages/Appointments";
import HealthRecords from "./pages/HealthRecords";
import AIDiagnostics from "./pages/AIDiagnostics";
import Settings from "./pages/Settings";
import Features from "./pages/Features";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Patient from "./pages/Patient";
import TreatmentPlan from "./pages/TreatmentPlan";
import { useState, useEffect, createContext } from "react";

// Create context for auth state
export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => {},
  userType: "",
  setUserType: (value: string) => {},
  selectedPatientId: null as string | null,
  setSelectedPatientId: (value: string | null) => {}
});

const queryClient = new QueryClient();

const App = () => {
  // In a real app, this would check localStorage, cookies, or an API
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  
  // Check if user is logged in when app loads
  useEffect(() => {
    // This is a simplified example - real apps would verify tokens, etc.
    const checkAuth = () => {
      const sessionActive = localStorage.getItem("kwecare_session") === "active" || 
                           sessionStorage.getItem("kwecare_session") === "active";
      
      if (sessionActive) {
        setIsAuthenticated(true);
        
        // Set the user type based on stored value
        const storedUserType = localStorage.getItem("kwecare_user_type") || 
                              sessionStorage.getItem("kwecare_user_type") || "";
        setUserType(storedUserType);
      } else {
        // Clear any existing auth data including the initial login flag
        setIsAuthenticated(false);
        setUserType("");
        sessionStorage.removeItem("kwecare_initial_provider_login");
        // Also clear any potential AI assistant flags
        sessionStorage.removeItem("kwecare_disable_ai_auto_open");
      }
    };
    
    checkAuth();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ 
        isAuthenticated, 
        setIsAuthenticated, 
        userType, 
        setUserType,
        selectedPatientId,
        setSelectedPatientId
      }}>
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
                (userType === "provider" ? <Navigate to="/provider-dashboard" /> : <Navigate to="/patient-dashboard" />)
                : <Login />} 
              />
              <Route path="/signup" element={isAuthenticated ? 
                (userType === "provider" ? <Navigate to="/provider-dashboard" /> : <Navigate to="/patient-dashboard" />)
                : <SignUp />} 
              />
              
              {/* Protected Patient Routes */}
              <Route 
                path="/patient-dashboard" 
                element={isAuthenticated ? 
                  (userType === "provider" ? <Navigate to="/provider-dashboard" /> : <PatientDashboard />)
                  : <Navigate to="/login" />} 
              />
              {/* Legacy path for backward compatibility */}
              <Route 
                path="/dashboard" 
                element={<Navigate to="/patient-dashboard" />} 
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
                  (userType === "provider" ? <ProviderDashboardWrapper /> : <Navigate to="/patient-dashboard" />)
                  : <Navigate to="/login" />} 
              />
              
              {/* Special route for provider login to ensure they land on the dashboard */}
              <Route 
                path="/provider-login-landing" 
                element={isAuthenticated ? 
                  (userType === "provider" ? <Navigate to="/provider-dashboard" /> : <Navigate to="/patient-dashboard" />)
                  : <Navigate to="/login" />} 
              />
              
              {/* Patient Record Viewer - Protected, only accessible to providers */}
              <Route 
                path="/patient/:patientId" 
                element={isAuthenticated && userType === "provider" ? 
                  <Patient /> : <Navigate to="/login" />} 
              />
              
              {/* Treatment Plan Builder - Protected, only accessible to providers */}
              <Route 
                path="/treatment-plan" 
                element={isAuthenticated && userType === "provider" ? 
                  <TreatmentPlan /> : <Navigate to="/login" />} 
              />
              
              {/* Settings Route - accessible to both user types */}
              <Route 
                path="/settings" 
                element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} 
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
