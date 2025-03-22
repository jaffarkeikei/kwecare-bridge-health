
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/ui/layout/Header";
import Footer from "@/components/ui/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, Globe, Heart, Laptop, MessageSquare, Phone, Shield, Stethoscope } from "lucide-react";
import { AuthContext } from "@/App";

const Features = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = React.useContext(AuthContext);
  
  const handleFeatureClick = (path: string, requiresAuth: boolean = true) => {
    if (requiresAuth && !isAuthenticated) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Header />
      
      <main className="flex-1 pt-28 px-6 pb-16 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">KweCare Features</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Bridging healthcare gaps for remote Indigenous communities through cutting-edge technology and culturally sensitive care.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <FeatureCard 
            icon={<Laptop className="h-12 w-12 text-kwecare-primary" />}
            title="Offline AI Diagnostics"
            description="Pre-loaded AI models provide symptom checking and health guidance, even without internet connectivity."
            onClick={() => handleFeatureClick('/ai-diagnostics')}
            clickable={true}
          />
          
          <FeatureCard 
            icon={<Globe className="h-12 w-12 text-kwecare-primary" />}
            title="Satellite Telemedicine"
            description="Low-bandwidth video consultations with specialists through Starlink integration for reliable connections."
          />
          
          <FeatureCard 
            icon={<MessageSquare className="h-12 w-12 text-kwecare-primary" />}
            title="Indigenous Language Support"
            description="Voice commands and text in Cree, Inuktitut, and Ojibwe languages for culturally responsive care."
          />
          
          <FeatureCard 
            icon={<Shield className="h-12 w-12 text-kwecare-primary" />}
            title="Secure Health Records"
            description="Your medical data is stored securely and syncs automatically when connectivity is available."
            onClick={() => handleFeatureClick('/health-records')}
            clickable={true}
          />
          
          <FeatureCard 
            icon={<Stethoscope className="h-12 w-12 text-kwecare-primary" />}
            title="Community Health Worker Portal"
            description="Tools for local health workers to triage patients and coordinate care efficiently."
          />
          
          <FeatureCard 
            icon={<Heart className="h-12 w-12 text-kwecare-primary" />}
            title="Preventive Care Reminders"
            description="Personalized notifications for screenings, medications, and healthy lifestyle recommendations."
          />
        </div>
        
        <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <h2 className="text-3xl font-bold mb-4">Ready to experience better healthcare?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join KweCare today and access quality healthcare services designed with your community in mind.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup">
              <Button 
                size="lg"
                className="bg-kwecare-primary hover:bg-kwecare-primary/90"
              >
                Create an Account
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                variant="outline" 
                size="lg"
                className="hover:border-kwecare-primary hover:text-kwecare-primary"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-xl p-8 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Need more information?</h3>
              <p className="text-muted-foreground mb-4">
                We're happy to answer any questions about KweCare and how it can benefit your community.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" className="flex gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Us
                </Button>
                <Button variant="outline" className="flex gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule a Demo
                </Button>
                <Button variant="outline" className="flex gap-2">
                  <FileText className="h-4 w-4" />
                  Download Brochure
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  onClick,
  clickable = false
}: { 
  icon: React.ReactNode;
  title: string; 
  description: string; 
  onClick?: () => void;
  clickable?: boolean;
}) => {
  return (
    <Card 
      className={`glass-card hover:border-kwecare-primary/20 transition-all duration-300 animate-fade-in ${clickable ? 'cursor-pointer hover:shadow-md' : ''}`}
      onClick={clickable ? onClick : undefined}
    >
      <CardHeader className="pb-2">
        <div className="mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
        {clickable && (
          <div className="mt-4">
            <Button 
              variant="link" 
              className="p-0 h-auto text-kwecare-primary" 
              onClick={(e) => {
                e.stopPropagation();
                onClick && onClick();
              }}
            >
              Try it now →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Features;
