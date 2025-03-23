import React, { useState } from "react";
import { RefreshCcw, Download, Brain, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  PieChart,
  BarChart,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  Bar,
  Pie,
  Cell,
  Line,
  ResponsiveContainer
} from 'recharts';

// Mock data for charts
const monthlyPatientVisits = [
  { name: 'Jan', inPerson: 65, virtual: 35, traditional: 12 },
  { name: 'Feb', inPerson: 60, virtual: 40, traditional: 15 },
  { name: 'Mar', inPerson: 55, virtual: 45, traditional: 18 },
  { name: 'Apr', inPerson: 50, virtual: 50, traditional: 20 },
  { name: 'May', inPerson: 45, virtual: 55, traditional: 25 },
  { name: 'Jun', inPerson: 40, virtual: 60, traditional: 22 },
  { name: 'Jul', inPerson: 35, virtual: 65, traditional: 28 },
  { name: 'Aug', inPerson: 30, virtual: 70, traditional: 30 },
  { name: 'Sep', inPerson: 25, virtual: 75, traditional: 35 },
  { name: 'Oct', inPerson: 20, virtual: 80, traditional: 32 },
  { name: 'Nov', inPerson: 15, virtual: 85, traditional: 38 },
  { name: 'Dec', inPerson: 10, virtual: 90, traditional: 40 },
];

const patientAgeDistribution = [
  { name: '0-18', value: 12 },
  { name: '19-35', value: 25 },
  { name: '36-50', value: 30 },
  { name: '51-65', value: 22 },
  { name: '66+', value: 11 },
];

const conditionPrevalence = [
  { name: 'Diabetes', value: 28 },
  { name: 'Hypertension', value: 22 },
  { name: 'Heart Disease', value: 15 },
  { name: 'Respiratory', value: 12 },
  { name: 'Mental Health', value: 18 },
  { name: 'Other', value: 5 },
];

const communityEngagement = [
  { name: 'White River', engagement: 75, adherence: 65 },
  { name: 'N. Tutchone', engagement: 68, adherence: 70 },
  { name: 'Kaska Dena', engagement: 82, adherence: 78 },
  { name: 'Champagne', engagement: 60, adherence: 55 },
  { name: 'Vuntut', engagement: 85, adherence: 80 },
];

const treatmentOutcomes = [
  { name: 'Diabetes Management', improved: 65, stable: 25, deteriorated: 10 },
  { name: 'Hypertension', improved: 70, stable: 20, deteriorated: 10 },
  { name: 'Mental Health', improved: 55, stable: 30, deteriorated: 15 },
  { name: 'Chronic Pain', improved: 50, stable: 35, deteriorated: 15 },
  { name: 'Respiratory', improved: 60, stable: 30, deteriorated: 10 },
];

// AI Recommendations for the report
const generateAIRecommendations = () => {
  return [
    {
      category: "Population Health",
      recommendation: "The data shows increasing diabetes rates in the White River community. Consider initiating targeted diabetes prevention programs focused on traditional dietary practices combined with modern management techniques.",
      impact: "high",
      evidence: "12.5% prevalence with 5% YoY increase"
    },
    {
      category: "Traditional Knowledge Integration",
      recommendation: "Patients receiving combined traditional and conventional treatment for mental health show 25% better outcomes. Expand the traditional knowledge integration program, especially in the Northern Tutchone community.",
      impact: "medium",
      evidence: "55% improvement rate vs. 30% with conventional treatment alone"
    },
    {
      category: "Care Delivery",
      recommendation: "Virtual appointment adherence has increased significantly (85% vs 65% for in-person). Consider transitioning more routine follow-ups to telemedicine, particularly for patients in remote communities.",
      impact: "high",
      evidence: "20% increase in appointment adherence"
    }
  ];
};

