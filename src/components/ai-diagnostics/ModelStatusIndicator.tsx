
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

const ModelStatusIndicator = () => {
  const [modelStatus, setModelStatus] = useState<"loading" | "ready" | "error">("loading");
  
  useEffect(() => {
    // Simulate model loading
    const timer = setTimeout(() => {
      setModelStatus("ready");
      console.log("AI models loaded successfully");
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleDownloadModels = () => {
    toast.success("AI models downloaded successfully");
  };
  
  return (
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
             modelStatus === "loading" ? "Loading..." : 
             "Error"}
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
                AI models are loaded and running locally on your device. 
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
  );
};

export default ModelStatusIndicator;
