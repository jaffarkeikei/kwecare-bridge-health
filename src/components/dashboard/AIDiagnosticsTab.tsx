
import React, { useState } from "react";
import { Brain, Search, PieChart, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModelStatusIndicator from "@/components/ai-diagnostics/ModelStatusIndicator";
import DiagnosticsSymptomsChecker from "@/components/ai-diagnostics/DiagnosticsSymptomsChecker";
import HealthPredictions from "@/components/ai-diagnostics/HealthPredictions";

const AIDiagnosticsTab = () => {
  const [activeTab, setActiveTab] = useState("symptoms");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-2 mb-6">
        <Brain className="h-6 w-6 text-kwecare-primary" />
        <h2 className="text-2xl font-bold">AI Diagnostics</h2>
      </div>
      
      <ModelStatusIndicator />
      
      <Card className="glass-card">
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="symptoms" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>Symptoms Checker</span>
              </TabsTrigger>
              <TabsTrigger value="predictions" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                <span>Health Predictions</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="symptoms" className="mt-0">
              <DiagnosticsSymptomsChecker />
            </TabsContent>
            
            <TabsContent value="predictions" className="mt-0">
              <HealthPredictions />
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            AI Insights
          </CardTitle>
          <CardDescription>
            Personalized health insights based on your medical history and data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30">
              <h3 className="font-medium mb-2">Blood Glucose Pattern</h3>
              <p className="text-sm mb-3">
                Our AI has detected a pattern of elevated blood glucose readings in the evenings. 
                This may be related to your dinner choices.
              </p>
              <Badge variant="outline" className="text-amber-500 border-amber-500">
                Lifestyle Suggestion
              </Badge>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/30">
              <h3 className="font-medium mb-2">Medication Efficacy</h3>
              <p className="text-sm mb-3">
                Your response to Metformin appears optimal based on your recent lab results. 
                Continue with current dosage.
              </p>
              <Badge variant="outline" className="text-green-500 border-green-500">
                Treatment Working Well
              </Badge>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/30">
              <h3 className="font-medium mb-2">Exercise Impact</h3>
              <p className="text-sm mb-3">
                We've noticed your blood pressure readings improve significantly on days with recorded physical activity.
              </p>
              <Badge variant="outline" className="text-blue-500 border-blue-500">
                Positive Correlation
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIDiagnosticsTab;
