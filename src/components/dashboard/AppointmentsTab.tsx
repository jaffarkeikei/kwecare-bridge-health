import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, Stethoscope, ArrowLeft, Video, Phone, MapPin, Plus, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Appointment } from "@/types/appointment";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const appointments: Appointment[] = [
  {
    id: 1,
    title: "Telemedicine Call",
    doctor: "Dr. Sarah Johnson",
    specialty: "Endocrinologist",
    time: "Today, 3:00 PM",
    date: new Date(),
    status: "upcoming",
    notes: "Follow-up on recent blood sugar levels and medication adjustment.",
    type: "telemedicine",
    location: "Virtual Appointment",
    duration: 30
  },
  {
    id: 2,
    title: "Diabetes Follow-up",
    doctor: "Dr. Michael Chen",
    specialty: "Internal Medicine",
    time: "Nov 15, 10:00 AM",
    date: new Date(2023, 10, 15, 10, 0),
    status: "scheduled",
    notes: "Regular quarterly checkup for diabetes management.",
    type: "in-person",
    location: "Main Clinic, Room 204",
    duration: 45
  },
  {
    id: 3,
    title: "Blood Test Results",
    doctor: "Dr. Emily White",
    specialty: "Lab Review",
    time: "Nov 22, 2:30 PM",
    date: new Date(2023, 10, 22, 14, 30),
    status: "scheduled",
    notes: "Review of A1C, cholesterol, and kidney function test results.",
    type: "telemedicine",
    location: "Virtual Appointment",
    duration: 20
  },
  {
    id: 4,
    title: "Foot Examination",
    doctor: "Dr. Robert Clark",
    specialty: "Podiatrist",
    time: "Nov 30, 11:00 AM",
    date: new Date(2023, 10, 30, 11, 0),
    status: "scheduled",
    notes: "Annual diabetic foot exam to check for neuropathy and circulation issues.",
    type: "in-person",
    location: "Specialty Clinic, Floor 3",
    duration: 60
  }
];

