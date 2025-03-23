import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  ClipboardList, 
  Search,
  PlusCircle,
  UserCog,
  Activity,
  TestTube,
  FilePlus,
  Bell,
  Clock,
  BarChart3,
  MessageSquare,
  AlertCircle,
  Leaf,
  Stethoscope
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Header from "@/components/ui/layout/Header";
import Footer from "@/components/ui/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IndigenousLanguage } from "@/components/cultural-safety/LanguageSelector";

type ProviderTab = "dashboard" | "patients" | "appointments" | "records" | "analytics" | "messages";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProviderTab>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const language = localStorage.getItem("preferredLanguage") as IndigenousLanguage || "english";

  // Mockup data for patients
  const patients = [
    { 
      id: 1, 
      name: "Sarah Johnson", 
      age: 34, 
      lastVisit: "Oct 15, 2023",
      nextVisit: "Nov 28, 2023", 
      conditions: ["Diabetes Type 2", "Hypertension"],
      status: "stable",
      adherence: "good",
      community: "White River First Nation",
      alerts: 1
    },
    { 
      id: 2, 
      name: "Michael Chen", 
      age: 45, 
      lastVisit: "Sep 22, 2023",
      nextVisit: "Dec 05, 2023", 
      conditions: ["Asthma"],
      status: "improving",
      adherence: "excellent",
      community: "Northern Tutchone",
      alerts: 0
    },
    { 
      id: 3, 
      name: "Aisha Patel", 
      age: 28, 
      lastVisit: "Nov 05, 2023",
      nextVisit: "Dec 15, 2023", 
      conditions: ["Pregnancy", "Anemia"],
      status: "monitoring",
      adherence: "good",
      community: "Kaska Dena",
      alerts: 0
    },
    { 
      id: 4, 
      name: "David Wilson", 
      age: 62, 
      lastVisit: "Oct 30, 2023",
      nextVisit: "Nov 30, 2023", 
      conditions: ["Arthritis", "Heart Disease", "Chronic Pain"],
      status: "deteriorating",
      adherence: "poor",
      community: "Champagne First Nation",
      alerts: 3
    },
    { 
      id: 5, 
      name: "Maria Rodriguez", 
      age: 41, 
      lastVisit: "Nov 10, 2023",
      nextVisit: "Jan 12, 2024", 
      conditions: ["Migraine", "Anxiety"],
      status: "stable",
      adherence: "moderate",
      community: "Vuntut Gwitchin",
      alerts: 1
    },
  ];

  // Filter patients based on search query
  const filteredPatients = searchQuery.trim() === ""
    ? patients
    : patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.conditions.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
          patient.community.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handlePatientSelect = (patientId: number) => {
    toast.success(`Viewing patient #${patientId} details`);
    navigate(`/patient/${patientId}`);
  };

  const handleAddPatient = () => {
    toast.success("Add new patient form opened");
    // In a real app, navigate to a patient registration form
  };

  // Wellness data for visualization
  const communityHealthData = [
    { community: "White River", diabetesRate: 12.5, heartDiseaseRate: 8.2, mentalHealthRate: 15.1 },
    { community: "Northern Tutchone", diabetesRate: 10.2, heartDiseaseRate: 7.8, mentalHealthRate: 12.8 },
    { community: "Kaska Dena", diabetesRate: 11.8, heartDiseaseRate: 9.5, mentalHealthRate: 14.2 },
    { community: "Champagne", diabetesRate: 13.4, heartDiseaseRate: 10.1, mentalHealthRate: 16.5 },
    { community: "Vuntut Gwitchin", diabetesRate: 9.7, heartDiseaseRate: 6.4, mentalHealthRate: 11.9 },
  ];

  // Treatment alerts for immediate attention
  const clinicalAlerts = [
    { patientId: 1, patientName: "Sarah Johnson", alert: "Blood glucose consistently elevated for 5 days", severity: "moderate", date: "2 days ago" },
    { patientId: 4, patientName: "David Wilson", alert: "Missed last 3 medication check-ins", severity: "high", date: "1 day ago" },
    { patientId: 4, patientName: "David Wilson", alert: "Reported increased chest pain", severity: "critical", date: "5 hours ago" },
    { patientId: 5, patientName: "Maria Rodriguez", alert: "Anxiety symptoms worsening", severity: "moderate", date: "12 hours ago" },
    { patientId: 4, patientName: "David Wilson", alert: "Blood pressure readings above threshold", severity: "high", date: "3 days ago" },
  ];

  // Upcoming appointments
  const upcomingAppointments = [
    { id: 1, patient: "David Wilson", time: "Today, 2:30 PM", type: "Follow-up", virtual: true },
    { id: 2, patient: "Sarah Johnson", time: "Tomorrow, 10:00 AM", type: "Medication Review", virtual: true },
    { id: 3, patient: "Michael Chen", time: "Nov 25, 1:15 PM", type: "Asthma Assessment", virtual: false },
    { id: 4, patient: "Aisha Patel", time: "Nov 28, 11:30 AM", type: "Prenatal Check", virtual: true },
  ];

  // Recent messages
  const recentMessages = [
    { id: 1, from: "Dr. Rebecca Taylor", subject: "Re: Treatment protocol for David Wilson", time: "35 minutes ago", read: false },
    { id: 2, from: "Nurse James White", subject: "Lab results for Sarah Johnson", time: "2 hours ago", read: true },
    { id: 3, from: "Community Health Worker", subject: "Visiting schedule for next week", time: "Yesterday", read: true },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "stable":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Stable</Badge>;
      case "improving":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Improving</Badge>;
      case "monitoring":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Monitoring</Badge>;
      case "deteriorating":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Needs Attention</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  const getAdherenceBadge = (adherence: string) => {
    switch(adherence) {
      case "excellent":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Excellent</Badge>;
      case "good":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Good</Badge>;
      case "moderate":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Moderate</Badge>;
      case "poor":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Poor</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{adherence}</Badge>;
    }
  };

  const getSeverityIndicator = (severity: string) => {
    switch(severity) {
      case "low":
        return <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 mr-2"></span>;
      case "moderate":
        return <span className="flex h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2"></span>;
      case "high":
        return <span className="flex h-2.5 w-2.5 rounded-full bg-orange-500 mr-2"></span>;
      case "critical":
        return <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse mr-2"></span>;
      default:
        return <span className="flex h-2.5 w-2.5 rounded-full bg-gray-500 mr-2"></span>;
    }
  };

  const renderProviderDashboardContent = () => {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1 text-orange-500" />
                  Clinical Alerts
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clinicalAlerts.length}</div>
              <p className="text-xs text-muted-foreground">
                {clinicalAlerts.filter(alert => alert.severity === "critical").length} critical
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="link" className="h-auto p-0 text-xs">View all alerts</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                  Today's Appointments
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {upcomingAppointments.filter(apt => apt.time.includes("Today")).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {upcomingAppointments.filter(apt => apt.time.includes("Today") && apt.virtual).length} virtual
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="link" className="h-auto p-0 text-xs">View schedule</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="flex items-center">
                  <Leaf className="h-4 w-4 mr-1 text-green-500" />
                  Cultural Consultations
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                Traditional medicine integration sessions
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="link" className="h-auto p-0 text-xs">Schedule consultation</Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                  Critical Patient Alerts
                </CardTitle>
                <CardDescription>Patients requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent className="overflow-auto max-h-[280px]">
                <div className="space-y-4">
                  {clinicalAlerts.map((alert, i) => (
                    <div key={i} className="flex items-start p-3 bg-muted/30 rounded-md">
                      <div className="flex-shrink-0 mt-0.5">
                        {getSeverityIndicator(alert.severity)}
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <h4 className="font-medium text-sm mr-2">
                            {alert.patientName}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={`
                              ${alert.severity === 'critical' ? 'border-red-500 text-red-600' : 
                                alert.severity === 'high' ? 'border-orange-500 text-orange-600' : 
                                'border-yellow-500 text-yellow-600'}
                            `}
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm mb-1">{alert.alert}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{alert.date}</span>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            Respond
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full">View All Patient Alerts</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                  Upcoming Appointments
                </CardTitle>
                <CardDescription>Next 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="overflow-auto max-h-[280px]">
                <div className="space-y-3">
                  {upcomingAppointments
                    .filter(apt => apt.time.includes("Today") || apt.time.includes("Tomorrow"))
                    .map((appointment, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                        <div>
                          <h4 className="font-medium text-sm">{appointment.patient}</h4>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="outline" className="h-5 px-1 text-xs">
                              {appointment.type}
                            </Badge>
                            {appointment.virtual && (
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 h-5 px-1 text-xs">
                                Virtual
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="h-7">
                          Prepare
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full">View Full Schedule</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-indigo-500" />
                      Community Health Trends
                    </CardTitle>
                    <CardDescription>Health metrics across communities</CardDescription>
                  </div>
                  <Select defaultValue="diabetes">
                    <SelectTrigger className="w-[160px] h-8">
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diabetes">Diabetes</SelectItem>
                      <SelectItem value="heart">Heart Disease</SelectItem>
                      <SelectItem value="mental">Mental Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-end justify-between gap-2">
                  {communityHealthData.map((data, i) => (
                    <div key={i} className="relative flex flex-col items-center">
                      <div 
                        className="w-12 bg-indigo-100 rounded-t-md" 
                        style={{ height: `${data.diabetesRate * 10}px` }}
                      >
                        <div className="absolute bottom-14 text-xs font-medium">
                          {data.diabetesRate}%
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground text-center max-w-[80px] truncate">
                        {data.community}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View Detailed Analytics
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-violet-500" />
                  Recent Messages
                </CardTitle>
                <CardDescription>{recentMessages.filter(m => !m.read).length} unread</CardDescription>
              </CardHeader>
              <CardContent className="overflow-auto max-h-[250px]">
                <div className="space-y-3">
                  {recentMessages.map((message, i) => (
                    <div key={i} className={`p-3 rounded-md ${message.read ? 'bg-muted/30' : 'bg-blue-50'}`}>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm">{message.from}</h4>
                        {!message.read && <div className="h-2 w-2 rounded-full bg-blue-500"></div>}
                      </div>
                      <p className="text-sm mb-1">{message.subject}</p>
                      <span className="text-xs text-muted-foreground">{message.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full">Open Messages</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderProviderDashboardContent();
      case "patients":
        return (
          <Card className="glass-card animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Patient Management</CardTitle>
                <CardDescription>Manage your patient list and access patient information</CardDescription>
              </div>
              <Button onClick={handleAddPatient} variant="branded">
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Patient
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search patients by name, condition or community..."
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="improving">Improving</SelectItem>
                      <SelectItem value="monitoring">Monitoring</SelectItem>
                      <SelectItem value="deteriorating">Needs Attention</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by community" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Communities</SelectItem>
                      <SelectItem value="white-river">White River</SelectItem>
                      <SelectItem value="tutchone">Northern Tutchone</SelectItem>
                      <SelectItem value="kaska">Kaska Dena</SelectItem>
                      <SelectItem value="champagne">Champagne</SelectItem>
                      <SelectItem value="vuntut">Vuntut Gwitchin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Community</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Conditions</TableHead>
                      <TableHead>Adherence</TableHead>
                      <TableHead>Last/Next Visit</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center h-32 text-muted-foreground">
                          No patients found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPatients.map((patient) => (
                        <TableRow key={patient.id} className={`cursor-pointer hover:bg-muted/50 ${patient.alerts > 0 ? 'bg-red-50/40' : ''}`}>
                          <TableCell className="font-medium flex items-center gap-2">
                            {patient.name}
                            {patient.alerts > 0 && (
                              <Badge variant="destructive" className="rounded-full h-5 w-5 p-0 flex items-center justify-center">
                                {patient.alerts}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{patient.age}</TableCell>
                          <TableCell>{patient.community}</TableCell>
                          <TableCell>{getStatusBadge(patient.status)}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {patient.conditions.map((condition, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                {condition}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{getAdherenceBadge(patient.adherence)}</TableCell>
                          <TableCell className="text-xs">
                            <div>Last: {patient.lastVisit}</div>
                            <div>Next: {patient.nextVisit}</div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Actions
                              </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handlePatientSelect(patient.id)}>
                                  <UserCog className="h-4 w-4 mr-2" />
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Activity className="h-4 w-4 mr-2" />
                                  Health Records
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Schedule Appointment
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <FilePlus className="h-4 w-4 mr-2" />
                                  Add Treatment Note
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <TestTube className="h-4 w-4 mr-2" />
                                  Lab Results
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Leaf className="h-4 w-4 mr-2" />
                                  Traditional Knowledge
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        );
      case "appointments":
        return (
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
              <CardTitle className="text-xl">Appointment Schedule</CardTitle>
              <CardDescription>Manage your upcoming appointments with patients</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button>
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
              <div className="calendar-view p-4 bg-muted/30 rounded-lg h-[500px] flex flex-col">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium">November 2023</h3>
                </div>
                <div className="flex justify-center mb-2">
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">Virtual</div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">In-Person</div>
                  <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">Traditional Consult</div>
                </div>
                <div className="calendar-placeholder flex-1 flex items-center justify-center">
                  <p className="text-muted-foreground">Calendar implementation coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case "records":
        return (
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Medical Records</CardTitle>
              <CardDescription>Access and manage patient health records</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="search"
                    placeholder="Search records..."
                    className="w-[250px]"
                  />
                  <Button variant="outline">Advanced Search</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-muted/30 p-5 rounded-lg">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Recent Patient Records
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-md">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-sm">David Wilson</span>
                        <Badge variant="outline" className="text-xs">Heart Disease</Badge>
                      </div>
                      <p className="text-sm mb-1">Updated blood pressure medication dosage</p>
                      <span className="text-xs text-muted-foreground">Updated 2 days ago</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-md">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-sm">Sarah Johnson</span>
                        <Badge variant="outline" className="text-xs">Diabetes</Badge>
                      </div>
                      <p className="text-sm mb-1">HbA1c results from Nov 12 lab work</p>
                      <span className="text-xs text-muted-foreground">Updated 3 days ago</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-md">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-sm">Aisha Patel</span>
                        <Badge variant="outline" className="text-xs">Pregnancy</Badge>
                      </div>
                      <p className="text-sm mb-1">Second trimester ultrasound results</p>
                      <span className="text-xs text-muted-foreground">Updated 5 days ago</span>
                    </div>
                  </div>
                  <Button variant="link" className="mt-2 p-0 h-auto">View all recent records</Button>
                </div>
                
                <div className="bg-muted/30 p-5 rounded-lg">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-500" />
                    Traditional Knowledge Integration
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-md">
                      <div className="flex flex-col mb-1">
                        <span className="font-medium text-sm">Labrador Tea Integration</span>
                        <div className="flex gap-1 mt-1">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                            Traditional Medicine
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs">
                            Respiratory
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm mb-1">Guidelines for integrating with standard COPD treatment</p>
                      <span className="text-xs text-muted-foreground">From Elder Margaret Francis</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-md">
                      <div className="flex flex-col mb-1">
                        <span className="font-medium text-sm">Cedar Preparation Protocol</span>
                        <div className="flex gap-1 mt-1">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                            Traditional Medicine
                          </Badge>
                          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 text-xs">
                            Mental Health
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm mb-1">Anxiety and stress management integration</p>
                      <span className="text-xs text-muted-foreground">From Knowledge Keeper Council</span>
                    </div>
                  </div>
                  <Button variant="link" className="mt-2 p-0 h-auto">Access traditional knowledge database</Button>
                </div>
              </div>
              
              <div className="mt-6 p-5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Data Sovereignty Guidelines
                </h3>
                <p className="text-sm">
                  Remember that all traditional knowledge records are subject to Indigenous data sovereignty principles. 
                  Permission must be obtained before sharing or transferring this information, and proper attribution to 
                  knowledge keepers must be maintained.
                </p>
                <Button variant="outline" className="mt-3 text-amber-800 border-amber-300 bg-amber-50 hover:bg-amber-100">
                  Review Data Protocols
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case "analytics":
        return (
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl">Population Health Analytics</CardTitle>
              <CardDescription>
                Analyze health trends across Indigenous communities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center p-12 text-muted-foreground">
                <p>Advanced analytics dashboard coming soon</p>
              </div>
            </CardContent>
          </Card>
        );
      case "messages":
        return (
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl">Secure Messaging</CardTitle>
              <CardDescription>
                Communicate with patients and healthcare team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center p-12 text-muted-foreground">
                <p>Messaging center coming soon</p>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Provider Dashboard | KweCare</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
        <Header />

        <main className="flex-1 pt-28 px-4 md:px-6 pb-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
            <h1 className="text-3xl font-bold">Healthcare Provider Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage patients, view clinical alerts, and access provider tools</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50 px-3 py-1 text-sm">
                Provider Mode
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Notifications</span>
                    <div className="relative flex h-2 w-2">
                      <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div>
                      <div className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[300px]">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[300px] overflow-auto">
                    <DropdownMenuItem className="cursor-pointer flex items-start gap-2 p-3">
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">Critical Patient Alert</div>
                        <p className="text-xs text-muted-foreground">David Wilson reported increased chest pain</p>
                        <p className="text-xs text-muted-foreground">5 hours ago</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer flex items-start gap-2 p-3">
                      <MessageSquare className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">New Message</div>
                        <p className="text-xs text-muted-foreground">Dr. Rebecca Taylor: Treatment protocol for David Wilson</p>
                        <p className="text-xs text-muted-foreground">35 minutes ago</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer flex items-start gap-2 p-3">
                      <Calendar className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">Appointment Reminder</div>
                        <p className="text-xs text-muted-foreground">Virtual appointment with David Wilson at 2:30 PM</p>
                        <p className="text-xs text-muted-foreground">Today</p>
                      </div>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      View All Notifications
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center">
            <div className="bg-emerald-100 rounded-full p-2 mr-3">
              <Stethoscope className="h-5 w-5 text-emerald-700" />
            </div>
            <div className="flex-1">
              <h2 className="font-medium text-emerald-800">Healthcare Provider Portal</h2>
              <p className="text-sm text-emerald-700">You're using the provider view with specialized clinical tools and patient management capabilities.</p>
            </div>
            <div>
              <Button size="sm" variant="outline" className="text-emerald-700 border-emerald-300">
                View Provider Guide
              </Button>
            </div>
          </div>

          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as ProviderTab)}
            className="mb-8"
          >
            <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
              <TabsTrigger value="dashboard" className="gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden md:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="patients" className="gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden md:inline">Patients</span>
              </TabsTrigger>
              <TabsTrigger value="appointments" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden md:inline">Appointments</span>
              </TabsTrigger>
              <TabsTrigger value="records" className="gap-2">
                <ClipboardList className="h-4 w-4" />
                <span className="hidden md:inline">Records</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden md:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden md:inline">Messages</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {renderContent()}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProviderDashboard;
