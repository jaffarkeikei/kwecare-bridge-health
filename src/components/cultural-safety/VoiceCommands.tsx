I need to provide the full code for the VoiceCommands.tsx file, replacing the comments with the actual code. Since I don't have the full original file, I'll need to make some assumptions about the structure based on the error information provided. Here's the complete code:

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface VoiceCommandsProps {
  onCommand?: (command: string) => void;
}

const VoiceCommands: React.FC<VoiceCommandsProps> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [transcriptText, setTranscriptText] = useState<string>("");
  const [supportsSpeechRecognition, setSupportsSpeechRecognition] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupportsSpeechRecognition(false);
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcriptArray = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join(' ');
      
      setTranscript(transcriptArray);
      
      // Check for commands in the transcript
      processCommands(transcriptArray);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        toast.error("Microphone access denied. Please enable microphone permissions.");
      } else if (event.error === 'no-speech') {
        toast.info("No speech detected. Please try again.");
      } else {
        toast.error(`Speech recognition error: ${event.error}`);
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!supportsSpeechRecognition) {
      toast.error("Your browser doesn't support speech recognition");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript("");
      recognitionRef.current.start();
      toast.info("Listening for voice commands...");
    }
  };

  const processCommands = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Example command processing
    if (lowerText.includes("show medications") || lowerText.includes("view medications")) {
      if (onCommand) onCommand("medications");
      toast.success("Opening medications");
    } else if (lowerText.includes("show appointments") || lowerText.includes("view appointments")) {
      if (onCommand) onCommand("appointments");
      toast.success("Opening appointments");
    } else if (lowerText.includes("show lab results") || lowerText.includes("view lab results")) {
      if (onCommand) onCommand("lab-results");
      toast.success("Opening lab results");
    } else if (lowerText.includes("help") || lowerText.includes("what can i say")) {
      toast.info("You can say: 'Show medications', 'Show appointments', or 'Show lab results'");
    }
  };

  const exampleCommands = [
    "Show medications",
    "View appointments",
    "Show lab results",
    "What can I say?"
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Voice Commands
        </CardTitle>
        <CardDescription>
          Speak to navigate the application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-center">
            <Button
              onClick={toggleListening}
              variant={isListening ? "destructive" : "default"}
              size="lg"
              className="rounded-full h-16 w-16 flex items-center justify-center"
              disabled={!supportsSpeechRecognition}
            >
              {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isListening ? "Listening..." : "Click the microphone to start"}
            </p>
          </div>
          
          {transcript && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">You said:</p>
              <p>{transcript as string}</p>
            </div>
          )}
          
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Example commands:</p>
            <div className="flex flex-wrap gap-2">
              {exampleCommands.map((command, i) => (
                <Badge key={i} variant="outline">{command}</Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          {supportsSpeechRecognition 
            ? "Voice recognition is available" 
            : "Your browser doesn't support voice recognition"}
        </p>
      </CardFooter>
    </Card>
  );
};

export default VoiceCommands;
