
import React from "react";
import { Book, Leaf, Star, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const TraditionalKnowledge = () => {
  const elderModules = [
    {
      id: 1,
      title: "Traditional Medicines",
      author: "Elder Sarah Moosewah",
      community: "Eabametoong First Nation",
      icon: <Leaf className="h-5 w-5 text-green-500" />,
      description: "Learn about traditional plant medicines for diabetes management and their integration with modern treatments."
    },
    {
      id: 2,
      title: "Holistic Wellness Circle",
      author: "Elder John Littlechild",
      community: "Ermineskin Cree Nation",
      icon: <Star className="h-5 w-5 text-amber-500" />,
      description: "Understanding the medicine wheel approach to health and healing for chronic conditions."
    },
    {
      id: 3,
      title: "Sacred Teachings and Health",
      author: "Elder Mary Wawatie",
      community: "Kitigan Zibi Anishinabeg",
      icon: <Users className="h-5 w-5 text-blue-500" />,
      description: "Seven grandfather teachings and their application to modern healthcare practices."
    }
  ];

  const handleModuleSelect = (moduleId: number) => {
    toast({
      title: "Module Loading",
      description: `Opening module: ${elderModules.find(module => module.id === moduleId)?.title}`,
    });
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5 text-kwecare-accent" />
          Traditional Knowledge
        </CardTitle>
        <CardDescription>
          Educational modules co-designed with Indigenous Elders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {elderModules.map((module) => (
            <div 
              key={module.id}
              className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{module.icon}</div>
                <div className="flex-1">
                  <h3 className="font-medium">{module.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    By {module.author} • {module.community}
                  </p>
                  <p className="text-sm mb-3">{module.description}</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleModuleSelect(module.id)}
                    className="text-xs"
                  >
                    Open Module
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TraditionalKnowledge;
