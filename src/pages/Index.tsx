
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/layout/Header";
import Footer from "@/components/ui/layout/Footer";
import { 
  CheckCircle2, 
  Cpu, 
  Globe, 
  Heart, 
  MessageCircle, 
  Smartphone, 
  User 
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/30 pointer-events-none -z-10" />
          <div className="max-w-5xl mx-auto text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-kwecare-primary/10 text-kwecare-primary text-sm font-medium mb-4">
              <Heart className="h-4 w-4 mr-2" />
              Healing Without Borders
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight gradient-text">
              Bridging Healthcare Gaps for<br /> Indigenous Communities
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              KweCare combines offline AI diagnostics, satellite telemedicine, and cultural sensitivity to ensure accessible healthcare for remote communities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/signup">
                <Button size="lg" className="bg-kwecare-primary hover:bg-kwecare-primary/90 shadow-lg button-hover">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="button-hover">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl font-bold mb-4">Four Integrated Components</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                KweCare addresses healthcare challenges through four key integrated components.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="glass-card p-6 rounded-2xl animate-slide-up card-hover-effect" style={{ animationDelay: "0.1s" }}>
                <div className="h-12 w-12 rounded-lg bg-kwecare-primary/10 flex items-center justify-center mb-4">
                  <Cpu className="h-6 w-6 text-kwecare-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Offline AI Diagnostics</h3>
                <p className="text-muted-foreground text-sm">
                  Pre-loaded AI models analyze symptoms, vital signs, and images without internet connectivity.
                </p>
              </div>
              
              <div className="glass-card p-6 rounded-2xl animate-slide-up card-hover-effect" style={{ animationDelay: "0.2s" }}>
                <div className="h-12 w-12 rounded-lg bg-kwecare-secondary/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-kwecare-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Satellite Telemedicine</h3>
                <p className="text-muted-foreground text-sm">
                  Low-bandwidth video consultations with specialists using Starlink integration.
                </p>
              </div>
              
              <div className="glass-card p-6 rounded-2xl animate-slide-up card-hover-effect" style={{ animationDelay: "0.3s" }}>
                <div className="h-12 w-12 rounded-lg bg-kwecare-accent/10 flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-kwecare-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Cultural Safety</h3>
                <p className="text-muted-foreground text-sm">
                  Indigenous language support with voice commands and text in Cree, Inuktitut, and Ojibwe.
                </p>
              </div>
              
              <div className="glass-card p-6 rounded-2xl animate-slide-up card-hover-effect" style={{ animationDelay: "0.4s" }}>
                <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                  <User className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community Empowerment</h3>
                <p className="text-muted-foreground text-sm">
                  Tools for Community Health Workers to triage patients and coordinate care.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl font-bold mb-4">Why Choose KweCare</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                KweCare is designed to address specific healthcare challenges faced by remote Indigenous communities.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-muted/30 p-8 rounded-2xl animate-slide-right">
                <h3 className="text-xl font-bold mb-6">Impact Metrics</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-kwecare-primary mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Short-Term Benefits</h4>
                      <p className="text-muted-foreground text-sm mt-1">
                        Reduce medical travel costs by $1,500+ per patient
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-kwecare-primary mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Long-Term Improvements</h4>
                      <p className="text-muted-foreground text-sm mt-1">
                        Lower diabetes-related complications by 30% in pilot communities
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-kwecare-primary mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Scalability</h4>
                      <p className="text-muted-foreground text-sm mt-1">
                        Expandable to mental health, maternal care, and disaster response
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/30 p-8 rounded-2xl animate-slide-right" style={{ animationDelay: "0.2s" }}>
                <h3 className="text-xl font-bold mb-6">Why Flutter?</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Smartphone className="h-5 w-5 text-kwecare-secondary mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Cross-Platform</h4>
                      <p className="text-muted-foreground text-sm mt-1">
                        Deploy on iOS/Android with a single codebase for wider reach
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Heart className="h-5 w-5 text-kwecare-secondary mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">UI Flexibility</h4>
                      <p className="text-muted-foreground text-sm mt-1">
                        Create culturally responsive designs with Indigenous iconography
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Cpu className="h-5 w-5 text-kwecare-secondary mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Offline-First</h4>
                      <p className="text-muted-foreground text-sm mt-1">
                        Easy integration with local databases for areas with limited connectivity
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-kwecare-primary/5 to-kwecare-secondary/5 pointer-events-none" />
          
          <div className="relative max-w-4xl mx-auto text-center glass-card p-12 rounded-3xl animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 gradient-text">Ready to Transform Healthcare Access?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join us in redefining healthcare accessibility by centering Indigenous sovereignty, resilience, and innovation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-kwecare-primary hover:bg-kwecare-primary/90 shadow-lg button-hover">
                  Get Started Now
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="button-hover">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
