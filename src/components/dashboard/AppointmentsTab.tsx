
import React, { useState } from "react";
import { Calendar, Clock, User, Stethoscope } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample appointment data
const appointments = [
  {
    id: 1,
    title: "Telemedicine Call",
    doctor: "Dr. Sarah Johnson",
    specialty: "Endocrinologist",
    time: "Today, 3:00 PM",
    status: "upcoming",
    notes: "Follow-up on recent blood sugar levels and medication adjustment."
  },
  {
    id: 2,
    title: "Diabetes Follow-up",
    doctor: "Dr. Michael Chen",
    specialty: "Internal Medicine",
    time: "Nov 15, 10:00 AM",
    status: "scheduled",
    notes: "Regular quarterly checkup for diabetes management."
  },
  {
    id: 3,
    title: "Blood Test Results",
    doctor: "Dr. Emily White",
    specialty: "Lab Review",
    time: "Nov 22, 2:30 PM",
    status: "scheduled",
    notes: "Review of A1C, cholesterol, and kidney function test results."
  },
  {
    id: 4,
    title: "Foot Examination",
    doctor: "Dr. Robert Clark",
    specialty: "Podiatrist",
    time: "Nov 30, 11:00 AM",
    status: "scheduled",
    notes: "Annual diabetic foot exam to check for neuropathy and circulation issues."
  }
];

const AppointmentsTab = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "details">("list");

  const handleViewAppointment = (id: number) => {
    setSelectedAppointment(id);
    setViewMode("details");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedAppointment(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-amber-500 hover:bg-amber-600";
      case "scheduled":
        return "bg-blue-500 hover:bg-blue-600";
      case "completed":
        return "bg-green-500 hover:bg-green-600";
      case "cancelled":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-2 mb-6">
        <Calendar className="h-6 w-6 text-kwecare-primary" />
        <h2 className="text-2xl font-bold">Appointments</h2>
      </div>

      {viewMode === "list" ? (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="glass-card hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{appointment.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-4 w-4 mr-1" />
                      <span>{appointment.doctor}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Stethoscope className="h-4 w-4 mr-1" />
                      <span>{appointment.specialty}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1 text-kwecare-primary" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Badge>
                </div>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewAppointment(appointment.id)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="glass-card p-6">
          {selectedAppointment && (
            <div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mb-4"
                onClick={handleBackToList}
              >
                ← Back to all appointments
              </Button>
              
              {(() => {
                const appointment = appointments.find(a => a.id === selectedAppointment);
                if (!appointment) return <p>Appointment not found</p>;
                
                return (
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold">{appointment.title}</h3>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Doctor</h4>
                          <p className="text-lg">{appointment.doctor}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Specialty</h4>
                          <p className="text-lg">{appointment.specialty}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Date & Time</h4>
                          <p className="text-lg">{appointment.time}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Appointment ID</h4>
                          <p className="text-lg">#{appointment.id.toString().padStart(4, '0')}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Notes</h4>
                      <p className="p-4 bg-muted/30 rounded-md">{appointment.notes}</p>
                    </div>
                    
                    <div className="pt-4 flex gap-3">
                      <Button variant="default">Reschedule</Button>
                      <Button variant="outline">Cancel Appointment</Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentsTab;
