import { Patient } from './patientData';

export type AppointmentType = "follow-up" | "initial" | "medication-review" | "assessment" | "check" | "other";

export type Appointment = {
  id: number;
  patientId: number;
  patientName: string;
  providerId: string;
  providerName: string;
  date: Date | number;
  time: string;
  reason: string;
  type: "telemedicine" | "in-person";
  duration: number;
  status: "scheduled" | "upcoming" | "completed" | "cancelled";
  isTraditionalConsult: boolean;
};

export const upcomingAppointments = [
  { id: 1, patient: "David Wilson", time: "Today, 2:30 PM", type: "Follow-up", virtual: true },
  { id: 2, patient: "Sarah Johnson", time: "Tomorrow, 10:00 AM", type: "Medication Review", virtual: true },
  { id: 3, patient: "Michael Chen", time: "Nov 25, 1:15 PM", type: "Asthma Assessment", virtual: false },
  { id: 4, patient: "Aisha Patel", time: "Nov 28, 11:30 AM", type: "Prenatal Check", virtual: true },
];

// Convert upcoming appointments to the Appointment type
export const convertToAppointments = (
  appointments: typeof upcomingAppointments,
  patients: Patient[]
): Appointment[] => {
  return appointments.map(apt => ({
    id: apt.id,
    patientId: patients.find(p => p.name === apt.patient)?.id || 0,
    patientName: apt.patient,
    providerId: "1", // Current provider
    providerName: "Dr. Rebecca Taylor",
    date: new Date(apt.time.includes("Today") 
      ? new Date().setHours(parseInt(apt.time.split(":")[0].split(" ")[1]), parseInt(apt.time.split(":")[1].split(" ")[0]), 0, 0)
      : apt.time.includes("Tomorrow")
        ? new Date(new Date().setDate(new Date().getDate() + 1)).setHours(parseInt(apt.time.split(":")[0].split(" ")[1]), parseInt(apt.time.split(":")[1].split(" ")[0]), 0, 0)
        : new Date(`${apt.time}, 2023`).getTime()),
    time: apt.time,
    reason: apt.type,
    type: apt.virtual ? "telemedicine" : "in-person",
    duration: 30,
    status: apt.time.includes("Today") ? "upcoming" : "scheduled",
    isTraditionalConsult: false
  }));
}; 