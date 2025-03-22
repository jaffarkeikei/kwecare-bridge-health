
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Activity, AlertTriangle, Heart, BarChart2, Droplet, Weight, RotateCw, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

const HealthPredictions = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [healthData, setHealthData] = useState({
    age: 35,
    systolic: 120,
    diastolic: 80,
    bloodSugar: 100,
    weight: 70,
    height: 170,
    cholesterol: 180,
  });
  
  const [risks, setRisks] = useState({
    diabetes: 0,
    hypertension: 0,
    heartDisease: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHealthData({
      ...healthData,
      [name]: parseFloat(value) || 0,
    });
  };
  
  const bmi = healthData.weight / Math.pow(healthData.height / 100, 2);
  
  const analyzeHealth = () => {
    setAnalyzing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Calculate diabetes risk (simplified algorithm for demo)
      const diabetesRisk = calculateRisk(
        healthData.bloodSugar / 100, // normalized blood sugar
        bmi > 25 ? (bmi > 30 ? 0.3 : 0.2) : 0.1, // BMI factor
        healthData.age > 40 ? 0.15 : 0.05, // age factor
      );
      
      // Calculate hypertension risk
      const hypertensionRisk = calculateRisk(
        (healthData.systolic - 110) / 40, // normalized systolic
        (healthData.diastolic - 70) / 20, // normalized diastolic
        healthData.age > 50 ? 0.2 : 0.1, // age factor
      );
      
      // Calculate heart disease risk
      const heartRisk = calculateRisk(
        (healthData.cholesterol - 150) / 100, // normalized cholesterol
        hypertensionRisk * 0.5, // hypertension contribution
        bmi > 25 ? (bmi > 30 ? 0.25 : 0.15) : 0.05, // BMI factor
      );
      
      setRisks({
        diabetes: Math.min(Math.max(diabetesRisk, 0.05), 0.95),
        hypertension: Math.min(Math.max(hypertensionRisk, 0.05), 0.95),
        heartDisease: Math.min(Math.max(heartRisk, 0.05), 0.95),
      });
      
      setAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };
  
  // Helper function to calculate risk with multiple factors
  const calculateRisk = (...factors: number[]) => {
    return factors.reduce((acc, factor) => acc + factor, 0) / factors.length;
  };
  
  const resetAnalysis = () => {
    setShowResults(false);
  };
  
  const getRiskLevel = (risk: number) => {
    if (risk < 0.3) return { level: "Low", color: "bg-green-500" };
    if (risk < 0.6) return { level: "Moderate", color: "bg-yellow-500" };
    return { level: "High", color: "bg-red-500" };
  };
  
  const getRecommendations = () => {
    const recommendations = [];
    
    // Diabetes recommendations
    if (risks.diabetes > 0.3) {
      recommendations.push("Monitor blood sugar levels regularly");
      if (risks.diabetes > 0.6) {
        recommendations.push("Consider consulting with a healthcare provider about diabetes risk");
      }
    }
    
    // Hypertension recommendations
    if (risks.hypertension > 0.3) {
      recommendations.push("Monitor blood pressure regularly");
      if (risks.hypertension > 0.6) {
        recommendations.push("Consider lifestyle changes to lower blood pressure");
      }
    }
    
    // Heart disease recommendations
    if (risks.heartDisease > 0.3) {
      recommendations.push("Consider having your cholesterol checked regularly");
    }
    
    // General recommendations
    if (bmi > 25) {
      recommendations.push("Consider physical activity and dietary changes to achieve a healthier weight");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("Continue maintaining your healthy lifestyle");
    }
    
    return recommendations;
  };

  return (
    <div className="animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-kwecare-primary" />
            Health Risk Assessment
          </CardTitle>
          <CardDescription>
            Evaluate your risk for common health conditions based on your vital measurements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showResults ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Age</label>
                  <div className="flex items-center gap-2">
                    <Slider
                      min={18}
                      max={90}
                      step={1}
                      value={[healthData.age]}
                      onValueChange={(values) => setHealthData({...healthData, age: values[0]})}
                    />
                    <Input
                      type="number"
                      name="age"
                      value={healthData.age}
                      onChange={handleInputChange}
                      className="w-20"
                    />
                  </div>
                </div>
              
                <div>
                  <label className="text-sm font-medium mb-1 block">Height (cm)</label>
                  <div className="flex items-center gap-2">
                    <Slider
                      min={120}
                      max={220}
                      step={1}
                      value={[healthData.height]}
                      onValueChange={(values) => setHealthData({...healthData, height: values[0]})}
                    />
                    <Input
                      type="number"
                      name="height"
                      value={healthData.height}
                      onChange={handleInputChange}
                      className="w-20"
                    />
                  </div>
                </div>
              
                <div>
                  <label className="text-sm font-medium mb-1 block">Weight (kg)</label>
                  <div className="flex items-center gap-2">
                    <Slider
                      min={40}
                      max={150}
                      step={1}
                      value={[healthData.weight]}
                      onValueChange={(values) => setHealthData({...healthData, weight: values[0]})}
                    />
                    <Input
                      type="number"
                      name="weight"
                      value={healthData.weight}
                      onChange={handleInputChange}
                      className="w-20"
                    />
                  </div>
                </div>
              
                <div>
                  <label className="text-sm font-medium mb-1 block">Blood Sugar (mg/dL)</label>
                  <div className="flex items-center gap-2">
                    <Slider
                      min={70}
                      max={200}
                      step={1}
                      value={[healthData.bloodSugar]}
                      onValueChange={(values) => setHealthData({...healthData, bloodSugar: values[0]})}
                    />
                    <Input
                      type="number"
                      name="bloodSugar"
                      value={healthData.bloodSugar}
                      onChange={handleInputChange}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Systolic BP (mmHg)</label>
                  <div className="flex items-center gap-2">
                    <Slider
                      min={90}
                      max={180}
                      step={1}
                      value={[healthData.systolic]}
                      onValueChange={(values) => setHealthData({...healthData, systolic: values[0]})}
                    />
                    <Input
                      type="number"
                      name="systolic"
                      value={healthData.systolic}
                      onChange={handleInputChange}
                      className="w-20"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Diastolic BP (mmHg)</label>
                  <div className="flex items-center gap-2">
                    <Slider
                      min={60}
                      max={120}
                      step={1}
                      value={[healthData.diastolic]}
                      onValueChange={(values) => setHealthData({...healthData, diastolic: values[0]})}
                    />
                    <Input
                      type="number"
                      name="diastolic"
                      value={healthData.diastolic}
                      onChange={handleInputChange}
                      className="w-20"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Total Cholesterol (mg/dL)</label>
                  <div className="flex items-center gap-2">
                    <Slider
                      min={120}
                      max={300}
                      step={1}
                      value={[healthData.cholesterol]}
                      onValueChange={(values) => setHealthData({...healthData, cholesterol: values[0]})}
                    />
                    <Input
                      type="number"
                      name="cholesterol"
                      value={healthData.cholesterol}
                      onChange={handleInputChange}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-muted p-3 rounded-md text-sm">
                <div className="font-medium mb-1 flex items-center gap-1">
                  <Weight className="h-4 w-4" />
                  Calculated BMI: {bmi.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {bmi < 18.5 ? "Underweight" : 
                   bmi < 25 ? "Normal weight" :
                   bmi < 30 ? "Overweight" : "Obese"}
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Risk Assessment Results</h3>
                <Button variant="ghost" size="sm" onClick={resetAnalysis} className="flex items-center gap-1">
                  <RotateCw className="h-3.5 w-3.5" />
                  New Assessment
                </Button>
              </div>
              
              <div className="space-y-6">
                <RiskMeter 
                  risk={risks.diabetes} 
                  title="Type 2 Diabetes Risk" 
                  icon={<Droplet className="h-4 w-4" />} 
                />
                
                <RiskMeter 
                  risk={risks.hypertension} 
                  title="Hypertension Risk" 
                  icon={<Activity className="h-4 w-4" />} 
                />
                
                <RiskMeter 
                  risk={risks.heartDisease} 
                  title="Heart Disease Risk" 
                  icon={<Heart className="h-4 w-4" />} 
                />
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Recommendations</h4>
                <div className="bg-muted/50 p-3 rounded-md space-y-2">
                  {getRecommendations().map((rec, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-kwecare-primary" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3 italic">
                  This is not a medical diagnosis. Always consult with healthcare professionals for medical advice.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        
        {!showResults && (
          <CardFooter>
            <Button 
              onClick={analyzeHealth}
              disabled={analyzing}
              className="w-full bg-kwecare-primary hover:bg-kwecare-primary/90"
            >
              {analyzing ? (
                <>
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Analyze Health Data
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

const RiskMeter = ({ risk, title, icon }: { risk: number; title: string; icon: React.ReactNode }) => {
  const { level, color } = getRiskLevel(risk);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">
          {icon}
          <span className="text-sm font-medium">{title}</span>
        </div>
        <Badge 
          variant={level === "Low" ? "outline" : "default"}
          className={`${
            level === "Low" ? "bg-green-100 text-green-800 border-green-200" :
            level === "Moderate" ? "bg-yellow-500 border-yellow-600" :
            "bg-red-500 border-red-600"
          }`}
        >
          {level} Risk
        </Badge>
      </div>
      <div className="relative">
        <Progress value={risk * 100} className="h-2" />
        <div 
          className={`absolute top-0 h-3 w-1 ${color}`} 
          style={{ left: `${risk * 100}%`, transform: 'translateX(-50%)' }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>Low</span>
        <span>Moderate</span>
        <span>High</span>
      </div>
    </div>
  );
};

const getRiskLevel = (risk: number) => {
  if (risk < 0.3) return { level: "Low", color: "bg-green-500" };
  if (risk < 0.6) return { level: "Moderate", color: "bg-yellow-500" };
  return { level: "High", color: "bg-red-500" };
};

export default HealthPredictions;
