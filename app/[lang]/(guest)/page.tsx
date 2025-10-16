"use client";

import React, { useEffect } from "react";
import { toast } from "sonner";
import { HeroSection } from "@/components/guest/hero-section";
import CoursePage from "./course/page";
import { FeaturesSection } from "@/components/guest/features-section";
import { TestimonialsSection } from "@/components/guest/testimonial";
import { Footer } from "@/components/guest/footer";

export default function Page() {
  useEffect(() => {
    toast.dismiss();
  }, []);

  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <CoursePage />
        <FeaturesSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
