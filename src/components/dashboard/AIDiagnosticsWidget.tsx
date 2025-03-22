
import React, { useState, useContext } from 'react';
import { Brain, Activity, AlertTriangle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TensorflowContext } from '@/components/ai-diagnostics/ModelStatusIndicator';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { encodeSymptoms, predictConditions } from '@/utils/tensorflowModels';

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
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-kwecare-primary" />
            TensorFlow.js Quick Check
          </CardTitle>
          <Badge variant="outline" className="bg-blue-100/50 text-blue-700 border-blue-200">
            Offline AI
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        {!quickResult ? (
          <>
            <p className="text-sm text-muted-foreground mb-3">
              Select symptoms for a quick AI assessment
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
          </>
        ) : (
          <div className="animate-fade-in space-y-3">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium">Quick Result:</h4>
              <span className="text-sm font-semibold">
                {quickResult.condition}
              </span>
              <span className="text-xs text-muted-foreground">
                ({Math.round(quickResult.probability * 100)}% match)
              </span>
            </div>
            
            <div className="flex items-start gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-500" />
              <p className="text-xs text-muted-foreground">
                This is a preliminary result. For a comprehensive analysis, use the full AI Diagnostics tool.
              </p>
            </div>
            
            <div className="pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={resetCheck}
              >
                Check Another
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex gap-2">
        {!quickResult ? (
          <Button 
            className="w-full bg-kwecare-primary hover:bg-kwecare-primary/90"
            size="sm"
            disabled={selectedSymptoms.length === 0 || checking || !modelsLoaded}
            onClick={runQuickCheck}
          >
            {checking ? 'Analyzing...' : 'Quick Check'}
          </Button>
        ) : null}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => navigate('/ai-diagnostics')}
        >
          <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
          Full Diagnostics
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIDiagnosticsWidget;
