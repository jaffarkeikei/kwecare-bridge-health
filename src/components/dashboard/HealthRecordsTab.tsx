
import React, { useState } from "react";
import { FileText, Pill, TestTube, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MedicationsList from "@/components/health-records/MedicationsList";
import LabResultsList from "@/components/health-records/LabResultsList";
import ImmunizationsList from "@/components/health-records/ImmunizationsList";
import RecordsHeader from "@/components/health-records/RecordsHeader";

const HealthRecordsTab = () => {
  const [activeRecordTab, setActiveRecordTab] = useState("medications");
  const [searchQueries, setSearchQueries] = useState({
    medications: "",
    "lab-results": "",
    immunizations: ""
  });

  const handleSearch = (tab: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueries(prev => ({
      ...prev,
      [tab]: e.target.value
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-2 mb-6">
        <FileText className="h-6 w-6 text-kwecare-primary" />
        <h2 className="text-2xl font-bold">Health Records</h2>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <Tabs
            value={activeRecordTab}
            onValueChange={setActiveRecordTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="medications" className="flex items-center gap-2">
                <Pill className="h-4 w-4" />
                <span>Medications</span>
              </TabsTrigger>
              <TabsTrigger value="lab-results" className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                <span>Lab Results</span>
              </TabsTrigger>
              <TabsTrigger value="immunizations" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Immunizations</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="medications" className="mt-0">
              <MedicationsList 
                searchQuery={searchQueries.medications} 
                onSearch={handleSearch} 
              />
            </TabsContent>
            
            <TabsContent value="lab-results" className="mt-0">
              <LabResultsList 
                searchQuery={searchQueries["lab-results"]} 
                onSearch={handleSearch} 
              />
            </TabsContent>
            
            <TabsContent value="immunizations" className="mt-0">
              <ImmunizationsList 
                searchQuery={searchQueries.immunizations} 
                onSearch={handleSearch} 
              />
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
      
      <div className="flex justify-end gap-3">
        <Button variant="outline">Export Records</Button>
        <Button variant="branded">Request Medical Records</Button>
      </div>
    </div>
  );
};

export default HealthRecordsTab;
