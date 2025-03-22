
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/layout/Header";
import Footer from "@/components/ui/layout/Footer";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-6 pt-28">
        <div className="text-center max-w-md mx-auto page-transition">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-orange-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <h2 className="text-2xl font-medium mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button className="bg-kwecare-primary hover:bg-kwecare-primary/90">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
