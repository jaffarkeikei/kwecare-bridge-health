
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  ClipboardList, 
  Search,
  PlusCircle,
  UserCog
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/ui/layout/Header";
import Footer from "@/components/ui/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

type ProviderTab = "patients" | "appointments" | "records";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProviderTab>("patients");
  const [searchQuery, setSearchQuery] = useState("");

  // Mockup data for patients
  const patients = [
    { id: 1, name: "Sarah Johnson", age: 34, lastVisit: "Oct 15, 2023", conditions: "Diabetes, Hypertension" },
    { id: 2, name: "Michael Chen", age: 45, lastVisit: "Sep 22, 2023", conditions: "Asthma" },
    { id: 3, name: "Aisha Patel", age: 28, lastVisit: "Nov 05, 2023", conditions: "Pregnancy" },
    { id: 4, name: "David Wilson", age: 62, lastVisit: "Oct 30, 2023", conditions: "Arthritis, Heart Disease" },
    { id: 5, name: "Maria Rodriguez", age: 41, lastVisit: "Nov 10, 2023", conditions: "Migraine" },
  ];

  // Filter patients based on search query
  const filteredPatients = searchQuery.trim() === ""
    ? patients
    : patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.conditions.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handlePatientSelect = (patientId: number) => {
    toast.success(`Viewing patient #${patientId} details`);
    // In a real app, navigate to the patient details page
  };

  const handleAddPatient = () => {
    toast.success("Add new patient - feature coming soon");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "patients":
        return (
          <Card className="glass-card animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Your Patients</CardTitle>
                <CardDescription>Manage your patient list and access patient information</CardDescription>
              </div>
              <Button onClick={handleAddPatient} variant="branded">
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Patient
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search patients by name or condition..."
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead>Conditions</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                          No patients found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPatients.map((patient) => (
                        <TableRow key={patient.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{patient.name}</TableCell>
                          <TableCell>{patient.age}</TableCell>
                          <TableCell>{patient.lastVisit}</TableCell>
                          <TableCell>
                            {patient.conditions.split(", ").map((condition, i) => (
                              <span key={i} className="inline-block px-2 py-1 mr-1 mb-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                                {condition}
                              </span>
                            ))}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handlePatientSelect(patient.id)}
                              >
                                <UserCog className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        );
      case "appointments":
        return (
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl">Appointment Schedule</CardTitle>
              <CardDescription>Manage your upcoming appointments with patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center p-12 text-muted-foreground">
                <p>Appointment management coming soon</p>
              </div>
            </CardContent>
          </Card>
        );
      case "records":
        return (
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl">Patient Records</CardTitle>
              <CardDescription>Access and manage patient health records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center p-12 text-muted-foreground">
                <p>Health records management coming soon</p>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Provider Dashboard | KweCare</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
        <Header />

        <main className="flex-1 pt-28 px-4 md:px-6 pb-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Healthcare Provider Dashboard</h1>
          </div>

          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as ProviderTab)}
            className="mb-8"
          >
            <TabsList className="grid grid-cols-3 gap-2">
              <TabsTrigger value="patients" className="gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden md:inline">Patients</span>
              </TabsTrigger>
              <TabsTrigger value="appointments" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden md:inline">Appointments</span>
              </TabsTrigger>
              <TabsTrigger value="records" className="gap-2">
                <ClipboardList className="h-4 w-4" />
                <span className="hidden md:inline">Health Records</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {renderContent()}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProviderDashboard;
