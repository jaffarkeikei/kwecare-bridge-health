
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
  VideoIcon,
  Tablet,
  TestTube,
  Syringe,
  Search,
  Download,
  Share2,
  ListPlus,
  Activity,
  Stethoscope,
  Info,
  AlertTriangle,
  TrendingUp,
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
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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

// Sample medications data
const medications = [
  {
    id: 1,
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    prescribedBy: "Dr. Sarah Johnson",
    startDate: "Oct 15, 2023",
    endDate: "Ongoing",
    instructions: "Take with food",
    status: "Active",
    type: "Tablet",
  },
  {
    id: 2,
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    prescribedBy: "Dr. Michael Chen",
    startDate: "Aug 22, 2023",
    endDate: "Ongoing",
    instructions: "Take in the morning",
    status: "Active",
    type: "Tablet",
  },
  {
    id: 3,
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily",
    prescribedBy: "Dr. Michael Chen",
    startDate: "Aug 22, 2023",
    endDate: "Ongoing",
    instructions: "Take in the evening",
    status: "Active",
    type: "Tablet",
  },
];

// Sample immunizations data
const immunizations = [
  {
    id: 1,
    name: "Influenza Vaccine",
    date: "Sep 15, 2023",
    provider: "Community Healthcare",
    administrator: "Nurse Wilson",
    lot: "FL23456",
    nextDue: "Sep 2024",
  },
  {
    id: 2,
    name: "COVID-19 Booster",
    date: "Jul 22, 2023",
    provider: "Community Healthcare",
    administrator: "Nurse Rodriguez",
    lot: "CV78901",
    nextDue: "As recommended",
  },
  {
    id: 3,
    name: "Tdap (Tetanus, Diphtheria, Pertussis)",
    date: "Mar 10, 2022",
    provider: "Family Care Clinic",
    administrator: "Dr. Emily White",
    lot: "TD34567",
    nextDue: "Mar 2032",
  },
];

// Sample lab results data
const labResults = [
  {
    id: 1,
    name: "HbA1c",
    value: "6.8%",
    referenceRange: "4.0-5.6%",
    status: "High",
    date: "Oct 10, 2023",
    orderedBy: "Dr. Sarah Johnson",
    notes: "Slight improvement from previous test (7.1%)",
  },
  {
    id: 2,
    name: "Blood Glucose",
    value: "135 mg/dL",
    referenceRange: "70-99 mg/dL",
    status: "High",
    date: "Oct 10, 2023",
    orderedBy: "Dr. Sarah Johnson",
    notes: "Fasting blood glucose test",
  },
  {
    id: 3,
    name: "Total Cholesterol",
    value: "195 mg/dL",
    referenceRange: "<200 mg/dL",
    status: "Normal",
    date: "Oct 10, 2023",
    orderedBy: "Dr. Michael Chen",
    notes: "Within normal range",
  },
];

