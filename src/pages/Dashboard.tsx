
import React, { useEffect, useState } from "react";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import Header from "@/components/ui/layout/Header";
import Footer from "@/components/ui/layout/Footer";
import { 
  BarChart3, 
  Bell, 
  CalendarClock, 
  FileText, 
  Settings,
  Brain,
  Clock,
  VideoIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationsDropdown from "@/components/dashboard/NotificationsDropdown";
import UserDropdown from "@/components/dashboard/UserDropdown";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample appointments data
const appointments = [
  {
    id: 1,
    title: "Telemedicine Call",
    doctor: "Dr. Sarah Johnson",
    specialty: "Endocrinologist",
    time: "Today, 3:00 PM",
    date: new Date(),
    status: "upcoming",
    notes: "Follow-up on recent insulin adjustments and review glucose monitoring data",
    location: "Virtual Appointment",
    duration: "30 minutes"
  },
  {
    id: 2,
    title: "Diabetes Follow-up",
    doctor: "Dr. Michael Chen",
    specialty: "Internal Medicine",
    time: "Nov 15, 10:00 AM",
    date: new Date(2023, 10, 15, 10, 0),
    status: "scheduled",
    notes: "Review medication efficacy and discuss latest lab results",
    location: "Medical Center - Suite 302",
    duration: "45 minutes"
  },
  {
    id: 3,
    title: "Blood Test Results",
    doctor: "Dr. Emily White",
    specialty: "Lab Review",
    time: "Nov 22, 2:30 PM",
    date: new Date(2023, 10, 22, 14, 30),
    status: "scheduled",
    notes: "Review comprehensive metabolic panel and HbA1c results",
    location: "Medical Center - Lab Department",
    duration: "20 minutes"
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  useEffect(() => {
    // Welcome toast when dashboard loads
    toast.success("Welcome back, Sarah!", {
      description: "You have 1 appointment scheduled for today.",
      duration: 5000,
    });
  }, []);

  const handleJoinCall = (id) => {
    toast.success(`Joining telemedicine call for appointment #${id}`);
  };

  const getStatusBadge = (status) => {
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

  // Render the appropriate content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview />;
      case "appointments":
        return (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarClock className="h-5 w-5 text-kwecare-primary" />
                  Your Appointments
                </CardTitle>
                <CardDescription>
                  View and manage your upcoming appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedAppointment ? (
                  // Appointment details view
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold">{selectedAppointment.title}</h2>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedAppointment(null)}
                      >
                        Back to List
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{selectedAppointment.time} • {selectedAppointment.duration}</span>
                    </div>
                    
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Doctor</TableCell>
                          <TableCell>{selectedAppointment.doctor}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Specialty</TableCell>
                          <TableCell>{selectedAppointment.specialty}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Location</TableCell>
                          <TableCell>{selectedAppointment.location}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Status</TableCell>
                          <TableCell>{getStatusBadge(selectedAppointment.status)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Notes</TableCell>
                          <TableCell>{selectedAppointment.notes}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    
                    <div className="flex gap-2 mt-4">
                      {selectedAppointment.status === "upcoming" ? (
                        <Button 
                          className="bg-kwecare-primary hover:bg-kwecare-primary/90"
                          onClick={() => handleJoinCall(selectedAppointment.id)}
                        >
                          <VideoIcon className="mr-2 h-4 w-4" />
                          Join Call
                        </Button>
                      ) : (
                        <Button 
                          className="bg-kwecare-primary hover:bg-kwecare-primary/90"
                        >
                          Reschedule
                        </Button>
                      )}
                      <Button variant="outline">
                        Contact Doctor
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Appointments list view
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="p-4 rounded-xl border border-border bg-card transition-all hover:border-kwecare-primary/20 hover:shadow-sm cursor-pointer"
                        onClick={() => setSelectedAppointment(appointment)}
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
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs h-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAppointment(appointment);
                            }}
                          >
                            View Details
                          </Button>
                          
                          {appointment.status === "upcoming" && (
                            <Button 
                              size="sm" 
                              className="bg-kwecare-primary hover:bg-kwecare-primary/90 text-xs h-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJoinCall(appointment.id);
                              }}
                            >
                              <VideoIcon className="mr-1 h-3 w-3" />
                              Join Call
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      case "health-records":
      case "ai-diagnostics":
        // Show a message that would direct users to the full page
        return (
          <div className="flex flex-col items-center justify-center p-20 text-center space-y-4 rounded-lg border-2 border-dashed border-muted-foreground/20">
            <h2 className="text-2xl font-semibold">
              {activeTab === "health-records" && "Health Records"}
              {activeTab === "ai-diagnostics" && "AI Diagnostics"}
            </h2>
            <p className="text-muted-foreground max-w-md">
              This is a preview of the {activeTab.replace('-', ' ')} tab. For the full experience, click the button below.
            </p>
            <Button 
              className="mt-4 bg-kwecare-primary hover:bg-kwecare-primary/90"
              onClick={() => navigate(`/${activeTab}`)}
            >
              Open Full {activeTab === "health-records" ? "Health Records" : "AI Diagnostics"}
            </Button>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Header />
      
      <main className="flex-1 pt-28 px-6 pb-16 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, Sarah
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <NotificationsDropdown />
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10 transition-all hover:border-kwecare-primary hover:bg-kwecare-primary/5">
              <Settings className="h-4 w-4" />
            </Button>
            <UserDropdown />
          </div>
        </div>
        
        <div className="mb-8 flex flex-wrap gap-3 animate-fade-in transition-all" style={{ animationDelay: "100ms" }}>
          <Button 
            variant={activeTab === "overview" ? "secondary" : "outline"}
            className={activeTab === "overview" 
              ? "bg-kwecare-primary text-white hover:bg-kwecare-primary/90 transition-all duration-300 shadow-sm hover:shadow-md" 
              : "transition-all duration-300 hover:border-kwecare-primary hover:text-kwecare-primary hover:bg-kwecare-primary/5"}
            onClick={() => setActiveTab("overview")}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </Button>
          <Button 
            variant={activeTab === "appointments" ? "secondary" : "outline"}
            className={activeTab === "appointments" 
              ? "bg-kwecare-primary text-white hover:bg-kwecare-primary/90 transition-all duration-300 shadow-sm hover:shadow-md" 
              : "transition-all duration-300 hover:border-kwecare-primary hover:text-kwecare-primary hover:bg-kwecare-primary/5"}
            onClick={() => setActiveTab("appointments")}
          >
            <CalendarClock className="mr-2 h-4 w-4" />
            Appointments
          </Button>
          <Button 
            variant={activeTab === "health-records" ? "secondary" : "outline"}
            className={activeTab === "health-records" 
              ? "bg-kwecare-primary text-white hover:bg-kwecare-primary/90 transition-all duration-300 shadow-sm hover:shadow-md" 
              : "transition-all duration-300 hover:border-kwecare-primary hover:text-kwecare-primary hover:bg-kwecare-primary/5"}
            onClick={() => setActiveTab("health-records")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Health Records
          </Button>
          <Button 
            variant={activeTab === "ai-diagnostics" ? "secondary" : "outline"}
            className={activeTab === "ai-diagnostics" 
              ? "bg-kwecare-primary text-white hover:bg-kwecare-primary/90 transition-all duration-300 shadow-sm hover:shadow-md" 
              : "transition-all duration-300 hover:border-kwecare-primary hover:text-kwecare-primary hover:bg-kwecare-primary/5"}
            onClick={() => setActiveTab("ai-diagnostics")}
          >
            <Brain className="mr-2 h-4 w-4" />
            AI Diagnostics
          </Button>
        </div>
        
        {renderContent()}
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
