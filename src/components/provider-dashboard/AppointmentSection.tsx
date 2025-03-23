import React, { useState } from "react";
import { Calendar, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { patients } from "./data/patientData";
import { upcomingAppointments, convertToAppointments } from "./data/appointmentData";
import CalendarScheduler, { Appointment } from "@/components/appointments/CalendarScheduler";
import ProviderAppointmentScheduleForm from "@/components/appointments/ProviderAppointmentScheduleForm";
import AppointmentDetails from "@/components/appointments/AppointmentDetails";

const AppointmentSection = () => {
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointmentDetailsOpen, setAppointmentDetailsOpen] = useState(false);

  // Convert upcomingAppointments to the Appointment type
  const providerAppointments = convertToAppointments(upcomingAppointments, patients);
  
  // Handle selecting an appointment
  const handleAppointmentSelected = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setAppointmentDetailsOpen(true);
  };
  
  // Handle appointment completion
  const handleAppointmentComplete = (appointment: Appointment) => {
    toast.success(`Appointment with ${appointment.patientName} marked as completed`);
    // In a real app, update the appointment status in the database
  };
  
  // Handle appointment cancellation
  const handleAppointmentCancel = (appointment: Appointment) => {
    toast.success(`Appointment with ${appointment.patientName} cancelled`);
    // In a real app, update the appointment status in the database
  };
  
  // Handle appointment editing
  const handleAppointmentEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setScheduleModalOpen(true);
  };
  
  // Handle new appointment creation
  const handleAppointmentCreated = (appointment: Appointment) => {
    toast.success(`New appointment with ${appointment.patientName} scheduled`);
    // In a real app, add the appointment to the database
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Appointment Schedule</CardTitle>
            <CardDescription>Manage your upcoming appointments with patients</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setScheduleModalOpen(true)}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
            <Button variant="outline">
              <Leaf className="h-4 w-4 mr-2" />
              Traditional Consult
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CalendarScheduler 
          appointments={providerAppointments.map(appointment => ({
            ...appointment,
            date: appointment.date instanceof Date ? appointment.date : new Date(appointment.date)
          }))}
          patients={patients}
          onScheduleAppointment={() => setScheduleModalOpen(true)}
          onAppointmentSelected={handleAppointmentSelected}
        />
      </CardContent>

      {/* Appointment Scheduling Dialog */}
      <ProviderAppointmentScheduleForm
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
        patients={patients}
        onAppointmentCreated={handleAppointmentCreated}
      />
      
      {/* Appointment Details Dialog */}
      <AppointmentDetails
        appointment={selectedAppointment}
        open={appointmentDetailsOpen}
        onOpenChange={setAppointmentDetailsOpen}
        onEdit={handleAppointmentEdit}
        onCancel={handleAppointmentCancel}
        onComplete={handleAppointmentComplete}
      />
    </Card>
  );
};

export default AppointmentSection; 