
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Brain, Activity, AlertTriangle, Thermometer, ArrowRight, ListChecks, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Sample symptoms
const COMMON_SYMPTOMS = [
  "Fever", "Headache", "Cough", "Fatigue", "Nausea", 
  "Sore throat", "Chest pain", "Abdominal pain", "Back pain", 
  "Shortness of breath", "Dizziness", "Vomiting"
];

const DiagnosticsSymptomsChecker = () => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    possibleConditions: Array<{condition: string, probability: number}>,
    recommendedActions: string[],
    severity: "low" | "medium" | "high"
  } | null>(null);

  const addSymptom = (symptom: string) => {
    if (symptom && !symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
      setCustomSymptom("");
    }
  };

  const removeSymptom = (symptomToRemove: string) => {
    setSymptoms(symptoms.filter(s => s !== symptomToRemove));
  };

  const handleCustomSymptomAdd = () => {
    if (customSymptom.trim()) {
      addSymptom(customSymptom.trim());
    }
  };

  const analyzeSymptoms = () => {
    if (symptoms.length === 0) {
      toast.error("Please add at least one symptom");
      return;
    }

    setAnalyzing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Mock result - in a real app, this would be from the TensorFlow model
      let mockResult = {
        possibleConditions: [] as Array<{condition: string, probability: number}>,
        recommendedActions: [] as string[],
        severity: "low" as "low" | "medium" | "high"
      };
      
      // Logic to generate different results based on symptoms
      if (symptoms.includes("Fever")) {
        if (symptoms.includes("Cough") && symptoms.includes("Fatigue")) {
          mockResult.possibleConditions.push(
            {condition: "Common Cold", probability: 0.65},
            {condition: "Influenza", probability: 0.45},
            {condition: "COVID-19", probability: 0.30}
          );
          mockResult.recommendedActions = [
            "Rest and stay hydrated",
            "Take acetaminophen or ibuprofen for fever",
            "Monitor symptoms for 48 hours",
            "Consider seeing a healthcare provider if symptoms worsen"
          ];
          mockResult.severity = "medium";
        } else {
          mockResult.possibleConditions.push(
            {condition: "Viral Infection", probability: 0.75},
            {condition: "Bacterial Infection", probability: 0.35}
          );
          mockResult.recommendedActions = [
            "Rest and hydrate",
            "Take fever-reducing medication if needed",
            "Monitor temperature"
          ];
          mockResult.severity = "low";
        }
      }
      
      if (symptoms.includes("Headache")) {
        mockResult.possibleConditions.push(
          {condition: "Tension Headache", probability: 0.55},
          {condition: "Migraine", probability: 0.25}
        );
        mockResult.recommendedActions.push(
          "Rest in a quiet, dark room",
          "Consider over-the-counter pain relievers"
        );
      }
      
      if (symptoms.includes("Shortness of breath")) {
        mockResult.possibleConditions.push(
          {condition: "Respiratory Infection", probability: 0.60},
          {condition: "Asthma", probability: 0.40},
          {condition: "Anxiety", probability: 0.35}
        );
        mockResult.recommendedActions = [
          "Seek immediate medical attention if severe",
          "Use prescribed inhaler if you have asthma",
          "Practice deep breathing exercises if mild"
        ];
        mockResult.severity = "high";
      }
      
      // Make sure we have at least some basic result
      if (mockResult.possibleConditions.length === 0) {
        mockResult.possibleConditions.push(
          {condition: "Minor Health Issue", probability: 0.65},
        );
        mockResult.recommendedActions = [
          "Monitor your symptoms",
          "Rest as needed",
          "Contact healthcare provider if symptoms persist or worsen"
        ];
      }
      
      setResult(mockResult);
      setAnalyzing(false);
    }, 2500);
  };
  
  const resetAnalysis = () => {
    setSymptoms([]);
    setResult(null);
  };

  return (
    <div className="animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-kwecare-primary" />
            AI Symptom Checker
          </CardTitle>
          <CardDescription>
            Select your symptoms for an AI-powered health assessment, even without internet connection
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!result ? (
            <>
              <div className="mb-6">
                <h3 className="text-base font-medium mb-2">Your Symptoms</h3>
                <div className="flex flex-wrap gap-2 min-h-12 p-2 border rounded-md bg-muted/20">
                  {symptoms.length > 0 ? (
                    symptoms.map((symptom) => (
                      <Badge 
                        key={symptom} 
                        variant="secondary"
                        className="px-3 py-1 flex items-center"
                      >
                        {symptom}
                        <button 
                          className="ml-2 text-muted-foreground hover:text-foreground"
                          onClick={() => removeSymptom(symptom)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm p-2">No symptoms selected yet</p>
                  )}
                </div>
              </div>
              
              <Tabs defaultValue="common">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="common">Common Symptoms</TabsTrigger>
                  <TabsTrigger value="custom">Custom Symptom</TabsTrigger>
                </TabsList>
                
                <TabsContent value="common">
                  <ScrollArea className="h-64 border rounded-md p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {COMMON_SYMPTOMS.map((symptom) => (
                        <Button
                          key={symptom}
                          variant={symptoms.includes(symptom) ? "default" : "outline"}
                          className={`justify-start ${symptoms.includes(symptom) ? 'bg-kwecare-primary hover:bg-kwecare-primary/90' : ''}`}
                          onClick={() => symptoms.includes(symptom) ? removeSymptom(symptom) : addSymptom(symptom)}
                        >
                          {symptom}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="custom">
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={customSymptom}
                      onChange={(e) => setCustomSymptom(e.target.value)}
                      placeholder="Enter another symptom..."
                      onKeyDown={(e) => e.key === 'Enter' && handleCustomSymptomAdd()}
                    />
                    <Button onClick={handleCustomSymptomAdd}>Add</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Type any additional symptoms that aren't listed in the common symptoms tab
                  </p>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Analysis Results</h3>
                <Button variant="ghost" size="sm" onClick={resetAnalysis} className="flex items-center gap-1">
                  <RotateCw className="h-3.5 w-3.5" />
                  New Analysis
                </Button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">Analyzed Symptoms:</h4>
                  <div className="flex flex-wrap gap-1">
                    {symptoms.map((s, i) => (
                      <span key={s} className="text-sm">
                        {s}{i < symptoms.length - 1 ? "," : ""}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className={`p-3 rounded-md mb-4 flex items-center gap-2 ${
                  result.severity === 'low' ? 'bg-green-100 text-green-800' :
                  result.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  <AlertTriangle className="h-5 w-5" />
                  <span>
                    {result.severity === 'low' ? 'Low severity - likely manageable at home' :
                     result.severity === 'medium' ? 'Medium severity - monitor closely and consider consultation' :
                     'High severity - recommended to seek medical attention'}
                  </span>
                </div>
              </div>
              
              <div className="grid gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-kwecare-primary" />
                    Possible Conditions
                  </h4>
                  <ul className="space-y-2">
                    {result.possibleConditions.map((item) => (
                      <li key={item.condition} className="flex items-center justify-between p-2 border rounded-md">
                        <span>{item.condition}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-kwecare-primary"
                              style={{ width: `${item.probability * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{Math.round(item.probability * 100)}%</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    This is not a diagnosis. Consult with a healthcare professional for proper medical advice.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-kwecare-primary" />
                    Recommended Actions
                  </h4>
                  <ul className="space-y-1">
                    {result.recommendedActions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 mt-0.5 text-kwecare-primary" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        {!result && (
          <CardFooter>
            <Button 
              onClick={analyzeSymptoms}
              disabled={symptoms.length === 0 || analyzing}
              className="w-full bg-kwecare-primary hover:bg-kwecare-primary/90"
            >
              {analyzing ? (
                <>
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze Symptoms
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

// Re-export Badge component from UI components
const Badge = ({ children, className, variant = "default" }: { children: React.ReactNode, className?: string, variant?: "default" | "secondary" | "destructive" | "outline" }) => {
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
      variant === 'secondary' ? 'border-transparent bg-secondary text-secondary-foreground' :
      variant === 'destructive' ? 'border-transparent bg-destructive text-destructive-foreground' :
      variant === 'outline' ? 'text-foreground border' :
      'border-transparent bg-primary text-primary-foreground'
    } ${className}`}>
      {children}
    </div>
  );
};

export default DiagnosticsSymptomsChecker;
