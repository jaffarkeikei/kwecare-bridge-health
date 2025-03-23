import React, { useContext } from "react";
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
  CreditCard, 
  HelpCircle,
  LogOut, 
  Settings, 
  User as UserIcon,
  Stethoscope
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext } from "@/App";

const UserDropdown = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, userType, setUserType } = useContext(AuthContext);

  const handleLogout = () => {
    // Clear auth state and session storage
    setIsAuthenticated(false);
    setUserType(""); // Reset the user type
    
    // Clear all storage locations
    localStorage.removeItem("kwecare_session");
    localStorage.removeItem("kwecare_user_type");
    sessionStorage.removeItem("kwecare_session");
    sessionStorage.removeItem("kwecare_user_type");
    sessionStorage.removeItem("kwecare_initial_provider_login"); // Clear the initial login flag
    
    toast.success(`Successfully logged out of your ${userType} account`);
    navigate("/login");
  };

  const isProvider = userType === "provider";
  const displayName = isProvider ? "Dr. Michael Chen" : "Sarah Johnson";
  const email = isProvider ? "dr.chen@example.com" : "sarah.johnson@example.com";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full h-10 w-10 transition-all hover:border-kwecare-primary hover:bg-kwecare-primary/5"
          aria-label="User menu"
        >
          {isProvider ? <Stethoscope className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 animate-scale-in" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{email}</p>
            <p className="text-xs leading-none text-kwecare-primary mt-1">
              {isProvider ? "Healthcare Provider" : "Patient"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer transition-colors hover:bg-kwecare-primary/5 hover:text-kwecare-primary"
          onClick={() => navigate("/settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        {!isProvider && (
          <DropdownMenuItem className="cursor-pointer transition-colors hover:bg-kwecare-primary/5 hover:text-kwecare-primary">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="cursor-pointer transition-colors hover:bg-kwecare-primary/5 hover:text-kwecare-primary">
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer transition-colors hover:bg-kwecare-primary/5 hover:text-kwecare-primary">
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
