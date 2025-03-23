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
  Stethoscope,
  LayoutDashboard,
  FileText,
  BarChart2,
  MessagesSquare,
  Brain,
  CalendarClock,
  Download
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
import CalendarScheduler, { Appointment } from "@/components/appointments/CalendarScheduler";
import ProviderAppointmentScheduleForm from "@/components/appointments/ProviderAppointmentScheduleForm";
import AppointmentDetails from "@/components/appointments/AppointmentDetails";
import { PieChart, BarChart, LineChart, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, Bar, Pie, Cell, Line, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs as MessageTabs, TabsContent as MessageTabsContent, TabsList as MessageTabsList, TabsTrigger as MessageTabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Circle, Filter, RefreshCcw, Search as SearchIcon, Send, Star, Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";

type ProviderTab = "dashboard" | "patients" | "appointments" | "records" | "analytics" | "messages";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProviderTab>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const language = localStorage.getItem("preferredLanguage") as IndigenousLanguage || "english";
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointmentDetailsOpen, setAppointmentDetailsOpen] = useState(false);
  const [analyticsFilter, setAnalyticsFilter] = useState("all");
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState("month");
  const [searchMessagesQuery, setSearchMessagesQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<null | { 
    id: number; 
    from: string; 
    subject: string; 
    content: string; 
    time: string; 
    read?: boolean;
    sent?: boolean;
    to?: string;
    folder?: string;
  }>(null);
  const [messageContent, setMessageContent] = useState("");
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [selectedMessageTab, setSelectedMessageTab] = useState("inbox");
  const [messageRecipient, setMessageRecipient] = useState("");
  const [messageSubject, setMessageSubject] = useState("");
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportData, setReportData] = useState<{
    recommendations: ReturnType<typeof generateAIRecommendations>,
    nextSteps: ReturnType<typeof generateNextSteps>,
    timestamp: string
  } | null>(null);

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

  // More detailed messages for the messaging section
  const detailedMessages = [
    { id: 1, from: "Dr. Rebecca Taylor", subject: "Re: Treatment protocol for David Wilson", content: "I've reviewed the latest blood work for David Wilson. His cholesterol levels have improved but we should continue monitoring his blood pressure. The current medication seems to be working well, but we might need to adjust the dosage if symptoms persist. Could you schedule a follow-up appointment for next week?", time: "35 minutes ago", read: false, folder: "inbox" },
    { id: 2, from: "Nurse James White", subject: "Lab results for Sarah Johnson", content: "Attached are the lab results for Sarah Johnson. Her HbA1c is 7.2%, which is better than her last reading but still above target. I've scheduled a nutritionist consultation for her next week. Please review the complete results and let me know if any additional tests are needed at her next visit.", time: "2 hours ago", read: true, folder: "inbox" },
    { id: 3, from: "Community Health Worker", subject: "Visiting schedule for next week", content: "Here's the visiting schedule for community outreach next week. We'll be visiting the White River community on Tuesday and Thursday for diabetes education and wellness checks. Please let me know if you'd like to join or if there are specific patients you'd like us to check on during these visits.", time: "Yesterday", read: true, folder: "inbox" },
    { id: 4, from: "Dr. Michael Chen", subject: "Research study participation", content: "We're looking for candidates for the new diabetes management research study. Based on your patient population, would you be able to identify 5-10 eligible patients? The inclusion criteria are adults with Type 2 diabetes diagnosed within the last 5 years who are currently on oral medication only. This could be a good opportunity for some of your patients to access additional resources.", time: "2 days ago", read: true, folder: "inbox" },
    { id: 5, from: "Elder Margaret Francis", subject: "Traditional medicine integration workshop", content: "I'd like to invite you to our upcoming workshop on integrating traditional medicine practices with conventional diabetes treatment. This will be held next month and will cover specific protocols that have shown promising results in our community. Your participation would be valuable given your experience with Indigenous patients.", time: "3 days ago", read: true, folder: "inbox" },
    { id: 6, from: "Hospital Administrator", subject: "EHR System Update", content: "We'll be updating the EHR system this weekend. The system will be down from Saturday 10PM until Sunday 6AM. Please ensure all critical patient information is noted before this maintenance window.", time: "4 days ago", read: true, folder: "inbox" },
    { id: 7, from: "Patient - David Wilson", subject: "Question about medication", content: "Dr. Taylor, I've been experiencing some mild dizziness in the mornings after taking my new blood pressure medication. Is this something I should be concerned about or will it subside as my body adjusts to the medication? Should I continue taking it as prescribed?", time: "1 day ago", read: true, folder: "inbox" },
    { id: 8, from: "Dr. Lisa Park", subject: "Consultation report", content: "Here's my consultation report for Michael Chen. His asthma appears to be triggered by seasonal allergies, and I've adjusted his treatment plan accordingly. He'll need follow-up in six weeks.", time: "1 week ago", read: true, folder: "archive" },
    { id: 9, from: "Medical Supply Coordinator", subject: "New testing kits available", content: "We've received new A1C testing kits that provide faster results. Let me know if you'd like to transition to these for your diabetes patients.", time: "2 weeks ago", read: true, folder: "archive" },
    { id: 10, from: "You", subject: "Follow-up appointment request", content: "Hi Sarah, Based on your recent test results, I'd like to schedule a follow-up appointment to discuss adjustments to your diabetes management plan. Please call the clinic to set up a time that works for you in the next two weeks.", time: "5 days ago", sent: true, to: "Patient - Sarah Johnson", folder: "sent" },
    { id: 11, from: "You", subject: "Community health initiative", content: "I'd like to propose a community health screening day focused on diabetes prevention for the White River community. Let's discuss logistics and potential dates during our next team meeting.", time: "1 week ago", sent: true, to: "Community Health Team", folder: "sent" },
  ];

  // Filter messages based on search query and selected folder
  const filteredMessages = detailedMessages
    .filter(message => 
      (selectedMessageTab === "all" || (message.folder === selectedMessageTab)) &&
      (searchMessagesQuery === "" || 
        message.subject.toLowerCase().includes(searchMessagesQuery.toLowerCase()) ||
        message.from.toLowerCase().includes(searchMessagesQuery.toLowerCase()) ||
        message.content.toLowerCase().includes(searchMessagesQuery.toLowerCase()))
    );

  // Analytics data for charts
  const monthlyPatientVisits = [
    { name: 'Jan', inPerson: 65, virtual: 35, traditional: 12 },
    { name: 'Feb', inPerson: 60, virtual: 40, traditional: 15 },
    { name: 'Mar', inPerson: 55, virtual: 45, traditional: 18 },
    { name: 'Apr', inPerson: 50, virtual: 50, traditional: 20 },
    { name: 'May', inPerson: 45, virtual: 55, traditional: 25 },
    { name: 'Jun', inPerson: 40, virtual: 60, traditional: 22 },
    { name: 'Jul', inPerson: 35, virtual: 65, traditional: 28 },
    { name: 'Aug', inPerson: 30, virtual: 70, traditional: 30 },
    { name: 'Sep', inPerson: 25, virtual: 75, traditional: 35 },
    { name: 'Oct', inPerson: 20, virtual: 80, traditional: 32 },
    { name: 'Nov', inPerson: 15, virtual: 85, traditional: 38 },
    { name: 'Dec', inPerson: 10, virtual: 90, traditional: 40 },
  ];

  const patientAgeDistribution = [
    { name: '0-18', value: 12 },
    { name: '19-35', value: 25 },
    { name: '36-50', value: 30 },
    { name: '51-65', value: 22 },
    { name: '66+', value: 11 },
  ];

  const conditionPrevalence = [
    { name: 'Diabetes', value: 28 },
    { name: 'Hypertension', value: 22 },
    { name: 'Heart Disease', value: 15 },
    { name: 'Respiratory', value: 12 },
    { name: 'Mental Health', value: 18 },
    { name: 'Other', value: 5 },
  ];

  const communityEngagement = [
    { name: 'White River', engagement: 75, adherence: 65 },
    { name: 'N. Tutchone', engagement: 68, adherence: 70 },
    { name: 'Kaska Dena', engagement: 82, adherence: 78 },
    { name: 'Champagne', engagement: 60, adherence: 55 },
    { name: 'Vuntut', engagement: 85, adherence: 80 },
  ];

  const treatmentOutcomes = [
    { name: 'Diabetes Management', improved: 65, stable: 25, deteriorated: 10 },
    { name: 'Hypertension', improved: 70, stable: 20, deteriorated: 10 },
    { name: 'Mental Health', improved: 55, stable: 30, deteriorated: 15 },
    { name: 'Chronic Pain', improved: 50, stable: 35, deteriorated: 15 },
    { name: 'Respiratory', improved: 60, stable: 30, deteriorated: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Function to format timestamp 
  const formatMessageTime = (time: string) => {
    if (time.includes('minutes') || time.includes('hours') || time === 'Yesterday') {
      return time;
    }
    // For older messages, return just the date part
    return time.split(' ')[0];
  };

  // Convert upcoming appointments to the Appointment type for the calendar
  const providerAppointments: Appointment[] = upcomingAppointments.map(apt => ({
    id: apt.id,
    patientId: patients.find(p => p.name === apt.patient)?.id || 0,
    patientName: apt.patient,
    providerId: "1", // Current provider
    providerName: "Dr. Rebecca Taylor",
    date: new Date(apt.time.includes("Today") 
      ? new Date().setHours(parseInt(apt.time.split(":")[0].split(" ")[1]), parseInt(apt.time.split(":")[1].split(" ")[0]), 0, 0)
      : apt.time.includes("Tomorrow")
        ? new Date(new Date().setDate(new Date().getDate() + 1)).setHours(parseInt(apt.time.split(":")[0].split(" ")[1]), parseInt(apt.time.split(":")[1].split(" ")[0]), 0, 0)
        : new Date(`${apt.time}, 2023`).getTime()),
    time: apt.time,
    reason: apt.type,
    type: apt.virtual ? "telemedicine" : "in-person",
    duration: 30,
    status: apt.time.includes("Today") ? "upcoming" : "scheduled",
    isTraditionalConsult: false
  }));
  
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
                appointments={providerAppointments}
                patients={patients}
                onScheduleAppointment={() => setScheduleModalOpen(true)}
                onAppointmentSelected={handleAppointmentSelected}
              />
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
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Population Health Analytics</CardTitle>
                  <CardDescription>
                    Analyze health trends across Indigenous communities
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Select 
                    value={analyticsTimeframe} 
                    onValueChange={setAnalyticsTimeframe}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="quarter">Last Quarter</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={analyticsFilter} 
                    onValueChange={setAnalyticsFilter}
                  >
                    <SelectTrigger className="w-[180px]">
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
                  
                  <Button variant="outline" size="icon">
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Stats Cards */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">128</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className="text-green-500 mr-1">↑ 12%</span> 
                      <span>from previous {analyticsTimeframe}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Appointment Adherence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">82%</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className="text-green-500 mr-1">↑ 5%</span> 
                      <span>from previous {analyticsTimeframe}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Traditional Knowledge Integration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">65%</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className="text-green-500 mr-1">↑ 15%</span> 
                      <span>from previous {analyticsTimeframe}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* First Row of Charts */}
                <Card className="p-4">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="text-base">Patient Visit Types</CardTitle>
                    <CardDescription>Trend of visit types over time</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyPatientVisits}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="inPerson" stroke="#8884d8" name="In-Person" />
                        <Line type="monotone" dataKey="virtual" stroke="#82ca9d" name="Virtual" />
                        <Line type="monotone" dataKey="traditional" stroke="#ffc658" name="Traditional Consult" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="p-4">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="text-base">Demographics</CardTitle>
                    <CardDescription>Patient age distribution</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 h-[300px] flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={patientAgeDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {patientAgeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Second Row of Charts */}
                <Card className="p-4">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="text-base">Condition Prevalence</CardTitle>
                    <CardDescription>Primary health conditions in patient population</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={conditionPrevalence}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="value" fill="#8884d8" name="Patients (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="p-4">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="text-base">Community Engagement</CardTitle>
                    <CardDescription>Patient engagement and medication adherence by community</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={communityEngagement}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="engagement" fill="#8884d8" name="Engagement %" />
                        <Bar dataKey="adherence" fill="#82ca9d" name="Adherence %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="p-4">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-base">Treatment Outcomes</CardTitle>
                  <CardDescription>Patient health status changes by condition category</CardDescription>
                </CardHeader>
                <CardContent className="p-0 h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={treatmentOutcomes}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="improved" stackId="a" fill="#82ca9d" name="Improved" />
                      <Bar dataKey="stable" stackId="a" fill="#ffc658" name="Stable" />
                      <Bar dataKey="deteriorated" stackId="a" fill="#ff8042" name="Deteriorated" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <div className="mt-6 flex justify-center">
                <Button onClick={handleGenerateReport}>
                  Generate Detailed Report
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case "messages":
        return (
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Secure Messaging</CardTitle>
                  <CardDescription>
                    Communicate with patients and healthcare team
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => setShowComposeDialog(true)}>
                    <Send className="h-4 w-4 mr-2" />
                    Compose Message
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex h-[600px] border rounded-md overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 border-r flex flex-col">
                  <MessageTabs 
                    value={selectedMessageTab} 
                    onValueChange={setSelectedMessageTab}
                    className="w-full"
                  >
                    <MessageTabsList className="w-full justify-start border-b h-auto">
                      <MessageTabsTrigger 
                        value="inbox"
                        className="flex-1 data-[state=active]:bg-muted rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                      >
                        Inbox
                      </MessageTabsTrigger>
                      <MessageTabsTrigger 
                        value="sent"
                        className="flex-1 data-[state=active]:bg-muted rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                      >
                        Sent
                      </MessageTabsTrigger>
                      <MessageTabsTrigger 
                        value="archive"
                        className="flex-1 data-[state=active]:bg-muted rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                      >
                        Archive
                      </MessageTabsTrigger>
                    </MessageTabsList>
                  </MessageTabs>
                  
                  <div className="p-2 border-b">
                    <div className="relative">
                      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search messages..."
                        className="pl-8"
                        value={searchMessagesQuery}
                        onChange={(e) => setSearchMessagesQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <ScrollArea className="flex-1">
                    {filteredMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No messages found</p>
                      </div>
                    ) : (
                      filteredMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-3 border-b cursor-pointer transition-colors ${
                            selectedMessage?.id === message.id 
                              ? 'bg-muted' 
                              : message.read 
                                ? 'hover:bg-muted/50' 
                                : 'bg-blue-50 hover:bg-blue-100'
                          }`}
                          onClick={() => setSelectedMessage(message)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-sm flex items-center gap-1">
                              {!message.read && !message.sent && (
                                <Circle className="h-2 w-2 fill-blue-500 text-blue-500" />
                              )}
                              {message.from}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {formatMessageTime(message.time)}
                            </span>
                          </div>
                          <p className="text-sm truncate">{message.subject}</p>
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {message.content.substring(0, 60)}...
                          </p>
                        </div>
                      ))
                    )}
                  </ScrollArea>
                </div>
                
                {/* Message Content */}
                <div className="flex-1 flex flex-col">
                  {selectedMessage ? (
                    <>
                      <div className="p-4 border-b">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold">{selectedMessage.subject}</h3>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Star className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{selectedMessage.from}</div>
                            <div className="text-sm text-muted-foreground">
                              {selectedMessage.time}
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setShowComposeDialog(true);
                              setMessageContent(`\n\n---\nOn ${selectedMessage.time}, ${selectedMessage.from} wrote:\n> ${selectedMessage.content.split('\n').join('\n> ')}`);
                            }}
                          >
                            Reply
                          </Button>
                        </div>
                      </div>
                      <ScrollArea className="flex-1 p-6">
                        <div className="max-w-3xl mx-auto">
                          <p className="whitespace-pre-line">{selectedMessage.content}</p>
                        </div>
                      </ScrollArea>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No message selected</h3>
                      <p className="text-muted-foreground mb-6">Select a message from the list to view its contents</p>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowComposeDialog(true)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Compose New Message
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  const handleSendMessage = () => {
    if (!messageRecipient) {
      toast.error("Please specify a recipient");
      return;
    }
    
    if (!messageSubject) {
      toast.error("Please enter a subject");
      return;
    }
    
    if (!messageContent) {
      toast.error("Please enter message content");
      return;
    }
    
    // In a real app, this would send the message to the server
    toast.success(`Message sent to ${messageRecipient}`);
    setShowComposeDialog(false);
    
    // Reset form
    setMessageRecipient("");
    setMessageSubject("");
    setMessageContent("");
  };

  const generateAIRecommendations = () => {
    // In a real application, this would use actual ML models to analyze patient data
    // and generate personalized recommendations based on trends and outcomes
    const recommendations = [
      {
        category: "Population Health",
        recommendation: "The data shows increasing diabetes rates in the White River community. Consider initiating targeted diabetes prevention programs focused on traditional dietary practices combined with modern management techniques.",
        impact: "high",
        evidence: "12.5% prevalence with 5% YoY increase"
      },
      {
        category: "Traditional Knowledge Integration",
        recommendation: "Patients receiving combined traditional and conventional treatment for mental health show 25% better outcomes. Expand the traditional knowledge integration program, especially in the Northern Tutchone community.",
        impact: "medium",
        evidence: "55% improvement rate vs. 30% with conventional treatment alone"
      },
      {
        category: "Care Delivery",
        recommendation: "Virtual appointment adherence has increased significantly (85% vs 65% for in-person). Consider transitioning more routine follow-ups to telemedicine, particularly for patients in remote communities.",
        impact: "high",
        evidence: "20% increase in appointment adherence"
      },
      {
        category: "Clinical Focus",
        recommendation: "Patients with chronic pain show lower adherence rates (50%). Develop a specialized chronic pain management program incorporating traditional practices and more frequent check-ins.",
        impact: "medium",
        evidence: "35% of these patients have deteriorating status"
      }
    ];

    return recommendations;
  };

  const generateNextSteps = () => {
    return [
      {
        step: "Schedule community health screening day in White River focusing on diabetes prevention",
        timeline: "Next 30 days",
        resources: "2 healthcare providers, 1 traditional knowledge keeper, screening equipment"
      },
      {
        step: "Develop integrated mental health protocol combining traditional and western approaches",
        timeline: "Next 60 days",
        resources: "Mental health team, community elders, protocol documentation"
      },
      {
        step: "Contact patients with chronic pain conditions for treatment plan reassessment",
        timeline: "Next 14 days",
        resources: "Patient list available in system, appointment scheduling"
      },
      {
        step: "Expand telemedicine program with cultural competency training for all providers",
        timeline: "Next 45 days",
        resources: "Technical infrastructure, cultural training materials"
      }
    ];
  };

  const handleGenerateReport = () => {
    setGeneratingReport(true);
    setReportModalOpen(true);
    
    // Simulate API call and AI processing time
    setTimeout(() => {
      const recommendations = generateAIRecommendations();
      const nextSteps = generateNextSteps();
      
      setReportData({
        recommendations,
        nextSteps,
        timestamp: new Date().toISOString()
      });
      
      setGeneratingReport(false);
    }, 2500); // Simulating processing time
  };

  const handleDownloadReport = () => {
    if (!reportData) return;
    
    // In a real app, this would generate a PDF or other formatted report
    // For this example, we'll create a JSON file
    
    const reportBlob = new Blob(
      [JSON.stringify({
        title: "KweCare Healthcare Provider Analytics Report",
        date: new Date().toLocaleDateString(),
        provider: "Dr. Rebecca Taylor",
        timeframe: analyticsTimeframe,
        communityFilter: analyticsFilter,
        patientMetrics: {
          totalPatients: 128,
          appointmentAdherence: "82%",
          traditionalKnowledgeIntegration: "65%"
        },
        visitTypes: monthlyPatientVisits,
        demographics: patientAgeDistribution,
        conditions: conditionPrevalence,
        communityEngagement,
        treatmentOutcomes,
        aiAnalysis: {
          recommendations: reportData.recommendations,
          suggestedNextSteps: reportData.nextSteps
        }
      }, null, 2)], 
      { type: 'application/json' }
    );
    
    // Create download link
    const url = URL.createObjectURL(reportBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kwecare-analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Report downloaded successfully");
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

      {/* Compose Message Dialog */}
      <Dialog open={showComposeDialog} onOpenChange={setShowComposeDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Compose Message</DialogTitle>
            <DialogDescription>
              Write your message to patients or healthcare team members
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipient" className="text-right">
                To
              </Label>
              <Select
                value={messageRecipient}
                onValueChange={setMessageRecipient}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient-david">David Wilson (Patient)</SelectItem>
                  <SelectItem value="patient-sarah">Sarah Johnson (Patient)</SelectItem>
                  <SelectItem value="dr-chen">Dr. Michael Chen</SelectItem>
                  <SelectItem value="nurse-white">Nurse James White</SelectItem>
                  <SelectItem value="elder-margaret">Elder Margaret Francis</SelectItem>
                  <SelectItem value="community-team">Community Health Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Input
                id="subject"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                className="col-span-3"
                placeholder="Enter message subject"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="content" className="text-right self-start pt-2">
                Message
              </Label>
              <Textarea
                id="content"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="col-span-3"
                rows={10}
                placeholder="Type your message here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowComposeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Generation Dialog */}
      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Analytics Report with AI Recommendations</DialogTitle>
            <DialogDescription>
              Healthcare insights and suggested next steps based on population health data
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {generatingReport ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative h-16 w-16">
                  <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-t-blue-500 border-b-blue-700 border-l-blue-600 border-r-blue-600 animate-spin"></div>
                  <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-blue-600" />
                </div>
                <p className="mt-4 text-center font-medium">
                  Analyzing health data and generating recommendations...
                </p>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Our AI is analyzing patterns across communities, conditions, and treatment outcomes
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    AI-Generated Recommendations
                  </h3>
                  
                  <div className="space-y-4">
                    {reportData?.recommendations.map((rec, i) => (
                      <Card key={i} className={`
                        ${rec.impact === 'high' 
                          ? 'border-l-4 border-l-red-500' 
                          : 'border-l-4 border-l-amber-500'}
                      `}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{rec.category}</h4>
                            <Badge variant={rec.impact === 'high' ? 'destructive' : 'outline'}>
                              {rec.impact === 'high' ? 'High Impact' : 'Medium Impact'}
                            </Badge>
                          </div>
                          <p className="text-sm mb-3">{rec.recommendation}</p>
                          <div className="text-xs bg-muted/40 p-2 rounded-md text-muted-foreground">
                            <strong>Evidence:</strong> {rec.evidence}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <CalendarClock className="h-5 w-5 text-emerald-600" />
                    Suggested Next Steps
                  </h3>
                  
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Action Item</TableHead>
                          <TableHead>Timeline</TableHead>
                          <TableHead>Resources Needed</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportData?.nextSteps.map((step, i) => (
                          <TableRow key={i}>
                            <TableCell>{step.step}</TableCell>
                            <TableCell>{step.timeline}</TableCell>
                            <TableCell>{step.resources}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This report is generated using AI analysis of health data trends. 
                    Always use clinical judgment when implementing recommendations.
                    Recommendations are based on detected patterns in your patient population data.
                  </p>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setReportModalOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={handleDownloadReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProviderDashboard;
