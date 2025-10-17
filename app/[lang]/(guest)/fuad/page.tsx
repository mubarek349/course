import { Header } from "@/components/guest/header";
import { HeroSection } from "@/components/guest/hero-section";
import { CoursesSection } from "@/components/guest/courses-sections";
import { FeaturesSection } from "@/components/guest/features-section";
import { TestimonialsSection } from "@/components/guest/testimonial";
import { Footer } from "@/components/guest/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <CoursesSection />
        <FeaturesSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
