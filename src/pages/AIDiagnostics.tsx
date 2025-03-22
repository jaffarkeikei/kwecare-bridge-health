
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Brain, AlertTriangle, Thermometer, Stethoscope, Activity } from "lucide-react";
import { toast } from "sonner";
import DiagnosticsSymptomsChecker from "@/components/ai-diagnostics/DiagnosticsSymptomsChecker";
import HealthPredictions from "@/components/ai-diagnostics/HealthPredictions";
import ModelStatusIndicator from "@/components/ai-diagnostics/ModelStatusIndicator";

const AIDiagnostics = () => {
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<"symptoms" | "predictions" | null>(null);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <main className="flex-1 pt-6 px-4 md:px-6 pb-16 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">TensorFlow.js Diagnostics</h1>
              <Badge variant="outline" className="bg-green-100/50 text-green-700 border-green-200">
                Offline Available
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              TensorFlow.js-powered health analysis that works locally in your browser
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
          </div>
        </div>
        
        <ModelStatusIndicator />
        
        {!activeTool ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 animate-fade-in">
            <DiagnosticToolCard 
              icon={<Stethoscope className="h-10 w-10 text-kwecare-primary" />}
              title="TensorFlow.js Symptom Checker"
              description="Analyze your symptoms with a browser-based neural network that works offline."
              onClick={() => setActiveTool("symptoms")}
              badge="TensorFlow.js"
            />
            
            <DiagnosticToolCard 
              icon={<Activity className="h-10 w-10 text-kwecare-primary" />}
              title="TensorFlow.js Health Predictions"
              description="Identify risks for diabetes, hypertension and other conditions using machine learning."
              onClick={() => setActiveTool("predictions")}
              badge="Neural Network"
            />
          </div>
        ) : (
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setActiveTool(null)} 
              className="mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Tools
            </Button>
            
            {activeTool === "symptoms" && <DiagnosticsSymptomsChecker />}
            {activeTool === "predictions" && <HealthPredictions />}
          </div>
        )}
      </main>
    </div>
  );
};

const DiagnosticToolCard = ({ 
  icon, 
  title, 
  description, 
  onClick,
  badge
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  onClick: () => void;
  badge: string;
}) => {
  return (
    <Card className="hover:border-kwecare-primary/20 transition-all duration-300 animate-fade-in overflow-hidden">
      <CardHeader className="pb-2 relative">
        <div className="absolute top-4 right-4">
          <Badge variant="outline" className="bg-blue-100/50 text-blue-700 border-blue-200">
            {badge}
          </Badge>
        </div>
        <div className="mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardFooter className="pt-2">
        <Button 
          className="bg-kwecare-primary hover:bg-kwecare-primary/90 w-full"
          onClick={onClick}
        >
          Launch Tool
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIDiagnostics;
