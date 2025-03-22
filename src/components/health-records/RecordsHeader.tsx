
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface RecordsHeaderProps {
  title: string;
  subtitle: string;
}

const RecordsHeader: React.FC<RecordsHeaderProps> = ({ title, subtitle }) => {
  const navigate = useNavigate();
  
  const handleAddRecord = (type: string) => {
    toast.success(`Adding new ${type} record - feature coming soon`);
  };

  return (
    <div className="flex items-center justify-between mb-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-1">
          {subtitle}
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Dashboard
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => navigate('/ai-diagnostics')}
          className="hidden sm:flex"
        >
          <Brain className="h-4 w-4 mr-1" />
          AI Diagnostics
        </Button>
        
        <Button 
          variant="branded"
          onClick={() => handleAddRecord("health")}
        >
          <FileText className="h-4 w-4 mr-1" />
          Request Records
        </Button>
      </div>
    </div>
  );
};

export default RecordsHeader;
