
import React, { useState } from "react";
import { Globe, Scroll } from "lucide-react";
import LanguageSelector, { IndigenousLanguage } from "./LanguageSelector";
import VoiceCommands from "./VoiceCommands";
import TraditionalKnowledge from "./TraditionalKnowledge";

const CulturalSafetyTab = () => {
  const [currentLanguage, setCurrentLanguage] = useState<IndigenousLanguage>("english");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-2 mb-6">
        <Globe className="h-6 w-6 text-kwecare-primary" />
        <h2 className="text-2xl font-bold">Cultural Safety</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="glass-card p-5">
            <LanguageSelector 
              currentLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
            />
          </div>
          
          <VoiceCommands language={currentLanguage} />
        </div>
        
        <div className="md:col-span-2">
          <TraditionalKnowledge />
        </div>
      </div>
    </div>
  );
};

export default CulturalSafetyTab;
