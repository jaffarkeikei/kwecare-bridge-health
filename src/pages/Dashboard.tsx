
import React from "react";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import Header from "@/components/ui/layout/Header";
import Footer from "@/components/ui/layout/Footer";
import { 
  BarChart3, 
  Bell, 
  CalendarClock, 
  FileText, 
  Settings, 
  User 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-28 px-6 pb-16 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="page-transition">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, Sarah
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mb-8 flex flex-wrap gap-3">
          <Button 
            variant="secondary" 
            className="bg-kwecare-primary text-white hover:bg-kwecare-primary/90"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </Button>
          <Button variant="outline">
            <CalendarClock className="mr-2 h-4 w-4" />
            Appointments
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Health Records
          </Button>
        </div>
        
        <DashboardOverview />
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
