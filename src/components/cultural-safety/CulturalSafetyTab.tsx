import React, { useState } from "react";
import { Globe, Book, Users, Leaf, Star, PlayCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import LanguageSelector, { IndigenousLanguage } from "./LanguageSelector";

// Translations example for key phrases
const translations: Record<string, Record<IndigenousLanguage, string>> = {
  greeting: {
    english: "Welcome to the Cultural Safety Center",
    cree: "ᑕᐋᐧᐤ ᒪᓯᓇᐦᐃᑲᓂᑲᒥᑯᐦᒡ",
    inuktitut: "ᑐᙵᓱᒋᑦ ᐃᓕᖅᑯᓯᑦᑎᓐᓂ ᐊᑦᑕᕐᓇᙱᑦᑐᒧᑦ",
    ojibwe: "ᐅᐁᐧ ᐊᓂᔑᓈᐯᐃᐧ ᐱᒋᐧᑭᐃᐧᓇᐣ ᑲᐃᐧᒋᑲᑌᐠ",
    michif: "Bienvenue au Centre de sécurité culturelle",
    denesuline: "Netah hoɂą kulturı̨ k'éch'ą́dı́"
  },
  healingPath: {
    english: "Traditional Healing Path",
    cree: "ᑳᐦᒋᑎᓈᐦᒡ ᒦᓄᐘᒋᐦᐄᐍᐏᐣ ᒣᐢᑲᓇᐤ",
    inuktitut: "ᐱᖅᑯᓯᑐᖃᕐᒥᑦ ᒪᒥᓴᕐᓂᕐᒧᑦ ᐊᖅᑯᑎ",
    ojibwe: "ᐊᓂᔑᓈᐯᐃᐧ ᓇᓇᐣᑕᐃᐧᐦᐃᐁᐧᐃᐧᐣ ᒥᑲᓇ",
    michif: "Sentier de guérison traditionnel",
    denesuline: "Tı̨ch'ą dene ch'anıé t'ą náts'edı́"
  },
  communityVoices: {
    english: "Community Voices",
    cree: "ᐁᐧᒋᐦᐃᑐᐃᐧᓐ ᐯᐦᑖᑯᓯᐃᐧᓇ",
    inuktitut: "ᓄᓇᓕᖕᓂ ᓂᐲᑦ",
    ojibwe: "ᑕᔑᑫᐃᐧᓂᐠ ᑎᐯᐣᒋᑫᐃᐧᓇᐣ",
    michif: "Voix de la communauté",
    denesuline: "Dene nezų ełets'edarı̨́nhı́"
  }
};

// Knowledge keeper information
interface KnowledgeKeeper {
  name: string;
  nation: string;
  expertise: string;
  imageUrl: string;
  bio: string;
}

const knowledgeKeepers: KnowledgeKeeper[] = [
  {
    name: "Elder Margaret Francis",
    nation: "Cree",
    expertise: "Traditional Medicine",
    imageUrl: "/images/elder-margaret.jpg",
    bio: "Elder Margaret has been practicing traditional plant medicine for over 50 years, specializing in treatments for diabetes and chronic pain."
  },
  {
    name: "Joseph Beardy",
    nation: "Ojibwe",
    expertise: "Ceremonial Knowledge",
    imageUrl: "/images/joseph-beardy.jpg",
    bio: "Joseph is a respected ceremonialist who helps integrate traditional healing ceremonies with modern healthcare practices."
  },
  {
    name: "Sarah Qitsualik",
    nation: "Inuit",
    expertise: "Mental Health & Traditional Counseling",
    imageUrl: "/images/sarah-qitsualik.jpg",
    bio: "Sarah combines traditional Inuit knowledge with modern mental health approaches to address trauma and healing."
  },
];

// Traditional medicine information
interface TraditionalMedicine {
  name: string;
  indigenousNames: Partial<Record<IndigenousLanguage, string>>;
  uses: string[];
  preparation: string;
  image: string;
}

const medicines: TraditionalMedicine[] = [
  {
    name: "Sweetgrass",
    indigenousNames: {
      cree: "ᐑᑭᐢᑿᐦᑯᐏᐩ (wîkiskwahkomi)",
      ojibwe: "ᐃᐧᑭᐠ (wiingashk)",
      michif: "Li fwin di buffalo"
    },
    uses: ["Purification", "Spiritual Protection", "Respiratory Support"],
    preparation: "Braided and dried, then burned as incense or made into tea for respiratory issues.",
    image: "/images/sweetgrass.jpg"
  },
  {
    name: "Labrador Tea",
    indigenousNames: {
      cree: "ᒪᐢᑫᑯᒥᓈᐳᐃ (maskêkominâpoy)",
      inuktitut: "ᒪᒪᐃᑦᓯᑦ (mamaitcit)",
      denesuline: "Nagotł'é"
    },
    uses: ["Immune Support", "Digestive Health", "Cold & Flu Treatment"],
    preparation: "Leaves are steeped in hot water to create a medicinal tea.",
    image: "/images/labrador-tea.jpg"
  },
  {
    name: "Cedar",
    indigenousNames: {
      ojibwe: "ᑮᔑᒃ (giizhik)",
      cree: "ᒪᐢᑭᑯᐹᐠ (maskikopâk)"
    },
    uses: ["Protection", "Purification", "Cold Relief"],
    preparation: "Branches burned for purification or made into tea for respiratory conditions.",
    image: "/images/cedar.jpg"
  }
];

const CulturalSafetyTab = () => {
  const [activeTab, setActiveTab] = useState("knowledge");
  const language = localStorage.getItem("preferredLanguage") as IndigenousLanguage || "english";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Globe className="h-6 w-6 text-kwecare-primary" />
          <h2 className="text-2xl font-bold">{translations.greeting[language]}</h2>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            <span>Traditional Knowledge</span>
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Community Resources</span>
          </TabsTrigger>
          <TabsTrigger value="medicine" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            <span>Traditional Medicine</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="knowledge" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                {translations.healingPath[language]}
              </CardTitle>
              <CardDescription>
                Traditional knowledge integrated with modern healthcare
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {knowledgeKeepers.map((keeper, index) => (
                  <div key={index} className="bg-muted/40 rounded-xl p-5 space-y-4">
                    <div className="aspect-square rounded-lg bg-muted overflow-hidden relative">
                      <div className="absolute inset-0 flex items-center justify-center bg-muted/80 text-primary/40">
                        {/* Image placeholder */}
                        <Users className="h-16 w-16 opacity-30" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold">{keeper.name}</h3>
                      <p className="text-sm text-muted-foreground">{keeper.nation} - {keeper.expertise}</p>
                      <p className="mt-2 text-sm">{keeper.bio}</p>
                      <Button variant="link" className="p-0 h-auto mt-2">
                        Schedule a virtual consultation
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-muted/40 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <PlayCircle className="h-5 w-5 text-kwecare-primary" />
                  <h3 className="font-bold">Knowledge Sharing Videos</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Traditional Medicine Preparation</p>
                  </div>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Holistic Wellness Teachings</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="community" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="h-5 w-5 text-kwecare-primary" />
                {translations.communityVoices[language]}
              </CardTitle>
              <CardDescription>
                Connect with your community for support and resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/40 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Community Health Workers</h3>
                    <p className="text-sm mb-3">
                      Local healthcare providers trained in cultural safety and traditional approaches.
                    </p>
                    <Button variant="outline" className="w-full">Find Nearby Support</Button>
                  </div>
                  
                  <div className="bg-muted/40 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Cultural Events Calendar</h3>
                    <p className="text-sm mb-3">
                      Healing circles, knowledge sharing gatherings, and community wellness events.
                    </p>
                    <Button variant="outline" className="w-full">View Calendar</Button>
                  </div>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Language Resources</h3>
                  <p className="text-sm mb-3">
                    Access healthcare information in your Indigenous language and connect with translators.
                  </p>
                  <div className="flex flex-col md:flex-row gap-3">
                    <Button variant="outline" className="flex-1">Download Language Guides</Button>
                    <Button variant="outline" className="flex-1">Request Translation</Button>
                  </div>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Share Your Traditional Knowledge</h3>
                  <p className="text-sm mb-3">
                    Contribute to our growing database of traditional healing practices with proper attribution.
                  </p>
                  <Button className="w-full bg-kwecare-primary hover:bg-kwecare-primary/90">
                    Contribute Knowledge
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="medicine" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Traditional Medicine Guide
              </CardTitle>
              <CardDescription>
                Ancient healing wisdom from Indigenous traditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {medicines.map((medicine, index) => (
                  <div key={index} className="bg-muted/40 p-4 rounded-lg">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="aspect-square h-24 w-24 rounded-lg bg-muted flex items-center justify-center">
                        <Leaf className="h-8 w-8 text-green-500 opacity-40" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{medicine.name}</h3>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 mb-2">
                          {Object.entries(medicine.indigenousNames).map(([lang, name], i) => (
                            <p key={i} className="text-xs text-muted-foreground">
                              <span className="font-medium">{lang}:</span> {name}
                            </p>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Uses:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {medicine.uses.map((use, i) => (
                                <span key={i} className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                  {use}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Preparation:</p>
                            <p className="text-sm">{medicine.preparation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="text-center">
                  <Button variant="outline">
                    View Full Medicine Guide
                  </Button>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 text-sm rounded-lg">
                  <p className="font-medium">Important Note:</p>
                  <p className="mt-1">
                    Always consult with a traditional knowledge keeper or healthcare provider before using traditional medicines, 
                    especially if you have existing health conditions or are taking other medications.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CulturalSafetyTab;
