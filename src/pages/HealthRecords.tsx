
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
} from "lucide-react";
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
              <TabsList className="grid grid-cols-3 mb-6">
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
            </Tabs>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default HealthRecords;