// Next steps for the report
const generateNextSteps = () => {
  return [
    {
      step: "Schedule community health screening day in White River focusing on diabetes prevention",
      timeline: "Next 30 days",
      resources: "2 healthcare providers, 1 traditional knowledge keeper, screening equipment"
    },
    {
      step: "Develop integrated mental health protocol combining traditional and western approaches",
      timeline: "Next 60 days",
      resources: "Mental health team, community elders, protocol documentation"
    },
    {
      step: "Expand telemedicine program with cultural competency training for all providers",
      timeline: "Next 45 days",
      resources: "Technical infrastructure, cultural training materials"
    }
  ];
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AnalyticsSection = () => {
  const [analyticsFilter, setAnalyticsFilter] = useState("all");
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState("month");
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportPreviewOpen, setReportPreviewOpen] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportData, setReportData] = useState<{
    recommendations: ReturnType<typeof generateAIRecommendations>,
    nextSteps: ReturnType<typeof generateNextSteps>,
    timestamp: string
  } | null>(null);

  // Handle report generation
  const handleGenerateReport = () => {
    setGeneratingReport(true);
    toast.loading("Generating comprehensive analytics report...");
    
    // Simulate API call to generate report (would be a real API call in production)
    setTimeout(() => {
      // Generate recommendations and steps
      const recommendations = generateAIRecommendations();
      const nextSteps = generateNextSteps();
      
      // Set the report data
      setReportData({
        recommendations,
        nextSteps,
        timestamp: new Date().toISOString()
      });
      
      toast.dismiss();
      toast.success("Report generated successfully");
      setGeneratingReport(false);
      setReportModalOpen(true);
    }, 1500);
  };

  // Handle report preview
  const handlePreviewReport = () => {
    setGeneratingReport(true);
    toast.loading("Preparing report preview...");
    
    // Simulate API call (would be a real API call in production)
    setTimeout(() => {
      // Generate recommendations and steps
      const recommendations = generateAIRecommendations();
      const nextSteps = generateNextSteps();
      
      // Set the report data
      setReportData({
        recommendations,
        nextSteps,
        timestamp: new Date().toISOString()
      });
      
      toast.dismiss();
      setGeneratingReport(false);
      setReportPreviewOpen(true);
    }, 1000);
  };

  // Handle downloading the report as PDF
  const handleDownloadReport = () => {
    toast.loading("Downloading report as PDF...");
    
    // Simulate PDF generation (would use a real PDF library in production)
    setTimeout(() => {
      toast.dismiss();
      toast.success("Report downloaded successfully");
    }, 1500);
  };

  return (
    <>
      <Card className="glass-card animate-fade-in">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Population Health Analytics</CardTitle>
              <CardDescription>
                Analyze health trends across Indigenous communities
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Select 
                value={analyticsTimeframe} 
                onValueChange={setAnalyticsTimeframe}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={analyticsFilter} 
                onValueChange={setAnalyticsFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by community" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Communities</SelectItem>
                  <SelectItem value="white-river">White River</SelectItem>
                  <SelectItem value="tutchone">Northern Tutchone</SelectItem>
                  <SelectItem value="kaska">Kaska Dena</SelectItem>
                  <SelectItem value="champagne">Champagne</SelectItem>
                  <SelectItem value="vuntut">Vuntut Gwitchin</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Stats Cards */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span className="text-green-500 mr-1">↑ 12%</span> 
                  <span>from previous {analyticsTimeframe}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Appointment Adherence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">82%</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span className="text-green-500 mr-1">↑ 5%</span> 
                  <span>from previous {analyticsTimeframe}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Traditional Knowledge Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">65%</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span className="text-green-500 mr-1">↑ 15%</span> 
                  <span>from previous {analyticsTimeframe}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* First Row of Charts */}
            <Card className="p-4">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-base">Patient Visit Types</CardTitle>
                <CardDescription>Trend of visit types over time</CardDescription>
              </CardHeader>
              <CardContent className="p-0 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyPatientVisits}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="inPerson" stroke="#8884d8" name="In-Person" />
                    <Line type="monotone" dataKey="virtual" stroke="#82ca9d" name="Virtual" />
                    <Line type="monotone" dataKey="traditional" stroke="#ffc658" name="Traditional Consult" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="p-4">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-base">Demographics</CardTitle>
                <CardDescription>Patient age distribution</CardDescription>
              </CardHeader>
              <CardContent className="p-0 h-[300px] flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={patientAgeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {patientAgeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Second Row of Charts */}
            <Card className="p-4">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-base">Condition Prevalence</CardTitle>
                <CardDescription>Primary health conditions in patient population</CardDescription>
              </CardHeader>
              <CardContent className="p-0 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={conditionPrevalence}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="value" fill="#8884d8" name="Patients (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="p-4">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-base">Community Engagement</CardTitle>
                <CardDescription>Patient engagement and medication adherence by community</CardDescription>
              </CardHeader>
              <CardContent className="p-0 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={communityEngagement}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="engagement" fill="#8884d8" name="Engagement %" />
                    <Bar dataKey="adherence" fill="#82ca9d" name="Adherence %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card className="p-4 mb-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base">Treatment Outcomes</CardTitle>
              <CardDescription>Patient health status changes by condition category</CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={treatmentOutcomes}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="improved" stackId="a" fill="#82ca9d" name="Improved" />
                  <Bar dataKey="stable" stackId="a" fill="#ffc658" name="Stable" />
                  <Bar dataKey="deteriorated" stackId="a" fill="#ff8042" name="Deteriorated" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      
      {/* Buttons as separate components */}
      <div className="text-center py-8">
        <button
          onClick={handlePreviewReport}
          className="mx-3 px-8 py-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-md font-medium inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Preview Report
        </button>
        
        <button
          onClick={handleGenerateReport}
          className="mx-3 px-8 py-3 bg-blue-600 text-white rounded-md font-medium inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Generate Detailed Report
        </button>
      </div>
      
      {/* Dialogs */}
      <Dialog open={reportPreviewOpen} onOpenChange={setReportPreviewOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Analytics Report Preview
            </DialogTitle>
            <DialogDescription>
              Visual preview of your population health analytics report with charts and diagrams
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            {/* Report Header */}
            <div className="bg-blue-600 p-5 rounded-md text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white h-10 w-10 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">K</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold">KweCare Healthcare</h2>
                  <p className="text-sm opacity-90">Population Health Analytics Report</p>
                </div>
              </div>
              <div className="text-sm">
                <p>Generated on {new Date().toLocaleDateString()}</p>
                <p>Timeframe: {analyticsTimeframe === 'month' ? 'Last Month' : 
                             analyticsTimeframe === 'quarter' ? 'Last Quarter' : 
                             analyticsTimeframe === 'year' ? 'Last Year' : 'All Time'}</p>
                <p>Community Filter: {analyticsFilter === 'all' ? 'All Communities' : analyticsFilter}</p>
              </div>
            </div>
            
            {/* Executive Summary */}
            <div className="border border-gray-200 rounded-md p-5 bg-gray-50">
              <h3 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-600 pb-1 mb-3">
                Executive Summary
              </h3>
              <p className="text-sm leading-relaxed">
                This report analyzes healthcare data across Indigenous communities to provide actionable 
                insights on patient engagement, treatment efficacy, and cultural integration opportunities.
                Key findings indicate that communities with traditional knowledge integration show significantly 
                better health outcomes, particularly for chronic conditions like diabetes and mental health issues.
              </p>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                <strong>AI Analysis:</strong> Based on cross-community data analysis, we recommend prioritizing 
                diabetes prevention programs in White River community, expanding mental health services that 
                integrate traditional practices, and transitioning appropriate follow-up appointments to 
                telemedicine to improve adherence rates.
              </div>
            </div>
            
            {/* Community Health Section */}
            <div>
              <h3 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-600 pb-1 mb-3">
                Community Health Insights
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">White River Community</h4>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Diabetes Rate:</span>
                    <span className="font-medium">12.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '12.5%' }}></div>
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Traditional Knowledge Impact</h4>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Improved Outcomes:</span>
                    <span className="font-medium">+25%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>
              <div className="h-[200px] bg-gray-100 rounded-md p-3 flex items-center justify-center mb-4">
                <div className="text-center w-full">
                  <span className="block text-gray-600 font-medium mb-2">Community Health Comparison Chart</span>
                  <div className="flex justify-center gap-2 mb-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                      <span>Patient Engagement %</span>
                    </div>
                  </div>
                  <div className="flex items-end justify-center gap-4 h-24">
                    {communityEngagement.map((community, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="relative w-12">
                          <div className="absolute top-0 left-0 right-0 text-xs text-center -mt-5">
                            {community.engagement}%
                          </div>
                          <div 
                            className="bg-blue-500 w-full rounded-t-sm" 
                            style={{ height: `${community.engagement * 0.3}px` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium mt-1">{community.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Add Condition Prevalence Visualization */}
            <div className="border rounded-md p-4 mt-4 mb-4">
              <h4 className="font-medium mb-3">Condition Prevalence</h4>
              <div className="space-y-3">
                {conditionPrevalence.map((condition, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{condition.name}:</span>
                      <span className="font-medium">{condition.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={{
                          width: `${condition.value * 3}%`,
                          backgroundColor: COLORS[i % COLORS.length]
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Add Age Distribution Visualization */}
            <div className="border rounded-md p-4 mt-4 mb-4">
              <h4 className="font-medium mb-3">Patient Age Distribution</h4>
              <div className="flex justify-center gap-3">
                {patientAgeDistribution.map((age, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="rounded-full w-10 h-10 flex items-center justify-center"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}>
                      <span className="text-xs text-white font-bold">{age.value}%</span>
                    </div>
                    <span className="text-xs mt-1">{age.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Add Treatment Outcomes Visualization */}
            <div className="border rounded-md p-4 mt-4 mb-4">
              <h4 className="font-medium mb-3">Treatment Outcomes by Condition</h4>
              <div className="space-y-4">
                {treatmentOutcomes.map((outcome, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{outcome.name}</span>
                    </div>
                    <div className="w-full flex h-6 rounded-md overflow-hidden">
                      <div 
                        style={{ width: `${outcome.improved}%` }}
                        className="bg-green-500 text-xs flex items-center justify-center text-white"
                      >
                        {outcome.improved}%
                      </div>
                      <div 
                        style={{ width: `${outcome.stable}%` }}
                        className="bg-yellow-400 text-xs flex items-center justify-center text-white"
                      >
                        {outcome.stable}%
                      </div>
                      <div 
                        style={{ width: `${outcome.deteriorated}%` }}
                        className="bg-red-500 text-xs flex items-center justify-center text-white"
                      >
                        {outcome.deteriorated}%
                      </div>
                    </div>
                    <div className="flex text-xs mt-1 text-gray-600 justify-between">
                      <span>Improved</span>
                      <span>Stable</span>
                      <span>Deteriorated</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-3 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                  <span>Improved</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>
                  <span>Stable</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                  <span>Deteriorated</span>
                </div>
              </div>
            </div>
            
            {/* AI Recommendations */}
            {reportData && (
              <div>
                <h3 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-600 pb-1 mb-3">
                  AI-Generated Recommendations
                </h3>
                <div className="space-y-4">
                  {reportData.recommendations.map((rec, i) => (
                    <div key={i} className={`border rounded-md p-4 ${
                      rec.impact === 'high' ? 'border-l-4 border-l-red-500 bg-red-50' : 
                                            'border-l-4 border-l-amber-500 bg-amber-50'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{rec.category}</h4>
                        <Badge variant={rec.impact === 'high' ? 'destructive' : 'outline'}>
                          {rec.impact === 'high' ? 'High Impact' : 'Medium Impact'}
                        </Badge>
                      </div>
                      <p className="text-sm mb-3">{rec.recommendation}</p>
                      <div className="text-xs bg-white/60 p-2 rounded-md">
                        <strong>Evidence:</strong> {rec.evidence}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-600 pb-1 mb-3">
                    Suggested Next Steps
                  </h3>
                  <div className="space-y-3">
                    {reportData.nextSteps.map((step, i) => (
                      <div key={i} className="border rounded-md p-4 bg-gray-50">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                            {i + 1}
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">{step.step}</h4>
                            <div className="flex flex-col md:flex-row gap-1 md:gap-4">
                              <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full inline-flex items-center">
                                <Calendar className="h-3 w-3 mr-1" /> {step.timeline}
                              </span>
                              <span className="text-xs text-gray-600">
                                <strong>Resources:</strong> {step.resources}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Disclaimer */}
            <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800 border border-blue-200">
              <p className="flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                <span>
                  <strong>Note:</strong> This report is generated using AI analysis of health data trends. 
                  Always use clinical judgment when implementing recommendations.
                  Recommendations are based on detected patterns in your patient population data.
                </span>
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" size="lg" onClick={() => setReportPreviewOpen(false)}>
              Close Preview
            </Button>
            <Button size="lg" onClick={handleDownloadReport}>
              <Download className="h-5 w-5 mr-2" />
              Generate Detailed Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Analytics Report with AI Recommendations</DialogTitle>
            <DialogDescription>
              Healthcare insights and suggested next steps based on population health data
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {generatingReport ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative h-16 w-16">
                  <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-t-blue-500 border-b-blue-700 border-l-blue-600 border-r-blue-600 animate-spin"></div>
                  <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-blue-600" />
                </div>
                <p className="mt-4 text-center font-medium">
                  Analyzing health data and generating recommendations...
                </p>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Our AI is analyzing patterns across communities, conditions, and treatment outcomes
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    AI-Generated Recommendations
                  </h3>
                  
                  <div className="space-y-4">
                    {reportData?.recommendations.map((rec, i) => (
                      <Card key={i} className={`
                        ${rec.impact === 'high' 
                          ? 'border-l-4 border-l-red-500' 
                          : 'border-l-4 border-l-amber-500'}
                      `}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{rec.category}</h4>
                            <Badge variant={rec.impact === 'high' ? 'destructive' : 'outline'}>
                              {rec.impact === 'high' ? 'High Impact' : 'Medium Impact'}
                            </Badge>
                          </div>
                          <p className="text-sm mb-3">{rec.recommendation}</p>
                          <div className="text-xs bg-muted/40 p-2 rounded-md text-muted-foreground">
                            <strong>Evidence:</strong> {rec.evidence}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                    Suggested Next Steps
                  </h3>
                  
                  <div className="space-y-3">
                    {reportData?.nextSteps.map((step, i) => (
                      <div key={i} className="border rounded-md p-4 bg-muted/40">
                        <h4 className="font-medium mb-1 flex items-center gap-2">
                          <div className="bg-blue-100 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                            {i + 1}
                          </div>
                          {step.step}
                        </h4>
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-xs text-muted-foreground mt-2">
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full inline-flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {step.timeline}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded-full">
                            <strong>Resources:</strong> {step.resources}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This report is generated using AI analysis of health data trends. 
                    Always use clinical judgment when implementing recommendations.
                    Recommendations are based on detected patterns in your patient population data.
                  </p>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button variant="outline" size="lg" onClick={() => setReportModalOpen(false)}>
                    Close
                  </Button>
                  <Button size="lg" onClick={handleDownloadReport}>
                    <Download className="h-5 w-5 mr-2" />
                    Generate Detailed Report
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AnalyticsSection; 