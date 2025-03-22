
import React from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Bell,
  CalendarClock, 
  CheckCheck,
  FileText,
  MessageSquare, 
} from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "New appointment reminder",
    message: "Telemedicine call with Dr. Sarah Johnson today at 3:00 PM",
    time: "10 minutes ago",
    icon: <CalendarClock className="h-4 w-4 text-blue-500" />,
    read: false,
  },
  {
    id: 2,
    title: "Test results available",
    message: "Your blood test results are now available for review",
    time: "2 hours ago",
    icon: <FileText className="h-4 w-4 text-green-500" />,
    read: false,
  },
  {
    id: 3,
    title: "Message from Dr. Chen",
    message: "Please remember to log your glucose readings daily",
    time: "Yesterday",
    icon: <MessageSquare className="h-4 w-4 text-purple-500" />,
    read: true,
  }
];

const NotificationsDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full h-10 w-10 transition-all hover:border-kwecare-primary hover:bg-kwecare-primary/5 relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2"></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 animate-scale-in" align="end">
        <DropdownMenuLabel className="font-normal flex items-center justify-between">
          <span>Notifications</span>
          <Button variant="ghost" size="sm" className="text-xs h-8">
            <CheckCheck className="h-3 w-3 mr-1" />
            Mark all as read
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((notification) => (
          <DropdownMenuItem 
            key={notification.id} 
            className={`cursor-pointer px-4 py-3 ${notification.read ? '' : 'bg-muted/50'}`}
          >
            <div className="flex items-start gap-3">
              <div className="bg-background p-2 rounded-full">
                {notification.icon}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{notification.title}</p>
                <p className="text-xs text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground/80 pt-1">{notification.time}</p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer justify-center text-center text-sm text-muted-foreground hover:text-kwecare-primary">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
