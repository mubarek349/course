"use client";
import { Card, CardBody, CardHeader } from "@heroui/react";
import {
  BookOpen,
  GraduationCap,
  Clock,
  Award,
  Video,
  Headphones,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Structured Curriculum",
    description:
      "Follow a comprehensive program from basics to advanced Tajweed and memorization",
  },
  {
    icon: GraduationCap,
    title: "Expert Instructors",
    description:
      "Learn from certified teachers with years of experience in Quranic education",
  },
  {
    icon: Clock,
    title: "Flexible Schedule",
    description:
      "Choose your preferred time slots and learn at your own comfortable pace",
  },
  {
    icon: Award,
    title: "Certification",
    description:
      "Receive official certificates upon completion of each course level",
  },
  {
    icon: Video,
    title: "Live Classes",
    description:
      "Interactive one-on-one or group sessions with HD video quality",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Get help anytime with our dedicated student support team",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-b from-sky-50 to-background dark:from-sky-900/20 dark:to-background relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 mb-6">
            <div className="w-8 h-8 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-primary"></div>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            Why Choose Us
          </h2>
          <p className="text-lg font-semibold text-primary mb-3">
            Excellence in Islamic Education
          </p>
          <p className="text-default-600 max-w-2xl mx-auto text-lg">
            Traditional Islamic scholarship combined with cutting-edge learning
            technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-background/80 dark:bg-background/90 border border-divider/50 hover:border-primary/30 backdrop-blur-sm hover:-translate-y-1"
              >
                <CardHeader className="flex-col items-start pb-4">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 group-hover:from-primary/20 group-hover:to-primary/10 dark:group-hover:from-primary/30 dark:group-hover:to-primary/20 transition-all duration-300 shadow-lg">
                    <Icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                </CardHeader>
                <CardBody className="pt-0">
                  <p className="text-default-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Additional Why Choose Section */}
        <div className="mt-24 relative">
          {/* Decorative Line */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>

          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 mb-6">
              <div className="w-6 h-6 rounded-full bg-primary/30 dark:bg-primary/40 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance text-foreground">
              Why Choose Darulkubra
            </h2>
            <p className="text-lg text-default-600 max-w-xl mx-auto">
              Your trusted partner in authentic Islamic education
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group text-center border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-background/80 dark:bg-background/90 border border-divider/50 hover:border-primary/30 backdrop-blur-sm hover:-translate-y-1">
              <CardHeader className="flex-col items-center pb-4">
                <div className="mx-auto mb-6 inline-flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 group-hover:from-primary/20 group-hover:to-primary/10 dark:group-hover:from-primary/30 dark:group-hover:to-primary/20 transition-all duration-300 shadow-lg">
                  <BookOpen className="h-9 w-9 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  Comprehensive Curriculum
                </h3>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-sm text-default-600 leading-relaxed">
                  Learn from authentic Islamic sources with structured courses
                  covering various Islamic sciences
                </p>
              </CardBody>
            </Card>

            <Card className="group text-center border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-background/80 dark:bg-background/90 border border-divider/50 hover:border-primary/30 backdrop-blur-sm hover:-translate-y-1">
              <CardHeader className="flex-col items-center pb-4">
                <div className="mx-auto mb-6 inline-flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 group-hover:from-primary/20 group-hover:to-primary/10 dark:group-hover:from-primary/30 dark:group-hover:to-primary/20 transition-all duration-300 shadow-lg">
                  <GraduationCap className="h-9 w-9 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  Expert Instructors
                </h3>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-sm text-default-600 leading-relaxed">
                  Study with qualified scholars and certified teachers
                  specializing in different Islamic disciplines
                </p>
              </CardBody>
            </Card>

            <Card className="group text-center border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-background/80 dark:bg-background/90 border border-divider/50 hover:border-primary/30 backdrop-blur-sm hover:-translate-y-1">
              <CardHeader className="flex-col items-center pb-4">
                <div className="mx-auto mb-6 inline-flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 group-hover:from-primary/20 group-hover:to-primary/10 dark:group-hover:from-primary/30 dark:group-hover:to-primary/20 transition-all duration-300 shadow-lg">
                  <Clock className="h-9 w-9 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  Flexible Schedule
                </h3>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-sm text-default-600 leading-relaxed">
                  Choose your learning pace with courses available 24/7 to fit
                  your schedule
                </p>
              </CardBody>
            </Card>

            <Card className="group text-center border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-background/80 dark:bg-background/90 border border-divider/50 hover:border-primary/30 backdrop-blur-sm hover:-translate-y-1">
              <CardHeader className="flex-col items-center pb-4">
                <div className="mx-auto mb-6 inline-flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 group-hover:from-primary/20 group-hover:to-primary/10 dark:group-hover:from-primary/30 dark:group-hover:to-primary/20 transition-all duration-300 shadow-lg">
                  <Award className="h-9 w-9 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  Certification Journey
                </h3>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-sm text-default-600 leading-relaxed">
                  Earn recognized certificates upon completion of courses to
                  showcase your Islamic education
                </p>
              </CardBody>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <p className="text-sm font-medium text-primary">
                  Accredited by leading Islamic educational institutions
                </p>
                <div
                  className="w-2 h-2 rounded-full bg-primary animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
