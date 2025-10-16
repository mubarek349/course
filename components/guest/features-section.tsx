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
    <section id="features" className="py-20 bg-sky-50 dark:bg-sky-900/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance text-foreground">
            Why Choose Us
          </h2>
          <p className="text-lg font-semibold text-primary mb-2">
            Excellence in Islamic Education
          </p>
          <p className="text-default-600 max-w-2xl mx-auto">
            Traditional Islamic scholarship combined with cutting-edge learning
            technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border-none shadow-sm hover:shadow-md transition-shadow bg-background border border-divider"
              >
                <CardHeader className="flex-col items-start">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </CardHeader>
                <CardBody className="pt-0">
                  <p className="text-default-600">{feature.description}</p>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Additional Why Choose Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance text-foreground">
              Why Choose Darulkubra
            </h2>
            <p className="text-lg text-default-600">
              Your trusted partner in authentic Islamic education
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-none shadow-sm bg-background border border-divider">
              <CardHeader className="flex-col items-center">
                <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">
                  Comprehensive Curriculum
                </h3>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-default-600">
                  Learn from authentic Islamic sources with structured courses
                  covering various Islamic sciences
                </p>
              </CardBody>
            </Card>

            <Card className="text-center border-none shadow-sm bg-background border border-divider">
              <CardHeader className="flex-col items-center">
                <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Expert Instructors</h3>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-default-600">
                  Study with qualified scholars and certified teachers
                  specializing in different Islamic disciplines
                </p>
              </CardBody>
            </Card>

            <Card className="text-center border-none shadow-sm bg-background border border-divider">
              <CardHeader className="flex-col items-center">
                <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Flexible Schedule</h3>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-default-600">
                  Choose your learning pace with courses available 24/7 to fit
                  your schedule
                </p>
              </CardBody>
            </Card>

            <Card className="text-center border-none shadow-sm bg-background border border-divider">
              <CardHeader className="flex-col items-center">
                <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Certification Journey</h3>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-default-600">
                  Earn recognized certificates upon completion of courses to
                  showcase your Islamic education
                </p>
              </CardBody>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-default-600 italic">
              Accredited by leading Islamic educational institutions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
