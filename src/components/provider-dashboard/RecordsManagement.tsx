import React from "react";
import { Search, Eye, FileOutput, Activity, AlertCircle, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { patients } from "./data/patientData";
import { StatusBadge } from "./utils/ui-helpers";

const RecordsManagement = () => {
  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Medical Records</CardTitle>
            <CardDescription>Access and manage patient health records</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="search"
              placeholder="Search records..."
              className="w-[250px]"
            />
            <Button variant="outline">Advanced Search</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-4">Patient Records</h3>
        <div className="space-y-4 mb-6">
          {patients.map(patient => (
            <Card key={patient.id} className="overflow-hidden border-l-4" style={{
              borderLeftColor: patient.status === "stable" ? "#10b981" : 
                              patient.status === "improving" ? "#3b82f6" : 
                              patient.status === "monitoring" ? "#f59e0b" : 
                              "#ef4444"
            }}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <h3 className="text-lg font-semibold">{patient.name}</h3>
                      {patient.alerts > 0 && (
                        <Badge variant="destructive" className="rounded-full h-5 w-5 p-0 flex items-center justify-center">
                          {patient.alerts}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 mt-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Age:</span> {patient.age}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Last Visit:</span> {patient.lastVisit}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Next Visit:</span> {patient.nextVisit}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Community:</span> {patient.community}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Status:</span> <StatusBadge status={patient.status} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm font-medium">Conditions:</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {patient.conditions.map((condition, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col gap-2 justify-end">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">Preview Report</span>
                    </Button>
                    <Button variant="default" size="sm" className="gap-1 bg-kwecare-primary hover:bg-kwecare-primary/90">
                      <FileOutput className="h-4 w-4" />
                      <span className="hidden sm:inline">Generate Report</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
            
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-muted/30 p-5 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Recent Patient Records
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-md">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-sm">David Wilson</span>
                  <Badge variant="outline" className="text-xs">Heart Disease</Badge>
                </div>
                <p className="text-sm mb-1">Updated blood pressure medication dosage</p>
                <span className="text-xs text-muted-foreground">Updated 2 days ago</span>
              </div>
              <div className="p-3 bg-muted/50 rounded-md">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-sm">Sarah Johnson</span>
                  <Badge variant="outline" className="text-xs">Diabetes</Badge>
                </div>
                <p className="text-sm mb-1">HbA1c results from Nov 12 lab work</p>
                <span className="text-xs text-muted-foreground">Updated 3 days ago</span>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/30 p-5 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-500" />
              Traditional Knowledge Integration
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-md">
                <div className="flex flex-col mb-1">
                  <span className="font-medium text-sm">Labrador Tea Integration</span>
                  <div className="flex gap-1 mt-1">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                      Traditional Medicine
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs">
                      Respiratory
                    </Badge>
                  </div>
                </div>
                <p className="text-sm mb-1">Guidelines for integrating with standard COPD treatment</p>
                <span className="text-xs text-muted-foreground">From Elder Margaret Francis</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Data Sovereignty Guidelines
          </h3>
          <p className="text-sm">
            Remember that all traditional knowledge records are subject to Indigenous data sovereignty principles. 
            Permission must be obtained before sharing or transferring this information.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordsManagement; 