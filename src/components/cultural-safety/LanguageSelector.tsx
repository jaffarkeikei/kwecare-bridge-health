
import React from "react";
import { Check, Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export type IndigenousLanguage = "english" | "cree" | "inuktitut" | "ojibwe";

interface LanguageSelectorProps {
  currentLanguage: IndigenousLanguage;
  onLanguageChange: (language: IndigenousLanguage) => void;
}

const LanguageSelector = ({
  currentLanguage,
  onLanguageChange,
}: LanguageSelectorProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <Globe className="h-5 w-5 text-kwecare-primary" />
        <Label htmlFor="language-select">Indigenous Language</Label>
      </div>
      <Select
        value={currentLanguage}
        onValueChange={(value) => onLanguageChange(value as IndigenousLanguage)}
      >
        <SelectTrigger id="language-select" className="w-full">
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="english">English</SelectItem>
          <SelectItem value="cree">Cree (ᓀᐦᐃᔭᐍᐏᐣ)</SelectItem>
          <SelectItem value="inuktitut">Inuktitut (ᐃᓄᒃᑎᑐᑦ)</SelectItem>
          <SelectItem value="ojibwe">Ojibwe (Anishinaabemowin)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
