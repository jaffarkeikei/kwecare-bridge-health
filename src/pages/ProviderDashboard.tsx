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
  Download,
  Eye,
  FileDown,
  Copy,
  FileOutput,
  BookOpen,
  ChevronRight,
  Globe
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
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

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
  const [patientReportModalOpen, setPatientReportModalOpen] = useState(false);
  const [selectedPatientForReport, setSelectedPatientForReport] = useState<(typeof patients)[0] | null>(null);
  const [generatingPatientReport, setGeneratingPatientReport] = useState(false);
  const [patientReportData, setPatientReportData] = useState<{
    vitalsTrend: any[];
    medicationAdherence: number;
    communityInsights: string[];
    culturalConsiderations: string[];
    treatmentRecommendations: any[];
    aiNotes: string;
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
              <h3 className="text-lg font-semibold mb-4">Patient Records</h3>
              <div className="space-y-4 mb-6">
                {patients.map(patient => (
                  <Card key={patient.id} className="overflow-hidden border-l-4" style={{
                    borderLeftColor: patient.status === "stable" ? "#10b981" : 
                                    patient.status === "improving" ? "#3b82f6" : 
                                    patient.status === "monitoring" ? "#f59e0b" : 
                                    "#ef4444"
                  }}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            <h3 className="text-lg font-semibold">{patient.name}</h3>
                            {patient.alerts > 0 && (
                              <Badge variant="destructive" className="rounded-full h-5 w-5 p-0 flex items-center justify-center">
                                {patient.alerts}
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 mt-2">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Age:</span> {patient.age}
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Last Visit:</span> {patient.lastVisit}
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Next Visit:</span> {patient.nextVisit}
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Community:</span> {patient.community}
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Status:</span> {getStatusBadge(patient.status)}
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Adherence:</span> {getAdherenceBadge(patient.adherence)}
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="text-sm font-medium">Conditions:</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {patient.conditions.map((condition, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {condition}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row md:flex-col gap-2 justify-end">
                          <Button variant="outline" size="sm" className="gap-1" onClick={() => generatePatientReport(patient)}>
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">Preview Report</span>
                          </Button>
                          <Button variant="default" size="sm" className="gap-1 bg-kwecare-primary hover:bg-kwecare-primary/90" onClick={() => generatePatientReportPDF(patient)}>
                            <FileOutput className="h-4 w-4" />
                            <span className="hidden sm:inline">Generate Report</span>
                          </Button>
                          <Button variant="default" size="sm" className="gap-1 bg-green-600 hover:bg-green-700 text-white border-green-600" onClick={() => handleExportPatientData(patient)}>
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Export Data</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
                
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
              
              
              <div className="mt-6 flex justify-center gap-3">
                <Button onClick={handlePreviewReport} variant="outline" className="border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Report
                </Button>
                <Button onClick={handleGenerateReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Detailed Report
                </Button>
                <Button onClick={handleExportData} className="bg-green-600 hover:bg-green-700 text-white border-green-600">
                  <FileOutput className="h-4 w-4 mr-2" />
                  Export Data
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

  // Create a hidden container for PDF export
  const [pdfContentReady, setPdfContentReady] = useState(false);

  // Handle exporting data
  const handleExportData = () => {
    toast.loading("Preparing data export...");
    
    // Simulate API call to export data (would be a real API call in production)
    setTimeout(() => {
      toast.dismiss();
      toast.success("Data exported successfully");
    }, 1000);
  };

  // Handle exporting patient data
  const handleExportPatientData = (patient: (typeof patients)[0]) => {
    toast.loading(`Preparing data export for ${patient.name}...`);
    
    // Simulate API call to export patient data (would be a real API call in production)
    setTimeout(() => {
      toast.dismiss();
      toast.success(`${patient.name}'s data exported successfully`);
    }, 1000);
  };

  // Handle preview report
  const handlePreviewReport = () => {
    toast.loading("Preparing report preview...");
    
    // Generate the recommendations and steps for preview
    const recommendations = generateAIRecommendations();
    const nextSteps = generateNextSteps();
    
    // Set the report data
    setReportData({
      recommendations,
      nextSteps,
      timestamp: new Date().toISOString()
    });
    
    // Simulate loading and then show the preview
    setTimeout(() => {
      toast.dismiss();
      setReportModalOpen(true);
    }, 800);
  };

  // Modify the handleGenerateReport function to generate and download directly
  const handleGenerateReport = () => {
    // Generate report data without opening the dialog
    toast.loading("Generating comprehensive analytics report...");
    
    // Generate the recommendations and steps
    const recommendations = generateAIRecommendations();
    const nextSteps = generateNextSteps();
    
    // Set the report data
    setReportData({
      recommendations,
      nextSteps,
      timestamp: new Date().toISOString()
    });
    
    // Set a flag to indicate content is ready for rendering
    setPdfContentReady(true);
    
    // Let the DOM update with new content before generating PDF
    setTimeout(() => {
      // Generate and download the PDF
      handleDownloadAsPdf("analytics-report-content", `kwecare-analytics-report-${new Date().toISOString().split('T')[0]}.pdf`, true);
    }, 800);
  };

  // Modify the handleDownloadAsPdf function to better handle complex content
  const handleDownloadAsPdf = (elementId: string, filename: string, clearContentAfter: boolean = false) => {
    const element = document.getElementById(elementId);
    if (!element) {
      toast.error("Could not generate PDF: Report content not available");
      return;
    }

    // Configure element for better capture
    const originalDisplay = element.style.display;
    const originalPosition = element.style.position;
    const originalZIndex = element.style.zIndex;
    const originalOpacity = element.style.opacity;
    const originalWidth = element.style.width;
    const originalHeight = element.style.height;
    const originalOverflow = element.style.overflow;
    const originalVisibility = element.style.visibility;
    const originalLeft = element.style.left;
    
    // Position element absolutely but keep it visible for rendering
    element.style.display = "block";
    element.style.position = "fixed";
    element.style.zIndex = "-9999";
    element.style.opacity = "1";
    element.style.left = "-8000px";
    element.style.width = "800px"; // Fixed width for PDF
    element.style.height = "auto";
    element.style.overflow = "visible";
    element.style.visibility = "visible";
    element.style.background = "white";
    
    // Use html2canvas with better settings
    html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: "#ffffff",
      windowWidth: 1200,
      height: element.scrollHeight,
      width: 800,
      onclone: (clonedDoc) => {
        // Manipulate the cloned document to better prepare it for PDF
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Make sure all content is visible
          Array.from(clonedElement.querySelectorAll('*')).forEach(el => {
            (el as HTMLElement).style.display = 'block';
            if ((el as HTMLElement).style.height === '0px') {
              (el as HTMLElement).style.height = 'auto';
            }
          });
        }
      }
    }).then(canvas => {
      try {
        // Reset the element style
        element.style.display = originalDisplay;
        element.style.position = originalPosition;
        element.style.zIndex = originalZIndex;
        element.style.opacity = originalOpacity;
        element.style.width = originalWidth;
        element.style.height = originalHeight;
        element.style.overflow = originalOverflow;
        element.style.visibility = originalVisibility;
        element.style.left = originalLeft;
        
        // Create a multi-page PDF if content is long
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        
        // Calculate if multiple pages are needed
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgHeight = canvas.height * canvas.width / pdf.internal.pageSize.getWidth();
        let heightLeft = imgHeight;
        let position = 0;
        
        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, pdf.internal.pageSize.getWidth(), 0);
        heightLeft -= pageHeight;
        
        // Add additional pages if needed
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdf.internal.pageSize.getWidth(), 0);
          heightLeft -= pageHeight;
        }
        
        // Save the PDF
        pdf.save(filename);
        
        // Clear the PDF content if requested (to free memory)
        if (clearContentAfter) {
          setPdfContentReady(false);
        }
        
        toast.dismiss();
        toast.success("Report downloaded successfully");
      } catch (error) {
        console.error("Error generating PDF:", error);
        toast.dismiss();
        toast.error("Error generating PDF");
      }
    }).catch(err => {
      console.error("Error capturing content for PDF:", err);
      toast.dismiss();
      toast.error("Error capturing content for PDF");
      
      // Reset the element style on error
      element.style.display = originalDisplay;
      element.style.position = originalPosition;
      element.style.zIndex = originalZIndex;
      element.style.opacity = originalOpacity;
      element.style.width = originalWidth;
      element.style.height = originalHeight;
      element.style.overflow = originalOverflow;
      element.style.visibility = originalVisibility;
      element.style.left = originalLeft;
    });
  };

  const generatePatientReport = (patient: (typeof patients)[0]) => {
    setSelectedPatientForReport(patient);
    toast.loading("Generating comprehensive patient report...");
    
    // Simulate API call and AI processing time (would be a real API call in production)
    setTimeout(() => {
      // Generate mock data for the patient report
      const vitalsTrend = [
        { date: '2023-06-01', heartRate: 72, bloodPressure: '120/80', bloodGlucose: 98 },
        { date: '2023-07-01', heartRate: 75, bloodPressure: '122/82', bloodGlucose: 102 },
        { date: '2023-08-01', heartRate: 73, bloodPressure: '118/79', bloodGlucose: 95 },
        { date: '2023-09-01', heartRate: 76, bloodPressure: '125/85', bloodGlucose: 108 },
        { date: '2023-10-01', heartRate: 71, bloodPressure: '119/78', bloodGlucose: 97 },
        { date: '2023-11-01', heartRate: 74, bloodPressure: '121/81', bloodGlucose: 104 },
      ];
      
      const medicationAdherence = patient.adherence === "excellent" ? 95 : 
                                 patient.adherence === "good" ? 85 : 
                                 patient.adherence === "moderate" ? 75 : 60;
      
      const communityInsights = [
        `${patient.name} is from the ${patient.community} community, which has a ${
          communityHealthData.find(c => c.community.includes(patient.community.split(' ')[0]))?.diabetesRate || 10
        }% diabetes prevalence rate.`,
        `Traditional medicine practices are commonly used in ${patient.community} for managing chronic conditions.`,
        `${patient.community} has a strong cultural emphasis on community-based healing approaches.`,
        `Language preferences: Traditional ${patient.community.split(' ')[0]} language may be preferred for discussing health concepts.`
      ];
      
      const culturalConsiderations = [
        "Include traditional knowledge keepers in treatment discussions when appropriate",
        "Consider seasonal traditional activities when scheduling follow-ups",
        "Respect communal decision-making processes for major treatment decisions",
        "Incorporate traditional dietary considerations into nutritional guidance"
      ];
      
      const treatmentRecommendations = patient.conditions.map(condition => {
        let recommendation = "";
        let evidence = "";
        let confidence = 0;
        
        if (condition === "Diabetes Type 2") {
          recommendation = "Consider integrated approach combining traditional dietary practices with standard medication. Recent studies show improved outcomes when traditional foods are incorporated into dietary plans for Indigenous patients with T2D.";
          evidence = "Blood glucose trends indicate potential benefit from adjusted medication schedule and traditional medicine integration";
          confidence = 87;
        } else if (condition === "Hypertension") {
          recommendation = "Current medication appears effective, but consider stress reduction techniques culturally appropriate for the patient's community background.";
          evidence = "Recent blood pressure readings show improvement but with fluctuations coinciding with reported stress periods";
          confidence = 92;
        } else if (condition === "Heart Disease") {
          recommendation = "Cardiac rehabilitation should be modified to account for traditional activities. Consider virtual monitoring options given patient's remote location.";
          evidence = "Patient reported difficulty adhering to standard exercise regimen but engages regularly in traditional physical activities";
          confidence = 85;
        } else if (condition === "Arthritis") {
          recommendation = "Traditional anti-inflammatory preparations have shown promising results when used alongside conventional treatments. Consider consulting with community elder for appropriate protocols.";
          evidence = "Self-reported pain scores show improvement when traditional remedies are used as supplement";
          confidence = 78;
        } else if (condition === "Chronic Pain") {
          recommendation = "Holistic pain management approach recommended, incorporating both pharmacological and traditional approaches. Virtual check-ins should be increased to weekly.";
          evidence = "Pain diary indicates correlation between traditional medicine usage and reduced pain scores";
          confidence = 81;
        } else if (condition === "Asthma") {
          recommendation = "Consider seasonal factors in treatment plan. Traditional respiratory treatments may complement conventional inhalers during high-risk seasons.";
          evidence = "Symptom frequency shows seasonal patterns aligned with traditional ecological knowledge";
          confidence = 89;
        } else if (condition === "Pregnancy") {
          recommendation = "Integrate traditional midwifery knowledge where appropriate. Schedule additional cultural support sessions during prenatal care.";
          evidence = "Patient has expressed interest in traditional birthing practices alongside modern medical care";
          confidence = 94;
        } else if (condition === "Anemia") {
          recommendation = "Traditional iron-rich food sources should be incorporated into nutritional guidance alongside supplements.";
          evidence = "Previous response to combined traditional/conventional approach was positive";
          confidence = 83;
        } else if (condition === "Anxiety") {
          recommendation = "Community-based healing circles have shown strong results for this patient. Continue supporting participation alongside conventional therapy.";
          evidence = "Self-reported anxiety scores show marked improvement following community healing sessions";
          confidence = 90;
        } else {
          recommendation = "Consider cultural context when developing treatment plans. Consult with traditional knowledge keepers from patient's community.";
          evidence = "General best practice for culturally appropriate care";
          confidence = 75;
        }
        
        return {
          condition,
          recommendation,
          evidence,
          confidence
        };
      });
      
      const aiNotes = `${patient.name}'s health data indicates ${
        patient.status === "stable" ? "a stable condition with consistent management" :
        patient.status === "improving" ? "improvement in key health indicators" :
        patient.status === "monitoring" ? "a condition requiring careful monitoring" :
        "deteriorating indicators requiring prompt intervention"
      }. ${
        patient.adherence === "excellent" ? "Medication adherence is excellent, suggesting strong engagement with treatment plan." :
        patient.adherence === "good" ? "Medication adherence is good, though occasional lapses are noted." :
        patient.adherence === "moderate" ? "Moderate medication adherence suggests barriers that should be addressed." :
        "Poor medication adherence indicates significant barriers to treatment that require immediate attention."
      }
      
      Cultural context analysis indicates that ${patient.name}'s connection to ${patient.community} traditions may offer unique opportunities for treatment integration. ${
        patient.alerts > 0 ? `The ${patient.alerts} current alert(s) should be addressed as a priority.` : "No current alerts suggest this is an appropriate time for treatment plan review and adjustment."
      }
      
      Comparing ${patient.name}'s health trajectory with similar demographic profiles suggests ${
        patient.status === "improving" ? "continued improvement with current approach" :
        patient.status === "stable" ? "maintenance of stability with potential for optimization" :
        patient.status === "monitoring" ? "vigilant monitoring with potential need for adjustment" :
        "intervention to address declining health indicators"
      }. Consider scheduling follow-up within ${
        patient.status === "deteriorating" ? "7" :
        patient.status === "monitoring" ? "14" :
        "30"
      } days.`;
      
      setPatientReportData({
        vitalsTrend,
        medicationAdherence,
        communityInsights,
        culturalConsiderations,
        treatmentRecommendations,
        aiNotes
      });
      
      // Open patient report dialog and set content as ready
      setPatientReportModalOpen(true);
      setGeneratingPatientReport(false);
      
      // Let the DOM update with the content before generating PDF
    }, 1500);
  };

  // Add this at the end of your component, right before the return statement
  // Create a hidden element for the analytics report content that will be used for PDF generation
  const renderHiddenReportContent = () => {
    if (!pdfContentReady || !reportData) return null;
    
    // Generate additional AI insights for each section
    const generateCommunityInsights = () => {
      const insights = [];
      
      // Add insights based on the community engagement data
      const highestEngagement = [...communityEngagement].sort((a, b) => b.engagement - a.engagement)[0];
      const lowestEngagement = [...communityEngagement].sort((a, b) => a.engagement - b.engagement)[0];
      
      insights.push(`${highestEngagement.name} shows the highest engagement (${highestEngagement.engagement}%) and could serve as a model for other communities.`);
      insights.push(`${lowestEngagement.name} has the lowest engagement (${lowestEngagement.engagement}%) and may benefit from targeted cultural outreach programs.`);
      
      // Add correlation between engagement and adherence
      const correlationExists = communityEngagement.every(c => Math.abs(c.engagement - c.adherence) < 15);
      if (correlationExists) {
        insights.push("Strong correlation observed between community engagement and medication adherence, suggesting cultural engagement programs may improve treatment outcomes.");
      } else {
        insights.push("Engagement and adherence patterns differ significantly across communities, indicating diverse cultural and access barriers.");
      }
      
      // Add trends based on condition prevalence
      const topCondition = [...conditionPrevalence].sort((a, b) => b.value - a.value)[0];
      insights.push(`${topCondition.name} represents the highest prevalence (${topCondition.value}%) and should be prioritized in prevention and treatment programs.`);
      
      return insights;
    };
    
    const generateTreatmentInsights = () => {
      const insights = [];
      
      // Find conditions with best and worst outcomes
      const bestOutcome = [...treatmentOutcomes].sort((a, b) => b.improved - a.improved)[0];
      const worstOutcome = [...treatmentOutcomes].sort((a, b) => b.deteriorated - a.deteriorated)[0];
      
      insights.push(`${bestOutcome.name} shows the strongest positive outcomes with ${bestOutcome.improved}% improvement rate, supporting current treatment protocols.`);
      insights.push(`${worstOutcome.name} has concerning results with ${worstOutcome.deteriorated}% deterioration rate, suggesting protocol revision may be necessary.`);
      
      // Add insight on traditional integration
      insights.push("Traditional knowledge integration shows significant positive correlation with improved outcomes, especially in mental health and chronic pain management.");
      
      return insights;
    };
    
    // Generate culturally relevant insights
    const generateCulturalInsights = () => {
      return [
        "Traditional practices are serving as effective complements to conventional treatments, particularly for chronic conditions.",
        "Communities with stronger cultural connections show higher engagement in preventive care programs.",
        "Language preferences significantly impact treatment adherence – patients receiving instructions in Indigenous languages show 23% better adherence.",
        "Seasonal patterns align with traditional ecological knowledge and should be incorporated into care planning."
      ];
    };
    
    const communityInsights = generateCommunityInsights();
    const treatmentInsights = generateTreatmentInsights();
    const culturalInsights = generateCulturalInsights();
    
    return (
      <div id="analytics-report-content" style={{ position: 'absolute', left: '-9999px', width: '800px' }}>
        <div style={{ padding: '40px', background: 'white', color: 'black', fontFamily: 'Arial, sans-serif' }}>
          {/* Report Header with Logo and Title */}
          <div style={{ 
            backgroundColor: '#3b82f6', 
            padding: '20px', 
            marginBottom: '30px', 
            borderRadius: '5px',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px'
              }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '20px' }}>K</div>
              </div>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>KweCare Healthcare</h1>
                <p style={{ fontSize: '16px', margin: '5px 0 0 0' }}>Population Health Analytics Report</p>
              </div>
            </div>
            <div style={{ fontSize: '14px', marginTop: '10px' }}>
              <p style={{ margin: '3px 0' }}>Generated on {new Date().toLocaleDateString()} by Dr. Rebecca Taylor</p>
              <p style={{ margin: '3px 0' }}>
                Timeframe: {analyticsTimeframe === 'month' ? 'Last Month' : 
                          analyticsTimeframe === 'quarter' ? 'Last Quarter' : 
                          analyticsTimeframe === 'year' ? 'Last Year' : 'All Time'}
              </p>
              <p style={{ margin: '3px 0' }}>
                Community Filter: {analyticsFilter === 'all' ? 'All Indigenous Communities' : analyticsFilter}
              </p>
            </div>
          </div>
          
          {/* Executive Summary */}
          <div style={{ 
            border: '1px solid #e2e8f0', 
            borderRadius: '5px', 
            padding: '20px',
            marginBottom: '30px',
            backgroundColor: '#f8fafc'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af', marginTop: '0', borderBottom: '2px solid #3b82f6', paddingBottom: '5px' }}>
              Executive Summary
            </h2>
            <p style={{ fontSize: '14px', lineHeight: '1.5' }}>
              This report analyzes healthcare data across Indigenous communities to provide actionable insights on patient engagement, 
              treatment efficacy, and cultural integration opportunities. Key findings indicate that communities with traditional knowledge 
              integration show significantly better health outcomes, particularly for chronic conditions like diabetes and mental health issues.
              For the {analyticsTimeframe} period, overall patient engagement increased by 12%, with notable improvement in appointment adherence.
              Virtual care adoption continues to grow, with 85% of patients now utilizing telemedicine services.
            </p>
            <div style={{ 
              padding: '10px', 
              border: '1px solid #bfdbfe', 
              borderRadius: '3px', 
              backgroundColor: '#eff6ff',
              fontSize: '13px',
              color: '#1e40af',
              marginTop: '15px'
            }}>
              <strong>AI Analysis:</strong> Based on cross-community data analysis, we recommend prioritizing diabetes prevention programs in 
              White River community, expanding mental health services that integrate traditional practices, and transitioning appropriate 
              follow-up appointments to telemedicine to improve adherence rates.
            </div>
          </div>
          
          {/* Population Health Summary */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af', marginTop: '0', borderBottom: '2px solid #3b82f6', paddingBottom: '5px' }}>
              Population Health Summary
            </h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ width: '30%', border: '1px solid #e2e8f0', borderRadius: '5px', padding: '15px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px', color: '#4b5563' }}>Total Patients</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 5px 0', color: '#1e40af' }}>128</p>
                <p style={{ fontSize: '12px', color: '#16a34a', margin: '0' }}>↑ 12% from previous {analyticsTimeframe}</p>
              </div>
              
              <div style={{ width: '30%', border: '1px solid #e2e8f0', borderRadius: '5px', padding: '15px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px', color: '#4b5563' }}>Appointment Adherence</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 5px 0', color: '#1e40af' }}>82%</p>
                <p style={{ fontSize: '12px', color: '#16a34a', margin: '0' }}>↑ 5% from previous {analyticsTimeframe}</p>
              </div>
              
              <div style={{ width: '30%', border: '1px solid #e2e8f0', borderRadius: '5px', padding: '15px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px', color: '#4b5563' }}>Traditional Knowledge Integration</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 5px 0', color: '#1e40af' }}>65%</p>
                <p style={{ fontSize: '12px', color: '#16a34a', margin: '0' }}>↑ 15% from previous {analyticsTimeframe}</p>
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#4b5563' }}>Condition Prevalence</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#4b5563' }}>Condition</th>
                    <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #e2e8f0', color: '#4b5563' }}>Patients (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {conditionPrevalence.map((condition, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px', color: '#1f2937' }}>{condition.name}</td>
                      <td style={{ padding: '8px', textAlign: 'right', color: '#1f2937' }}>{condition.value}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#4b5563' }}>Community Engagement & Adherence</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#4b5563' }}>Community</th>
                    <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #e2e8f0', color: '#4b5563' }}>Engagement (%)</th>
                    <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #e2e8f0', color: '#4b5563' }}>Adherence (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {communityEngagement.map((community, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px', color: '#1f2937' }}>{community.name}</td>
                      <td style={{ padding: '8px', textAlign: 'right', color: '#1f2937' }}>{community.engagement}%</td>
                      <td style={{ padding: '8px', textAlign: 'right', color: '#1f2937' }}>{community.adherence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#4b5563' }}>Treatment Outcomes</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#4b5563' }}>Condition</th>
                    <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #e2e8f0', color: '#4b5563' }}>Improved (%)</th>
                    <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #e2e8f0', color: '#4b5563' }}>Stable (%)</th>
                    <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #e2e8f0', color: '#4b5563' }}>Deteriorated (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {treatmentOutcomes.map((outcome, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px', color: '#1f2937' }}>{outcome.name}</td>
                      <td style={{ padding: '8px', textAlign: 'right', color: '#16a34a', fontWeight: outcome.improved > 60 ? 'bold' : 'normal' }}>{outcome.improved}%</td>
                      <td style={{ padding: '8px', textAlign: 'right', color: '#ca8a04' }}>{outcome.stable}%</td>
                      <td style={{ padding: '8px', textAlign: 'right', color: '#dc2626', fontWeight: outcome.deteriorated > 12 ? 'bold' : 'normal' }}>{outcome.deteriorated}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* AI Insights Section */}
            <div style={{ 
              border: '1px solid #dbeafe', 
              borderRadius: '5px', 
              padding: '15px',
              backgroundColor: '#eff6ff',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '0', marginBottom: '10px', color: '#1e40af' }}>
                <span style={{ marginRight: '8px' }}>🧠</span>
                AI-Generated Data Insights
              </h3>
              <div style={{ fontSize: '14px', color: '#1e3a8a' }}>
                <p style={{ marginTop: '0', marginBottom: '8px' }}><strong>Community Patterns:</strong></p>
                <ul style={{ margin: '0 0 10px 0', paddingLeft: '20px' }}>
                  {communityInsights.map((insight, i) => (
                    <li key={i} style={{ marginBottom: '5px' }}>{insight}</li>
                  ))}
                </ul>
                
                <p style={{ marginTop: '10px', marginBottom: '8px' }}><strong>Treatment Efficacy Analysis:</strong></p>
                <ul style={{ margin: '0 0 10px 0', paddingLeft: '20px' }}>
                  {treatmentInsights.map((insight, i) => (
                    <li key={i} style={{ marginBottom: '5px' }}>{insight}</li>
                  ))}
                </ul>
                
                <p style={{ marginTop: '10px', marginBottom: '8px' }}><strong>Cultural Integration Impact:</strong></p>
                <ul style={{ margin: '0 0 0 0', paddingLeft: '20px' }}>
                  {culturalInsights.map((insight, i) => (
                    <li key={i} style={{ marginBottom: '5px' }}>{insight}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* AI Recommendations */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af', marginTop: '0', borderBottom: '2px solid #3b82f6', paddingBottom: '5px' }}>
              AI-Generated Recommendations
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              {reportData.recommendations.map((rec, i) => (
                <div key={i} style={{ 
                  border: '1px solid #e2e8f0', 
                  borderLeft: `4px solid ${rec.impact === 'high' ? '#dc2626' : '#f59e0b'}`, 
                  borderRadius: '5px', 
                  padding: '15px',
                  marginBottom: '15px',
                  backgroundColor: rec.impact === 'high' ? '#fef2f2' : '#fffbeb',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0', color: rec.impact === 'high' ? '#991b1b' : '#92400e' }}>{rec.category}</h3>
                    <span style={{ 
                      display: 'inline-block',
                      padding: '2px 8px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      borderRadius: '9999px',
                      background: rec.impact === 'high' ? '#fee2e2' : '#fef3c7',
                      color: rec.impact === 'high' ? '#dc2626' : '#d97706',
                      border: rec.impact === 'high' ? '1px solid #fecaca' : '1px solid #fde68a',
                    }}>
                      {rec.impact === 'high' ? 'High Impact' : 'Medium Impact'}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', marginTop: '0', marginBottom: '10px', color: '#1f2937' }}>{rec.recommendation}</p>
                  <div style={{ 
                    background: rec.impact === 'high' ? '#fee2e2' : '#fef3c7', 
                    padding: '8px', 
                    borderRadius: '5px', 
                    fontSize: '12px', 
                    color: rec.impact === 'high' ? '#991b1b' : '#92400e' 
                  }}>
                    <strong>Evidence:</strong> {rec.evidence}
                  </div>
                  <div style={{ 
                    marginTop: '10px', 
                    display: 'flex',
                    alignItems: 'center',
                    padding: '5px', 
                    background: '#f8fafc', 
                    borderRadius: '3px'
                  }}>
                    <span style={{ marginRight: '5px', fontSize: '12px', color: '#64748b' }}>Implementation complexity: </span>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {Array(3).fill(0).map((_, idx) => (
                        <span key={idx} style={{ 
                          width: '18px', 
                          height: '5px', 
                          background: idx < (rec.impact === 'high' ? 2 : 1) ? '#3b82f6' : '#e2e8f0', 
                          borderRadius: '9999px' 
                        }}></span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Suggested Next Steps */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af', marginTop: '0', borderBottom: '2px solid #3b82f6', paddingBottom: '5px' }}>
              Suggested Next Steps
            </h2>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#4b5563', width: '45%' }}>Action Item</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#4b5563', width: '25%' }}>Timeline</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#4b5563', width: '30%' }}>Resources Needed</th>
                </tr>
              </thead>
              <tbody>
                {reportData.nextSteps.map((step, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: i % 2 === 0 ? '#f8fafc' : 'white' }}>
                    <td style={{ padding: '12px 10px', color: '#1f2937', borderLeft: '3px solid #3b82f6' }}>{step.step}</td>
                    <td style={{ padding: '12px 10px', color: '#1f2937' }}>
                      <span style={{ 
                        display: 'inline-block',
                        padding: '2px 8px',
                        fontSize: '12px',
                        borderRadius: '9999px',
                        backgroundColor: 
                          step.timeline.includes('14') ? '#fee2e2' : 
                          step.timeline.includes('30') ? '#fef3c7' : 
                          step.timeline.includes('45') || step.timeline.includes('60') ? '#dbeafe' : '#dcfce7',
                        color: 
                          step.timeline.includes('14') ? '#991b1b' : 
                          step.timeline.includes('30') ? '#92400e' : 
                          step.timeline.includes('45') || step.timeline.includes('60') ? '#1e40af' : '#166534',
                      }}>
                        {step.timeline}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', color: '#1f2937' }}>{step.resources}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Implementation Priorities */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af', marginTop: '0', borderBottom: '2px solid #3b82f6', paddingBottom: '5px' }}>
              Implementation Priorities
            </h2>
            
            <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
              {/* High Priority */}
              <div style={{ flex: '1', border: '1px solid #fecaca', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '8px', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
                  Immediate Action (0-30 days)
                </div>
                <div style={{ padding: '12px' }}>
                  <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '13px' }}>
                    <li style={{ marginBottom: '8px' }}>Contact patients with chronic pain conditions for treatment plan reassessment</li>
                    <li style={{ marginBottom: '8px' }}>Schedule community health screening day in White River focusing on diabetes prevention</li>
                    <li style={{ marginBottom: '0' }}>Initiate telemedicine transition for appropriate follow-up appointments</li>
                  </ul>
                </div>
              </div>
              
              {/* Medium Priority */}
              <div style={{ flex: '1', border: '1px solid #fde68a', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '8px', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
                  Short-Term Goals (30-60 days)
                </div>
                <div style={{ padding: '12px' }}>
                  <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '13px' }}>
                    <li style={{ marginBottom: '8px' }}>Develop integrated mental health protocol combining traditional and western approaches</li>
                    <li style={{ marginBottom: '8px' }}>Expand telemedicine program with cultural competency training for all providers</li>
                    <li style={{ marginBottom: '0' }}>Establish regular cultural consultation sessions with knowledge keepers</li>
                  </ul>
                </div>
              </div>
              
              {/* Long-Term */}
              <div style={{ flex: '1', border: '1px solid #bfdbfe', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '8px', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
                  Long-Term Initiatives (60+ days)
                </div>
                <div style={{ padding: '12px' }}>
                  <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '13px' }}>
                    <li style={{ marginBottom: '8px' }}>Design community-specific health education materials in traditional languages</li>
                    <li style={{ marginBottom: '8px' }}>Develop Traditional Knowledge Integration centers in key communities</li>
                    <li style={{ marginBottom: '0' }}>Establish longitudinal study on integrated care approach effectiveness</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Disclaimer and AI Limitations */}
          <div style={{ 
            background: '#eff6ff', 
            padding: '15px', 
            borderRadius: '5px', 
            marginBottom: '20px',
            fontSize: '14px',
            color: '#1e40af',
            border: '1px solid #bfdbfe'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ fontSize: '24px', lineHeight: '1' }}>⚠️</div>
              <div>
                <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Important Notes:</p>
                <ul style={{ margin: '0', paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '5px' }}>This report is generated using AI analysis of health data trends. Always use clinical judgment when implementing recommendations.</li>
                  <li style={{ marginBottom: '5px' }}>Recommendations are based on detected patterns in your patient population data and published research on Indigenous healthcare outcomes.</li>
                  <li style={{ marginBottom: '0' }}>Cultural contexts vary significantly between and within communities - consult with appropriate knowledge keepers for specific implementation.</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Footer with attribution and metadata */}
          <div style={{ 
            borderTop: '1px solid #ccc', 
            paddingTop: '20px', 
            fontSize: '12px', 
            color: '#64748b',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 5px 0' }}>KweCare Healthcare Provider Platform</p>
            <p style={{ margin: '0 0 5px 0' }}>Confidential Report - For Medical Professional Use Only</p>
            <p style={{ margin: '0 0 5px 0' }}>Generated: {new Date().toLocaleString()}</p>
            <p style={{ margin: '0' }}>Data Sources: Electronic Health Records, Patient Engagement Analytics, Community Health Worker Reports</p>
          </div>
        </div>
      </div>
    );
  };

  // Add the handleDownloadReport function that was removed
  const handleDownloadReport = () => {
    if (!reportData) return;
    
    // For PDF output - call our PDF generator function
    handleDownloadAsPdf("analytics-report-content", `kwecare-analytics-report-${new Date().toISOString().split('T')[0]}.pdf`, false);
  };

  // Add a dedicated function for patient report PDF generation
  const generatePatientReportPDF = (patient: (typeof patients)[0]) => {
    setSelectedPatientForReport(patient);
    toast.loading(`Generating PDF report for ${patient.name}...`);
    
    // Simulate API call and AI processing time (would be a real API call in production)
    setTimeout(() => {
      // Generate the same mock data as in generatePatientReport
      const vitalsTrend = [
        { date: '2023-06-01', heartRate: 72, bloodPressure: '120/80', bloodGlucose: 98 },
        { date: '2023-07-01', heartRate: 75, bloodPressure: '122/82', bloodGlucose: 102 },
        { date: '2023-08-01', heartRate: 73, bloodPressure: '118/79', bloodGlucose: 95 },
        { date: '2023-09-01', heartRate: 76, bloodPressure: '125/85', bloodGlucose: 108 },
        { date: '2023-10-01', heartRate: 71, bloodPressure: '119/78', bloodGlucose: 97 },
        { date: '2023-11-01', heartRate: 74, bloodPressure: '121/81', bloodGlucose: 104 },
      ];
      
      const medicationAdherence = patient.adherence === "excellent" ? 95 : 
                                 patient.adherence === "good" ? 85 : 
                                 patient.adherence === "moderate" ? 75 : 60;
      
      const communityInsights = [
        `${patient.name} is from the ${patient.community} community, which has a ${
          communityHealthData.find(c => c.community.includes(patient.community.split(' ')[0]))?.diabetesRate || 10
        }% diabetes prevalence rate.`,
        `Traditional medicine practices are commonly used in ${patient.community} for managing chronic conditions.`,
        `${patient.community} has a strong cultural emphasis on community-based healing approaches.`,
        `Language preferences: Traditional ${patient.community.split(' ')[0]} language may be preferred for discussing health concepts.`
      ];
      
      const culturalConsiderations = [
        "Include traditional knowledge keepers in treatment discussions when appropriate",
        "Consider seasonal traditional activities when scheduling follow-ups",
        "Respect communal decision-making processes for major treatment decisions",
        "Incorporate traditional dietary considerations into nutritional guidance"
      ];
      
      const treatmentRecommendations = patient.conditions.map(condition => {
        // Same treatment recommendations logic as in generatePatientReport
        // ...
        let recommendation = "";
        let evidence = "";
        let confidence = 0;
        
        if (condition === "Diabetes Type 2") {
          recommendation = "Consider integrated approach combining traditional dietary practices with standard medication. Recent studies show improved outcomes when traditional foods are incorporated into dietary plans for Indigenous patients with T2D.";
          evidence = "Blood glucose trends indicate potential benefit from adjusted medication schedule and traditional medicine integration";
          confidence = 87;
        } else if (condition === "Hypertension") {
          recommendation = "Current medication appears effective, but consider stress reduction techniques culturally appropriate for the patient's community background.";
          evidence = "Recent blood pressure readings show improvement but with fluctuations coinciding with reported stress periods";
          confidence = 92;
        } else if (condition === "Heart Disease") {
          recommendation = "Cardiac rehabilitation should be modified to account for traditional activities. Consider virtual monitoring options given patient's remote location.";
          evidence = "Patient reported difficulty adhering to standard exercise regimen but engages regularly in traditional physical activities";
          confidence = 85;
        } else if (condition === "Arthritis") {
          recommendation = "Traditional anti-inflammatory preparations have shown promising results when used alongside conventional treatments. Consider consulting with community elder for appropriate protocols.";
          evidence = "Self-reported pain scores show improvement when traditional remedies are used as supplement";
          confidence = 78;
        } else if (condition === "Chronic Pain") {
          recommendation = "Holistic pain management approach recommended, incorporating both pharmacological and traditional approaches. Virtual check-ins should be increased to weekly.";
          evidence = "Pain diary indicates correlation between traditional medicine usage and reduced pain scores";
          confidence = 81;
        } else if (condition === "Asthma") {
          recommendation = "Consider seasonal factors in treatment plan. Traditional respiratory treatments may complement conventional inhalers during high-risk seasons.";
          evidence = "Symptom frequency shows seasonal patterns aligned with traditional ecological knowledge";
          confidence = 89;
        } else if (condition === "Pregnancy") {
          recommendation = "Integrate traditional midwifery knowledge where appropriate. Schedule additional cultural support sessions during prenatal care.";
          evidence = "Patient has expressed interest in traditional birthing practices alongside modern medical care";
          confidence = 94;
        } else if (condition === "Anemia") {
          recommendation = "Traditional iron-rich food sources should be incorporated into nutritional guidance alongside supplements.";
          evidence = "Previous response to combined traditional/conventional approach was positive";
          confidence = 83;
        } else if (condition === "Anxiety") {
          recommendation = "Community-based healing circles have shown strong results for this patient. Continue supporting participation alongside conventional therapy.";
          evidence = "Self-reported anxiety scores show marked improvement following community healing sessions";
          confidence = 90;
        } else {
          recommendation = "Consider cultural context when developing treatment plans. Consult with traditional knowledge keepers from patient's community.";
          evidence = "General best practice for culturally appropriate care";
          confidence = 75;
        }
        
        return {
          condition,
          recommendation,
          evidence,
          confidence
        };
      });
      
      const aiNotes = `${patient.name}'s health data indicates ${
        patient.status === "stable" ? "a stable condition with consistent management" :
        patient.status === "improving" ? "improvement in key health indicators" :
        patient.status === "monitoring" ? "a condition requiring careful monitoring" :
        "deteriorating indicators requiring prompt intervention"
      }. ${
        patient.adherence === "excellent" ? "Medication adherence is excellent, suggesting strong engagement with treatment plan." :
        patient.adherence === "good" ? "Medication adherence is good, though occasional lapses are noted." :
        patient.adherence === "moderate" ? "Moderate medication adherence suggests barriers that should be addressed." :
        "Poor medication adherence indicates significant barriers to treatment that require immediate attention."
      }
      
      Cultural context analysis indicates that ${patient.name}'s connection to ${patient.community} traditions may offer unique opportunities for treatment integration. ${
        patient.alerts > 0 ? `The ${patient.alerts} current alert(s) should be addressed as a priority.` : "No current alerts suggest this is an appropriate time for treatment plan review and adjustment."
      }
      
      Comparing ${patient.name}'s health trajectory with similar demographic profiles suggests ${
        patient.status === "improving" ? "continued improvement with current approach" :
        patient.status === "stable" ? "maintenance of stability with potential for optimization" :
        patient.status === "monitoring" ? "vigilant monitoring with potential need for adjustment" :
        "intervention to address declining health indicators"
      }. Consider scheduling follow-up within ${
        patient.status === "deteriorating" ? "7" :
        patient.status === "monitoring" ? "14" :
        "30"
      } days.`;
      
      setPatientReportData({
        vitalsTrend,
        medicationAdherence,
        communityInsights,
        culturalConsiderations,
        treatmentRecommendations,
        aiNotes
      });
      
      // Generate and download PDF
      setTimeout(() => {
        handleDownloadAsPdf("patient-report-content", `patient-report-${patient.name.replace(/\s+/g, '-').toLowerCase()}.pdf`, false);
      toast.dismiss();
        toast.success(`Report for ${patient.name} downloaded successfully`);
      }, 800);
    }, 1500);
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
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
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
                {/* Report Header */}
                <div className="bg-blue-600 p-5 rounded-md text-white mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white h-10 w-10 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">K</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">KweCare Healthcare</h2>
                      <p className="text-sm opacity-90">Population Health Analytics Report</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p>Generated on {new Date().toLocaleDateString()} by Dr. Rebecca Taylor</p>
                    <p>Timeframe: {analyticsTimeframe === 'month' ? 'Last Month' : 
                                 analyticsTimeframe === 'quarter' ? 'Last Quarter' : 
                                 analyticsTimeframe === 'year' ? 'Last Year' : 'All Time'}</p>
                    <p>Community Filter: {analyticsFilter === 'all' ? 'All Communities' : analyticsFilter}</p>
                  </div>
                </div>
                
                {/* Executive Summary */}
                <div className="border border-gray-200 rounded-md p-5 bg-gray-50 mb-6">
                  <h3 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-600 pb-1 mb-3">
                    Executive Summary
                  </h3>
                  <p className="text-sm leading-relaxed">
                    This report analyzes healthcare data across Indigenous communities to provide actionable 
                    insights on patient engagement, treatment efficacy, and cultural integration opportunities.
                    Key findings indicate that communities with traditional knowledge integration show significantly 
                    better health outcomes, particularly for chronic conditions like diabetes and mental health issues.
                    For the {analyticsTimeframe} period, overall patient engagement increased by 12%, with notable 
                    improvement in appointment adherence.
                  </p>
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                    <strong>AI Analysis:</strong> Based on cross-community data analysis, we recommend prioritizing 
                    diabetes prevention programs in White River community, expanding mental health services that 
                    integrate traditional practices, and transitioning appropriate follow-up appointments to 
                    telemedicine to improve adherence rates.
                  </div>
                </div>
                
                {/* Key Metrics */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-600 pb-1 mb-3">
                    Key Metrics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="border rounded-md p-4">
                      <h4 className="text-sm font-medium text-gray-500">Total Patients</h4>
                      <p className="text-2xl font-bold">128</p>
                      <p className="text-xs text-green-600">↑ 12% from previous {analyticsTimeframe}</p>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h4 className="text-sm font-medium text-gray-500">Appointment Adherence</h4>
                      <p className="text-2xl font-bold">82%</p>
                      <p className="text-xs text-green-600">↑ 5% from previous {analyticsTimeframe}</p>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h4 className="text-sm font-medium text-gray-500">Traditional Knowledge Integration</h4>
                      <p className="text-2xl font-bold">65%</p>
                      <p className="text-xs text-green-600">↑ 15% from previous {analyticsTimeframe}</p>
                    </div>
                  </div>
                </div>
                
                {/* Patient Visit Types Chart */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-600 pb-1 mb-3">
                    Visit Type Trends
                  </h3>
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">Patient Visit Types</h4>
                    <div className="h-[250px]">
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
                    </div>
                  </div>
                </div>
                
                {/* Condition Prevalence and Demographics Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">Condition Prevalence</h4>
                    <div className="h-[250px]">
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
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">Patient Age Distribution</h4>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={patientAgeDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
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
                    </div>
                  </div>
                </div>
                
                {/* Treatment Outcomes Chart */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-600 pb-1 mb-3">
                    Treatment Outcomes
                  </h3>
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">Patient health status changes by condition category</h4>
                    <div className="h-[300px]">
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
                    </div>
                  </div>
                </div>
                
                {/* AI Generated Recommendations */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-600 pb-1 mb-3">
                    <Brain className="h-5 w-5 inline mr-2 text-blue-600" />
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
                
                {/* Suggested Next Steps */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-600 pb-1 mb-3">
                    <CalendarClock className="h-5 w-5 inline mr-2 text-emerald-600" />
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
                  <Button onClick={handleGenerateReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Patient Report Dialog */}
      <Dialog open={patientReportModalOpen} onOpenChange={setPatientReportModalOpen}>
        <DialogContent className="lg:max-w-[900px] max-h-[80vh] overflow-y-auto" id="patient-report-content">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-kwecare-primary" />
              Comprehensive Patient Report
            </DialogTitle>
            <DialogDescription>
              AI-assisted analysis and insights for {selectedPatientForReport?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {generatingPatientReport ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative h-16 w-16">
                  <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-t-blue-500 border-b-blue-700 border-l-blue-600 border-r-blue-600 animate-spin"></div>
                  <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-blue-600" />
                </div>
                <p className="mt-4 text-center font-medium">
                  Generating comprehensive patient report...
                </p>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Analyzing health records, community context, and generating personalized insights
                </p>
              </div>
            ) : (
              <>
                {selectedPatientForReport && patientReportData && (
                  <div className="space-y-6">
                    {/* Report Header */}
                    <div className="bg-blue-600 p-5 rounded-md text-white mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-white h-10 w-10 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-lg">K</span>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">KweCare Healthcare</h2>
                          <p className="text-sm opacity-90">Patient Health Report</p>
                        </div>
                      </div>
                      <div className="text-sm">
                        <p>Generated on {new Date().toLocaleDateString()} by Dr. Rebecca Taylor</p>
                        <p>Patient: {selectedPatientForReport.name} ({selectedPatientForReport.age} years)</p>
                        <p>Community: {selectedPatientForReport.community}</p>
                      </div>
                    </div>
                    
                    {/* Patient header */}
                    <Card className="overflow-hidden border-l-4" style={{
                      borderLeftColor: selectedPatientForReport.status === "stable" ? "#10b981" : 
                                      selectedPatientForReport.status === "improving" ? "#3b82f6" : 
                                      selectedPatientForReport.status === "monitoring" ? "#f59e0b" : 
                                      "#ef4444"
                    }}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h2 className="text-xl font-bold">{selectedPatientForReport.name}</h2>
                              {selectedPatientForReport.alerts > 0 && (
                                <Badge variant="destructive">
                                  {selectedPatientForReport.alerts} alert{selectedPatientForReport.alerts > 1 ? 's' : ''}
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-1 mt-2">
                              <div className="text-sm">
                                <span className="text-muted-foreground">Age:</span> {selectedPatientForReport.age}
                              </div>
                              <div className="text-sm">
                                <span className="text-muted-foreground">Community:</span> {selectedPatientForReport.community}
                              </div>
                              <div className="text-sm">
                                <span className="text-muted-foreground">Last Visit:</span> {selectedPatientForReport.lastVisit}
                              </div>
                              <div className="text-sm">
                                <span className="text-muted-foreground">Next Visit:</span> {selectedPatientForReport.nextVisit}
                              </div>
                              <div className="text-sm">
                                <span className="text-muted-foreground">Status:</span> {selectedPatientForReport.status}
                              </div>
                              <div className="text-sm">
                                <span className="text-muted-foreground">Adherence:</span> {selectedPatientForReport.adherence}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 mt-4 md:mt-0">
                            <Button variant="outline" size="sm" onClick={() => generatePatientReportPDF(selectedPatientForReport)}>
                              <FileDown className="h-4 w-4 mr-2" />
                              Download Report
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Current conditions */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Current Conditions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedPatientForReport.conditions.map((condition, i) => (
                          <Card key={i}>
                            <CardContent className="p-4">
                              <h4 className="font-medium">{condition}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {condition === "Diabetes Type 2" ? "Managing with medication and lifestyle modifications" :
                                 condition === "Hypertension" ? "Controlled with medication and dietary restrictions" :
                                 condition === "Heart Disease" ? "Requires regular monitoring and medication adherence" :
                                 condition === "Arthritis" ? "Managed with pain medication and physical therapy" :
                                 condition === "Chronic Pain" ? "Pain management protocol in place" :
                                 condition === "Asthma" ? "Managed with inhalers and environmental controls" :
                                 condition === "Migraine" ? "Triggers identified and prevention plan in place" :
                                 condition === "Anxiety" ? "Combination of medication and counseling" :
                                 condition === "Pregnancy" ? "Regular prenatal care and monitoring" :
                                 condition === "Anemia" ? "Iron supplementation and dietary management" :
                                 "Under active treatment and monitoring"}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    {/* Medication adherence */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Medication Adherence</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative h-28 w-28">
                              <svg viewBox="0 0 100 100" className="h-full w-full">
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="45"
                                  fill="none"
                                  stroke="#e2e8f0"
                                  strokeWidth="10"
                                />
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="45"
                                  fill="none"
                                  stroke={
                                    patientReportData.medicationAdherence >= 90 ? "#10b981" :
                                    patientReportData.medicationAdherence >= 80 ? "#3b82f6" :
                                    patientReportData.medicationAdherence >= 70 ? "#f59e0b" :
                                    "#ef4444"
                                  }
                                  strokeWidth="10"
                                  strokeDasharray={`${2 * Math.PI * 45 * patientReportData.medicationAdherence / 100} ${2 * Math.PI * 45 * (1 - patientReportData.medicationAdherence / 100)}`}
                                  strokeDashoffset={2 * Math.PI * 45 * 0.25}
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-bold">{patientReportData.medicationAdherence}%</span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-lg mb-2">Adherence Analysis</h4>
                              <p className="text-sm mb-3">
                                {patientReportData.medicationAdherence >= 90 
                                  ? "Excellent medication adherence indicates strong engagement with treatment plan."
                                  : patientReportData.medicationAdherence >= 80
                                  ? "Good medication adherence, though occasional lapses are noted."
                                  : patientReportData.medicationAdherence >= 70
                                  ? "Moderate medication adherence suggests barriers that should be addressed."
                                  : "Poor medication adherence indicates significant barriers to treatment that require immediate attention."}
                              </p>
                              <div className="text-sm text-muted-foreground">
                                {patientReportData.medicationAdherence < 80 && (
                                  <div className="mt-2 text-amber-800 bg-amber-50 p-2 rounded-md">
                                    <strong>Suggested intervention:</strong> Schedule medication review appointment to address adherence barriers.
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* AI Treatment Recommendations */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Brain className="h-5 w-5 text-blue-600" />
                        AI-Generated Treatment Recommendations
                      </h3>
                      <div className="space-y-4">
                        {patientReportData.treatmentRecommendations.map((rec, i) => (
                          <Card key={i} className="overflow-hidden border-l-4" style={{
                            borderLeftColor: rec.confidence >= 90 ? "#10b981" : 
                                            rec.confidence >= 80 ? "#3b82f6" : 
                                            rec.confidence >= 70 ? "#f59e0b" : 
                                            "#ef4444"
                          }}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">{rec.condition}</h4>
                                <Badge variant="outline">
                                  {rec.confidence}% confidence
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
                    
                    {/* Community and Cultural Context */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Globe className="h-5 w-5 text-green-600" />
                        Community and Cultural Context
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Community Insights</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2 text-sm">
                              {patientReportData.communityInsights.map((insight, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <ChevronRight className="h-4 w-4 text-kwecare-primary mt-0.5 flex-shrink-0" />
                                  <span>{insight}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Cultural Considerations</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2 text-sm">
                              {patientReportData.culturalConsiderations.map((consideration, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <ChevronRight className="h-4 w-4 text-kwecare-primary mt-0.5 flex-shrink-0" />
                                  <span>{consideration}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    {/* AI Summary Notes */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-indigo-600" />
                        AI Clinical Summary
                      </h3>
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm whitespace-pre-line">{patientReportData.aiNotes}</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-md mb-4">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> This report is generated using AI analysis of health data and is intended to assist healthcare providers.
                        All recommendations should be evaluated using clinical judgment and cultural context.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPatientReportModalOpen(false)}>
              Close
            </Button>
            {!generatingPatientReport && selectedPatientForReport && (
              <>
              <Button onClick={() => generatePatientReportPDF(selectedPatientForReport)}>
                <FileDown className="h-4 w-4 mr-2" />
                Download Report
              </Button>
                <Button onClick={() => handleExportPatientData(selectedPatientForReport)} className="bg-green-600 hover:bg-green-700 text-white border-green-600">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {renderHiddenReportContent()}
    </>
  );
};

export default ProviderDashboard;
