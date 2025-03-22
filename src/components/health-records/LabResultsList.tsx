
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
import { Download, FileDown, Filter, Search, Share2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Data moved from HealthRecords.tsx
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

// Result badge helper function moved from HealthRecords.tsx
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

interface LabResultsListProps {
  searchQuery: string;
  onSearch: (tab: string, e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LabResultsList: React.FC<LabResultsListProps> = ({ searchQuery, onSearch }) => {
  const filteredLabResults = searchQuery.trim() === ""
    ? labResults
    : labResults.filter(
        (lab) =>
          lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lab.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lab.result.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleDownload = (id: number) => {
    toast.success(`Downloading lab result #${id}`);
  };

  const handleShare = (id: number) => {
    toast.success(`Preparing to share lab result #${id}`);
  };

  const handleAddRecord = () => {
    toast.success("Adding new lab result - feature coming soon");
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-2 sm:w-auto w-full">
          <Button 
            variant="outline" 
            className="sm:w-auto w-full"
            onClick={handleAddRecord}
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
            onChange={(e) => onSearch("lab-results", e)}
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
                        onClick={() => handleDownload(lab.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleShare(lab.id)}
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

export default LabResultsList;
