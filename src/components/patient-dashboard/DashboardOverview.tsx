import React, { useState, useEffect } from "react";
import HealthMetricsCard from "./HealthMetricsCard";
import QuickActions from "./QuickActions";
import HealthCharts from "./HealthCharts";
import AIDiagnosticsWidget from "./AIDiagnosticsWidget";
import WeeklySurveysWidget from "./WeeklySurveysWidget";
import ModelStatusIndicator from "../ai-diagnostics/ModelStatusIndicator";
import { Activity, Heart, BarChart2, Globe, AlertCircle, Calendar, MessageSquare, Users } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DashboardOverview = () => {
  // Sample health metrics data
  const healthMetrics = [
    {
      title: "Heart Rate",
      value: "72",
      unit: "bpm",
      change: "+3",
      status: "normal",
      icon: <Heart className="h-5 w-5 text-red-500" />,
    },
    {
      title: "Blood Pressure",
      value: "120/80",
      unit: "mmHg",
      change: "-5",
      status: "normal",
      icon: <Activity className="h-5 w-5 text-green-500" />,
    },
    {
      title: "Blood Glucose",
      value: "98",
      unit: "mg/dL",
      change: "+2",
      status: "normal",
      icon: <BarChart2 className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Cultural Safety",
      value: "Enabled",
      unit: "",
      change: "",
      status: "normal",
      icon: <Globe className="h-5 w-5 text-purple-500" />,
    },
  ];

  // Sample provider dashboard data
  const clinicalAlerts = [
    {
      patientName: "Sarah Johnson",
      alert: "Blood glucose readings consistently above 180 mg/dL",
      severity: "critical",
      date: "2 hours ago"
    },
    {
      patientName: "David Wilson",
      alert: "Reported increased chest pain and shortness of breath",
      severity: "critical",
      date: "5 hours ago"
    },
    {
      patientName: "Maria Garcia",
      alert: "Missed last two appointments for prenatal care",
      severity: "high",
      date: "Yesterday"
    }
  ];

  const upcomingAppointments = [
    {
      patient: "John Deer",
      time: "Today, 11:30 AM",
      type: "Check-up",
      virtual: true
    },
    {
      patient: "Emily Chen",
      time: "Today, 2:00 PM",
      type: "Follow-up",
      virtual: false
    },
    {
      patient: "William Taylor",
      time: "Tomorrow, 9:15 AM",
      type: "Consultation",
      virtual: true
    }
  ];

  // Check if this is the user's first login
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  
  useEffect(() => {
    const isInitialLogin = sessionStorage.getItem("kwecare_initial_provider_login") !== "complete";
    if (isInitialLogin) {
      setIsFirstLogin(true);
      toast.success("Welcome to your provider dashboard!", {
        description: "You now have access to all clinical tools and patient management features."
      });
      sessionStorage.setItem("kwecare_initial_provider_login", "complete");
    }
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome message for first login */}
      {isFirstLogin && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-800 mb-1">Welcome to KweCare Provider Portal</h3>
                <p className="text-blue-700">This dashboard gives you a comprehensive overview of your patients, appointments, and critical alerts. Use the navigation tabs above to access specialized clinical tools.</p>
              </div>
              <Button variant="outline" className="text-blue-600 border-blue-300">Take Tour</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* AI Model Status Indicator */}
      <ModelStatusIndicator />
      
      {/* Key provider metrics */}
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
                <Globe className="h-4 w-4 mr-1 text-purple-500" />
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Critical patient alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                Critical Patient Alerts
              </CardTitle>
              <CardDescription>Patients requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[300px] overflow-auto">
              <div className="space-y-4">
                {clinicalAlerts.map((alert, i) => (
                  <div key={i} className="flex items-start p-3 bg-muted/30 rounded-md">
                    <div className="flex-shrink-0 mr-3">
                      <Badge 
                        variant="outline" 
                        className={`
                          ${alert.severity === 'critical' ? 'border-red-500 text-red-600 bg-red-50' : 
                            alert.severity === 'high' ? 'border-orange-500 text-orange-600 bg-orange-50' : 
                            'border-yellow-500 text-yellow-600 bg-yellow-50'}
                        `}
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{alert.patientName}</h4>
                      <p className="text-sm mb-1">{alert.alert}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{alert.date}</span>
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">View All Patient Alerts</Button>
            </CardFooter>
          </Card>
          
          <HealthCharts />
        </div>
        
        <div className="space-y-6">
          {/* Appointments widget */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>Next 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto max-h-[200px]">
              <div className="space-y-3">
                {upcomingAppointments.map((appointment, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div>
                      <h4 className="font-medium text-sm">{appointment.patient}</h4>
                      <div className="flex items-center gap-1 mt-1">
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
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">View Full Schedule</Button>
            </CardFooter>
          </Card>
          
          <WeeklySurveysWidget />
          <AIDiagnosticsWidget />
        </div>
      </div>
      
      <QuickActions />
    </div>
  );
};

export default DashboardOverview;
