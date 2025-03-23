import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, User, Stethoscope } from "lucide-react";
import { AuthContext } from "@/App";

const LoginForm = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserType } = useContext(AuthContext);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<"patient" | "provider">("patient");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsLoading(true);

    // Simulating API request
    setTimeout(() => {
      setIsLoading(false);

      // Store session data and user type
      if (rememberMe) {
        localStorage.setItem("kwecare_session", "active");
        localStorage.setItem("kwecare_user_type", loginType);
      } else {
        sessionStorage.setItem("kwecare_session", "active");
        sessionStorage.setItem("kwecare_user_type", loginType);
      }

      // Update auth context
      setIsAuthenticated(true);
      setUserType(loginType);
      
      // Provide user feedback about the type of account they're accessing
      toast.success(`${loginType === 'provider' ? 'Healthcare provider' : 'Patient'} login successful`);
      
      // Redirect based on user type
      if (loginType === "provider") {
        toast.info("Accessing healthcare provider dashboard with clinical tools");
        // Set provider initial login flag to trigger welcome message
        sessionStorage.setItem("kwecare_initial_provider_login", "new");
        // Ensure AIDA assistant doesn't auto-open
        sessionStorage.setItem("kwecare_disable_ai_auto_open", "false");
        // Use the same path format and set the tab session storage
        // sessionStorage.setItem("provider_dashboard_tab", "dashboard");
        navigate("/provider-dashboard");
      } else {
        toast.info("Accessing patient dashboard with personal health tools");
        navigate("/patient-dashboard");
      }
    }, 1500);
  };

  return (
    <div className="animate-fade-in">
      <Tabs 
        value={loginType} 
        onValueChange={(value) => setLoginType(value as "patient" | "provider")}
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="patient" className="flex items-center justify-center gap-2">
            <User className="h-4 w-4" />
            <span>Patient</span>
          </TabsTrigger>
          <TabsTrigger value="provider" className="flex items-center justify-center gap-2">
            <Stethoscope className="h-4 w-4" />
            <span>Healthcare Provider</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} className="input-field" required />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs text-kwecare-primary hover:text-kwecare-primary/80 transition-colors">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="input-field pr-10" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" checked={rememberMe} onCheckedChange={checked => setRememberMe(checked as boolean)} />
            <Label htmlFor="remember" className="text-sm font-normal leading-none cursor-pointer">
              Remember me
            </Label>
          </div>
        </div>
        
        <Button type="submit" disabled={isLoading} className="w-full bg-blue-500 hover:bg-blue-400">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            `Sign in as ${loginType === 'provider' ? 'Healthcare Provider' : 'Patient'}`
          )}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
