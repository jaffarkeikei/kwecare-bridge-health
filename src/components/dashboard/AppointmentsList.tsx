
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Phone, Video, MapPin, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Appointment } from "@/types/appointment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface AppointmentsListProps {
  appointments: Appointment[];
  isLoading?: boolean;
  error?: string;
  showViewAll?: boolean;
  limit?: number;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ 
  appointments, 
  isLoading = false, 
  error,
  showViewAll = true,
  limit = 3
}) => {
  const navigate = useNavigate();
  const [expandedAppointment, setExpandedAppointment] = useState<number | null>(null);

  const handleJoinCall = (id: number) => {
    toast.success(`Joining telemedicine call for appointment #${id}`);
  };

  const handleReschedule = (id: number) => {
    toast.info(`Rescheduling appointment #${id}`);
  };

  const handleCancel = (id: number) => {
    toast.info(`Cancelling appointment #${id}`);
  };

  const handleViewDetails = (id: number) => {
    setExpandedAppointment(expandedAppointment === id ? null : id);
  };

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
      case "cancelled":
        return (
          <div className="px-2 py-1 rounded-full bg-red-100 text-red-600 text-xs font-medium">
            Cancelled
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-24" />
        </div>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="w-full h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-700">
        <p>Error loading appointments: {error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  const displayedAppointments = limit ? appointments.slice(0, limit) : appointments;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
        {showViewAll && appointments.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => navigate('/appointments')}
          >
            <Calendar className="mr-1 h-3 w-3" />
            View All
          </Button>
        )}
      </div>

      {displayedAppointments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
          <Calendar className="h-10 w-10 mx-auto text-muted-foreground/60 mb-2" />
          <p>No upcoming appointments</p>
          <Button 
            variant="link" 
            size="sm" 
            className="mt-2"
            onClick={() => navigate('/appointments')}
          >
            Schedule an appointment
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedAppointments.map((appointment) => (
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
                <div className="flex items-center gap-2">
                  {getStatusBadge(appointment.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(appointment.id)}>
                        {expandedAppointment === appointment.id ? 'Hide Details' : 'View Details'}
                      </DropdownMenuItem>
                      {appointment.status !== "completed" && appointment.status !== "cancelled" && (
                        <>
                          <DropdownMenuItem onClick={() => handleReschedule(appointment.id)}>
                            Reschedule
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleCancel(appointment.id)}
                            className="text-red-600"
                          >
                            Cancel
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 mt-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  {appointment.time}
                </div>
                
                {appointment.location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 mr-1.5" />
                    {appointment.location}
                  </div>
                )}
              </div>
              
              {expandedAppointment === appointment.id && (
                <div className="mt-3 pt-3 border-t border-border">
                  {appointment.notes && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Notes:</p>
                      <p className="text-sm">{appointment.notes}</p>
                    </div>
                  )}
                  {appointment.type && (
                    <div className="mt-2 flex items-center">
                      <p className="text-xs text-muted-foreground mr-2">Type:</p>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        appointment.type === "telemedicine" 
                          ? "bg-blue-100 text-blue-600" 
                          : "bg-purple-100 text-purple-600"
                      }`}>
                        {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-4 flex items-center gap-2">
                {appointment.status === "upcoming" ? (
                  <>
                    <Button 
                      size="sm" 
                      className="bg-kwecare-primary hover:bg-kwecare-primary/90 text-xs h-8"
                      onClick={() => handleJoinCall(appointment.id)}
                    >
                      <Video className="mr-1 h-3 w-3" />
                      Join Call
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-8"
                      onClick={() => handleReschedule(appointment.id)}
                    >
                      Reschedule
                    </Button>
                  </>
                ) : appointment.status === "scheduled" ? (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs h-8"
                      onClick={() => handleViewDetails(appointment.id)}
                    >
                      {expandedAppointment === appointment.id ? 'Hide Details' : 'View Details'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-xs h-8"
                      onClick={() => handleReschedule(appointment.id)}
                    >
                      Reschedule
                    </Button>
                  </>
                ) : appointment.status === "completed" ? (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs h-8"
                      onClick={() => handleViewDetails(appointment.id)}
                    >
                      {expandedAppointment === appointment.id ? 'Hide Details' : 'View Details'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-xs h-8"
                      onClick={() => navigate('/health-records')}
                    >
                      <Phone className="mr-1 h-3 w-3" />
                      Follow Up
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs h-8"
                    onClick={() => navigate('/appointments')}
                  >
                    <Calendar className="mr-1 h-3 w-3" />
                    Reschedule
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;
