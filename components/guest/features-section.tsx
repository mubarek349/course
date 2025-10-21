"use client";
import { Card, CardBody, CardHeader } from "@heroui/react";
import {
  BookOpen,
  GraduationCap,
  Clock,
  Award,
  Video,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Comprehensive Curriculum",
    description:
      "A wide range of courses covering Quran recitation, Tajweed, Islamic studies, and more",
  },
  {
    icon: GraduationCap,
    title: "Expert Instructors",
    description:
      "Learn from certified teachers with years of experience in Quranic education",
  },
  {
    icon: Clock,
    title: "Flexible Learning",
    description:
      "Learn at your own comfortable pace and on your own schedule",
  },
  {
    icon: Award,
    title: "Certification",
    description:
      "Receive official certificates upon completion of each course level",
  },
  {
    icon: Video,
    title: "Live Support",
    description:
      "Get live support from our instructors to help you with your questions and doubts",
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
            Why Choose Darulkubra
          </h2>
          <p className="text-lg font-semibold text-primary mb-3">
            Excellence in Islamic Education
          </p>
          <p className="text-default-600 max-w-2xl mx-auto text-lg">
            Professional Islamic scholarship combined with cutting-edge learning
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
      </div>
    </section>
  );
}
