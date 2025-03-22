
import React, { useEffect, useState } from "react";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import Header from "@/components/ui/layout/Header";
import Footer from "@/components/ui/layout/Footer";
import { 
  BarChart3, 
  Bell, 
  CalendarClock, 
  FileText, 
  Settings,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationsDropdown from "@/components/dashboard/NotificationsDropdown";
import UserDropdown from "@/components/dashboard/UserDropdown";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    // Welcome toast when dashboard loads
    toast.success("Welcome back, Sarah!", {
      description: "You have 1 appointment scheduled for today.",
      duration: 5000,
    });
  }, []);

  // Render the appropriate content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview />;
      case "appointments":
      case "health-records":
      case "ai-diagnostics":
        // Show a message that would direct users to the full page
        return (
          <div className="flex flex-col items-center justify-center p-20 text-center space-y-4 rounded-lg border-2 border-dashed border-muted-foreground/20">
            <h2 className="text-2xl font-semibold">
              {activeTab === "appointments" && "Appointments"}
              {activeTab === "health-records" && "Health Records"}
              {activeTab === "ai-diagnostics" && "AI Diagnostics"}
            </h2>
            <p className="text-muted-foreground max-w-md">
              This is a preview of the {activeTab.replace('-', ' ')} tab. For the full experience, click the button below.
            </p>
            <Button 
              className="mt-4 bg-kwecare-primary hover:bg-kwecare-primary/90"
              onClick={() => navigate(`/${activeTab}`)}
            >
              Open Full {activeTab === "appointments" ? "Appointments" : 
                         activeTab === "health-records" ? "Health Records" : 
                         "AI Diagnostics"}
            </Button>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

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
            variant={activeTab === "overview" ? "secondary" : "outline"}
            className={activeTab === "overview" 
              ? "bg-kwecare-primary text-white hover:bg-kwecare-primary/90 transition-all duration-300 shadow-sm hover:shadow-md" 
              : "transition-all duration-300 hover:border-kwecare-primary hover:text-kwecare-primary hover:bg-kwecare-primary/5"}
            onClick={() => setActiveTab("overview")}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </Button>
          <Button 
            variant={activeTab === "appointments" ? "secondary" : "outline"}
            className={activeTab === "appointments" 
              ? "bg-kwecare-primary text-white hover:bg-kwecare-primary/90 transition-all duration-300 shadow-sm hover:shadow-md" 
              : "transition-all duration-300 hover:border-kwecare-primary hover:text-kwecare-primary hover:bg-kwecare-primary/5"}
            onClick={() => setActiveTab("appointments")}
          >
            <CalendarClock className="mr-2 h-4 w-4" />
            Appointments
          </Button>
          <Button 
            variant={activeTab === "health-records" ? "secondary" : "outline"}
            className={activeTab === "health-records" 
              ? "bg-kwecare-primary text-white hover:bg-kwecare-primary/90 transition-all duration-300 shadow-sm hover:shadow-md" 
              : "transition-all duration-300 hover:border-kwecare-primary hover:text-kwecare-primary hover:bg-kwecare-primary/5"}
            onClick={() => setActiveTab("health-records")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Health Records
          </Button>
          <Button 
            variant={activeTab === "ai-diagnostics" ? "secondary" : "outline"}
            className={activeTab === "ai-diagnostics" 
              ? "bg-kwecare-primary text-white hover:bg-kwecare-primary/90 transition-all duration-300 shadow-sm hover:shadow-md" 
              : "transition-all duration-300 hover:border-kwecare-primary hover:text-kwecare-primary hover:bg-kwecare-primary/5"}
            onClick={() => setActiveTab("ai-diagnostics")}
          >
            <Brain className="mr-2 h-4 w-4" />
            AI Diagnostics
          </Button>
        </div>
        
        {renderContent()}
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
