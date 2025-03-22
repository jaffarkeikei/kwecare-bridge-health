
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { 
  Home, 
  Calendar, 
  FileText, 
  Brain, 
  Globe,
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/ui/layout/Header";
import Footer from "@/components/ui/layout/Footer";

import DashboardOverview from "@/components/dashboard/DashboardOverview";
// Import detailed tab components
import AppointmentsTab from "@/components/dashboard/AppointmentsTab";
import HealthRecordsTab from "@/components/dashboard/HealthRecordsTab";
import AIDiagnosticsTab from "@/components/dashboard/AIDiagnosticsTab";
import CulturalSafetyTab from "@/components/cultural-safety/CulturalSafetyTab";

type DashboardTab = "overview" | "appointments" | "health-records" | "ai-diagnostics" | "cultural-safety";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

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
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | KweCare</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
        <Header />

        <main className="flex-1 pt-28 px-4 md:px-6 pb-16 w-full max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as DashboardTab)}
            className="mb-8"
          >
            <TabsList className="grid grid-cols-3 md:grid-cols-5 gap-2">
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
            </TabsList>
          </Tabs>

          {renderContent()}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
