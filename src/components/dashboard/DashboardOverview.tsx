
import React from "react";
import HealthMetricsCard from "./HealthMetricsCard";
import AppointmentsList from "./AppointmentsList";
import QuickActions from "./QuickActions";
import HealthCharts from "./HealthCharts";
import AIDiagnosticsWidget from "./AIDiagnosticsWidget";
import ModelStatusIndicator from "../ai-diagnostics/ModelStatusIndicator";
import { Activity, Calendar, Heart, BarChart2, Globe } from "lucide-react";

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

  // Sample appointments data
  const appointments = [
    {
      id: 1,
      title: "Telemedicine Call",
      doctor: "Dr. Sarah Johnson",
      specialty: "Endocrinologist",
      time: "Today, 3:00 PM",
      status: "upcoming",
    },
    {
      id: 2,
      title: "Diabetes Follow-up",
      doctor: "Dr. Michael Chen",
      specialty: "Internal Medicine",
      time: "Nov 15, 10:00 AM",
      status: "scheduled",
    },
    {
      id: 3,
      title: "Blood Test Results",
      doctor: "Dr. Emily White",
      specialty: "Lab Review",
      time: "Nov 22, 2:30 PM",
      status: "scheduled",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* AI Model Status Indicator */}
      <ModelStatusIndicator />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {healthMetrics.map((metric, index) => (
              <HealthMetricsCard key={index} metric={metric} />
            ))}
          </div>
          
          <HealthCharts />
          
          <QuickActions />
        </div>
        
        <div className="space-y-6">
          <AIDiagnosticsWidget />
          
          <div className="glass-card p-6">
            <AppointmentsList appointments={appointments} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
