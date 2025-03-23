import React, { useState, useContext } from 'react';
import { Brain, Activity, AlertTriangle, ArrowRight, Info } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TensorflowContext } from '@/components/ai-diagnostics/ModelStatusIndicator';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { encodeSymptoms, predictConditions } from '@/utils/tensorflowModels';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

// Common symptoms for quick check
const QUICK_SYMPTOMS = [
  "Fever", "Headache", "Cough", "Fatigue", "Sore throat"
];

const AIDiagnosticsWidget = () => {
  const navigate = useNavigate();
  const { symptomModel, modelsLoaded } = useContext(TensorflowContext);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [quickResult, setQuickResult] = useState<{condition: string, probability: number} | null>(null);
  const [checking, setChecking] = useState(false);

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const runQuickCheck = async () => {
    if (selectedSymptoms.length === 0) {
      toast.error("Please select at least one symptom");
      return;
    }

    if (!modelsLoaded || !symptomModel) {
      toast.error("TensorFlow models are still loading");
      return;
    }

    setChecking(true);
    try {
      const encodedSymptoms = encodeSymptoms(selectedSymptoms, QUICK_SYMPTOMS.concat(
        "Chest pain", "Abdominal pain", "Back pain", 
        "Shortness of breath", "Dizziness", "Vomiting", "Nausea"
      ));
      
      const predictions = await predictConditions(symptomModel, encodedSymptoms);
      
      // Take top result
      if (predictions.length > 0) {
        setQuickResult(predictions[0]);
      }
    } catch (error) {
      console.error("Error in quick check:", error);
      toast.error("Couldn't complete the quick check");
    } finally {
      setChecking(false);
    }
  };

  const resetCheck = () => {
    setSelectedSymptoms([]);
    setQuickResult(null);
  };

  return (
    <Card className="shadow-sm border border-gray-200/50 overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-kwecare-primary" />
            TensorFlow.js Quick Check
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-blue-100/50 text-blue-700 border-blue-200 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Offline AI
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-[200px]">
                  Runs directly in your browser using TensorFlow.js.
                  No data is sent to external servers.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {!quickResult ? (
          <>
            <p className="text-sm text-muted-foreground mb-3">
              Select your symptoms for a quick AI assessment
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {QUICK_SYMPTOMS.map(symptom => (
                <Button
                  key={symptom}
                  size="sm"
                  variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                  className={`text-xs ${selectedSymptoms.includes(symptom) ? 'bg-kwecare-primary hover:bg-kwecare-primary/90' : ''}`}
                  onClick={() => toggleSymptom(symptom)}
                >
                  {symptom}
                </Button>
              ))}
            </div>
            
            <div className="flex justify-between gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                disabled={selectedSymptoms.length === 0}
                onClick={resetCheck}
              >
                Reset
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-kwecare-primary hover:bg-kwecare-primary/90"
                disabled={selectedSymptoms.length === 0 || checking || !modelsLoaded}
                onClick={runQuickCheck}
              >
                {checking ? "Analyzing..." : "Check Symptoms"}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-2">
            <div className="mb-4">
              <h4 className="text-md font-medium">Possible Condition</h4>
              <div className="flex justify-center items-center mt-2">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-kwecare-primary/10 border-4 border-kwecare-primary/20 text-kwecare-primary mb-2">
                  <Activity className="h-10 w-10" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mt-2">{quickResult.condition}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Probability: {Math.round(quickResult.probability * 100)}%
              </p>
              
              <Separator className="my-4" />
              
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-2 mb-3 flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800 text-left">
                  This is a preliminary assessment only. Please consult with a healthcare professional for proper diagnosis and treatment.
                </p>
              </div>
              
              <div className="flex justify-between gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={resetCheck}
                >
                  New Check
                </Button>
                <Button 
                  size="sm"
                  className="flex-1 bg-kwecare-primary hover:bg-kwecare-primary/90"
                  onClick={() => navigate('/ai-diagnostics')}
                >
                  Detailed Analysis
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-sm"
          onClick={() => navigate('/ai-diagnostics')}
        >
          <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
          Advanced AI Diagnostics
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIDiagnosticsWidget;
