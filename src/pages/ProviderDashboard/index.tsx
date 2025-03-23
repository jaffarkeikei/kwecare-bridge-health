import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar, 
  ClipboardList, 
  BarChart3,
  MessageSquare,
  Bell,
  Stethoscope,
  Activity 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Header from "@/components/ui/layout/Header";
import Footer from "@/components/ui/layout/Footer";

// Import tab components
import DashboardOverview from "./components/DashboardOverview";
// import PatientManagement from "./components/PatientManagement";
// import AppointmentSection from "./components/AppointmentSection";
// import RecordsManagement from "./components/RecordsManagement";
// import AnalyticsSection from "./components/AnalyticsSection";
// import MessagesSection from "./components/MessagesSection";

// Types
export type ProviderTab = "dashboard" | "patients" | "appointments" | "records" | "analytics" | "messages";

const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState<ProviderTab>("dashboard");

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
                    <NotificationItems />
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

          {/* Render active tab content */}
          {activeTab === "dashboard" && <DashboardOverview />}
          {/* {activeTab === "patients" && <PatientManagement />}
          {activeTab === "appointments" && <AppointmentSection />}
          {activeTab === "records" && <RecordsManagement />}
          {activeTab === "analytics" && <AnalyticsSection />}
          {activeTab === "messages" && <MessagesSection />} */}
        </main>

        <Footer />
      </div>
    </>
  );
};

// Helper component for notification dropdown
const NotificationItems = () => {
  return (
    <>
      <DropdownMenuItem className="cursor-pointer flex items-start gap-2 p-3">
        <Bell className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
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
    </>
  );
};

export default ProviderDashboard; 