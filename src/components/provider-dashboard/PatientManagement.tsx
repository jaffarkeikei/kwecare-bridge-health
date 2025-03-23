import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search, UserCog, Activity, Calendar, FilePlus, TestTube, Leaf } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { patients } from "./data/patientData";
import { StatusBadge, AdherenceBadge } from "./utils/ui-helpers";

const PatientManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [communityFilter, setCommunityFilter] = useState("all");

  // Filter patients based on search query and filters
  const filteredPatients = patients
    .filter(patient => 
      (searchQuery.trim() === "" || 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.conditions.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        patient.community.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(patient => 
      statusFilter === "all" || patient.status === statusFilter
    )
    .filter(patient => 
      communityFilter === "all" || 
      patient.community.toLowerCase().includes(communityFilter.toLowerCase())
    );

  const handlePatientSelect = (patientId: number) => {
    toast.success(`Viewing patient #${patientId} details`);
    navigate(`/patient/${patientId}`);
  };

  const handleAddPatient = () => {
    toast.success("Add new patient form opened");
    // In a real app, navigate to a patient registration form
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Patient Management</CardTitle>
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
              placeholder="Search patients by name, condition or community..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select 
              defaultValue="all" 
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="stable">Stable</SelectItem>
                <SelectItem value="improving">Improving</SelectItem>
                <SelectItem value="monitoring">Monitoring</SelectItem>
                <SelectItem value="deteriorating">Needs Attention</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              defaultValue="all"
              value={communityFilter}
              onValueChange={setCommunityFilter}
            >
              <SelectTrigger className="w-[150px]">
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
          </div>
        </div>
        
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Community</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Conditions</TableHead>
                <TableHead>Adherence</TableHead>
                <TableHead>Last/Next Visit</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-32 text-muted-foreground">
                    No patients found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id} className={`cursor-pointer hover:bg-muted/50 ${patient.alerts > 0 ? 'bg-red-50/40' : ''}`}>
                    <TableCell className="font-medium flex items-center gap-2">
                      {patient.name}
                      {patient.alerts > 0 && (
                        <Badge variant="destructive" className="rounded-full h-5 w-5 p-0 flex items-center justify-center">
                          {patient.alerts}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.community}</TableCell>
                    <TableCell><StatusBadge status={patient.status} /></TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {patient.conditions.map((condition, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell><AdherenceBadge adherence={patient.adherence} /></TableCell>
                    <TableCell className="text-xs">
                      <div>Last: {patient.lastVisit}</div>
                      <div>Next: {patient.nextVisit}</div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handlePatientSelect(patient.id)}>
                            <UserCog className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Activity className="h-4 w-4 mr-2" />
                            Health Records
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Appointment
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <FilePlus className="h-4 w-4 mr-2" />
                            Add Treatment Note
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <TestTube className="h-4 w-4 mr-2" />
                            Lab Results
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Leaf className="h-4 w-4 mr-2" />
                            Traditional Knowledge
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
};

export default PatientManagement; 