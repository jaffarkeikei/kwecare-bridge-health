import React, { useState, useEffect } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export type IndigenousLanguage = "english" | "cree" | "inuktitut" | "ojibwe" | "michif" | "denesuline";

interface LanguageOption {
  id: IndigenousLanguage;
  name: string;
  nativeName: string;
  flag?: string;
}

const languages: LanguageOption[] = [
  { id: "english", name: "English", nativeName: "English" },
  { id: "cree", name: "Cree", nativeName: "ᓀᐦᐃᔭᐍᐏᐣ (Nēhiyawēwin)" },
  { id: "inuktitut", name: "Inuktitut", nativeName: "ᐃᓄᒃᑎᑐᑦ (Inuktitut)" },
  { id: "ojibwe", name: "Ojibwe", nativeName: "ᐊᓂᔑᓈᐯᒧᐎᓐ (Anishinaabemowin)" },
  { id: "michif", name: "Michif", nativeName: "Michif / Mitchif" },
  { id: "denesuline", name: "Dene", nativeName: "Dëne Sųłıné" },
];

const LanguageSelector = () => {
  // Get preferred language from localStorage or default to English
  const [selectedLanguage, setSelectedLanguage] = useState<IndigenousLanguage>(
    (localStorage.getItem("preferredLanguage") as IndigenousLanguage) || "english"
  );
  
  // On mount, check if language is already set
  useEffect(() => {
    if (!localStorage.getItem("preferredLanguage")) {
      localStorage.setItem("preferredLanguage", selectedLanguage);
    }
  }, [selectedLanguage]);

  const handleLanguageChange = (language: IndigenousLanguage) => {
    setSelectedLanguage(language);
    localStorage.setItem("preferredLanguage", language);
    
    // In a real app, this would trigger language change across the app
    document.documentElement.lang = language;
    
    // Simulate language change
    toast.success(`Language changed to ${languages.find(l => l.id === language)?.name}`);
    
    // Dispatch a custom event that other components can listen for
    const event = new CustomEvent("language-changed", { detail: { language } });
    window.dispatchEvent(event);
  };

  const getSelectedLanguageOption = () => {
    return languages.find(lang => lang.id === selectedLanguage) || languages[0];
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-9">
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">{getSelectedLanguageOption().name}</span>
          <span className="text-xs text-muted-foreground hidden md:inline">
            ({getSelectedLanguageOption().nativeName})
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuGroup>
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.id}
              onClick={() => handleLanguageChange(language.id)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div>
                  <div>{language.name}</div>
                  <div className="text-xs text-muted-foreground">{language.nativeName}</div>
                </div>
                {selectedLanguage === language.id && <Check className="h-4 w-4" />}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
