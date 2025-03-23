import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles } from "lucide-react";
import PersonalDoctorAI from "./PersonalDoctorAI";

interface PersonalDoctorButtonProps {
  className?: string;
}

const PersonalDoctorButton: React.FC<PersonalDoctorButtonProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={`bg-gradient-to-r from-kwecare-primary to-kwecare-secondary text-white hover:opacity-90 transition-opacity ${className}`}
        size="sm"
      >
        <Brain className="mr-1.5 h-4 w-4" />
        <span className="flex items-center gap-1">
          <span className="font-medium">AI Doctor</span>
          <Sparkles className="h-3 w-3 text-amber-200" />
        </span>
      </Button>

      <PersonalDoctorAI 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
};

export default PersonalDoctorButton; 