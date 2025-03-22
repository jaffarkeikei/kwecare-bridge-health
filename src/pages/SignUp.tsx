
import React from "react";
import { Link } from "react-router-dom";
import SignUpForm from "@/components/auth/SignUpForm";
import Header from "@/components/ui/layout/Header";
import Footer from "@/components/ui/layout/Footer";
import { Heart } from "lucide-react";

const SignUp = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-6 pt-28">
        <div className="w-full max-w-md space-y-8 page-transition">
          <div className="text-center">
            <div className="flex justify-center">
              <Heart className="text-kwecare-primary h-10 w-10" />
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight">Create an account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign up to access KweCare's health platform
            </p>
          </div>
          
          <div className="glass-card p-8 rounded-2xl">
            <SignUpForm />
          </div>
          
          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-kwecare-primary hover:text-kwecare-primary/80 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignUp;
