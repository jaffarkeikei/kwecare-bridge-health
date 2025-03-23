import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Video, 
  MapPin, 
  Users,
  Leaf
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, addMonths, subMonths, isToday, isSameDay } from "date-fns";
import { toast } from "sonner";
import { Patient } from "./ProviderAppointmentScheduleForm";

// Define appointment types
export interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  providerId: string;
  providerName: string;
  date: Date;
  time: string;
  reason: string;
  notes?: string;
  type: "telemedicine" | "in-person" | "home-visit";
  duration: number;
  isTraditionalConsult?: boolean;
  status: "scheduled" | "completed" | "cancelled" | "upcoming";
}

interface CalendarSchedulerProps {
  appointments: Appointment[];
  patients: Patient[];
  onScheduleAppointment: () => void;
  onAppointmentSelected?: (appointment: Appointment) => void;
}

const CalendarScheduler: React.FC<CalendarSchedulerProps> = ({
  appointments,
  patients,
  onScheduleAppointment,
  onAppointmentSelected
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dateAppointments, setDateAppointments] = useState<Appointment[]>([]);
  
  // Filter appointments by selected date
  useEffect(() => {
    if (selectedDate) {
      const filtered = appointments.filter(appointment => 
        isSameDay(new Date(appointment.date), selectedDate)
      );
      setDateAppointments(filtered);
    }
  }, [selectedDate, appointments]);
  
  // Handle month navigation
  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.date), date)
    );
  };
  
  // Format appointment time to be more readable
  const formatAppointmentTime = (appointment: Appointment) => {
    const appointmentDate = new Date(appointment.date);
    return format(appointmentDate, "h:mm a");
  };
  
  // Get appointment type badge
  const getAppointmentTypeBadge = (type: string, isTraditional: boolean = false) => {
    let color = "";
    let icon = null;
    
    switch (type) {
      case "telemedicine":
        color = "bg-blue-100 text-blue-800";
        icon = <Video className="h-3 w-3 mr-1" />;
        break;
      case "in-person":
        color = "bg-green-100 text-green-800";
        icon = <MapPin className="h-3 w-3 mr-1" />;
        break;
      case "home-visit":
        color = "bg-purple-100 text-purple-800";
        icon = <Users className="h-3 w-3 mr-1" />;
        break;
      default:
        color = "bg-gray-100 text-gray-800";
    }
    
    if (isTraditional) {
      return (
        <div className="flex space-x-1">
          <Badge className={`text-xs flex items-center ${color}`}>
            {icon}{type === "telemedicine" ? "Virtual" : type === "in-person" ? "In-Person" : "Home Visit"}
          </Badge>
          <Badge className="bg-amber-100 text-amber-800 text-xs flex items-center">
            <Leaf className="h-3 w-3 mr-1" />Traditional
          </Badge>
        </div>
      );
    }
    
    return (
      <Badge className={`text-xs flex items-center ${color}`}>
        {icon}{type === "telemedicine" ? "Virtual" : type === "in-person" ? "In-Person" : "Home Visit"}
      </Badge>
    );
  };
  
  // Custom modifiers for the calendar
  const appointmentDates = appointments.map(a => new Date(a.date));
  
  // Create a modifier for dates with traditional consults
  const traditionalConsultDates = appointments
    .filter(a => a.isTraditionalConsult)
    .map(a => new Date(a.date));
  
  // Overlay content for calendar days
  const dayContentOverlay = (day: Date) => {
    const dayAppointments = getAppointmentsForDate(day);
    if (dayAppointments.length === 0) return null;
    
    const types: Record<string, number> = {};
    dayAppointments.forEach(appointment => {
      types[appointment.type] = (types[appointment.type] || 0) + 1;
    });
    
    return (
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 pb-1">
        {Object.entries(types).map(([type, count], index) => (
          <div 
            key={index} 
            className={`h-1.5 w-1.5 rounded-full ${
              type === "telemedicine" 
                ? "bg-blue-500" 
                : type === "in-person" 
                  ? "bg-green-500" 
                  : "bg-purple-500"
            }`}
            title={`${count} ${type} appointment${count > 1 ? 's' : ''}`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToPreviousMonth}
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-medium mx-4">
                  {format(currentMonth, "MMMM yyyy")}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToNextMonth}
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={onScheduleAppointment} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New Appointment
              </Button>
            </CardHeader>
            
            <CardContent>
              <div className="flex justify-center mb-4 space-x-4">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-blue-500 mr-1.5"></div>
                  <span className="text-xs">Virtual</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-1.5"></div>
                  <span className="text-xs">In-Person</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-purple-500 mr-1.5"></div>
                  <span className="text-xs">Home Visit</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-amber-500 mr-1.5"></div>
                  <span className="text-xs">Traditional</span>
                </div>
              </div>
              
              <Calendar
                mode="single"
                month={currentMonth}
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border p-3"
                modifiers={{
                  appointment: appointmentDates,
                  traditional: traditionalConsultDates,
                  today: [new Date()]
                }}
                modifiersStyles={{
                  appointment: {
                    fontWeight: 'bold',
                    border: '2px solid #3b82f6',
                    position: 'relative'
                  },
                  traditional: {
                    borderColor: '#F59E0B'
                  },
                  today: {
                    backgroundColor: '#e0f2fe',
                  }
                }}
                components={{
                  DayContent: ({ date }) => (
                    <div className="relative h-full w-full">
                      <div>{date.getDate()}</div>
                      {dayContentOverlay(date)}
                    </div>
                  )
                }}
              />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate && format(selectedDate, "MMMM d, yyyy")}
              </CardTitle>
              <CardDescription>
                {dateAppointments.length === 0 
                  ? "No appointments scheduled" 
                  : `${dateAppointments.length} appointment${dateAppointments.length !== 1 ? 's' : ''} scheduled`}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {dateAppointments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-8 border border-dashed rounded-md">
                    <p className="text-muted-foreground mb-4">No appointments for this date</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={onScheduleAppointment}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Schedule New
                    </Button>
                  </div>
                ) : (
                  dateAppointments
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map(appointment => (
                      <Card 
                        key={appointment.id} 
                        className="overflow-hidden border-l-4 hover:bg-muted/20 cursor-pointer transition-colors"
                        style={{ 
                          borderLeftColor: appointment.type === "telemedicine" 
                            ? '#3b82f6' 
                            : appointment.type === "in-person" 
                              ? '#10b981' 
                              : '#8b5cf6' 
                        }}
                        onClick={() => onAppointmentSelected?.(appointment)}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-sm">{appointment.patientName}</h4>
                              <p className="text-xs text-muted-foreground mt-1">{appointment.reason}</p>
                            </div>
                            <Badge variant={isToday(new Date(appointment.date)) ? "default" : "outline"} className="text-xs">
                              {formatAppointmentTime(appointment)}
                            </Badge>
                          </div>
                          
                          <div className="mt-2 flex items-center justify-between">
                            {getAppointmentTypeBadge(appointment.type, appointment.isTraditionalConsult)}
                            <span className="text-xs text-muted-foreground">{appointment.duration} min</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarScheduler; 