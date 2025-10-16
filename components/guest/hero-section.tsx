import { Button, Chip } from "@heroui/react";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 to-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <Chip color="primary" variant="flat" className="mb-6">
            Join 10,000+ students worldwide
          </Chip>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
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
              className="text-lg px-8"
              endContent={<ArrowRight className="h-5 w-5" />}
            >
              Start Your Journey
            </Button>
            <Button
              size="lg"
              variant="bordered"
              color="primary"
              className="text-lg px-8"
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
              <div className="text-sm text-muted-foreground">
                Active Students
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                50+
              </div>
              <div className="text-sm text-muted-foreground">
                Expert Scholars
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                95%
              </div>
              <div className="text-sm text-muted-foreground">
                Satisfaction Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                30+
              </div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
