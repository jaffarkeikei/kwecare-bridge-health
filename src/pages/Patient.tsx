import React from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/ui/layout/Header";
import Footer from "@/components/ui/layout/Footer";
import PatientRecordViewer from "@/components/provider/PatientRecordViewer";

const Patient = () => {
  // Get the patient ID from URL params
  const { patientId } = useParams<{ patientId: string }>();

  return (
    <>
      <Helmet>
        <title>Patient Record | KweCare</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
        <Header />

        <main className="flex-1 pt-28 px-4 md:px-6 pb-16 w-full max-w-7xl mx-auto">
          <PatientRecordViewer patientId={patientId} />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Patient; 