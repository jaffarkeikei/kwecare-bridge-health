
import React, { useState } from "react";
import Header from "@/components/ui/layout/Header";
import Footer from "@/components/ui/layout/Footer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Search,
  VideoIcon,
  Calendar as CalendarIcon,
  MapPin,
  CalendarPlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AppointmentScheduleForm from "@/components/appointments/AppointmentScheduleForm";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const appointments = [
  {
    id: 1,
    title: "Telemedicine Call",
    doctor: "Dr. Sarah Johnson",
    specialty: "Endocrinologist",
    time: "Today, 3:00 PM",
    date: new Date(),
    status: "upcoming",
  },
  {
    id: 2,
    title: "Diabetes Follow-up",
    doctor: "Dr. Michael Chen",
    specialty: "Internal Medicine",
    time: "Nov 15, 10:00 AM",
    date: new Date(2023, 10, 15, 10, 0),
    status: "scheduled",
  },
  {
    id: 3,
    title: "Blood Test Results",
    doctor: "Dr. Emily White",
    specialty: "Lab Review",
    time: "Nov 22, 2:30 PM",
    date: new Date(2023, 10, 22, 14, 30),
    status: "scheduled",
  },
  {
    id: 4,
    title: "Annual Physical",
    doctor: "Dr. James Wilson",
    specialty: "Primary Care",
    time: "Dec 05, 9:00 AM",
    date: new Date(2023, 11, 5, 9, 0),
    status: "scheduled",
  },
  {
    id: 5,
    title: "Eye Examination",
    doctor: "Dr. Lisa Park",
    specialty: "Ophthalmologist",
    time: "Dec 12, 1:15 PM",
    date: new Date(2023, 11, 12, 13, 15),
    status: "scheduled",
  },
];

const Appointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState(appointments);
  const [searchQuery, setSearchQuery] = useState("");
  const [scheduleFormOpen, setScheduleFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setFilteredAppointments(appointments);
    } else {
      const filtered = appointments.filter(
        (app) =>
          app.title.toLowerCase().includes(query) ||
          app.doctor.toLowerCase().includes(query) ||
          app.specialty.toLowerCase().includes(query)
      );
      setFilteredAppointments(filtered);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      // Filter appointments for the selected date
      const filtered = appointments.filter(
        (app) => app.date.toDateString() === selectedDate.toDateString()
      );
      setFilteredAppointments(filtered.length > 0 ? filtered : []);
      
      if (filtered.length === 0) {
        toast.info("No appointments scheduled for this date");
      }
    } else {
      setFilteredAppointments(appointments);
    }
  };

  const handleScheduleNew = () => {
    setScheduleFormOpen(true);
  };

  const handleJoinCall = (id: number) => {
    toast.success(`Joining telemedicine call for appointment #${id}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <div className="px-2 py-1 rounded-full bg-kwecare-primary/10 text-kwecare-primary text-xs font-medium">
            Today
          </div>
        );
      case "scheduled":
        return (
          <div className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
            Scheduled
          </div>
        );
      case "completed":
        return (
          <div className="px-2 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium">
            Completed
          </div>
        );
      default:
        return null;
    }
  };

  const getAppointmentsByDate = () => {
    // Group appointments by date for calendar view
    const groupedAppointments: Record<string, typeof appointments> = {};
    
    appointments.forEach(appointment => {
      const dateKey = format(appointment.date, "yyyy-MM-dd");
      if (!groupedAppointments[dateKey]) {
        groupedAppointments[dateKey] = [];
      }
      groupedAppointments[dateKey].push(appointment);
    });
    
    return groupedAppointments;
  };

  // For highlighting dates with appointments in calendar
  const appointmentDates = appointments.map(a => a.date);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Header />
      
      <main className="flex-1 pt-28 px-6 pb-16 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold">Appointments</h1>
            <p className="text-muted-foreground mt-1">
              Manage your healthcare appointments
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
            <Button 
              className="bg-kwecare-primary hover:bg-kwecare-primary/90"
              onClick={handleScheduleNew}
            >
              <CalendarPlus className="h-4 w-4 mr-1" />
              Schedule New
            </Button>
          </div>
        </div>
        
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "calendar")} className="animate-fade-in" style={{ animationDelay: "50ms" }}>
          <div className="flex justify-end mb-4">
            <TabsList>
              <TabsTrigger value="list" className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4" />
                List View
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                Calendar View
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="list">
            <div className="grid md:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="md:col-span-2 space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarClock className="h-5 w-5 text-kwecare-primary" />
                      Your Appointments
                    </CardTitle>
                    <CardDescription>
                      Upcoming and scheduled healthcare visits
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <Tabs defaultValue="all" className="w-full">
                      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                        <TabsList className="mb-0">
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                          <TabsTrigger value="past">Past</TabsTrigger>
                        </TabsList>
                        
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search appointments..."
                            className="pl-8 w-full sm:w-[250px]"
                            value={searchQuery}
                            onChange={handleSearch}
                          />
                        </div>
                      </div>
                      
                      <TabsContent value="all" className="mt-0">
                        <div className="space-y-4">
                          {filteredAppointments.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              No appointments found for your search or selected date
                            </div>
                          ) : (
                            filteredAppointments.map((appointment) => (
                              <div
                                key={appointment.id}
                                className="p-4 rounded-xl border border-border bg-card transition-all hover:border-kwecare-primary/20 hover:shadow-sm"
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="font-medium">{appointment.title}</div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                      {appointment.doctor} • {appointment.specialty}
                                    </div>
                                  </div>
                                  {getStatusBadge(appointment.status)}
                                </div>
                                
                                <div className="flex items-center mt-3 text-sm text-muted-foreground">
                                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                                  {appointment.time}
                                </div>
                                
                                <div className="mt-4 flex items-center gap-2">
                                  {appointment.status === "upcoming" ? (
                                    <>
                                      <Button 
                                        size="sm" 
                                        className="bg-kwecare-primary hover:bg-kwecare-primary/90 text-xs h-8"
                                        onClick={() => handleJoinCall(appointment.id)}
                                      >
                                        <VideoIcon className="mr-1 h-3 w-3" />
                                        Join Call
                                      </Button>
                                      <Button variant="outline" size="sm" className="text-xs h-8">
                                        Reschedule
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button size="sm" variant="outline" className="text-xs h-8">
                                        Details
                                      </Button>
                                      <Button size="sm" variant="ghost" className="text-xs h-8">
                                        Reschedule
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="upcoming" className="mt-0">
                        <div className="space-y-4">
                          {appointments
                            .filter(app => app.status === "upcoming" || app.status === "scheduled")
                            .map((appointment) => (
                              <div
                                key={appointment.id}
                                className="p-4 rounded-xl border border-border bg-card transition-all hover:border-kwecare-primary/20 hover:shadow-sm"
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="font-medium">{appointment.title}</div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                      {appointment.doctor} • {appointment.specialty}
                                    </div>
                                  </div>
                                  {getStatusBadge(appointment.status)}
                                </div>
                                
                                <div className="flex items-center mt-3 text-sm text-muted-foreground">
                                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                                  {appointment.time}
                                </div>
                                
                                <div className="mt-4 flex items-center gap-2">
                                  {appointment.status === "upcoming" ? (
                                    <>
                                      <Button 
                                        size="sm" 
                                        className="bg-kwecare-primary hover:bg-kwecare-primary/90 text-xs h-8"
                                        onClick={() => handleJoinCall(appointment.id)}
                                      >
                                        <VideoIcon className="mr-1 h-3 w-3" />
                                        Join Call
                                      </Button>
                                      <Button variant="outline" size="sm" className="text-xs h-8">
                                        Reschedule
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button size="sm" variant="outline" className="text-xs h-8">
                                        Details
                                      </Button>
                                      <Button size="sm" variant="ghost" className="text-xs h-8">
                                        Reschedule
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="past" className="mt-0">
                        <div className="text-center py-8 text-muted-foreground">
                          No past appointments to display
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-1">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-base">Appointment Calendar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      className="rounded-md p-3 pointer-events-auto"
                      modifiers={{
                        booked: appointmentDates
                      }}
                      modifiersStyles={{
                        booked: {
                          fontWeight: 'bold',
                          border: '2px solid #3b82f6',
                          color: '#3b82f6'
                        }
                      }}
                    />
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Selected Day</h4>
                      <div className="text-sm text-muted-foreground">
                        {date ? date.toDateString() : "No date selected"}
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        {filteredAppointments.length > 0 ? (
                          filteredAppointments.map((app) => (
                            <div key={app.id} className="flex items-center text-sm border-l-2 border-kwecare-primary pl-2 py-1">
                              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span>{app.time.split(',')[1]}</span>
                              <span className="mx-1">-</span>
                              <span className="text-muted-foreground truncate">{app.title}</span>
                            </div>
                          ))
                        ) : date ? (
                          <div className="text-sm text-muted-foreground">
                            No appointments scheduled
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-4">
                  <Button 
                    className="w-full bg-kwecare-primary hover:bg-kwecare-primary/90"
                    onClick={handleScheduleNew}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Schedule New Appointment
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="calendar">
            <div className="animate-fade-in grid grid-cols-1 gap-6" style={{ animationDelay: "150ms" }}>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-kwecare-primary" />
                    Calendar View
                  </CardTitle>
                  <CardDescription>
                    View your appointments on a monthly calendar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-7 gap-4">
                    <div className="md:col-span-5">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        className="w-full rounded-md p-3 pointer-events-auto border border-border"
                        modifiers={{
                          booked: appointmentDates
                        }}
                        modifiersStyles={{
                          booked: {
                            fontWeight: 'bold',
                            border: '2px solid #3b82f6',
                            color: '#3b82f6'
                          }
                        }}
                      />
                      
                      <div className="flex items-center justify-between mt-6 mb-2">
                        <h3 className="text-lg font-medium">
                          {date && format(date, "MMMM d, yyyy")} Appointments
                        </h3>
                        <Button variant="outline" size="sm" onClick={handleScheduleNew}>
                          <Plus className="h-3.5 w-3.5 mr-1.5" />
                          Add New
                        </Button>
                      </div>
                      
                      <div className="space-y-3 mt-4">
                        {filteredAppointments.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed rounded-md">
                            <CalendarClock className="h-10 w-10 text-muted-foreground/60 mb-2" />
                            <p className="text-muted-foreground">No appointments scheduled for this date</p>
                            <Button 
                              variant="link" 
                              className="mt-2" 
                              onClick={handleScheduleNew}
                            >
                              Schedule an appointment
                            </Button>
                          </div>
                        ) : (
                          filteredAppointments.map((appointment) => (
                            <div
                              key={appointment.id}
                              className="p-4 rounded-lg border border-border hover:border-kwecare-primary/20 transition-all"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{appointment.title}</div>
                                  <div className="flex items-center gap-4 mt-1 text-sm">
                                    <div className="text-muted-foreground">
                                      {appointment.doctor}
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
                                      <Clock className="h-3.5 w-3.5 mr-1" />
                                      {appointment.time.split(',')[1]}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {getStatusBadge(appointment.status)}
                                  {appointment.status === "upcoming" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 px-2"
                                      onClick={() => handleJoinCall(appointment.id)}
                                    >
                                      <VideoIcon className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-4">Upcoming Appointments</h3>
                        
                        <div className="space-y-3">
                          {appointments
                            .filter(app => app.status === "upcoming")
                            .slice(0, 3)
                            .map((app) => (
                              <div key={app.id} className="flex items-center gap-3 border-l-2 border-kwecare-primary pl-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{app.title}</p>
                                  <p className="text-xs text-muted-foreground">{app.time}</p>
                                </div>
                              </div>
                            ))}
                            
                          {appointments.filter(app => app.status === "upcoming").length === 0 && (
                            <p className="text-sm text-muted-foreground">No upcoming appointments</p>
                          )}
                        </div>
                        
                        <h3 className="font-medium mt-6 mb-4">Legend</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-kwecare-primary">Today</Badge>
                            <span>Today's appointments</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-md border-2 border-blue-500"></div>
                            <span>Days with appointments</span>
                          </div>
                        </div>
                        
                        <Button
                          className="w-full mt-6 bg-kwecare-primary hover:bg-kwecare-primary/90"
                          onClick={handleScheduleNew}
                        >
                          <CalendarPlus className="mr-1.5 h-4 w-4" />
                          Schedule Appointment
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
      
      <AppointmentScheduleForm
        open={scheduleFormOpen}
        onOpenChange={setScheduleFormOpen}
      />
    </div>
  );
};

export default Appointments;
