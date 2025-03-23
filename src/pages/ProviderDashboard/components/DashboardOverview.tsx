import React from "react";
import { 
  AlertCircle, 
  Calendar, 
  Leaf, 
  Clock,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SeverityIndicator } from "../utils/ui-helpers";
import { clinicalAlerts, upcomingAppointments, communityHealthData, recentMessages } from "../data/dashboardData";

const DashboardOverview = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-1 text-orange-500" />
                Clinical Alerts
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clinicalAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {clinicalAlerts.filter(alert => alert.severity === "critical").length} critical
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="link" className="h-auto p-0 text-xs">View all alerts</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                Today's Appointments
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingAppointments.filter(apt => apt.time.includes("Today")).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {upcomingAppointments.filter(apt => apt.time.includes("Today") && apt.virtual).length} virtual
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="link" className="h-auto p-0 text-xs">View schedule</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Leaf className="h-4 w-4 mr-1 text-green-500" />
                Cultural Consultations
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Traditional medicine integration sessions
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="link" className="h-auto p-0 text-xs">Schedule consultation</Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                Critical Patient Alerts
              </CardTitle>
              <CardDescription>Patients requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto max-h-[280px]">
              <div className="space-y-4">
                {clinicalAlerts.map((alert, i) => (
                  <div key={i} className="flex items-start p-3 bg-muted/30 rounded-md">
                    <div className="flex-shrink-0 mt-0.5">
                      <SeverityIndicator severity={alert.severity} />
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <h4 className="font-medium text-sm mr-2">
                          {alert.patientName}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${alert.severity === 'critical' ? 'border-red-500 text-red-600' : 
                              alert.severity === 'high' ? 'border-orange-500 text-orange-600' : 
                              'border-yellow-500 text-yellow-600'}
                          `}
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm mb-1">{alert.alert}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{alert.date}</span>
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          Respond
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full">View All Patient Alerts</Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>Next 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto max-h-[280px]">
              <div className="space-y-3">
                {upcomingAppointments
                  .filter(apt => apt.time.includes("Today") || apt.time.includes("Tomorrow"))
                  .map((appointment, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                      <div>
                        <h4 className="font-medium text-sm">{appointment.patient}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="outline" className="h-5 px-1 text-xs">
                            {appointment.type}
                          </Badge>
                          {appointment.virtual && (
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 h-5 px-1 text-xs">
                              Virtual
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="h-7">
                        Prepare
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full">View Full Schedule</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-indigo-500" />
                    Community Health Trends
                  </CardTitle>
                  <CardDescription>Health metrics across communities</CardDescription>
                </div>
                <Select defaultValue="diabetes">
                  <SelectTrigger className="w-[160px] h-8">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diabetes">Diabetes</SelectItem>
                    <SelectItem value="heart">Heart Disease</SelectItem>
                    <SelectItem value="mental">Mental Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-end justify-between gap-2">
                {communityHealthData.map((data, i) => (
                  <div key={i} className="relative flex flex-col items-center">
                    <div 
                      className="w-12 bg-indigo-100 rounded-t-md" 
                      style={{ height: `${data.diabetesRate * 10}px` }}
                    >
                      <div className="absolute bottom-14 text-xs font-medium">
                        {data.diabetesRate}%
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground text-center max-w-[80px] truncate">
                      {data.community}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View Detailed Analytics
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-violet-500" />
                Recent Messages
              </CardTitle>
              <CardDescription>{recentMessages.filter(m => !m.read).length} unread</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto max-h-[250px]">
              <div className="space-y-3">
                {recentMessages.map((message, i) => (
                  <div key={i} className={`p-3 rounded-md ${message.read ? 'bg-muted/30' : 'bg-blue-50'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm">{message.from}</h4>
                      {!message.read && <div className="h-2 w-2 rounded-full bg-blue-500"></div>}
                    </div>
                    <p className="text-sm mb-1">{message.subject}</p>
                    <span className="text-xs text-muted-foreground">{message.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full">Open Messages</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview; 