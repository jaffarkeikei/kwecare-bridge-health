
import React, { useState } from "react";
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  PieChart, 
  Pie,
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  Download, 
  FileText, 
  Printer, 
  ChartPie, 
  Eye, 
  Clock8, 
  Activity,
  Heart,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  ArrowUpDown,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface HealthAnalyticsReportProps {
  patientId?: string;
}

const HealthAnalyticsReport: React.FC<HealthAnalyticsReportProps> = ({ patientId }) => {
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Sample data for analytics
  const glucoseData = [
    { date: "Jan", glucose: 7.2 },
    { date: "Feb", glucose: 7.5 },
    { date: "Mar", glucose: 7.8 },
    { date: "Apr", glucose: 7.6 },
    { date: "May", glucose: 7.3 },
    { date: "Jun", glucose: 7.1 },
    { date: "Jul", glucose: 6.9 },
    { date: "Aug", glucose: 7.0 },
    { date: "Sep", glucose: 7.2 },
    { date: "Oct", glucose: 7.8 },
    { date: "Nov", glucose: 7.6 },
    { date: "Dec", glucose: 7.4 }
  ];

  const bloodPressureData = [
    { date: "Jan", systolic: 142, diastolic: 90 },
    { date: "Feb", systolic: 145, diastolic: 92 },
    { date: "Mar", systolic: 148, diastolic: 93 },
    { date: "Apr", systolic: 146, diastolic: 91 },
    { date: "May", systolic: 143, diastolic: 90 },
    { date: "Jun", systolic: 140, diastolic: 88 },
    { date: "Jul", systolic: 139, diastolic: 87 },
    { date: "Aug", systolic: 141, diastolic: 89 },
    { date: "Sep", systolic: 143, diastolic: 90 },
    { date: "Oct", systolic: 145, diastolic: 92 },
    { date: "Nov", systolic: 144, diastolic: 91 },
    { date: "Dec", systolic: 140, diastolic: 88 }
  ];

  const medicationAdherenceData = [
    { name: "Taken as Prescribed", value: 82 },
    { name: "Missed Occasionally", value: 15 },
    { name: "Irregular Usage", value: 3 }
  ];

  const labResultsData = [
    { test: "HbA1c", previous: 7.5, current: 7.8, target: "< 7.0" },
    { test: "LDL", previous: 105, current: 110, target: "< 100" },
    { test: "HDL", previous: 45, current: 48, target: "> 40" },
    { test: "Triglycerides", previous: 165, current: 150, target: "< 150" },
    { test: "eGFR", previous: 75, current: 72, target: "> 60" }
  ];

  const appointmentAdherenceData = [
    { name: "Attended", value: 90 },
    { name: "Missed", value: 7 },
    { name: "Rescheduled", value: 3 }
  ];

  const COLORS = ["#8B5CF6", "#D946EF", "#F97316", "#0EA5E9"];

  const generatePDF = async (download = true) => {
    try {
      if (download) {
        setIsGeneratingReport(true);
      }
      
      const reportElement = document.getElementById('analytics-report');
      if (!reportElement) {
        toast.error("Could not find report element");
        return;
      }
      
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      if (download) {
        pdf.save(`health_analytics_report.pdf`);
        toast.success("Analytics report downloaded successfully");
      }
      
      return pdf;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate analytics report");
      return null;
    } finally {
      if (download) {
        setIsGeneratingReport(false);
      }
    }
  };

  const handlePreviewReport = async () => {
    setShowReportPreview(true);
  };

  const handleGenerateReport = async () => {
    await generatePDF(true);
  };

  const handleDownloadReport = async () => {
    await generatePDF(true);
  };

  const renderTrend = (current: number, previous: number) => {
    if (current > previous) {
      return <ArrowUpDown className="h-4 w-4 ml-2 text-red-500" />;
    } else if (current < previous) {
      return <ArrowUpDown className="h-4 w-4 ml-2 text-green-500" />;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h2 className="text-2xl font-bold">Health Analytics Report</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Comprehensive analysis of health metrics and trends
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Printer className="h-4 w-4 mr-2" />
                    Report
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Report Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handlePreviewReport}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleGenerateReport} disabled={isGeneratingReport}>
                    {isGeneratingReport ? (
                      <>
                        <Clock8 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownloadReport} disabled={isGeneratingReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showReportPreview} onOpenChange={setShowReportPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Health Analytics Report Preview</DialogTitle>
            <DialogDescription>
              Review your health analytics report before downloading
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div id="report-preview">
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-2xl font-bold">Health Analytics Report</h2>
                  <div className="mt-1 text-sm text-muted-foreground">
                    <div>Generated on {new Date().toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Blood Glucose Trends</h3>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={glucoseData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="glucose" stroke="#8B5CF6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-3 text-sm">
                      <p className="text-muted-foreground">Average blood glucose level: 7.4 mmol/L</p>
                      <p className="text-muted-foreground">Target: &lt; 7.0 mmol/L</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Blood Pressure Trends</h3>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={bloodPressureData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="systolic" stroke="#D946EF" strokeWidth={2} />
                          <Line type="monotone" dataKey="diastolic" stroke="#0EA5E9" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-3 text-sm">
                      <p className="text-muted-foreground">Average blood pressure: 143/90 mmHg</p>
                      <p className="text-muted-foreground">Target: &lt; 130/80 mmHg</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Medication Adherence</h3>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={medicationAdherenceData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {medicationAdherenceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-3 text-sm">
                      <p className="text-muted-foreground">Overall medication adherence rate: 82%</p>
                      <p className="text-muted-foreground">Target: &gt; 90%</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground border-t pt-4">
                  Generated on {new Date().toLocaleString()} by KweCare Health
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowReportPreview(false)}>
              Close
            </Button>
            <Button onClick={handleDownloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div id="analytics-report" className="hidden">
        <div className="p-6 bg-white space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold">Health Analytics Report</h2>
            <div className="mt-1 text-sm text-muted-foreground">
              <div>Generated on {new Date().toLocaleDateString()}</div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Blood Glucose Trends</h3>
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={glucoseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="glucose" stroke="#8B5CF6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 text-sm">
                <p className="text-muted-foreground">Average blood glucose level: 7.4 mmol/L</p>
                <p className="text-muted-foreground">Target: &lt; 7.0 mmol/L</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Blood Pressure Trends</h3>
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bloodPressureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="systolic" stroke="#D946EF" strokeWidth={2} />
                    <Line type="monotone" dataKey="diastolic" stroke="#0EA5E9" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 text-sm">
                <p className="text-muted-foreground">Average blood pressure: 143/90 mmHg</p>
                <p className="text-muted-foreground">Target: &lt; 130/80 mmHg</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Medication Adherence</h3>
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={medicationAdherenceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {medicationAdherenceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 text-sm">
                <p className="text-muted-foreground">Overall medication adherence rate: 82%</p>
                <p className="text-muted-foreground">Target: &gt; 90%</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Recent Lab Results</h3>
            <div className="space-y-2">
              {labResultsData.map((lab, i) => (
                <div key={i} className="border p-3 rounded-lg">
                  <h4 className="font-medium">{lab.test}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div>
                      <div className="text-xs text-muted-foreground">Previous</div>
                      <div className="text-sm">{lab.previous}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Current</div>
                      <div className="flex items-center text-sm">
                        {lab.current}
                        {renderTrend(lab.current, lab.previous)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Target</div>
                      <div className="text-sm">{lab.target}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Appointment Adherence</h3>
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={appointmentAdherenceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {appointmentAdherenceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 text-sm">
                <p className="text-muted-foreground">Appointment attendance rate: 90%</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Health Recommendations</h3>
            <div className="space-y-2">
              <div className="border p-3 rounded-lg">
                <h4 className="font-medium text-amber-600">Blood Glucose Control</h4>
                <p className="text-sm mt-1">
                  Your average blood glucose is above target levels. Consider reviewing your diet and 
                  medication adherence with your healthcare provider.
                </p>
              </div>
              <div className="border p-3 rounded-lg">
                <h4 className="font-medium text-amber-600">Blood Pressure Management</h4>
                <p className="text-sm mt-1">
                  Your blood pressure readings remain elevated. Continue with prescribed medications and 
                  consider increasing physical activity and reducing sodium intake.
                </p>
              </div>
              <div className="border p-3 rounded-lg">
                <h4 className="font-medium text-green-600">Appointment Adherence</h4>
                <p className="text-sm mt-1">
                  Excellent appointment attendance. Maintaining regular check-ups helps ensure 
                  proactive management of your health conditions.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground border-t pt-4">
            Generated on {new Date().toLocaleString()} by KweCare Health
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChartIcon className="h-5 w-5 text-primary" />
              Blood Glucose Trends
            </CardTitle>
            <CardDescription>
              12-month trends in blood glucose levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer
                config={{
                  glucose: {
                    label: "Glucose",
                    color: "#8B5CF6"
                  }
                }}
              >
                <LineChart data={glucoseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="glucose" stroke="#8B5CF6" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Average</div>
                <div className="flex items-center">
                  <span className="text-xl font-semibold">7.4</span>
                  <span className="text-sm ml-1">mmol/L</span>
                  <ArrowUpDown className="h-4 w-4 ml-2 text-amber-500" />
                </div>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Target</div>
                <div className="flex items-center">
                  <span className="text-xl font-semibold">&lt; 7.0</span>
                  <span className="text-sm ml-1">mmol/L</span>
                </div>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="flex items-center">
                  <Badge className="bg-amber-100 text-amber-800">Above Target</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Blood Pressure Trends
            </CardTitle>
            <CardDescription>
              12-month trends in blood pressure readings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer
                config={{
                  systolic: {
                    label: "Systolic",
                    color: "#D946EF"
                  },
                  diastolic: {
                    label: "Diastolic",
                    color: "#0EA5E9"
                  }
                }}
              >
                <LineChart data={bloodPressureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="systolic" stroke="#D946EF" strokeWidth={2} />
                  <Line type="monotone" dataKey="diastolic" stroke="#0EA5E9" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Average</div>
                <div className="flex items-center">
                  <span className="text-xl font-semibold">143/90</span>
                  <span className="text-sm ml-1">mmHg</span>
                  <ArrowUpDown className="h-4 w-4 ml-2 text-red-500" />
                </div>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Target</div>
                <div className="flex items-center">
                  <span className="text-xl font-semibold">&lt; 130/80</span>
                  <span className="text-sm ml-1">mmHg</span>
                </div>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="flex items-center">
                  <Badge className="bg-red-100 text-red-800">Hypertension</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartPie className="h-5 w-5 text-primary" />
              Medication Adherence
            </CardTitle>
            <CardDescription>
              Analysis of medication compliance patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={medicationAdherenceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {medicationAdherenceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Adherence Rate</div>
                <div className="flex items-center">
                  <span className="text-xl font-semibold">82%</span>
                </div>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Target</div>
                <div className="flex items-center">
                  <span className="text-xl font-semibold">&gt; 90%</span>
                </div>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="flex items-center">
                  <Badge className="bg-amber-100 text-amber-800">Needs Improvement</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChartIcon className="h-5 w-5 text-primary" />
              Lab Results Comparison
            </CardTitle>
            <CardDescription>
              Current vs. previous lab test results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {labResultsData.map((lab, i) => (
                <div key={i} className="bg-muted/30 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{lab.test}</h4>
                    <Badge 
                      className={
                        lab.test === "HDL" 
                          ? (lab.current > 40 ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800")
                          : (lab.test === "eGFR" 
                              ? (lab.current > 60 ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800")
                              : (lab.current < parseInt(lab.target.match(/\d+/)?.[0] || "0") 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-amber-100 text-amber-800"))
                      }
                    >
                      {lab.test === "HDL" || lab.test === "eGFR" 
                        ? (lab.current >= parseInt(lab.target.match(/\d+/)?.[0] || "0") ? "Normal" : "Below Target")
                        : (lab.current <= parseInt(lab.target.match(/\d+/)?.[0] || "0") ? "Normal" : "Above Target")}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div>
                      <div className="text-xs text-muted-foreground">Previous</div>
                      <div className="text-sm">{lab.previous}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Current</div>
                      <div className="flex items-center text-sm">
                        {lab.current}
                        {renderTrend(lab.current, lab.previous)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Target</div>
                      <div className="text-sm">{lab.target}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartPie className="h-5 w-5 text-primary" />
              Appointment Adherence
            </CardTitle>
            <CardDescription>
              Analysis of appointment attendance patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appointmentAdherenceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {appointmentAdherenceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Attendance Rate</div>
                <div className="flex items-center">
                  <span className="text-xl font-semibold">90%</span>
                </div>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="flex items-center">
                  <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in bg-gradient-to-br from-violet-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Health Recommendations
            </CardTitle>
            <CardDescription>
              Personalized health improvement suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="bg-white/70 p-3 rounded-lg border border-amber-200">
                <h4 className="font-medium text-amber-600">Blood Glucose Control</h4>
                <p className="text-sm mt-1">
                  Your average blood glucose is above target levels. Consider reviewing your diet and 
                  medication adherence with your healthcare provider.
                </p>
              </div>
              <div className="bg-white/70 p-3 rounded-lg border border-amber-200">
                <h4 className="font-medium text-amber-600">Blood Pressure Management</h4>
                <p className="text-sm mt-1">
                  Your blood pressure readings remain elevated. Continue with prescribed medications and 
                  consider increasing physical activity and reducing sodium intake.
                </p>
              </div>
              <div className="bg-white/70 p-3 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-600">Appointment Adherence</h4>
                <p className="text-sm mt-1">
                  Excellent appointment attendance. Maintaining regular check-ups helps ensure 
                  proactive management of your health conditions.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">
              View Full Health Plan
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default HealthAnalyticsReport;
