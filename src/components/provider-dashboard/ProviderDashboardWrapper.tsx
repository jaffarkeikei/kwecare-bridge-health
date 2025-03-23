import React, { useEffect } from "react";
import ProviderDashboardPage from "./ProviderDashboardPage";

const ProviderDashboardWrapper: React.FC = () => {
  // Force all flags to prevent auto-opening of AI assistant
  useEffect(() => {
    // Multiple approaches to prevent auto-opening
    sessionStorage.setItem("kwecare_disable_ai_auto_open", "true");
    sessionStorage.setItem("provider_dashboard_visited", "true");
    
    // Ensure dashboard overview is the landing page
    sessionStorage.setItem("provider_dashboard_tab", "dashboard");
    
    // Force refresh of window without any parameters that might trigger assistant
    if (window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Ensure we're on the correct page
    if (window.location.pathname !== "/provider-dashboard") {
      window.location.pathname = "/provider-dashboard";
    }
  }, []);
  
  return <ProviderDashboardPage />;
};

export default ProviderDashboardWrapper; 