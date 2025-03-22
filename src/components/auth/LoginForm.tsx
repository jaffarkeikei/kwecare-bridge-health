import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthContext } from "@/App";
const LoginForm = () => {
  const navigate = useNavigate();
  const {
    setIsAuthenticated
  } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

      // Store session data
      if (rememberMe) {
        localStorage.setItem("kwecare_session", "active");
      } else {
        sessionStorage.setItem("kwecare_session", "active");
      }

      // Update auth context
      setIsAuthenticated(true);
      toast.success("Login successful");
      navigate("/dashboard");
    }, 1500);
  };
  return <div className="animate-fade-in">
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
          {isLoading ? <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </> : "Sign in"}
        </Button>
      </form>
    </div>;
};
export default LoginForm;