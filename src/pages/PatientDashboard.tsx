import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { 
  Home, 
  Calendar, 
  FileText, 
  Brain, 
  Globe, 
  ClipboardCheck,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/ui/layout/Header";
import Footer from "@/components/ui/layout/Footer";
import VoiceCommandButton from "@/components/cultural-safety/VoiceCommandButton";

import DashboardOverview from "@/components/patient-dashboard/DashboardOverview";
// Import detailed tab components
import AppointmentsTab from "@/components/patient-dashboard/AppointmentsTab";
import HealthRecordsTab from "@/components/patient-dashboard/HealthRecordsTab";
import AIDiagnosticsTab from "@/components/patient-dashboard/AIDiagnosticsTab";
import CulturalSafetyTab from "@/components/cultural-safety/CulturalSafetyTab";
import SurveysTab from "@/components/patient-dashboard/SurveysTab";

type DashboardTab = "overview" | "appointments" | "health-records" | "ai-diagnostics" | "cultural-safety" | "surveys";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

  // Listen for custom events to set the active tab (used by voice command)
  useEffect(() => {
    const handleSetActiveTab = (event: CustomEvent<{ tab: DashboardTab }>) => {
      setActiveTab(event.detail.tab);
    };
    
    window.addEventListener("set-active-tab", handleSetActiveTab as EventListener);
    
    return () => {
      window.removeEventListener("set-active-tab", handleSetActiveTab as EventListener);
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview />;
      case "appointments":
        return <AppointmentsTab />;
      case "health-records":
        return <HealthRecordsTab />;
      case "ai-diagnostics":
        return <AIDiagnosticsTab />;
      case "cultural-safety":
        return <CulturalSafetyTab />;
      case "surveys":
        return <SurveysTab />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Patient Dashboard | KweCare</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
        <Header />

        <main className="flex-1 pt-28 px-4 md:px-6 pb-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Patient Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your health records and appointments</p>
            </div>
            <VoiceCommandButton />
          </div>

          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <User className="h-5 w-5 text-blue-700" />
            </div>
            <div className="flex-1">
              <h2 className="font-medium text-blue-800">Patient Portal</h2>
              <p className="text-sm text-blue-700">Your personal health dashboard with self-care tools and appointment tracking.</p>
            </div>
            <div>
              <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                Health Guide
              </Button>
            </div>
          </div>

          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as DashboardTab)}
            className="mb-8"
          >
            <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
              <TabsTrigger value="overview" className="gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden md:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="appointments" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden md:inline">Appointments</span>
              </TabsTrigger>
              <TabsTrigger value="health-records" className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden md:inline">Health Records</span>
              </TabsTrigger>
              <TabsTrigger value="ai-diagnostics" className="gap-2">
                <Brain className="h-4 w-4" />
                <span className="hidden md:inline">AI Diagnostics</span>
              </TabsTrigger>
              <TabsTrigger value="cultural-safety" className="gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden md:inline">Cultural Safety</span>
              </TabsTrigger>
              <TabsTrigger value="surveys" className="gap-2">
                <ClipboardCheck className="h-4 w-4" />
                <span className="hidden md:inline">Surveys</span>
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

export default PatientDashboard;
