
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  CalendarPlus, 
  FileText, 
  MessageSquare, 
  Phone, 
  PlusCircle, 
  RefreshCw 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="justify-start font-normal h-12 text-left hover:bg-kwecare-primary/5 hover:text-kwecare-primary hover:border-kwecare-primary/30"
          onClick={() => navigate("/appointments")}
        >
          <CalendarPlus className="mr-2 h-4 w-4" />
          Schedule Appointment
        </Button>
        
        <Button 
          variant="outline" 
          className="justify-start font-normal h-12 text-left hover:bg-kwecare-primary/5 hover:text-kwecare-primary hover:border-kwecare-primary/30"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Message Provider
        </Button>
        
        <Button 
          variant="outline" 
          className="justify-start font-normal h-12 text-left hover:bg-kwecare-primary/5 hover:text-kwecare-primary hover:border-kwecare-primary/30"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Medication Refill
        </Button>
        
        <Button 
          variant="outline" 
          className="justify-start font-normal h-12 text-left hover:bg-kwecare-primary/5 hover:text-kwecare-primary hover:border-kwecare-primary/30"
          onClick={() => navigate("/health-records")}
        >
          <FileText className="mr-2 h-4 w-4" />
          View Health Records
        </Button>
        
        <Button 
          variant="outline" 
          className="justify-start font-normal h-12 text-left hover:bg-kwecare-primary/5 hover:text-kwecare-primary hover:border-kwecare-primary/30"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Log Health Data
        </Button>
        
        <Button 
          variant="outline" 
          className="justify-start font-normal h-12 text-left hover:bg-kwecare-primary/5 hover:text-kwecare-primary hover:border-kwecare-primary/30"
        >
          <Phone className="mr-2 h-4 w-4" />
          Emergency Contact
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;
