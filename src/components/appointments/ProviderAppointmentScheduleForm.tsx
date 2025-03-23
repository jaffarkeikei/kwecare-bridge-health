import React, { useState, useEffect } from "react";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarPlus, User, Clock, Stethoscope, Leaf } from "lucide-react";

export interface Patient {
  id: number;
  name: string;
  age: number;
  community: string;
  conditions: string[];
}

interface ProviderAppointmentScheduleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patients?: Patient[];
  onAppointmentCreated?: (appointment: any) => void;
}

const ProviderAppointmentScheduleForm: React.FC<ProviderAppointmentScheduleFormProps> = ({
  open,
  onOpenChange,
  patients = [],
  onAppointmentCreated
}) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [appointmentType, setAppointmentType] = useState("telemedicine");
  const [duration, setDuration] = useState("30");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [isTraditionalConsult, setIsTraditionalConsult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock provider data
  const providers = [
    { id: "1", name: "Dr. Rebecca Taylor (You)", specialty: "General Practice" },
    { id: "2", name: "Dr. Michael Chen", specialty: "Internal Medicine" },
    { id: "3", name: "Dr. Lisa Park", specialty: "Endocrinology" },
    { id: "4", name: "Elder Margaret Francis", specialty: "Traditional Knowledge" }
  ];
  
  const [selectedProviderId, setSelectedProviderId] = useState<string>("1");

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setDate(undefined);
      setReason("");
      setNotes("");
      setAppointmentType("telemedicine");
      setDuration("30");
      setSelectedPatientId("");
      setSelectedProviderId("1");
      setIsTraditionalConsult(false);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast.error("Please select a date and time");
      return;
    }
    
    if (!selectedPatientId) {
      toast.error("Please select a patient");
      return;
    }
    
    setIsSubmitting(true);
    
    // Create new appointment object
    const newAppointment = {
      id: Math.floor(Math.random() * 10000),
      patientId: parseInt(selectedPatientId),
      patientName: patients.find(p => p.id === parseInt(selectedPatientId))?.name || "Unknown Patient",
      providerId: selectedProviderId,
      providerName: providers.find(p => p.id === selectedProviderId)?.name || "Unknown Provider",
      date: date,
      time: date ? `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "",
      reason: reason,
      notes: notes,
      type: appointmentType,
      duration: parseInt(duration),
      isTraditionalConsult: isTraditionalConsult,
      status: "scheduled"
    };
    
    // Simulate API call to schedule appointment
    setTimeout(() => {
      setIsSubmitting(false);
      onOpenChange(false);
      
      if (onAppointmentCreated) {
        onAppointmentCreated(newAppointment);
      }
      
      toast.success(`Appointment scheduled with ${newAppointment.patientName}`);
    }, 1500);
  };

  const selectedPatient = patients.find(p => p.id === parseInt(selectedPatientId));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CalendarPlus className="mr-2 h-5 w-5 text-kwecare-primary" />
            Schedule New Appointment
          </DialogTitle>
          <DialogDescription>
            Schedule an appointment with a patient. Add appointment details below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Select Patient</Label>
            <Select 
              value={selectedPatientId} 
              onValueChange={setSelectedPatientId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map(patient => (
                  <SelectItem key={patient.id} value={patient.id.toString()}>
                    {patient.name} ({patient.age} yrs, {patient.community})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Show patient details if a patient is selected */}
            {selectedPatient && (
              <div className="mt-2 p-3 bg-muted/20 rounded-md">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{selectedPatient.name}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedPatient.conditions.map((condition, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Appointment Reason</Label>
            <Input
              id="reason"
              placeholder="Reason for appointment"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointment-type">Appointment Type</Label>
              <RadioGroup
                value={appointmentType}
                onValueChange={setAppointmentType}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="telemedicine" id="telemedicine" />
                  <Label htmlFor="telemedicine" className="cursor-pointer">Telemedicine</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="in-person" id="in-person" />
                  <Label htmlFor="in-person" className="cursor-pointer">In-Person</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="home-visit" id="home-visit" />
                  <Label htmlFor="home-visit" className="cursor-pointer">Home Visit</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2 mt-4">
                <input
                  type="checkbox"
                  id="traditional-consult"
                  checked={isTraditionalConsult}
                  onChange={(e) => setIsTraditionalConsult(e.target.checked)}
                  className="rounded border-gray-300 text-kwecare-primary focus:ring-kwecare-primary"
                />
                <Label htmlFor="traditional-consult" className="cursor-pointer flex items-center">
                  <Leaf className="h-4 w-4 mr-1 text-green-600" />
                  Include Traditional Knowledge Consult
                </Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Date & Time</Label>
            <DateTimePicker date={date} setDate={setDate} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="provider">Provider</Label>
            <Select 
              value={selectedProviderId} 
              onValueChange={setSelectedProviderId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map(provider => (
                  <SelectItem key={provider.id} value={provider.id}>
                    <div className="flex items-center gap-1">
                      {provider.name}
                      <span className="text-xs text-muted-foreground ml-1">
                        ({provider.specialty})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about this appointment"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
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

export default ProviderAppointmentScheduleForm; 