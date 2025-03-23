import React, { useState } from "react";
import Header from "@/components/ui/layout/Header";
import Footer from "@/components/ui/layout/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  FileText, 
  Syringe,
  Tablet,
  TestTube,
  Activity,
  BarChart2, 
  Download,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import RecordsHeader from "@/components/health-records/RecordsHeader";
import MedicationsList from "@/components/health-records/MedicationsList";
import LabResultsList from "@/components/health-records/LabResultsList";
import ImmunizationsList from "@/components/health-records/ImmunizationsList";

const HealthRecords = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (tab: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const handlePreviewReport = () => {
    toast.success("Preview report functionality coming soon");
  };

  const handleGenerateReport = () => {
    toast.success("Generate detailed report functionality coming soon");
  };

  const handleExportData = () => {
    toast.success("Export data functionality coming soon");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Header />
      
      <main className="flex-1 pt-28 px-6 pb-16 max-w-7xl mx-auto w-full">
        <RecordsHeader 
          title="Health Records" 
          subtitle="Your complete medical history" 
        />
        
        <Card className="glass-card animate-fade-in" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-kwecare-primary" />
              Medical Records
            </CardTitle>
            <CardDescription>
              View and manage your health information
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="medications" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="medications" className="flex items-center gap-1">
                  <Tablet className="h-4 w-4" />
                  <span className="hidden sm:inline">Medications</span>
                </TabsTrigger>
                <TabsTrigger value="lab-results" className="flex items-center gap-1">
                  <TestTube className="h-4 w-4" />
                  <span className="hidden sm:inline">Lab Results</span>
                </TabsTrigger>
                <TabsTrigger value="immunizations" className="flex items-center gap-1">
                  <Syringe className="h-4 w-4" />
                  <span className="hidden sm:inline">Immunizations</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Medications Tab */}
              <TabsContent value="medications" className="mt-0">
                <MedicationsList 
                  searchQuery={searchQuery} 
                  onSearch={handleSearch} 
                />
              </TabsContent>
              
              {/* Lab Results Tab */}
              <TabsContent value="lab-results" className="mt-0">
                <LabResultsList 
                  searchQuery={searchQuery} 
                  onSearch={handleSearch} 
                />
              </TabsContent>
              
              {/* Immunizations Tab */}
              <TabsContent value="immunizations" className="mt-0">
                <ImmunizationsList 
                  searchQuery={searchQuery} 
                  onSearch={handleSearch} 
                />
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="mt-0">
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                          <h2 className="text-2xl font-bold">Health Analytics Report</h2>
                          <p className="text-sm text-muted-foreground mt-1">
                            Comprehensive analysis of health metrics and trends
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Patient-specific AI-assisted summaries */}
                  <div className="grid grid-cols-1 gap-6 mb-6">
                    <Card className="p-4">
                      <CardHeader className="p-0 pb-4">
                        <CardTitle className="text-base">AI-Assisted Health Summary</CardTitle>
                        <CardDescription>Patient-specific health analysis</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="space-y-4">
                          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                            <h3 className="font-medium text-blue-700 mb-2">Recent Health Trends</h3>
                            <p className="text-sm">
                              Your blood glucose levels have shown improvement over the last 3 months, decreasing from an average of 7.8 mmol/L to 7.2 mmol/L. Continue with your current medication and dietary plan.
                            </p>
                          </div>
                          
                          <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
                            <h3 className="font-medium text-amber-700 mb-2">Areas of Attention</h3>
                            <p className="text-sm">
                              Your blood pressure readings remain slightly elevated. Consider discussing lifestyle modifications with your healthcare provider at your next appointment scheduled for next month.
                            </p>
                          </div>
                          
                          <div className="bg-green-50 p-4 rounded-md border border-green-100">
                            <h3 className="font-medium text-green-700 mb-2">Positive Outcomes</h3>
                            <p className="text-sm">
                              Your cholesterol levels have significantly improved and are now within the normal range. Your consistent medication adherence (90%) has been key to this improvement.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="p-4">
                      <CardHeader className="p-0 pb-4">
                        <CardTitle className="text-base">Health Trends</CardTitle>
                        <CardDescription>Your health metrics over time</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0 h-[300px] flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <BarChart2 className="h-16 w-16 mx-auto mb-4 opacity-20" />
                          <p>Health trend data will appear here</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Separate buttons similar to provider's analytics */}
                  <div className="text-center py-8">
                    <button
                      onClick={handlePreviewReport}
                      className="mx-3 px-8 py-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-md font-medium inline-flex items-center"
                    >
                      <Eye className="mr-2 h-5 w-5" />
                      Preview Report
                    </button>
                    
                    <button
                      onClick={handleGenerateReport}
                      className="mx-3 px-8 py-3 bg-blue-600 text-white rounded-md font-medium inline-flex items-center"
                    >
                      <FileText className="mr-2 h-5 w-5" />
                      Generate Detailed Report
                    </button>
                    
                    <button
                      onClick={handleExportData}
                      className="mx-3 px-8 py-3 bg-green-600 text-white rounded-md font-medium inline-flex items-center"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Export Data
                    </button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default HealthRecords;
