import React, { useState } from "react";
import { 
  Activity, 
  Calendar, 
  Clipboard, 
  Heart, 
  FileText, 
  Droplets, 
  Clock, 
  PieChart, 
  Pill, 
  ArrowUpDown, 
  Printer, 
  Download, 
  Share2, 
  Clock8, 
  MessageSquare, 
  Star,
  Leaf,
  TestTube as Flask,
  Eye
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { prepareDataMigration, executeDataMigration } from "@/utils/healthDataMigration";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PatientVitals {
  bloodPressure: string;
  heartRate: number;
  respiratoryRate: number;
  temperature: number;
  bloodGlucose: number;
  oxygenSaturation: number;
  weight: number;
  height: number;
  bmi: number;
  timestamp: string;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  purpose: string;
  isTraditional: boolean;
  notes?: string;
}

interface LabResult {
  testName: string;
  date: string;
  result: string;
  normalRange?: string;
  interpretation: "normal" | "abnormal" | "critical";
  notes?: string;
}

interface Diagnosis {
  condition: string;
  diagnosedDate: string;
  diagnosedBy: string;
  status: "active" | "resolved" | "monitoring";
  notes?: string;
  treatmentPlan?: string;
}

interface PatientNote {
  date: string;
  provider: string;
  content: string;
  tags: string[];
  isTraditionalKnowledge: boolean;
  followUpRequired: boolean;
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  dateOfBirth: string;
  community: string;
  gender: string;
  contact: {
    phone?: string;
    email?: string;
    address?: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  culturalInformation: {
    preferredLanguage: string;
    traditionalPractices: string[];
    culturalConsiderations?: string[];
  };
  medicalHistory: {
    allergies: string[];
    chronicConditions: string[];
    surgeries: Array<{ procedure: string, date: string }>;
    familyHistory: string[];
  };
  vitals: PatientVitals[];
  medications: Medication[];
  labResults: LabResult[];
  diagnoses: Diagnosis[];
  notes: PatientNote[];
}

const mockPatientData: PatientRecord = {
  id: "P123456",
  name: "David Wilson",
  age: 62,
  dateOfBirth: "1961-04-12",
  gender: "Male",
  community: "Champagne First Nation",
  contact: {
    phone: "867-555-4789",
    email: "david.wilson@example.com",
    address: "45 Eagle Drive, Champagne, YT"
  },
  emergencyContact: {
    name: "Jennifer Wilson",
    relationship: "Daughter",
    phone: "867-555-8901"
  },
  culturalInformation: {
    preferredLanguage: "English with some Northern Tutchone",
    traditionalPractices: ["Smudging", "Sweat lodge", "Traditional plant medicine"],
    culturalConsiderations: ["Prefers to include Elder in treatment decisions"]
  },
  medicalHistory: {
    allergies: ["Penicillin", "Sulfa drugs"],
    chronicConditions: ["Rheumatoid Arthritis", "Coronary Artery Disease", "Type 2 Diabetes", "Chronic Pain"],
    surgeries: [
      { procedure: "Coronary Artery Bypass Graft", date: "2018-05-23" },
      { procedure: "Right Knee Replacement", date: "2019-11-15" }
    ],
    familyHistory: ["Heart disease", "Diabetes", "Hypertension"]
  },
  vitals: [
    {
      bloodPressure: "145/92",
      heartRate: 78,
      respiratoryRate: 18,
      temperature: 37.1,
      bloodGlucose: 7.8,
      oxygenSaturation: 96,
      weight: 88.5,
      height: 178,
      bmi: 27.9,
      timestamp: "2023-11-10T09:32:00"
    },
    {
      bloodPressure: "148/94",
      heartRate: 82,
      respiratoryRate: 19,
      temperature: 37.0,
      bloodGlucose: 8.2,
      oxygenSaturation: 95,
      weight: 89.1,
      height: 178,
      bmi: 28.1,
      timestamp: "2023-10-25T14:15:00"
    },
    {
      bloodPressure: "140/90",
      heartRate: 76,
      respiratoryRate: 17,
      temperature: 36.9,
      bloodGlucose: 7.5,
      oxygenSaturation: 97,
      weight: 88.3,
      height: 178,
      bmi: 27.9,
      timestamp: "2023-10-05T11:42:00"
    }
  ],
  medications: [
    {
      name: "Metformin",
      dosage: "1000mg",
      frequency: "Twice daily",
      startDate: "2020-03-15",
      prescribedBy: "Dr. Rebecca Taylor",
      purpose: "Diabetes management",
      isTraditional: false,
      notes: "Take with food to minimize GI upset"
    },
    {
      name: "Lisinopril",
      dosage: "20mg",
      frequency: "Once daily",
      startDate: "2018-06-10",
      prescribedBy: "Dr. Rebecca Taylor",
      purpose: "Hypertension management",
      isTraditional: false
    },
    {
      name: "Atorvastatin",
      dosage: "40mg",
      frequency: "Once daily at bedtime",
      startDate: "2018-06-10",
      prescribedBy: "Dr. Rebecca Taylor",
      purpose: "Cholesterol management",
      isTraditional: false
    },
    {
      name: "Labrador Tea",
      dosage: "1 cup",
      frequency: "Twice weekly",
      startDate: "2022-01-05",
      prescribedBy: "Elder Margaret Francis",
      purpose: "Respiratory support, stress management",
      isTraditional: true,
      notes: "Traditional medicine - complementary to Western medications"
    }
  ],
  labResults: [
    {
      testName: "HbA1c",
      date: "2023-10-20",
      result: "7.8%",
      normalRange: "< 7.0%",
      interpretation: "abnormal",
      notes: "Slight increase from previous 7.5%, adjust diabetes management"
    },
    {
      testName: "Lipid Panel - LDL",
      date: "2023-10-20",
      result: "110 mg/dL",
      normalRange: "< 100 mg/dL",
      interpretation: "abnormal",
      notes: "Continue statin therapy"
    },
    {
      testName: "Comprehensive Metabolic Panel",
      date: "2023-10-20",
      result: "Within normal limits except elevated creatinine",
      interpretation: "abnormal",
      notes: "Monitor kidney function"
    },
    {
      testName: "Electrocardiogram",
      date: "2023-09-15",
      result: "Normal sinus rhythm, no acute changes",
      interpretation: "normal"
    }
  ],
  diagnoses: [
    {
      condition: "Type 2 Diabetes Mellitus",
      diagnosedDate: "2020-02-28",
      diagnosedBy: "Dr. Rebecca Taylor",
      status: "active",
      treatmentPlan: "Metformin, dietary changes, regular glucose monitoring, A1C every 3 months"
    },
    {
      condition: "Coronary Artery Disease",
      diagnosedDate: "2018-04-12",
      diagnosedBy: "Dr. Michael Lee",
      status: "active",
      treatmentPlan: "Medication management, cardiac rehab program completed, regular follow-ups"
    },
    {
      condition: "Rheumatoid Arthritis",
      diagnosedDate: "2015-11-05",
      diagnosedBy: "Dr. Susan Wang",
      status: "active",
      treatmentPlan: "NSAID management, physical therapy, traditional medicine integration"
    },
    {
      condition: "Osteoarthritis - Right Knee",
      diagnosedDate: "2017-08-22",
      diagnosedBy: "Dr. Susan Wang",
      status: "resolved",
      treatmentPlan: "Total knee replacement completed 11/15/2019"
    }
  ],
  notes: [
    {
      date: "2023-11-10",
      provider: "Dr. Rebecca Taylor",
      content: "Patient reports increased chest discomfort over the past week, particularly with exertion. BP elevated at 145/92. Increased frequency of nitroglycerin use. EKG ordered, cardiology referral made for stress test. Discussed importance of medication adherence and reporting any worsening symptoms immediately.",
      tags: ["chest pain", "CAD", "medication review"],
      isTraditionalKnowledge: false,
      followUpRequired: true
    },
    {
      date: "2023-10-25",
      provider: "Dr. Rebecca Taylor",
      content: "Diabetes follow-up. A1C slightly elevated at 7.8%. Patient reports difficulty with dietary compliance over past month due to community events. Glucose readings show consistent elevation in morning. Discussed medication timing adjustment and reviewed meal planning strategies. Referral to nutritionist.",
      tags: ["diabetes", "nutrition", "medication adjustment"],
      isTraditionalKnowledge: false,
      followUpRequired: false
    },
    {
      date: "2023-09-15",
      provider: "Elder Margaret Francis",
      content: "Traditional medicine consultation focused on pain management for arthritis. Patient has been using Labrador Tea preparation with reported improvement in joint stiffness. Discussed integration with Western medications and proper preparation techniques. Recommended addition of birch bark topical preparation for localized knee pain.",
      tags: ["traditional medicine", "pain management", "arthritis"],
      isTraditionalKnowledge: true,
      followUpRequired: true
    }
  ]
};

interface PatientRecordViewerProps {
  patientId?: string; // In a real app, you'd fetch data based on this ID
}

const PatientRecordViewer: React.FC<PatientRecordViewerProps> = ({ patientId }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isTransferring, setIsTransferring] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showReportPreview, setShowReportPreview] = useState(false);
  
  const patient = mockPatientData;

  const getStatusColor = (status: string) => {
    switch(status) {
      case "active": return "text-red-600";
      case "resolved": return "text-green-600";
      case "monitoring": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  const getInterpretationColor = (interpretation: string) => {
    switch(interpretation) {
      case "normal": return "text-green-600";
      case "abnormal": return "text-yellow-600";
      case "critical": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const generatePDF = async (download = true) => {
    try {
      if (download) {
        setIsGeneratingReport(true);
      }
      
      const reportElement = document.getElementById('patient-report');
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
        pdf.save(`${patient.name.replace(/\s/g, '_')}_medical_record.pdf`);
        toast.success("Report downloaded successfully");
      }
      
      return pdf;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate report");
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

  const handleDataTransfer = async () => {
    setIsTransferring(true);
    
    try {
      const records = [
        {
          id: "rec-123",
          patientId: patient.id,
          date: new Date().toISOString(),
          recordType: 'diagnosis' as const,
          provider: "Dr. Rebecca Taylor",
          content: {
            diagnoses: patient.diagnoses,
            notes: "Transfer includes all active diagnoses and treatment plans"
          },
          permissions: {
            owner: patient.id,
            sharedWith: ["Dr. Rebecca Taylor"],
            viewableBy: 'providers' as const,
            exportable: true,
            deletable: false
          },
          metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: 1,
            source: "KweCare Primary System"
          }
        }
      ];
      
      const migrationResult = prepareDataMigration(records, {
        destinationProvider: "Northern Health Center",
        respectTraditionalProtections: true
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transferResult = await executeDataMigration(
        migrationResult.migrationPackage,
        true
      );
      
      if (transferResult) {
        toast.success("Patient record successfully transferred");
      } else {
        toast.error("Transfer failed - please try again");
      }
    } catch (error) {
      console.error("Error transferring patient data:", error);
      toast.error("An error occurred during the transfer");
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xl">
                {patient.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{patient.name}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <div>{patient.age} years ({patient.dateOfBirth})</div>
                  <div>•</div>
                  <div>{patient.gender}</div>
                  <div>•</div>
                  <div>ID: {patient.id}</div>
                  <div>•</div>
                  <div>{patient.community}</div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {patient.medicalHistory.chronicConditions.map((condition, i) => (
                    <Badge key={i} variant="secondary">{condition}</Badge>
                  ))}
                </div>
              </div>
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
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Share Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDataTransfer} disabled={isTransferring}>
                    {isTransferring ? (
                      <>
                        <Clock8 className="h-4 w-4 mr-2 animate-spin" />
                        Transferring...
                      </>
                    ) : (
                      <>
                        <Activity className="h-4 w-4 mr-2" />
                        Transfer to Another Provider
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownloadReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Medical Record
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-amber-600">
                    <Leaf className="h-4 w-4 mr-2" />
                    Request Traditional Knowledge Sharing
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button>
                <MessageSquare className="h-4 w-4 mr-2" />
                Message Patient
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showReportPreview} onOpenChange={setShowReportPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Report Preview</DialogTitle>
            <DialogDescription>
              Review the patient report before downloading
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div id="report-preview">
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-2xl font-bold">{patient.name}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <div>{patient.age} years ({patient.dateOfBirth})</div>
                    <div>•</div>
                    <div>{patient.gender}</div>
                    <div>•</div>
                    <div>ID: {patient.id}</div>
                    <div>•</div>
                    <div>{patient.community}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div>{patient.contact.phone}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div>{patient.contact.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Address</div>
                      <div>{patient.contact.address}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Active Diagnoses</h3>
                  <div className="space-y-2">
                    {patient.diagnoses
                      .filter(d => d.status === "active")
                      .map((diagnosis, i) => (
                        <div key={i} className="border p-3 rounded-lg">
                          <h4 className="font-medium">{diagnosis.condition}</h4>
                          <div className="text-sm mt-1">
                            <span className="text-muted-foreground">Diagnosed: </span>
                            {diagnosis.diagnosedDate} by {diagnosis.diagnosedBy}
                          </div>
                          {diagnosis.treatmentPlan && (
                            <div className="text-sm mt-2">
                              <span className="text-muted-foreground">Treatment: </span>
                              {diagnosis.treatmentPlan}
                            </div>
                          )}
                        </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Current Medications</h3>
                  <div className="space-y-2">
                    {patient.medications.map((med, i) => (
                      <div key={i} className="border p-3 rounded-lg">
                        <h4 className="font-medium">{med.name}</h4>
                        <div className="text-sm">
                          {med.dosage}, {med.frequency}
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Purpose: </span>
                          {med.purpose}
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Prescribed by: </span>
                          {med.prescribedBy}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Recent Lab Results</h3>
                  <div className="space-y-2">
                    {patient.labResults.map((lab, i) => (
                      <div key={i} className="border p-3 rounded-lg">
                        <h4 className="font-medium">{lab.testName}</h4>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Date: </span>
                          {lab.date}
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Result: </span>
                          {lab.result}
                        </div>
                        {lab.normalRange && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Normal Range: </span>
                            {lab.normalRange}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Recent Vitals</h3>
                  <div className="space-y-2">
                    {patient.vitals.slice(0, 1).map((vital, i) => (
                      <div key={i} className="border p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">
                          Recorded on: {new Date(vital.timestamp).toLocaleDateString()}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                          <div>
                            <div className="text-sm text-muted-foreground">Blood Pressure</div>
                            <div>{vital.bloodPressure}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Heart Rate</div>
                            <div>{vital.heartRate} bpm</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Blood Glucose</div>
                            <div>{vital.bloodGlucose} mmol/L</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">O₂ Saturation</div>
                            <div>{vital.oxygenSaturation}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
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

      <div id="patient-report" className="hidden">
        <div className="p-6 bg-white space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold">{patient.name}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
              <div>{patient.age} years ({patient.dateOfBirth})</div>
              <div>•</div>
              <div>{patient.gender}</div>
              <div>•</div>
              <div>ID: {patient.id}</div>
              <div>•</div>
              <div>{patient.community}</div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <div>{patient.contact.phone}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div>{patient.contact.email}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Address</div>
                <div>{patient.contact.address}</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Active Diagnoses</h3>
            <div className="space-y-2">
              {patient.diagnoses
                .filter(d => d.status === "active")
                .map((diagnosis, i) => (
                  <div key={i} className="border p-3 rounded-lg">
                    <h4 className="font-medium">{diagnosis.condition}</h4>
                    <div className="text-sm mt-1">
                      <span className="text-muted-foreground">Diagnosed: </span>
                      {diagnosis.diagnosedDate} by {diagnosis.diagnosedBy}
                    </div>
                    {diagnosis.treatmentPlan && (
                      <div className="text-sm mt-2">
                        <span className="text-muted-foreground">Treatment: </span>
                        {diagnosis.treatmentPlan}
                      </div>
                    )}
                  </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Current Medications</h3>
            <div className="space-y-2">
              {patient.medications.map((med, i) => (
                <div key={i} className="border p-3 rounded-lg">
                  <h4 className="font-medium">{med.name}</h4>
                  <div className="text-sm">
                    {med.dosage}, {med.frequency}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Purpose: </span>
                    {med.purpose}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Prescribed by: </span>
                    {med.prescribedBy}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Recent Lab Results</h3>
            <div className="space-y-2">
              {patient.labResults.map((lab, i) => (
                <div key={i} className="border p-3 rounded-lg">
                  <h4 className="font-medium">{lab.testName}</h4>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Date: </span>
                    {lab.date}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Result: </span>
                    {lab.result}
                  </div>
                  {lab.normalRange && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Normal Range: </span>
                      {lab.normalRange}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Recent Vitals</h3>
            <div className="space-y-2">
              {patient.vitals.slice(0, 1).map((vital, i) => (
                <div key={i} className="border p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    Recorded on: {new Date(vital.timestamp).toLocaleDateString()}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    <div>
                      <div className="text-sm text-muted-foreground">Blood Pressure</div>
                      <div>{vital.bloodPressure}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Heart Rate</div>
                      <div>{vital.heartRate} bpm</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Blood Glucose</div>
                      <div>{vital.bloodGlucose} mmol/L</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">O₂ Saturation</div>
                      <div>{vital.oxygenSaturation}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground border-t pt-4">
            Generated on {new Date().toLocaleString()} by KweCare Health
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
          <TabsTrigger value="overview" className="gap-2">
            <Activity className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="vitals" className="gap-2">
            <Heart className="h-4 w-4" />
            <span>Vitals</span>
          </TabsTrigger>
          <TabsTrigger value="medications" className="gap-2">
            <Pill className="h-4 w-4" />
            <span>Medications</span>
          </TabsTrigger>
          <TabsTrigger value="labs" className="gap-2">
            <Flask className="h-4 w-4" />
            <span>Lab Results</span>
          </TabsTrigger>
          <TabsTrigger value="diagnoses" className="gap-2">
            <Clipboard className="h-4 w-4" />
            <span>Diagnoses</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2">
            <FileText className="h-4 w-4" />
            <span>Notes</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Vitals</CardTitle>
                </CardHeader>
                <CardContent>
                  {patient.vitals.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Blood Pressure</div>
                        <div className="flex items-center">
                          <span className="text-xl font-semibold">{patient.vitals[0].bloodPressure}</span>
                          <ArrowUpDown className="h-4 w-4 ml-2 text-red-500" />
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Heart Rate</div>
                        <div className="flex items-center">
                          <span className="text-xl font-semibold">{patient.vitals[0].heartRate}</span>
                          <span className="text-sm ml-1">bpm</span>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Blood Glucose</div>
                        <div className="flex items-center">
                          <span className="text-xl font-semibold">{patient.vitals[0].bloodGlucose}</span>
                          <span className="text-sm ml-1">mmol/L</span>
                          <ArrowUpDown className="h-4 w-4 ml-2 text-amber-500" />
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">O₂ Saturation</div>
                        <div className="flex items-center">
                          <span className="text-xl font-semibold">{patient.vitals[0].oxygenSaturation}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-4">
                    Last recorded: {new Date(patient.vitals[0].timestamp).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Diagnoses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {patient.diagnoses
                      .filter(d => d.status === "active")
                      .map((diagnosis, i) => (
                        <div key={i} className="bg-muted/30 p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{diagnosis.condition}</h4>
                            <Badge variant="outline" className={`${getStatusColor(diagnosis.status)}`}>
                              {diagnosis.status}
                            </Badge>
                          </div>
                          <div className="text-sm mt-1">
                            <span className="text-muted-foreground">Diagnosed: </span>
                            {diagnosis.diagnosedDate} by {diagnosis.diagnosedBy}
                          </div>
                          {diagnosis.treatmentPlan && (
                            <div className="text-sm mt-2">
                              <span className="text-muted-foreground">Treatment: </span>
                              {diagnosis.treatmentPlan}
                            </div>
                          )}
                        </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {patient.notes.slice(0, 2).map((note, i) => (
                      <div key={i} className={`p-4 rounded-lg ${note.isTraditionalKnowledge ? 'bg-green-50' : 'bg-muted/30'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-medium">{note.provider}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {new Date(note.date).toLocaleDateString()}
                            </span>
                          </div>
                          {note.isTraditionalKnowledge && (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              Traditional Knowledge
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm mb-2">{note.content}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {note.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View All Notes
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Patient Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Contact Details</h4>
                        <div className="space-y-1 text-sm">
                          <div>{patient.contact.phone}</div>
                          <div>{patient.contact.email}</div>
                          <div>{patient.contact.address}</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Emergency Contact</h4>
                        <div className="space-y-1 text-sm">
                          <div>{patient.emergencyContact?.name}</div>
                          <div>{patient.emergencyContact?.relationship}</div>
                          <div>{patient.emergencyContact?.phone}</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Cultural Considerations</h4>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="font-medium">Language: </span>
                            {patient.culturalInformation.preferredLanguage}
                          </div>
                          <div>
                            <span className="font-medium">Traditional Practices: </span>
                            {patient.culturalInformation.traditionalPractices.join(", ")}
                          </div>
                          {patient.culturalInformation.culturalConsiderations && (
                            <div>
                              <span className="font-medium">Considerations: </span>
                              {patient.culturalInformation.culturalConsiderations.join(", ")}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Medical History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Allergies</h4>
                        <div className="flex flex-wrap gap-1">
                          {patient.medicalHistory.allergies.map((allergy, i) => (
                            <Badge key={i} variant="destructive" className="text-xs">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Surgeries</h4>
                        <div className="space-y-2 text-sm">
                          {patient.medicalHistory.surgeries.map((surgery, i) => (
                            <div key={i}>
                              <div className="font-medium">{surgery.procedure}</div>
                              <div className="text-muted-foreground">{surgery.date}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Family History</h4>
                        <ul className="list-disc list-inside text-sm">
                          {patient.medicalHistory.familyHistory.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Leaf className="h-5 w-5 mr-2 text-green-700" />
                      Traditional Medicine
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {patient.medications
                        .filter(med => med.isTraditional)
                        .map((med, i) => (
                          <div key={i} className="bg-green-100/50 p-3 rounded-lg">
                            <div className="font-medium">{med.name}</div>
                            <div className="text-sm mt-1">{med.dosage}, {med.frequency}</div>
                            <div className="text-sm mt-1">
                              <span className="text-muted-foreground">Purpose: </span>
                              {med.purpose}
                            </div>
                            <div className="text-sm mt-1">
                              <span className="text-muted-foreground">Guided by: </span>
                              {med.prescribedBy}
                            </div>
                            {med.notes && (
                              <div className="text-sm mt-2 italic">
                                {med.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      
                      {patient.medications.filter(med => med.isTraditional).length === 0 && (
                        <div className="text-sm text-muted-foreground">
                          No traditional medicines currently recorded.
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-green-800 border-green-200 hover:bg-green-100"
                    >
                      <Star className="h-4 w-4 mr-2 text-yellow-500" />
                      Request Elder Consultation
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="vitals">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Vitals History</CardTitle>
                <Button>Record New Vitals</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-muted-foreground text-sm">
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">BP</th>
                      <th className="px-4 py-2">HR</th>
                      <th className="px-4 py-2">RR</th>
                      <th className="px-4 py-2">Temp</th>
                      <th className="px-4 py-2">Glucose</th>
                      <th className="px-4 py-2">O₂ Sat</th>
                      <th className="px-4 py-2">Weight</th>
                      <th className="px-4 py-2">BMI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patient.vitals.map((vital, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-muted/30' : ''}>
                        <td className="px-4 py-3 text-sm">
                          {new Date(vital.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 font-medium">{vital.bloodPressure}</td>
                        <td className="px-4 py-3">{vital.heartRate} bpm</td>
                        <td className="px-4 py-3">{vital.respiratoryRate} /min</td>
                        <td className="px-4 py-3">{vital.temperature}°C</td>
                        <td className="px-4 py-3">{vital.bloodGlucose} mmol/L</td>
                        <td className="px-4 py-3">{vital.oxygenSaturation}%</td>
                        <td className="px-4 py-3">{vital.weight} kg</td>
                        <td className="px-4 py-3">{vital.bmi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="medications">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Current Medications</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">Medication History</Button>
                  <Button>Add Medication</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patient.medications.map((med, i) => (
                  <div 
                    key={i} 
                    className={`p-4 rounded-lg ${med.isTraditional ? 'bg-green-50' : 'bg-muted/30'}`}
                  >
                    <div className="flex justify-between">
                      <h3 className="font-medium">{med.name}</h3>
                      {med.isTraditional && (
                        <Badge className="bg-green-100 text-green-800">Traditional</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <div className="text-xs text-muted-foreground">Dosage</div>
                        <div className="text-sm">{med.dosage}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Frequency</div>
                        <div className="text-sm">{med.frequency}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Started</div>
                        <div className="text-sm">{med.startDate}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Prescribed by</div>
                        <div className="text-sm">{med.prescribedBy}</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground">Purpose</div>
                      <div className="text-sm">{med.purpose}</div>
                    </div>
                    {med.notes && (
                      <div className="mt-2 text-sm italic bg-muted/50 p-2 rounded">
                        {med.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="labs">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Laboratory Results</CardTitle>
                <div className="flex gap-2">
                  <Button>Add Lab Results</Button>
                  <Button variant="outline">Order New Tests</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patient.labResults.map((lab, i) => (
                  <div key={i} className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{lab.testName}</h3>
                      <div className="flex items-center">
                        <Badge 
                          className={`
                            ${lab.interpretation === 'normal' ? 'bg-green-100 text-green-800' : 
                              lab.interpretation === 'abnormal' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}
                          `}
                        >
                          {lab.interpretation}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                      <div>
                        <div className="text-xs text-muted-foreground">Date</div>
                        <div className="text-sm">{lab.date}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Result</div>
                        <div className="text-sm">{lab.result}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Normal Range</div>
                        <div className="text-sm">{lab.normalRange || "Not specified"}</div>
                      </div>
                    </div>
                    {lab.notes && (
                      <div className="mt-3 text-sm italic bg-muted/50 p-2 rounded">
                        {lab.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="diagnoses">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Diagnosis List</CardTitle>
                <Button>Add Diagnosis</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patient.diagnoses.map((diagnosis, i) => (
                  <div key={i} className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{diagnosis.condition}</h3>
                      <Badge 
                        className={`
                          ${diagnosis.status === 'active' ? 'bg-red-100 text-red-800' : 
                            diagnosis.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                            'bg-yellow-100 text-yellow-800'}
                        `}
                      >
                        {diagnosis.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <div className="text-xs text-muted-foreground">Diagnosed Date</div>
                        <div className="text-sm">{diagnosis.diagnosedDate}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Diagnosed By</div>
                        <div className="text-sm">{diagnosis.diagnosedBy}</div>
                      </div>
                    </div>
                    {diagnosis.treatmentPlan && (
                      <div className="mt-3">
                        <div className="text-xs text-muted-foreground">Treatment Plan</div>
                        <div className="text-sm p-2 bg-muted/50 rounded mt-1">
                          {diagnosis.treatmentPlan}
                        </div>
                      </div>
                    )}
                    {diagnosis.notes && (
                      <div className="mt-3">
                        <div className="text-xs text-muted-foreground">Notes</div>
                        <div className="text-sm italic mt-1">{diagnosis.notes}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Clinical Notes</CardTitle>
                <div className="flex gap-2">
                  <Button>Add Clinical Note</Button>
                  <Button variant="outline" className="gap-2">
                    <Leaf className="h-4 w-4" />
                    Traditional Knowledge Note
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patient.notes.map((note, i) => (
                  <div 
                    key={i} 
                    className={`p-4 rounded-lg ${note.isTraditionalKnowledge ? 'bg-green-50 border border-green-200' : 'bg-muted/30'}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium">{note.provider}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(note.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {note.followUpRequired && (
                          <Badge variant="destructive">Follow-up Required</Badge>
                        )}
                        {note.isTraditionalKnowledge && (
                          <Badge className="bg-green-100 text-green-800">
                            Traditional Knowledge
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm">
                      {note.content}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {note.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientRecordViewer;
