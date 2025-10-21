"use client";

import { Button, Chip } from "@heroui/react";
import { ArrowRight, BookOpen } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export function HeroSection() {
  const params = useParams();
  const router = useRouter();
  const lang = (params?.lang as string) || "en";

  const handleStartJourney = () => {
    router.push(`/${lang}/signup`);
  };

  const handleExploreCourses = () => {
    const coursesSection = document.getElementById("courses");
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(`/${lang}/course`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 to-background dark:from-sky-900/20 dark:to-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <Chip color="primary" variant="flat" className="mb-6">
            Join 10,000+ students worldwide
          </Chip>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-6xl lg:text-7xl text-foreground">
            Master Islamic Studies
            <br />
            <span className="text-primary">From the Comfort of Home</span>
          </h1>

          <p className="mb-10 text-lg text-default-600 text-pretty md:text-xl max-w-2xl mx-auto">
            Connect with world-class scholars and certified instructors. Learn
            Quran, Arabic, Islamic jurisprudence, and more through personalized
            one-on-one sessions and interactive courses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              color="primary"
              className="text-lg px-8 font-semibold shadow-lg hover:shadow-xl transition-shadow"
              endContent={<ArrowRight className="h-5 w-5" />}
              onPress={handleStartJourney}
            >
              Start Your Journey
            </Button>
            <Button
              size="lg"
              variant="bordered"
              color="primary"
              className="text-lg px-8 font-semibold border-2 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
              startContent={<BookOpen className="h-5 w-5" />}
              onPress={handleExploreCourses}
            >
              Explore Courses
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                10K+
              </div>
              <div className="text-sm text-default-600">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                100+
              </div>
              <div className="text-sm text-default-600">Expert Scholars</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                95%
              </div>
              <div className="text-sm text-default-600">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                30+
              </div>
              <div className="text-sm text-default-600">Countries</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
