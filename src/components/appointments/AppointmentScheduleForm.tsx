
import React, { useState } from "react";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarPlus, Clock, X } from "lucide-react";

interface AppointmentScheduleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AppointmentScheduleForm: React.FC<AppointmentScheduleFormProps> = ({
  open,
  onOpenChange,
}) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [appointmentType, setAppointmentType] = useState("telemedicine");
  const [doctor, setDoctor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast.error("Please select a date and time");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call to schedule appointment
    setTimeout(() => {
      setIsSubmitting(false);
      onOpenChange(false);
      toast.success("Appointment scheduled successfully!");
      
      // Reset form
      setDate(undefined);
      setReason("");
      setNotes("");
      setAppointmentType("telemedicine");
      setDoctor("");
      
      // Refresh the appointments page
      navigate('/appointments');
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CalendarPlus className="mr-2 h-5 w-5 text-kwecare-primary" />
            Schedule New Appointment
          </DialogTitle>
          <DialogDescription>
            Book a telemedicine or in-person appointment with a healthcare provider.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Visit</Label>
            <Input
              id="reason"
              placeholder="Brief description of your concern"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="doctor">Preferred Provider (Optional)</Label>
            <Input
              id="doctor"
              placeholder="Dr. Name (leave blank for first available)"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="appointment-type">Appointment Type</Label>
            <RadioGroup
              value={appointmentType}
              onValueChange={setAppointmentType}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="telemedicine" id="telemedicine" />
                <Label htmlFor="telemedicine" className="cursor-pointer">Telemedicine</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in-person" id="in-person" />
                <Label htmlFor="in-person" className="cursor-pointer">In-Person</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Preferred Date & Time</Label>
            <DateTimePicker date={date} setDate={setDate} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information for the provider"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-kwecare-primary hover:bg-kwecare-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : "Schedule Appointment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentScheduleForm;
