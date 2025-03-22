
export interface Appointment {
  id: number;
  title: string;
  doctor: string;
  specialty: string;
  time: string;
  date: Date;
  status: "upcoming" | "scheduled" | "completed" | "cancelled";
  notes?: string;
  location?: string;
  type?: "in-person" | "telemedicine";
  duration?: number; // in minutes
}

export interface AppointmentAction {
  id: number;
  label: string;
  icon: React.ReactNode;
  onClick: (appointmentId: number) => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  disabled?: boolean;
}
