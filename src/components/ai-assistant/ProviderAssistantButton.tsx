import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Stethoscope, Sparkles } from "lucide-react";
import ProviderAssistantAI from "./ProviderAssistantAI";
import { useNavigate } from "react-router-dom";

interface ProviderAssistantButtonProps {
  className?: string;
  autoOpen?: boolean;
}

const ProviderAssistantButton: React.FC<ProviderAssistantButtonProps> = ({ 
  className,
  autoOpen = false
}) => {
  // Ignore autoOpen prop completely - force it to be false initially
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Force close on initial render
  useEffect(() => {
    // Check if there's a flag to disable auto-open
    const shouldDisableAutoOpen = sessionStorage.getItem("kwecare_disable_ai_auto_open") === "true";
    
    // If auto-open is disabled via session storage, clear the flag and ensure it's closed
    if (shouldDisableAutoOpen) {
      sessionStorage.removeItem("kwecare_disable_ai_auto_open");
      setIsOpen(false);
    } else {
      // Otherwise, respect the autoOpen prop
      setIsOpen(autoOpen);
    }
  }, [autoOpen]);
  
  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate('/provider-dashboard');
  };

  // Updated function to navigate to the main provider dashboard
  const goToMainDashboard = () => {
    // Navigation to the main provider dashboard in the pages directory
    navigate('/dashboard'); // Corrected path to dashboard page
  };

  return (
    <>
      <Button
        onClick={goToMainDashboard}
        className={`bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:opacity-90 transition-opacity ${className}`}
        size="sm"
      >
        <Stethoscope className="mr-1.5 h-4 w-4" />
        <span className="flex items-center gap-1">
          <span className="font-medium">AI Assistant</span>
          <Sparkles className="h-3 w-3 text-amber-200" />
        </span>
      </Button>

      <ProviderAssistantAI 
        isOpen={isOpen} 
        onClose={handleClose} 
      />
    </>
  );
};

export default ProviderAssistantButton; 