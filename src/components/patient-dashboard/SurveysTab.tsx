
import React, { useState } from "react";
import { ClipboardCheck, Search, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Extended survey data for the full tab
const SURVEYS = [
  {
    id: 1,
    title: "Diabetes Symptom Tracker",
    description: "Track your diabetes symptoms and glucose levels",
    dueDate: "Today",
    status: "pending",
    completion: 0,
    priority: "high",
    category: "medical"
  },
  {
    id: 2,
    title: "Medication Effectiveness",
    description: "Report on how your current medications are working",
    dueDate: "Nov 16",
    status: "in-progress",
    completion: 30,
    priority: "medium",
    category: "medical"
  },
  {
    id: 3,
    title: "Weekly Wellness Check",
    description: "Regular check-in on your overall health and wellbeing",
    dueDate: "Nov 18",
    status: "completed",
    completion: 100,
    priority: "medium",
    category: "wellness"
  },
  {
    id: 4,
    title: "Cultural Care Experience",
    description: "Share your experience with culturally appropriate care",
    dueDate: "Nov 20",
    status: "pending",
    completion: 0,
    priority: "low",
    category: "cultural"
  },
  {
    id: 5,
    title: "Mental Health Assessment",
    description: "Regular assessment of your mental health and stress levels",
    dueDate: "Nov 22",
    status: "pending",
    completion: 0,
    priority: "medium",
    category: "wellness"
  },
  {
    id: 6,
    title: "Treatment Satisfaction",
    description: "Rate your satisfaction with your current treatment plan",
    dueDate: "Nov 25",
    status: "completed",
    completion: 100,
    priority: "low",
    category: "medical"
  }
];

const SurveysTab = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const filteredSurveys = SURVEYS.filter(survey => {
    // Apply search filter
    const matchesSearch = 
      survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      survey.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply status filter
    let matchesStatus = true;
    if (statusFilter !== "all") {
      matchesStatus = survey.status === statusFilter;
    }
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100/50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-100/50 text-blue-700 border-blue-200">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100/50 text-green-700 border-green-200">Completed</Badge>;
      default:
        return null;
    }
  };

  const getPriorityIndicator = (priority: string) => {
    switch(priority) {
      case "high":
        return <span className="h-2 w-2 rounded-full bg-red-500 mr-2" title="High Priority"></span>;
      case "medium":
        return <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2" title="Medium Priority"></span>;
      case "low":
        return <span className="h-2 w-2 rounded-full bg-green-500 mr-2" title="Low Priority"></span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Weekly Surveys</h2>
          <p className="text-muted-foreground mt-1">Complete health surveys to help manage your care</p>
        </div>
        
        <Button onClick={() => navigate('/surveys/new')} className="bg-kwecare-primary hover:bg-kwecare-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          New Response
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search surveys..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs 
          value={statusFilter} 
          onValueChange={setStatusFilter}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-3 w-full sm:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSurveys.map(survey => (
          <Card key={survey.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                {getStatusBadge(survey.status)}
                <Badge variant="outline" className="bg-slate-100">{survey.category}</Badge>
              </div>
              <CardTitle className="text-lg mt-2 flex items-center">
                {getPriorityIndicator(survey.priority)}
                {survey.title}
              </CardTitle>
              <CardDescription>{survey.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <div>Due: {survey.dueDate}</div>
                <div>{survey.completion}% Complete</div>
              </div>
              
              <Progress value={survey.completion} className="h-2 mb-4" />
              
              <Button 
                className={`w-full ${survey.status === "completed" ? "bg-green-500 hover:bg-green-600" : "bg-kwecare-primary hover:bg-kwecare-primary/90"}`}
                onClick={() => navigate(`/surveys/${survey.id}`)}
              >
                {survey.status === "pending" ? "Start Survey" : 
                 survey.status === "in-progress" ? "Continue Survey" : "View Results"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredSurveys.length === 0 && (
        <div className="text-center py-12">
          <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No surveys found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
};

export default SurveysTab;
