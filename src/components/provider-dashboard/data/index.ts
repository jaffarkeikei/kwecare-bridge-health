// Export all data
export * from './dashboardData';
// Re-export appointmentData with unique names to avoid conflict
import { upcomingAppointments as appointmentUpcomingList, convertToAppointments } from './appointmentData';
export { appointmentUpcomingList, convertToAppointments };
export * from './patientData'; 