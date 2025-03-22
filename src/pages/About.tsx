
import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/ui/layout/Header";
import Footer from "@/components/ui/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, HeartHandshake, Languages, MapPin, ShieldCheck, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Header />
      
      <main className="flex-1 pt-28 px-6 pb-16 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">About KweCare</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empowering Indigenous communities with accessible healthcare solutions designed with cultural sensitivity and technological innovation.
          </p>
        </div>
        
        {/* Mission Section */}
        <section className="mb-20 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                At KweCare, we're committed to bridging healthcare gaps in remote Indigenous communities through 
                technology that works with and without internet connectivity, respecting cultural traditions while 
                providing modern healthcare solutions.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Founded in 2023 by a team of Indigenous healthcare professionals and technology experts, 
                our platform combines AI diagnostics, telemedicine, and culturally responsive care to address 
                the unique health challenges faced by remote communities.
              </p>
              <div className="flex gap-4 mt-8">
                <Link to="/features">
                  <Button className="bg-kwecare-primary hover:bg-kwecare-primary/90">
                    Explore Features
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline">
                    Join Us
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-muted/30 rounded-xl p-8 h-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-3 p-4 bg-background rounded-lg shadow-sm">
                  <HeartHandshake className="h-8 w-8 text-kwecare-primary" />
                  <h3 className="font-semibold text-lg">Cultural Sensitivity</h3>
                  <p className="text-muted-foreground">Built with respect for Indigenous healing traditions</p>
                </div>
                <div className="flex flex-col gap-3 p-4 bg-background rounded-lg shadow-sm">
                  <ShieldCheck className="h-8 w-8 text-kwecare-primary" />
                  <h3 className="font-semibold text-lg">Secure & Private</h3>
                  <p className="text-muted-foreground">Your health data remains secure and under your control</p>
                </div>
                <div className="flex flex-col gap-3 p-4 bg-background rounded-lg shadow-sm">
                  <Languages className="h-8 w-8 text-kwecare-primary" />
                  <h3 className="font-semibold text-lg">Indigenous Languages</h3>
                  <p className="text-muted-foreground">Available in Cree, Inuktitut, and Ojibwe</p>
                </div>
                <div className="flex flex-col gap-3 p-4 bg-background rounded-lg shadow-sm">
                  <MapPin className="h-8 w-8 text-kwecare-primary" />
                  <h3 className="font-semibold text-lg">Works Offline</h3>
                  <p className="text-muted-foreground">Designed for areas with limited connectivity</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="mb-20 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-24 h-24 rounded-full bg-muted mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-muted-foreground/60" />
              </div>
              <h3 className="text-xl font-semibold">Dr. Sarah Beardy</h3>
              <p className="text-kwecare-primary font-medium">Co-Founder & Medical Director</p>
              <p className="text-muted-foreground mt-2">Indigenous healthcare specialist with 15 years experience in remote medicine</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-24 h-24 rounded-full bg-muted mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-muted-foreground/60" />
              </div>
              <h3 className="text-xl font-semibold">Michael Thunder</h3>
              <p className="text-kwecare-primary font-medium">Co-Founder & Tech Lead</p>
              <p className="text-muted-foreground mt-2">Software engineer focused on offline-first applications for remote communities</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-24 h-24 rounded-full bg-muted mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-muted-foreground/60" />
              </div>
              <h3 className="text-xl font-semibold">Lisa Odjick</h3>
              <p className="text-kwecare-primary font-medium">Cultural Advisor</p>
              <p className="text-muted-foreground mt-2">Ensuring our platform respectfully integrates traditional healing approaches</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-24 h-24 rounded-full bg-muted mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-muted-foreground/60" />
              </div>
              <h3 className="text-xl font-semibold">Dr. James Wilson</h3>
              <p className="text-kwecare-primary font-medium">Chief Medical Officer</p>
              <p className="text-muted-foreground mt-2">Specialized in telehealth solutions for underserved communities</p>
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="animate-fade-in" style={{ animationDelay: "300ms" }}>
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
              <CheckCircle2 className="h-10 w-10 text-kwecare-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community First</h3>
              <p className="text-muted-foreground">We design our solutions with direct input from the communities we serve, ensuring relevance and adoption.</p>
            </div>
            <div className="bg-background rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
              <CheckCircle2 className="h-10 w-10 text-kwecare-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Cultural Respect</h3>
              <p className="text-muted-foreground">We honor traditional healing practices and integrate them thoughtfully into our modern healthcare platform.</p>
            </div>
            <div className="bg-background rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
              <CheckCircle2 className="h-10 w-10 text-kwecare-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Innovation for Impact</h3>
              <p className="text-muted-foreground">We leverage technology not for its own sake, but to solve real healthcare access challenges facing remote communities.</p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
