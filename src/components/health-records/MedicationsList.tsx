
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, ListPlus, Search, Share2, Tablet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Data moved from HealthRecords.tsx
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

interface MedicationsListProps {
  searchQuery: string;
  onSearch: (tab: string, e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MedicationsList: React.FC<MedicationsListProps> = ({ searchQuery, onSearch }) => {
  const filteredMedications = searchQuery.trim() === ""
    ? medications
    : medications.filter(
        (med) =>
          med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          med.prescribedBy.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleDownload = (id: number) => {
    toast.success(`Downloading medication record #${id}`);
  };

  const handleShare = (id: number) => {
    toast.success(`Preparing to share medication record #${id}`);
  };

  const handleAddRecord = () => {
    toast.success("Adding new medication record - feature coming soon");
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <Button 
          variant="outline" 
          className="sm:w-auto w-full"
          onClick={handleAddRecord}
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
            onChange={(e) => onSearch("medications", e)}
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
                        onClick={() => handleDownload(med.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleShare(med.id)}
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
    </>
  );
};

export default MedicationsList;
