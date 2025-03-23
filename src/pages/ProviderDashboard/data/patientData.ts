export type Patient = {
  id: number;
  name: string;
  age: number;
  lastVisit: string;
  nextVisit: string;
  conditions: string[];
  status: "stable" | "improving" | "monitoring" | "deteriorating";
  adherence: "excellent" | "good" | "moderate" | "poor";
  community: string;
  alerts: number;
};

export const patients: Patient[] = [
  { 
    id: 1, 
    name: "Sarah Johnson", 
    age: 34, 
    lastVisit: "Oct 15, 2023",
    nextVisit: "Nov 28, 2023", 
    conditions: ["Diabetes Type 2", "Hypertension"],
    status: "stable",
    adherence: "good",
    community: "White River First Nation",
    alerts: 1
  },
  { 
    id: 2, 
    name: "Michael Chen", 
    age: 45, 
    lastVisit: "Sep 22, 2023",
    nextVisit: "Dec 05, 2023", 
    conditions: ["Asthma"],
    status: "improving",
    adherence: "excellent",
    community: "Northern Tutchone",
    alerts: 0
  },
  { 
    id: 3, 
    name: "Aisha Patel", 
    age: 28, 
    lastVisit: "Nov 05, 2023",
    nextVisit: "Dec 15, 2023", 
    conditions: ["Pregnancy", "Anemia"],
    status: "monitoring",
    adherence: "good",
    community: "Kaska Dena",
    alerts: 0
  },
  { 
    id: 4, 
    name: "David Wilson", 
    age: 62, 
    lastVisit: "Oct 30, 2023",
    nextVisit: "Nov 30, 2023", 
    conditions: ["Arthritis", "Heart Disease", "Chronic Pain"],
    status: "deteriorating",
    adherence: "poor",
    community: "Champagne First Nation",
    alerts: 3
  },
  { 
    id: 5, 
    name: "Maria Rodriguez", 
    age: 41, 
    lastVisit: "Nov 10, 2023",
    nextVisit: "Jan 12, 2024", 
    conditions: ["Migraine", "Anxiety"],
    status: "stable",
    adherence: "moderate",
    community: "Vuntut Gwitchin",
    alerts: 1
  },
]; 