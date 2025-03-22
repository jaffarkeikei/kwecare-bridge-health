
import React, { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { IndigenousLanguage } from "./LanguageSelector";

const VoiceCommandButton = () => {
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  // Default to English if no language is set
  const language: IndigenousLanguage = 
    (localStorage.getItem("preferredLanguage") as IndigenousLanguage) || "english";

  const toggleListening = () => {
    if (!isListening) {
      // Start listening
      setIsListening(true);
      
      toast.info(`Listening for commands in ${language}...`);
      
      // Simulate voice recognition (would connect to actual voice API in production)
      setTimeout(() => {
        setIsListening(false);
        toast.success("Command recognized");
        
        // For demo purposes, automatically navigate to Cultural Safety section after 1 second
        setTimeout(() => {
          navigate("/dashboard");
          // This would set the active tab to cultural-safety in a real implementation
          const setActiveTabEvent = new CustomEvent("set-active-tab", { 
            detail: { tab: "cultural-safety" } 
          });
          window.dispatchEvent(setActiveTabEvent);
        }, 1000);
      }, 3000);
    } else {
      setIsListening(false);
      toast.info("Voice recognition stopped");
    }
  };

  return (
    <Button
      onClick={toggleListening}
      variant={isListening ? "destructive" : "outline"}
      size="icon"
      className={`rounded-full transition-all ${
        isListening 
          ? "bg-red-500 text-white hover:bg-red-600" 
          : "hover:bg-kwecare-primary/5 hover:text-kwecare-primary hover:border-kwecare-primary/30"
      }`}
      aria-label="Voice commands"
    >
      {isListening ? (
        <MicOff className="h-4 w-4 animate-pulse" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};

export default VoiceCommandButton;
