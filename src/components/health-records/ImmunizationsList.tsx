
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
import { Download, ListPlus, Search, Share2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Data moved from HealthRecords.tsx
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

interface ImmunizationsListProps {
  searchQuery: string;
  onSearch: (tab: string, e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImmunizationsList: React.FC<ImmunizationsListProps> = ({ searchQuery, onSearch }) => {
  const filteredImmunizations = searchQuery.trim() === ""
    ? immunizations
    : immunizations.filter(
        (imm) =>
          imm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          imm.provider.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleDownload = (id: number) => {
    toast.success(`Downloading immunization record #${id}`);
  };

  const handleShare = (id: number) => {
    toast.success(`Preparing to share immunization record #${id}`);
  };

  const handleAddRecord = () => {
    toast.success("Adding new immunization record - feature coming soon");
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
          Add Immunization
        </Button>
        
        <div className="relative sm:w-auto w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search immunizations..."
            className="pl-8 w-full sm:w-[250px]"
            value={searchQuery}
            onChange={(e) => onSearch("immunizations", e)}
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
                        onClick={() => handleDownload(imm.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleShare(imm.id)}
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

export default ImmunizationsList;
