
import React, { useState } from "react";
import { Mic, MicOff, Play, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import type { IndigenousLanguage } from "./LanguageSelector";

interface VoiceCommandsProps {
  language: IndigenousLanguage;
}

const VoiceCommands = ({ language }: VoiceCommandsProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isPlayingExample, setIsPlayingExample] = useState(false);
  
  // Example commands in different languages 
  const exampleCommands = {
    english: {
      checkBloodPressure: "Check my blood pressure",
      scheduleAppointment: "Schedule appointment with doctor",
      medicationReminder: "Set medication reminder",
    },
    cree: {
      checkBloodPressure: "ᓇᓇᑲᒋᑕ ᒥᐢᑯ ᒪᐦᑎᓀᐃᐧᑲᓇᐤ",
      scheduleAppointment: "ᐅᓇᐢᑕᐃᐧᓇ ᑭᐊᐧᐸᒪᐟ ᒪᐢᑭᑭᐃᐧᓂᓂᐤ",
      medicationReminder: "ᑭᐢᑭᓯᑐᑕᐃᐧᐣ ᒪᐢᑭᑭᐃᐧᓇ",
    },
    inuktitut: {
      checkBloodPressure: "ᖃᐅᔨᓴᕐᓗᒍ ᐊᐅᑉ ᐅᖁᒪᐃᓐᓂᖓ",
      scheduleAppointment: "ᐋᖅᑭᒃᓱᐃᓗᓂ ᓘᒃᑖᒧᐊᕐᓂᕐᒧᑦ",
      medicationReminder: "ᐃᖅᑲᐃᑎᑦᑎᔾᔪᑎᒥᒃ ᐋᓐᓂᐊᕐᓇᙱᑦᑐᓕᕆᓂᕐᒧᑦ ᐋᖅᑭᒃᓯᓗᓂ",
    },
    ojibwe: {
      checkBloodPressure: "Ganawaabandan miskwi gaye gidode'e",
      scheduleAppointment: "Gigidonan mashkikiwinini", 
      medicationReminder: "Mikwendan gigiigawag mashkiki",
    },
  };

  const toggleListening = () => {
    if (!isListening) {
      // Start listening 
      setIsListening(true);
      
      // In a real implementation, this would connect to a speech recognition API
      // that supports Indigenous languages
      toast({
        title: "Voice Recognition Started",
        description: `Listening for commands in ${language}...`,
      });
      
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
        setTranscript(exampleCommands[language].checkBloodPressure);
        
        toast({
          title: "Command Recognized",
          description: "Opening blood pressure readings...",
        });
      }, 3000);
    } else {
      setIsListening(false);
      toast({
        title: "Voice Recognition Stopped",
        description: "No longer listening for commands.",
      });
    }
  };

  const playExampleCommand = (command: string) => {
    setIsPlayingExample(true);
    toast({
      title: "Playing Example",
      description: `Example: "${command}"`,
    });
    
    // In a real implementation, this would use text-to-speech with Indigenous languages
    setTimeout(() => {
      setIsPlayingExample(false);
    }, 2000);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isListening ? (
            <Mic className="h-5 w-5 text-red-500 animate-pulse" />
          ) : (
            <MicOff className="h-5 w-5 text-muted-foreground" />
          )}
          Voice Commands ({language})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            variant={isListening ? "destructive" : "default"}
            className="w-full"
            onClick={toggleListening}
          >
            {isListening ? (
              <>
                <StopCircle className="mr-2 h-4 w-4" /> Stop Listening
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" /> Start Voice Command
              </>
            )}
          </Button>
          
          {transcript && (
            <div className="p-3 bg-muted rounded-md text-sm">
              <p className="font-medium">Transcript:</p>
              <p>{transcript}</p>
            </div>
          )}
          
          <div className="pt-2">
            <p className="text-sm font-medium mb-2">Example Commands:</p>
            <ul className="space-y-2">
              {Object.entries(exampleCommands[language]).map(([key, command]) => (
                <li 
                  key={key} 
                  className="flex items-center justify-between text-sm p-2 bg-background/50 rounded hover:bg-muted/50 cursor-pointer"
                  onClick={() => playExampleCommand(command)}
                >
                  <span>{command}</span>
                  <Button size="sm" variant="ghost" disabled={isPlayingExample}>
                    <Play className="h-3 w-3" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceCommands;
