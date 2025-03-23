import React, { useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/ui/layout/Header";
import Footer from "@/components/ui/layout/Footer";
import TreatmentPlanBuilder from "@/components/provider/TreatmentPlanBuilder";
import { AuthContext } from "@/App";
import { useParams } from "react-router-dom";

const TreatmentPlan = () => {
  // Get the patientId from URL params if it exists
  const { patientId } = useParams<{ patientId?: string }>();
  const { setSelectedPatientId } = useContext(AuthContext);
  
  // This page is using a hardcoded patient ID - in a real app, this would be dynamic
  const currentPatientId = patientId || "P123456";
  
  // Update the selected patient ID when the component mounts
  useEffect(() => {
    setSelectedPatientId(currentPatientId);
    
    // Clear the selected patient ID when the component unmounts
    return () => {
      setSelectedPatientId(null);
    };
  }, [currentPatientId, setSelectedPatientId]);

  // Mock conditions for testing
  const conditions = ["Type 2 Diabetes", "Coronary Artery Disease", "Chronic Pain"];

  return (
    <>
      <Helmet>
        <title>Treatment Plan Builder | KweCare</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
        <Header />

        <main className="flex-1 pt-28 px-4 md:px-6 pb-16 w-full max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Treatment Plan Builder</h1>
          <TreatmentPlanBuilder 
            patientId={currentPatientId}
            patientName="David Wilson"
            conditions={conditions}
          />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TreatmentPlan; 