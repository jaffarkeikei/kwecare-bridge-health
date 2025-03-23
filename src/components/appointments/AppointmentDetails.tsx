import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Video, 
  Users,
  FileText,
  Leaf,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  Send,
  Printer
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Appointment } from "./CalendarScheduler";
import { format } from "date-fns";
import { toast } from "sonner";

interface AppointmentDetailsProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  onComplete?: (appointment: Appointment) => void;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  appointment,
  open,
  onOpenChange,
  onEdit,
  onCancel,
  onComplete
}) => {
  if (!appointment) return null;
  
  // Format appointment date and time in a readable format
  const formattedDateTime = format(
    new Date(appointment.date),
    "EEEE, MMMM d, yyyy 'at' h:mm a"
  );
  
  const getTypeIcon = () => {
    switch (appointment.type) {
      case "telemedicine":
        return <Video className="h-5 w-5 text-blue-500" />;
      case "in-person":
        return <MapPin className="h-5 w-5 text-green-500" />;
      case "home-visit":
        return <Users className="h-5 w-5 text-purple-500" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };
  
  const handleEdit = () => {
    if (onEdit) {
      onEdit(appointment);
    }
    onOpenChange(false);
  };
  
  const handleCancel = () => {
    if (onCancel) {
      onCancel(appointment);
    } else {
      toast.success(`Appointment with ${appointment.patientName} cancelled`);
    }
    onOpenChange(false);
  };
  
  const handleComplete = () => {
    if (onComplete) {
      onComplete(appointment);
    } else {
      toast.success(`Appointment with ${appointment.patientName} marked as completed`);
    }
    onOpenChange(false);
  };
  
  const handleSendReminder = () => {
    toast.success(`Reminder sent to ${appointment.patientName}`);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTypeIcon()}
            Appointment Details
          </DialogTitle>
          <DialogDescription>
            View and manage appointment information
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-2">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-4 flex-1">
              <div>
                <h3 className="text-lg font-semibold">{appointment.patientName}</h3>
                <div className="flex items-center text-sm text-muted-foreground gap-1">
                  <Calendar className="h-4 w-4" />
                  {formattedDateTime}
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-1 mt-1">
                  <Clock className="h-4 w-4" />
                  {appointment.duration} minutes
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Badge className={`
                  ${appointment.type === "telemedicine" 
                    ? "bg-blue-100 text-blue-800" 
                    : appointment.type === "in-person"
                      ? "bg-green-100 text-green-800"
                      : "bg-purple-100 text-purple-800"
                  } flex items-center gap-1`}
                >
                  {appointment.type === "telemedicine" && <Video className="h-3.5 w-3.5" />}
                  {appointment.type === "in-person" && <MapPin className="h-3.5 w-3.5" />}
                  {appointment.type === "home-visit" && <Users className="h-3.5 w-3.5" />}
                  {appointment.type === "telemedicine" ? "Virtual Appointment" :
                    appointment.type === "in-person" ? "In-Person Visit" :
                    "Home Visit"}
                </Badge>
                
                {appointment.isTraditionalConsult && (
                  <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
                    <Leaf className="h-3.5 w-3.5" />
                    Traditional Knowledge Consult
                  </Badge>
                )}
                
                <Badge variant="outline" className={`
                  ${appointment.status === "scheduled" 
                    ? "border-blue-200 text-blue-700" 
                    : appointment.status === "completed"
                      ? "border-green-200 text-green-700"
                      : appointment.status === "cancelled"
                        ? "border-red-200 text-red-700"
                        : "border-amber-200 text-amber-700"
                  }`}
                >
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </Badge>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Appointment Reason</h4>
                <Card>
                  <CardContent className="p-3 text-sm">
                    {appointment.reason}
                  </CardContent>
                </Card>
              </div>
              
              {appointment.notes && (
                <div>
                  <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Notes
                  </h4>
                  <Card>
                    <CardContent className="p-3 text-sm">
                      {appointment.notes}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
            
            <div className="flex-shrink-0 md:w-[160px] flex flex-row md:flex-col gap-2">
              {appointment.status === "scheduled" && (
                <>
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={handleEdit}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={handleSendReminder}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Reminder
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="justify-start"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print Details
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 justify-start"
                    onClick={handleComplete}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Complete
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 justify-start"
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
              
              {appointment.status === "completed" && (
                <>
                  <Button 
                    variant="outline" 
                    className="justify-start"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Summary
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="justify-start"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print Details
                  </Button>
                </>
              )}
              
              {appointment.status === "cancelled" && (
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={handleEdit}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Reschedule
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetails; 