"use client";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Button,
  Chip,
} from "@heroui/react";
import { Clock, Users, Star } from "lucide-react";

const courses = [
  {
    title: "Quran Recitation & Tajweed",
    description:
      "Master art of proper Quranic recitation with advanced Tajweed rules and Makharij",
    duration: "3 months",
    students: "2,500+ students",
    level: "Beginner to Advanced",
    price: "$199",
    rating: "4.9",
  },
  {
    title: "Islamic Studies",
    description:
      "Comprehensive study of Islamic history, jurisprudence, theology, and Prophetic biography",
    duration: "6 months",
    students: "1,800+ students",
    level: "All Levels",
    price: "$249",
    rating: "4.8",
  },
  {
    title: "Classical Arabic Language",
    description:
      "Learn Quranic Arabic through Nahw, Sarf, and Balagha to understand the Quran deeply",
    duration: "12 months",
    students: "3,200+ students",
    level: "Beginner to Advanced",
    price: "$299",
    rating: "4.9",
  },
];

export function CoursesSection() {
  return (
    <section id="courses" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance text-foreground">
            Popular Courses
          </h2>
          <p className="text-lg text-default-600 max-w-2xl mx-auto text-pretty">
            Transform Your Islamic Knowledge
          </p>
          <p className="text-default-600 max-w-3xl mx-auto mt-2">
            Explore our comprehensive range of courses designed by scholars and
            taught by experienced instructors
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <Card
              key={index}
              className="flex flex-col hover:shadow-lg transition-shadow bg-background border border-divider"
            >
              {/* Thumbnail with Play Icon - Dark Mode Compatible */}
              <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-t-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-green-500/20 dark:from-blue-400/30 dark:to-green-400/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 dark:bg-white/20 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                    <div className="w-0 h-0 border-l-[12px] border-l-blue-500 dark:border-l-blue-400 border-y-[8px] border-y-transparent ml-1"></div>
                  </div>
                </div>
              </div>

              <CardHeader className="flex-col items-start">
                <div className="flex items-start justify-between mb-2 w-full">
                  <Chip color="primary" variant="flat" size="sm">
                    {course.level}
                  </Chip>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-sm text-default-600">{course.description}</p>
              </CardHeader>

              <CardBody className="flex-1 pt-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-default-600">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-default-600">
                    <Users className="h-4 w-4" />
                    <span>{course.students}</span>
                  </div>
                </div>
              </CardBody>

              <CardFooter className="flex items-center justify-between pt-4 border-t">
                <div className="text-2xl font-bold text-primary">
                  {course.price}
                </div>
                <Button color="primary">Enroll Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
