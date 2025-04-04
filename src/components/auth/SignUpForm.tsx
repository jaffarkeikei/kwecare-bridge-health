import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, User, Stethoscope } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthContext } from "@/App";

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserType } = useContext(AuthContext);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupType, setSignupType] = useState<"patient" | "provider">("patient");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (!agreeTerms) {
      toast.error("Please agree to the terms of service and privacy policy");
      return;
    }
    
    setIsLoading(true);
    
    // Simulating API request
    setTimeout(() => {
      setIsLoading(false);

      // Store session data and user type
      localStorage.setItem("kwecare_session", "active");
      localStorage.setItem("kwecare_user_type", signupType);
      
      // Update auth context
      setIsAuthenticated(true);
      setUserType(signupType);
      
      toast.success(`${signupType === 'provider' ? 'Healthcare provider' : 'Patient'} account created successfully`);
      
      // Redirect based on user type
      if (signupType === "provider") {
        navigate("/provider-dashboard");
      } else {
        navigate("/dashboard");
      }
    }, 1500);
  };

  return (
    <div className="animate-fade-in">
      <Tabs 
        value={signupType} 
        onValueChange={(value) => setSignupType(value as "patient" | "provider")}
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
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-field"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>
          
          {signupType === "provider" && (
            <div className="space-y-2">
              <Label htmlFor="credential">Medical License/Credential Number</Label>
              <Input
                id="credential"
                type="text"
                placeholder="License or credential ID"
                className="input-field"
                required
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="terms" 
              checked={agreeTerms}
              onCheckedChange={(checked) => 
                setAgreeTerms(checked as boolean)
              }
              className="mt-1"
            />
            <Label
              htmlFor="terms"
              className="text-sm font-normal text-muted-foreground cursor-pointer"
            >
              I agree to the{" "}
              <a href="#" className="text-kwecare-primary hover:text-kwecare-primary/80 transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-kwecare-primary hover:text-kwecare-primary/80 transition-colors">
                Privacy Policy
              </a>
            </Label>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-kwecare-primary hover:bg-kwecare-primary/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            `Create ${signupType === 'provider' ? 'Healthcare Provider' : 'Patient'} Account`
          )}
        </Button>
      </form>
    </div>
  );
};

export default SignUpForm;
