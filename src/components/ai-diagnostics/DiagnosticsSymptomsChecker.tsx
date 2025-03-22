import React, { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Brain, Activity, AlertTriangle, Thermometer, ArrowRight, ListChecks, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TensorflowContext } from "./ModelStatusIndicator";
import { encodeSymptoms, predictConditions } from "@/utils/tensorflowModels";

// Sample symptoms
const COMMON_SYMPTOMS = [
  "Fever", "Headache", "Cough", "Fatigue", "Nausea", 
  "Sore throat", "Chest pain", "Abdominal pain", "Back pain", 
  "Shortness of breath", "Dizziness", "Vomiting"
];

const DiagnosticsSymptomsChecker = () => {
  const { symptomModel, modelsLoaded } = useContext(TensorflowContext);
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

  const analyzeSymptoms = async () => {
    if (symptoms.length === 0) {
      toast.error("Please add at least one symptom");
      return;
    }

    if (!modelsLoaded || !symptomModel) {
      toast.error("TensorFlow models are still loading. Please wait.");
      return;
    }

    setAnalyzing(true);
    
    try {
      // Encode symptoms for the model
      const encodedSymptoms = encodeSymptoms(symptoms, COMMON_SYMPTOMS);
      
      // Get predictions from the model
      const predictions = await predictConditions(symptomModel, encodedSymptoms);
      
      // Filter predictions to only include those with reasonable probability
      const filteredPredictions = predictions
        .filter(p => p.probability > 0.15)
        .slice(0, 4); // Take top 4 predictions
      
      // Determine severity based on symptoms and predicted conditions
      let severity: "low" | "medium" | "high" = "low";
      
      if (symptoms.includes("Shortness of breath") || symptoms.includes("Chest pain")) {
        severity = "high";
      } else if (symptoms.includes("Fever") && (symptoms.includes("Cough") || symptoms.includes("Fatigue"))) {
        severity = "medium";
      }
      
      // Generate appropriate recommendations based on symptoms and severity
      const recommendedActions: string[] = [];
      
      if (severity === "high") {
        recommendedActions.push("Seek immediate medical attention");
      }
      
      if (symptoms.includes("Fever")) {
        recommendedActions.push("Rest and stay hydrated", "Take acetaminophen or ibuprofen for fever");
      }
      
      if (symptoms.includes("Headache")) {
        recommendedActions.push("Rest in a quiet, dark room", "Consider over-the-counter pain relievers");
      }
      
      if (severity === "medium") {
        recommendedActions.push("Monitor symptoms for 48 hours", "Consider seeing a healthcare provider if symptoms worsen");
      } else if (severity === "low") {
        recommendedActions.push("Monitor your symptoms", "Rest as needed");
      }
      
      // Add a generic recommendation
      recommendedActions.push("Contact healthcare provider if symptoms persist or worsen");
      
      // Remove duplicates from recommendations
      const uniqueRecommendations = [...new Set(recommendedActions)];
      
      setResult({
        possibleConditions: filteredPredictions,
        recommendedActions: uniqueRecommendations,
        severity
      });

    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      toast.error("An error occurred while analyzing symptoms");
    } finally {
      setAnalyzing(false);
    }
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
            TensorFlow.js Symptom Checker
          </CardTitle>
          <CardDescription>
            Select your symptoms for a TensorFlow.js powered health assessment, even without internet connection
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
              disabled={symptoms.length === 0 || analyzing || !modelsLoaded}
              className="w-full bg-kwecare-primary hover:bg-kwecare-primary/90"
            >
              {analyzing ? (
                <>
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing with TensorFlow.js...
                </>
              ) : !modelsLoaded ? (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Waiting for TensorFlow.js...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze Symptoms with TensorFlow.js
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
