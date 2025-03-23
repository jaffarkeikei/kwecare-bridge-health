import React, { useState, useEffect } from "react";
import HealthMetricsCard from "./HealthMetricsCard";
import QuickActions from "./QuickActions";
import HealthCharts from "./HealthCharts";
import AIDiagnosticsWidget from "./AIDiagnosticsWidget";
import WeeklySurveysWidget from "./WeeklySurveysWidget";
import ModelStatusIndicator from "../ai-diagnostics/ModelStatusIndicator";
import { Activity, Heart, BarChart2, Globe } from "lucide-react";
import { toast } from "sonner";

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
          {/* Improved layout for surveys and diagnostics widgets */}
          <div className="grid grid-cols-1 gap-5">
            <WeeklySurveysWidget />
            <AIDiagnosticsWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
