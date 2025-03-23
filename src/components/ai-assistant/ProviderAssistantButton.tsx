import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Stethoscope, Sparkles } from "lucide-react";
import { ProviderAssistantAI } from "./index";
import { useNavigate } from "react-router-dom";

interface ProviderAssistantButtonProps {
  className?: string;
  autoOpen?: boolean;
}

const ProviderAssistantButton: React.FC<ProviderAssistantButtonProps> = ({ 
  className,
  autoOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (autoOpen) {
      setIsOpen(true);
    }
  }, [autoOpen]);
  
  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };
  
  const handleClose = () => {
    setIsOpen(false);
    navigate('/provider-dashboard');
  };

  return (
    <>
      <Button
        onClick={handleToggle}
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