// Sample AI diagnostic tools
const diagnosticTools = [
  {
    id: 1,
    title: "TensorFlow.js Symptom Checker",
    description: "Analyze your symptoms with a browser-based neural network that works offline.",
    icon: <Stethoscope className="h-10 w-10 text-kwecare-primary" />,
    badge: "TensorFlow.js",
    type: "symptoms"
  },
  {
    id: 2,
    title: "TensorFlow.js Health Predictions",
    description: "Identify risks for diabetes, hypertension and other conditions using machine learning.",
    icon: <Activity className="h-10 w-10 text-kwecare-primary" />,
    badge: "Neural Network",
    type: "predictions"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Health Records states
  const [activeHealthTab, setActiveHealthTab] = useState("medications");
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [selectedLabResult, setSelectedLabResult] = useState(null);
  const [selectedImmunization, setSelectedImmunization] = useState(null);
  
  // AI Diagnostics state
  const [selectedTool, setSelectedTool] = useState(null);
  
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

  const handleDownload = (type, id) => {
    toast.success(`Downloading ${type} record #${id}`);
  };

  const handleShare = (type, id) => {
    toast.success(`Preparing to share ${type} record #${id}`);
  };

  const handleAddRecord = (type) => {
    toast.success(`Adding new ${type} record - feature coming soon`);
  };

  const handleSearch = (tab, e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
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
        return (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-kwecare-primary" />
                  Health Records
                </CardTitle>
                <CardDescription>
                  View and manage your health information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedMedication || selectedLabResult || selectedImmunization ? (
                  // Health Record detail view
                  <div>
                    {selectedMedication && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <h2 className="text-xl font-semibold">{selectedMedication.name} ({selectedMedication.dosage})</h2>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedMedication(null)}
                          >
                            Back to List
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Tablet className="h-4 w-4" />
                          <span>{selectedMedication.frequency} • {selectedMedication.type}</span>
                        </div>
                        
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Prescribed By</TableCell>
                              <TableCell>{selectedMedication.prescribedBy}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Start Date</TableCell>
                              <TableCell>{selectedMedication.startDate}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">End Date</TableCell>
                              <TableCell>{selectedMedication.endDate}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Instructions</TableCell>
                              <TableCell>{selectedMedication.instructions}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Status</TableCell>
                              <TableCell>
                                <div className="px-2 py-1 rounded-full bg-green-100 text-green-600 text-xs inline-block">
                                  {selectedMedication.status}
                                </div>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" onClick={() => handleDownload('medication', selectedMedication.id)}>
                            <Download className="mr-1 h-4 w-4" />
                            Download Record
                          </Button>
                          <Button variant="outline" onClick={() => handleShare('medication', selectedMedication.id)}>
                            <Share2 className="mr-1 h-4 w-4" />
                            Share Record
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {selectedLabResult && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <h2 className="text-xl font-semibold">{selectedLabResult.name} Test Result</h2>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedLabResult(null)}
                          >
                            Back to List
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <TestTube className="h-4 w-4" />
                          <span>Tested on {selectedLabResult.date}</span>
                        </div>
                        
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Result Value</TableCell>
                              <TableCell>{selectedLabResult.value}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Reference Range</TableCell>
                              <TableCell>{selectedLabResult.referenceRange}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Status</TableCell>
                              <TableCell>
                                <div className={`px-2 py-1 rounded-full text-xs inline-block ${
                                  selectedLabResult.status === "Normal" 
                                    ? "bg-green-100 text-green-600" 
                                    : "bg-orange-100 text-orange-600"
                                }`}>
                                  {selectedLabResult.status}
                                </div>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Ordered By</TableCell>
                              <TableCell>{selectedLabResult.orderedBy}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Notes</TableCell>
                              <TableCell>{selectedLabResult.notes}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" onClick={() => handleDownload('lab', selectedLabResult.id)}>
                            <Download className="mr-1 h-4 w-4" />
                            Download Result
                          </Button>
                          <Button variant="outline" onClick={() => handleShare('lab', selectedLabResult.id)}>
                            <Share2 className="mr-1 h-4 w-4" />
                            Share Result
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {selectedImmunization && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <h2 className="text-xl font-semibold">{selectedImmunization.name}</h2>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedImmunization(null)}
                          >
                            Back to List
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Syringe className="h-4 w-4" />
                          <span>Administered on {selectedImmunization.date}</span>
                        </div>
                        
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Provider</TableCell>
                              <TableCell>{selectedImmunization.provider}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Administrator</TableCell>
                              <TableCell>{selectedImmunization.administrator}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Lot Number</TableCell>
                              <TableCell>{selectedImmunization.lot}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Next Due</TableCell>
                              <TableCell>{selectedImmunization.nextDue}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" onClick={() => handleDownload('immunization', selectedImmunization.id)}>
                            <Download className="mr-1 h-4 w-4" />
                            Download Record
                          </Button>
                          <Button variant="outline" onClick={() => handleShare('immunization', selectedImmunization.id)}>
                            <Share2 className="mr-1 h-4 w-4" />
                            Share Record
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Records list view
                  <Tabs value={activeHealthTab} onValueChange={setActiveHealthTab} className="w-full">
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="medications" className="flex items-center gap-1">
                        <Tablet className="h-4 w-4" />
                        <span className="hidden sm:inline">Medications</span>
                      </TabsTrigger>
                      <TabsTrigger value="lab-results" className="flex items-center gap-1">
                        <TestTube className="h-4 w-4" />
                        <span className="hidden sm:inline">Lab Results</span>
                      </TabsTrigger>
                      <TabsTrigger value="immunizations" className="flex items-center gap-1">
                        <Syringe className="h-4 w-4" />
                        <span className="hidden sm:inline">Immunizations</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    {/* Medications Tab */}
                    <TabsContent value="medications" className="mt-0">
                      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <Button 
                          variant="outline" 
                          className="sm:w-auto w-full"
                          onClick={() => handleAddRecord('medication')}
                        >
                          <ListPlus className="h-4 w-4 mr-1" />
                          Add Medication
                        </Button>
                        
                        <div className="relative sm:w-auto w-full">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search medications..."
                            className="pl-8 w-full sm:w-[250px]"
                            value={searchQuery}
                            onChange={(e) => handleSearch("medications", e)}
                          />
                        </div>
                      </div>
                      
                      <div className="overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Medication</TableHead>
                              <TableHead>Dosage</TableHead>
                              <TableHead>Frequency</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {medications.map((med) => (
                              <TableRow key={med.id} className="cursor-pointer" onClick={() => setSelectedMedication(med)}>
                                <TableCell className="font-medium">{med.name}</TableCell>
                                <TableCell>{med.dosage}</TableCell>
                                <TableCell>{med.frequency}</TableCell>
                                <TableCell>
                                  <div className="px-2 py-1 rounded-full bg-green-100 text-green-600 text-xs inline-block">
                                    {med.status}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-xs h-8"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedMedication(med);
                                    }}
                                  >
                                    View Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                    
                    {/* Lab Results Tab */}
                    <TabsContent value="lab-results" className="mt-0">
                      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <Button 
                          variant="outline" 
                          className="sm:w-auto w-full"
                          onClick={() => handleAddRecord('lab result')}
                        >
                          <ListPlus className="h-4 w-4 mr-1" />
                          Add Lab Result
                        </Button>
                        
                        <div className="relative sm:w-auto w-full">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search lab results..."
                            className="pl-8 w-full sm:w-[250px]"
                            value={searchQuery}
                            onChange={(e) => handleSearch("lab-results", e)}
                          />
                        </div>
                      </div>
                      
                      <div className="overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Test</TableHead>
                              <TableHead>Result</TableHead>
                              <TableHead>Reference Range</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {labResults.map((result) => (
                              <TableRow key={result.id} className="cursor-pointer" onClick={() => setSelectedLabResult(result)}>
                                <TableCell className="font-medium">{result.name}</TableCell>
                                <TableCell>{result.value}</TableCell>
                                <TableCell>{result.referenceRange}</TableCell>
                                <TableCell>
                                  <div className={`px-2 py-1 rounded-full text-xs inline-block ${
                                    result.status === "Normal" 
                                      ? "bg-green-100 text-green-600" 
                                      : "bg-orange-100 text-orange-600"
                                  }`}>
                                    {result.status}
                                  </div>
                                </TableCell>
                                <TableCell>{result.date}</TableCell>
                                <TableCell>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-xs h-8"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedLabResult(result);
                                    }}
                                  >
                                    View Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                    
                    {/* Immunizations Tab */}
                    <TabsContent value="immunizations" className="mt-0">
                      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <Button 
                          variant="outline" 
                          className="sm:w-auto w-full"
                          onClick={() => handleAddRecord('immunization')}
                        >
                          <ListPlus className="h-4 w-4 mr-1" />
                          Add Immunization
                        </Button>
                        
                        <div className="relative sm:w-auto w-full">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search immunizations..."
                            className="pl-8 w-full sm:w-[250px]"
                            value={searchQuery}
                            onChange={(e) => handleSearch("immunizations", e)}
                          />
                        </div>
                      </div>
                      
                      <div className="overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Vaccine</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Provider</TableHead>
                              <TableHead>Next Due</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {immunizations.map((imm) => (
                              <TableRow key={imm.id} className="cursor-pointer" onClick={() => setSelectedImmunization(imm)}>
                                <TableCell className="font-medium">{imm.name}</TableCell>
                                <TableCell>{imm.date}</TableCell>
                                <TableCell>{imm.provider}</TableCell>
                                <TableCell>{imm.nextDue}</TableCell>
                                <TableCell>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-xs h-8"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedImmunization(imm);
                                    }}
                                  >
                                    View Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>
        );
      case "ai-diagnostics":
        return (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-kwecare-primary" />
                  AI Diagnostics
                </CardTitle>
                <CardDescription>
                  TensorFlow.js-powered health analysis tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedTool ? (
                  // Tool detail view
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        {selectedTool.icon}
                        <span>{selectedTool.title}</span>
                      </h2>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedTool(null)}
                      >
                        Back to Tools
                      </Button>
                    </div>
                    
                    <div className="mb-4">
                      <Badge variant="outline" className="bg-blue-100/50 text-blue-700 border-blue-200">
                        {selectedTool.badge}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground">{selectedTool.description}</p>
                    
                    <div className="flex items-center gap-2 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
                      <Info className="h-5 w-5 text-amber-500 shrink-0" />
                      <p className="text-sm">
                        {selectedTool.type === "symptoms" ? (
                          "Describe your symptoms to get AI-powered insights. The model uses TensorFlow.js and runs entirely in your browser for privacy."
                        ) : (
                          "Enter your health metrics to get AI predictions about potential health risks. All processing happens locally in your browser."
                        )}
                      </p>
                    </div>
                    
                    <div className="p-6 rounded-lg border border-border bg-card/50 mt-4">
                      <h3 className="text-lg font-medium mb-4">To use this tool, you need to:</h3>
                      
                      {selectedTool.type === "symptoms" ? (
                        <ol className="space-y-2 list-decimal list-inside">
                          <li>Describe your symptoms in detail</li>
                          <li>Specify when they started</li>
                          <li>Mention any relevant medical history</li>
                          <li>Include any medications you're currently taking</li>
                          <li>Let the AI analyze your symptoms</li>
                        </ol>
                      ) : (
                        <ol className="space-y-2 list-decimal list-inside">
                          <li>Input your recent health metrics</li>
                          <li>Include blood glucose levels if available</li>
                          <li>Add blood pressure readings</li>
                          <li>Enter your BMI or height/weight</li>
                          <li>Let the AI generate health predictions</li>
                        </ol>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-center py-8">
                      <Button 
                        className="bg-kwecare-primary hover:bg-kwecare-primary/90"
                        size="lg"
                        onClick={() => navigate('/ai-diagnostics')}
                      >
                        Launch Full {selectedTool.type === "symptoms" ? "Symptom Checker" : "Health Predictions"} Tool
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Tools list view
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {diagnosticTools.map((tool) => (
                      <div 
                        key={tool.id}
                        className="p-6 rounded-lg border border-border hover:border-kwecare-primary/20 transition-all cursor-pointer"
                        onClick={() => setSelectedTool(tool)}
                      >
                        <div className="absolute top-4 right-4">
                          <Badge variant="outline" className="bg-blue-100/50 text-blue-700 border-blue-200">
                            {tool.badge}
                          </Badge>
                        </div>
                        <div className="mb-4">{tool.icon}</div>
                        <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                        <p className="text-muted-foreground mb-4">{tool.description}</p>
                        <Button 
                          className="bg-kwecare-primary hover:bg-kwecare-primary/90 w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTool(tool);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
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
