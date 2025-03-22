
import React from "react";
import { ClipboardCheck, ArrowRight, Bell } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

// Sample survey data
const WEEKLY_SURVEYS = [
  {
    id: 1,
    title: "Diabetes Symptom Tracker",
    dueDate: "Today",
    status: "pending",
    completion: 0,
    priority: "high"
  },
  {
    id: 2,
    title: "Medication Effectiveness",
    dueDate: "Nov 16",
    status: "in-progress",
    completion: 30,
    priority: "medium"
  },
  {
    id: 3,
    title: "Weekly Wellness Check",
    dueDate: "Nov 18",
    status: "completed",
    completion: 100,
    priority: "medium"
  }
];

const WeeklySurveysWidget = () => {
  const navigate = useNavigate();

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
        return <span className="h-2 w-2 rounded-full bg-red-500" title="High Priority"></span>;
      case "medium":
        return <span className="h-2 w-2 rounded-full bg-yellow-500" title="Medium Priority"></span>;
      case "low":
        return <span className="h-2 w-2 rounded-full bg-green-500" title="Low Priority"></span>;
      default:
        return null;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-kwecare-primary" />
            Weekly Surveys
          </CardTitle>
          <Badge variant="outline" className="bg-blue-100/50 text-blue-700 border-blue-200">
            {WEEKLY_SURVEYS.filter(survey => survey.status !== "completed").length} Pending
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-3">
          {WEEKLY_SURVEYS.map(survey => (
            <div key={survey.id} className="border rounded-md p-3 bg-card hover:bg-muted/20 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {getPriorityIndicator(survey.priority)}
                  <h4 className="text-sm font-medium">{survey.title}</h4>
                </div>
                {getStatusBadge(survey.status)}
              </div>
              
              <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Bell className="h-3 w-3" />
                  <span>Due: {survey.dueDate}</span>
                </div>
                <span>{survey.completion}% Complete</span>
              </div>
              
              <Progress value={survey.completion} className="h-1.5 bg-slate-100" />
              
              {survey.status !== "completed" && (
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-xs p-0 h-auto mt-2 text-kwecare-primary"
                  onClick={() => navigate(`/surveys/${survey.id}`)}
                >
                  {survey.status === "pending" ? "Start Survey" : "Continue Survey"}
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => navigate('/surveys')}
        >
          <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
          View All Surveys
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WeeklySurveysWidget;
