
import React, { useState } from "react";
import Header from "@/components/ui/layout/Header";
import Footer from "@/components/ui/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  Download, 
  FileDown, 
  FileText, 
  Filter, 
  Search, 
  Share2,
  Syringe,
  Tablet,
  Thermometer,
  Flask,
  ListPlus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const medications = [
  {
    id: 1,
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    prescribedBy: "Dr. Sarah Johnson",
    startDate: "Oct 15, 2023",
    endDate: "Ongoing",
    instructions: "Take with food",
    status: "Active",
    type: "Tablet",
  },
  {
    id: 2,
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    prescribedBy: "Dr. Michael Chen",
    startDate: "Aug 22, 2023",
    endDate: "Ongoing",
    instructions: "Take in the morning",
    status: "Active",
    type: "Tablet",
  },
  {
    id: 3,
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily",
    prescribedBy: "Dr. Michael Chen",
    startDate: "Aug 22, 2023",
    endDate: "Ongoing",
    instructions: "Take in the evening",
    status: "Active",
    type: "Tablet",
  },
];

const labResults = [
  {
    id: 1,
    name: "Complete Blood Count (CBC)",
    date: "Oct 10, 2023",
    provider: "Central Lab Services",
    doctor: "Dr. Sarah Johnson",
    status: "Completed",
    result: "Normal",
  },
  {
    id: 2,
    name: "Hemoglobin A1C",
    date: "Oct 10, 2023",
    provider: "Central Lab Services",
    doctor: "Dr. Sarah Johnson",
    status: "Completed",
    result: "7.1% (High)",
  },
  {
    id: 3,
    name: "Lipid Panel",
    date: "Oct 10, 2023",
    provider: "Central Lab Services",
    doctor: "Dr. Sarah Johnson",
    status: "Completed",
    result: "Borderline",
  },
  {
    id: 4,
    name: "Thyroid Function Test",
    date: "Aug 15, 2023",
    provider: "Central Lab Services",
    doctor: "Dr. Michael Chen",
    status: "Completed",
    result: "Normal",
  },
  {
    id: 5,
    name: "Urinalysis",
    date: "Aug 15, 2023",
    provider: "Central Lab Services",
    doctor: "Dr. Michael Chen",
    status: "Completed",
    result: "Normal",
  },
];

const immunizations = [
  {
    id: 1,
    name: "Influenza Vaccine",
    date: "Sep 15, 2023",
    provider: "Community Healthcare",
    administrator: "Nurse Wilson",
    lot: "FL23456",
    nextDue: "Sep 2024",
  },
  {
    id: 2,
    name: "COVID-19 Booster",
    date: "Jul 22, 2023",
    provider: "Community Healthcare",
    administrator: "Nurse Rodriguez",
    lot: "CV78901",
    nextDue: "As recommended",
  },
  {
    id: 3,
    name: "Tdap (Tetanus, Diphtheria, Pertussis)",
    date: "Mar 10, 2022",
    provider: "Family Care Clinic",
    administrator: "Dr. Emily White",
    lot: "TD34567",
    nextDue: "Mar 2032",
  },
];

const getResultBadge = (result: string) => {
  if (result.toLowerCase().includes("normal")) {
    return (
      <div className="px-2 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium">
        {result}
      </div>
    );
  } else if (result.toLowerCase().includes("high") || result.toLowerCase().includes("low")) {
    return (
      <div className="px-2 py-1 rounded-full bg-amber-100 text-amber-600 text-xs font-medium">
        {result}
      </div>
    );
  } else {
    return (
      <div className="px-2 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
        {result}
      </div>
    );
  }
};

