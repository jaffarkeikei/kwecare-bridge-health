
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Phone, Video } from "lucide-react";

interface Appointment {
  id: number;
  title: string;
  doctor: string;
  specialty: string;
  time: string;
  status: string;
}

interface AppointmentsListProps {
  appointments: Appointment[];
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ appointments }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <div className="px-2 py-1 rounded-full bg-kwecare-primary/10 text-kwecare-primary text-xs font-medium">
            Today
          </div>
        );
      case "scheduled":
        return (
          <div className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
            Scheduled
          </div>
        );
      case "completed":
        return (
          <div className="px-2 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium">
            Completed
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
        <Button variant="outline" size="sm" className="text-xs">
          <Calendar className="mr-1 h-3 w-3" />
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="p-4 rounded-xl border border-border bg-card transition-all hover:border-kwecare-primary/20 hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{appointment.title}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {appointment.doctor} • {appointment.specialty}
                </div>
              </div>
              {getStatusBadge(appointment.status)}
            </div>
            
            <div className="flex items-center mt-3 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              {appointment.time}
            </div>
            
            <div className="mt-4 flex items-center gap-2">
              {appointment.status === "upcoming" ? (
                <>
                  <Button size="sm" className="bg-kwecare-primary hover:bg-kwecare-primary/90 text-xs h-8">
                    <Video className="mr-1 h-3 w-3" />
                    Join Call
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-8">
                    Reschedule
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="outline" className="text-xs h-8">
                    <Calendar className="mr-1 h-3 w-3" />
                    Details
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs h-8">
                    <Phone className="mr-1 h-3 w-3" />
                    Contact
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentsList;
