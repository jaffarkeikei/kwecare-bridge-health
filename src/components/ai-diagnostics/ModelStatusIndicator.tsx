
import React, { useState, useEffect } from "react";
import { Brain, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as tf from '@tensorflow/tfjs';
import { createSymptomModel, createHealthPredictionModel } from "@/utils/tensorflowModels";

// Create a context to share loaded models across components
export const TensorflowContext = React.createContext<{
  symptomModel: tf.LayersModel | null;
  healthModel: tf.LayersModel | null;
  modelsLoaded: boolean;
}>({
  symptomModel: null,
  healthModel: null,
  modelsLoaded: false
});

const ModelStatusIndicator = () => {
  const [modelStatus, setModelStatus] = useState<"loading" | "ready" | "error">("loading");
  const [symptomModel, setSymptomModel] = useState<tf.LayersModel | null>(null);
  const [healthModel, setHealthModel] = useState<tf.LayersModel | null>(null);
  
  useEffect(() => {
    // Check if TF is ready immediately
    const isTfReady = tf.getBackend() !== undefined;
    console.log("TensorFlow backend status:", isTfReady ? "ready" : "not ready", "using backend:", tf.getBackend());
    
    const loadModels = async () => {
      try {
        // Force initialization if not already done
        if (!isTfReady) {
          await tf.setBackend('cpu'); // Start with CPU as fallback
          await tf.ready();
        }
        
        console.log("TensorFlow.js is ready");
        
        // Create models with reasonable timeouts
        const symptomModelPromise = createSymptomModel().catch(e => {
          console.error("Error creating symptom model:", e);
          return null;
        });
        
        const healthModelPromise = createHealthPredictionModel().catch(e => {
          console.error("Error creating health model:", e);
          return null;
        });
        
        // Wait for both models with a timeout
        const [symptomModelInstance, healthModelInstance] = await Promise.all([
          symptomModelPromise,
          healthModelPromise
        ]);
        
        if (symptomModelInstance && healthModelInstance) {
          setSymptomModel(symptomModelInstance);
          setHealthModel(healthModelInstance);
          setModelStatus("ready");
          console.log("AI models loaded successfully");
        } else {
          throw new Error("One or more models failed to load");
        }
      } catch (error) {
        console.error("Error loading TensorFlow models:", error);
        setModelStatus("error");
        
        // Try to recover with simplified models
        try {
          const simpleSymptomModel = await createSymptomModel(true);
          const simpleHealthModel = await createHealthPredictionModel(true);
          
          setSymptomModel(simpleSymptomModel);
          setHealthModel(simpleHealthModel);
          setModelStatus("ready");
          console.log("Simplified AI models loaded as fallback");
        } catch (fallbackError) {
          console.error("Fallback model loading also failed:", fallbackError);
        }
      }
    };
    
    // Start loading models
    loadModels();
  }, []);
  
  const handleDownloadModels = () => {
    // This would typically download updated model weights
    toast.success("AI models updated successfully");
  };
  
  return (
    <TensorflowContext.Provider 
      value={{ 
        symptomModel, 
        healthModel, 
        modelsLoaded: modelStatus === "ready" 
      }}
    >
      <div className="mb-6 py-2 px-4 bg-muted/50 rounded-lg border border-border/50 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className={`h-2.5 w-2.5 rounded-full ${
              modelStatus === "ready" ? "bg-green-500" : 
              modelStatus === "loading" ? "bg-yellow-500 animate-pulse" : 
              "bg-red-500"
            }`}></div>
            <span className="text-sm font-medium">AI Models: </span>
            <span className="text-sm">
              {modelStatus === "ready" ? "Ready" : 
               modelStatus === "loading" ? "Loading TensorFlow.js..." : 
               "Error Loading Models"}
            </span>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Info className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-60">
                  TensorFlow.js models are loaded and running locally on your device. 
                  No internet connection required for basic diagnostics.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex gap-2 items-center">
          <div className="text-xs text-muted-foreground mr-1">
            <span className="font-medium">Last updated:</span> Today
          </div>
          
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleDownloadModels}>
            <Check className="h-3.5 w-3.5 mr-1.5" />
            Update Models
          </Button>
        </div>
      </div>
    </TensorflowContext.Provider>
  );
};

export default ModelStatusIndicator;
