export type ClinicalAlert = {
  patientId: number;
  patientName: string;
  alert: string;
  severity: "low" | "moderate" | "high" | "critical";
  date: string;
};

export const clinicalAlerts: ClinicalAlert[] = [
  { patientId: 1, patientName: "Sarah Johnson", alert: "Blood glucose consistently elevated for 5 days", severity: "moderate", date: "2 days ago" },
  { patientId: 4, patientName: "David Wilson", alert: "Missed last 3 medication check-ins", severity: "high", date: "1 day ago" },
  { patientId: 4, patientName: "David Wilson", alert: "Reported increased chest pain", severity: "critical", date: "5 hours ago" },
  { patientId: 5, patientName: "Maria Rodriguez", alert: "Anxiety symptoms worsening", severity: "moderate", date: "12 hours ago" },
  { patientId: 4, patientName: "David Wilson", alert: "Blood pressure readings above threshold", severity: "high", date: "3 days ago" },
];

export type SimpleAppointment = {
  id: number;
  patient: string;
  time: string;
  type: string;
  virtual: boolean;
};

export const upcomingAppointments: SimpleAppointment[] = [
  { id: 1, patient: "David Wilson", time: "Today, 2:30 PM", type: "Follow-up", virtual: true },
  { id: 2, patient: "Sarah Johnson", time: "Tomorrow, 10:00 AM", type: "Medication Review", virtual: true },
  { id: 3, patient: "Michael Chen", time: "Nov 25, 1:15 PM", type: "Asthma Assessment", virtual: false },
  { id: 4, patient: "Aisha Patel", time: "Nov 28, 11:30 AM", type: "Prenatal Check", virtual: true },
];

export type CommunityHealthData = {
  community: string;
  diabetesRate: number;
  heartDiseaseRate: number;
  mentalHealthRate: number;
};

export const communityHealthData: CommunityHealthData[] = [
  { community: "White River", diabetesRate: 12.5, heartDiseaseRate: 8.2, mentalHealthRate: 15.1 },
  { community: "Northern Tutchone", diabetesRate: 10.2, heartDiseaseRate: 7.8, mentalHealthRate: 12.8 },
  { community: "Kaska Dena", diabetesRate: 11.8, heartDiseaseRate: 9.5, mentalHealthRate: 14.2 },
  { community: "Champagne", diabetesRate: 13.4, heartDiseaseRate: 10.1, mentalHealthRate: 16.5 },
  { community: "Vuntut Gwitchin", diabetesRate: 9.7, heartDiseaseRate: 6.4, mentalHealthRate: 11.9 },
];

export type RecentMessage = {
  id: number;
  from: string;
  subject: string;
  time: string;
  read: boolean;
};

export const recentMessages: RecentMessage[] = [
  { id: 1, from: "Dr. Rebecca Taylor", subject: "Re: Treatment protocol for David Wilson", time: "35 minutes ago", read: false },
  { id: 2, from: "Nurse James White", subject: "Lab results for Sarah Johnson", time: "2 hours ago", read: true },
  { id: 3, from: "Community Health Worker", subject: "Visiting schedule for next week", time: "Yesterday", read: true },
]; 