const HealthRecords = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMedications, setFilteredMedications] = useState(medications);
  const [filteredLabResults, setFilteredLabResults] = useState(labResults);
  const [filteredImmunizations, setFilteredImmunizations] = useState(immunizations);
  const navigate = useNavigate();

  const handleSearch = (tab: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setFilteredMedications(medications);
      setFilteredLabResults(labResults);
      setFilteredImmunizations(immunizations);
    } else {
      switch (tab) {
        case "medications":
          const filteredMeds = medications.filter(
            (med) =>
              med.name.toLowerCase().includes(query) ||
              med.prescribedBy.toLowerCase().includes(query)
          );
          setFilteredMedications(filteredMeds);
          break;
        case "lab-results":
          const filteredLabs = labResults.filter(
            (lab) =>
              lab.name.toLowerCase().includes(query) ||
              lab.doctor.toLowerCase().includes(query) ||
              lab.result.toLowerCase().includes(query)
          );
          setFilteredLabResults(filteredLabs);
          break;
        case "immunizations":
          const filteredImm = immunizations.filter(
            (imm) =>
              imm.name.toLowerCase().includes(query) ||
              imm.provider.toLowerCase().includes(query)
          );
          setFilteredImmunizations(filteredImm);
          break;
      }
    }
  };

  const handleDownload = (id: number, type: string) => {
    toast.success(`Downloading ${type} record #${id}`);
  };

  const handleShare = (id: number, type: string) => {
    toast.success(`Preparing to share ${type} record #${id}`);
  };

  const handleAddRecord = (type: string) => {
    toast.success(`Adding new ${type} record - feature coming soon`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Header />
      
      <main className="flex-1 pt-28 px-6 pb-16 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold">Health Records</h1>
            <p className="text-muted-foreground mt-1">
              Your complete medical history
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
            <Button 
              className="bg-kwecare-primary hover:bg-kwecare-primary/90"
              onClick={() => handleAddRecord("health")}
            >
              <FileText className="h-4 w-4 mr-1" />
              Request Records
            </Button>
          </div>
        </div>
        
        <Card className="glass-card animate-fade-in" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-kwecare-primary" />
              Medical Records
            </CardTitle>
            <CardDescription>
              View and manage your health information
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="medications" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="medications" className="flex items-center gap-1">
                  <Tablet className="h-4 w-4" />
                  <span className="hidden sm:inline">Medications</span>
                </TabsTrigger>
                <TabsTrigger value="lab-results" className="flex items-center gap-1">
                  <Flask className="h-4 w-4" />
                  <span className="hidden sm:inline">Lab Results</span>
                </TabsTrigger>
                <TabsTrigger value="immunizations" className="flex items-center gap-1">
                  <Syringe className="h-4 w-4" />
                  <span className="hidden sm:inline">Immunizations</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Medications Tab */}
              <TabsContent value="medications" className="mt-0">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                  <Button 
                    variant="outline" 
                    className="sm:w-auto w-full"
                    onClick={() => handleAddRecord("medication")}
                  >
                    <ListPlus className="h-4 w-4 mr-1" />
                    Add Medication
                  </Button>
                  
                  <div className="relative sm:w-auto w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search medications..."
                      className="pl-8 w-full sm:w-[250px]"
                      value={searchQuery}
                      onChange={(e) => handleSearch("medications", e)}
                    />
                  </div>
                </div>
                
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medication</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Prescribed By</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMedications.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                            No medications found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredMedications.map((med) => (
                          <TableRow key={med.id}>
                            <TableCell className="font-medium">{med.name}</TableCell>
                            <TableCell>{med.dosage}</TableCell>
                            <TableCell>{med.frequency}</TableCell>
                            <TableCell>{med.prescribedBy}</TableCell>
                            <TableCell>{med.startDate}</TableCell>
                            <TableCell>
                              <div className="px-2 py-1 rounded-full bg-green-100 text-green-600 text-xs inline-block">
                                {med.status}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleDownload(med.id, "medication")}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleShare(med.id, "medication")}
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              {/* Lab Results Tab */}
              <TabsContent value="lab-results" className="mt-0">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                  <div className="flex gap-2 sm:w-auto w-full">
                    <Button 
                      variant="outline" 
                      className="sm:w-auto w-full"
                      onClick={() => handleAddRecord("lab result")}
                    >
                      <FileDown className="h-4 w-4 mr-1" />
                      Upload Results
                    </Button>
                    <Button variant="outline" className="sm:w-auto w-full">
                      <Filter className="h-4 w-4 mr-1" />
                      Filter
                    </Button>
                  </div>
                  
                  <div className="relative sm:w-auto w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search lab results..."
                      className="pl-8 w-full sm:w-[250px]"
                      value={searchQuery}
                      onChange={(e) => handleSearch("lab-results", e)}
                    />
                  </div>
                </div>
                
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLabResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                            No lab results found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredLabResults.map((lab) => (
                          <TableRow key={lab.id}>
                            <TableCell className="font-medium">{lab.name}</TableCell>
                            <TableCell>{lab.date}</TableCell>
                            <TableCell>{lab.provider}</TableCell>
                            <TableCell>{lab.doctor}</TableCell>
                            <TableCell>{getResultBadge(lab.result)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleDownload(lab.id, "lab result")}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleShare(lab.id, "lab result")}
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              {/* Immunizations Tab */}
              <TabsContent value="immunizations" className="mt-0">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                  <Button 
                    variant="outline" 
                    className="sm:w-auto w-full"
                    onClick={() => handleAddRecord("immunization")}
                  >
                    <ListPlus className="h-4 w-4 mr-1" />
                    Add Immunization
                  </Button>
                  
                  <div className="relative sm:w-auto w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search immunizations..."
                      className="pl-8 w-full sm:w-[250px]"
                      value={searchQuery}
                      onChange={(e) => handleSearch("immunizations", e)}
                    />
                  </div>
                </div>
                
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vaccine</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Administrator</TableHead>
                        <TableHead>Next Due</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredImmunizations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                            No immunizations found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredImmunizations.map((imm) => (
                          <TableRow key={imm.id}>
                            <TableCell className="font-medium">{imm.name}</TableCell>
                            <TableCell>{imm.date}</TableCell>
                            <TableCell>{imm.provider}</TableCell>
                            <TableCell>{imm.administrator}</TableCell>
                            <TableCell>{imm.nextDue}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleDownload(imm.id, "immunization")}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleShare(imm.id, "immunization")}
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default HealthRecords;