const AppointmentsTab = () => {
  const navigate = useNavigate();
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "details">("list");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (Math.random() < 0.05) {
        setError("Failed to load appointments. Please try again.");
      }
    }, 800);
  }, []);

  const handleViewAppointment = (id: number) => {
    setSelectedAppointment(id);
    setViewMode("details");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedAppointment(null);
  };

  const handleJoinCall = (id: number) => {
    toast.success(`Joining telemedicine call for appointment #${id}`);
  };

  const handleReschedule = (id: number) => {
    toast.info(`Rescheduling appointment #${id}`);
  };

  const handleCancel = (id: number) => {
    toast.info(`Cancelling appointment #${id}`);
  };

  const handleScheduleNew = () => {
    navigate('/appointments');
    toast.success("Opening appointment scheduler");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Today</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Scheduled</Badge>;
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-2 mb-6">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="h-6 w-6 text-kwecare-primary" />
          <h2 className="text-2xl font-bold">Appointments</h2>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Upcoming appointments section (moved from Dashboard Overview)
  const renderUpcomingAppointments = () => {
    const upcomingAppointments = appointments.filter(app => 
      app.status === "upcoming" || 
      (app.status === "scheduled" && new Date(app.date).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000)
    ).slice(0, 3);
    
    return (
      <Card className="glass-card shadow-sm mb-6 border border-blue-200/50 overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-kwecare-primary" />
              Upcoming Appointments
            </CardTitle>
            <Badge variant="outline" className="bg-blue-100/50 text-blue-700 border-blue-200">
              {upcomingAppointments.length} Upcoming
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <Calendar className="h-10 w-10 mx-auto text-muted-foreground/60 mb-2" />
              <p>No upcoming appointments</p>
              <Button 
                variant="link" 
                size="sm" 
                className="mt-2"
                onClick={handleScheduleNew}
              >
                Schedule an appointment
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-3 rounded-md bg-card hover:bg-blue-50/30 transition-colors border border-blue-100/50 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{appointment.title}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3.5 w-3.5" /> {appointment.time}
                      <span className="mx-1">•</span>
                      <User className="h-3.5 w-3.5" /> {appointment.doctor}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {appointment.type === "telemedicine" && appointment.status === "upcoming" && (
                      <Button 
                        size="sm" 
                        className="h-8 bg-kwecare-primary hover:bg-kwecare-primary/90"
                        onClick={() => handleJoinCall(appointment.id)}
                      >
                        <Video className="h-3.5 w-3.5 mr-1" />
                        Join
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8"
                      onClick={() => handleViewAppointment(appointment.id)}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-sm"
            onClick={() => setViewMode("list")}
          >
            <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
            View All Appointments
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-kwecare-primary" />
          <h2 className="text-2xl font-bold">Appointments</h2>
        </div>
        <Button onClick={handleScheduleNew} variant="branded">
          <Plus className="h-4 w-4 mr-1" />
          Schedule New
        </Button>
      </div>

      {/* Render the Upcoming Appointments section at the top */}
      {viewMode === "list" && renderUpcomingAppointments()}

      {viewMode === "list" ? (
        <div className="grid gap-4">
          {appointments.length === 0 ? (
            <Card className="glass-card p-8 text-center">
              <CardContent className="pt-6">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Appointments</h3>
                <p className="text-muted-foreground mb-6">You don't have any upcoming appointments scheduled.</p>
                <Button onClick={handleScheduleNew} variant="default">
                  <Plus className="h-4 w-4 mr-1" />
                  Schedule Appointment
                </Button>
              </CardContent>
            </Card>
          ) : (
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
                        {appointment.location && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{appointment.location}</span>
                          </div>
                        )}
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewAppointment(appointment.id)}
                      >
                        View Details
                      </Button>
                      
                      {appointment.status === "upcoming" && appointment.type === "telemedicine" && (
                        <Button 
                          size="sm"
                          onClick={() => handleJoinCall(appointment.id)}
                        >
                          <Video className="mr-1 h-4 w-4" />
                          Join Call
                        </Button>
                      )}
                      
                      {(appointment.status === "upcoming" || appointment.status === "scheduled") && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReschedule(appointment.id)}
                          >
                            Reschedule
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleCancel(appointment.id)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to all appointments
              </Button>
              
              {(() => {
                const appointment = appointments.find(a => a.id === selectedAppointment);
                if (!appointment) return <p>Appointment not found</p>;
                
                return (
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold">{appointment.title}</h3>
                      {getStatusBadge(appointment.status)}
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
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm ${
                            appointment.type === "telemedicine" 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-purple-100 text-purple-800"
                          }`}>
                            {appointment.type === "telemedicine" ? (
                              <Video className="mr-1 h-3 w-3" />
                            ) : (
                              <MapPin className="mr-1 h-3 w-3" />
                            )}
                            {appointment.type?.charAt(0).toUpperCase() + appointment.type?.slice(1)}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Date & Time</h4>
                          <p className="text-lg">{appointment.time}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Duration</h4>
                          <p className="text-lg">{appointment.duration} minutes</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
                          <p className="text-lg">{appointment.location}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Notes</h4>
                      <p className="p-4 bg-muted/30 rounded-md">{appointment.notes}</p>
                    </div>
                    
                    <div className="pt-4 flex flex-wrap gap-3">
                      {appointment.status === "upcoming" && appointment.type === "telemedicine" && (
                        <Button onClick={() => handleJoinCall(appointment.id)}>
                          <Video className="mr-1 h-4 w-4" />
                          Join Call
                        </Button>
                      )}
                      
                      {(appointment.status === "upcoming" || appointment.status === "scheduled") && (
                        <>
                          <Button variant="outline" onClick={() => handleReschedule(appointment.id)}>
                            Reschedule
                          </Button>
                          <Button 
                            variant="outline" 
                            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            onClick={() => {
                              handleCancel(appointment.id);
                              handleBackToList();
                            }}
                          >
                            Cancel Appointment
                          </Button>
                        </>
                      )}
                      
                      {appointment.status === "completed" && (
                        <Button variant="outline">
                          Download Summary
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-end gap-3 mt-8">
        <Button variant="outline" onClick={() => navigate('/appointments')}>
          <Calendar className="h-4 w-4 mr-1" />
          View Calendar
        </Button>
        <Button variant="branded" onClick={handleScheduleNew}>
          <Plus className="h-4 w-4 mr-1" />
          Schedule New
        </Button>
      </div>
    </div>
  );
};

export default AppointmentsTab;
