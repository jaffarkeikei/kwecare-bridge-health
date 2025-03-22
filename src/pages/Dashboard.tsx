
import React, { useEffect } from "react";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import Header from "@/components/ui/layout/Header";
import Footer from "@/components/ui/layout/Footer";
import { 
  BarChart3, 
  Bell, 
  CalendarClock, 
  FileText, 
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationsDropdown from "@/components/dashboard/NotificationsDropdown";
import UserDropdown from "@/components/dashboard/UserDropdown";
import { toast } from "sonner";

const Dashboard = () => {
  useEffect(() => {
    // Welcome toast when dashboard loads
    toast.success("Welcome back, Sarah!", {
      description: "You have 1 appointment scheduled for today.",
      duration: 5000,
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Header />
      
      <main className="flex-1 pt-28 px-6 pb-16 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, Sarah
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <NotificationsDropdown />
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10 transition-all hover:border-kwecare-primary hover:bg-kwecare-primary/5">
              <Settings className="h-4 w-4" />
            </Button>
            <UserDropdown />
          </div>
        </div>
        
        <div className="mb-8 flex flex-wrap gap-3 animate-fade-in transition-all" style={{ animationDelay: "100ms" }}>
          <Button 
            variant="secondary" 
            className="bg-kwecare-primary text-white hover:bg-kwecare-primary/90 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </Button>
          <Button 
            variant="outline"
            className="transition-all duration-300 hover:border-kwecare-primary hover:text-kwecare-primary hover:bg-kwecare-primary/5"
          >
            <CalendarClock className="mr-2 h-4 w-4" />
            Appointments
          </Button>
          <Button 
            variant="outline"
            className="transition-all duration-300 hover:border-kwecare-primary hover:text-kwecare-primary hover:bg-kwecare-primary/5"  
          >
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
