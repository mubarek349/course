import { Card, CardBody } from "@heroui/react";
import { Star } from "lucide-react";

const ourStudents = [
  {
    name: "Fatima Abdurrahman",
    role: "Hifz Student from Saudi",
    content:
      "Masha'Allah, this lesson has been extremely beneficial and useful! Despite my tight schedule, the resources—including the videos, live lessons, and the Qai'da application—made it possible for me to start the Quran and learn to read. Everything provided has truly helped me. Alhamdulillah!",
    rating: 5,
  },
  {
    name: "Sualihat",
    role: "Tajweed Student from UK",
    content:
      "Masha'Allah, I don't blame the instructors for any of my shortcomings—they haven't held back anything! They taught with videos, live sessions, and three key methods. The content is excellent; I've learned that writing things down is key to retention. May Allah increase you!",
    rating: 3,
  },
  {
    name: "Siraj Seid",
    role: "Student from Canada",
    content:
      "Masha'Allah, your presentation is very clear and pleasing! It is great, and there is nothing complicated about the way things are done. May Allah make it easy for us, Insha'Allah.",
    rating: 4,
  },
  {
    name: "Aduneya",
    role: "Student from Australia",
    content:
      "had to pause the course due to work and travel in areas with poor connection. It's a great course, and I'm eager to resume.",
    rating: 4,
  },
  
  {
    name: "Rediwan",
    role: "Student from Somalia",
    content:
      "Alhamdulillah. I have been checking the lessons from time to time, and it is great—very good so far! I am looking forward to doing more as soon as my work schedule allows",
    rating: 5,
  },
  {
    name: "Biniyam",
    role: "Student from Ethiopia",
    content:
      "The course is excellent,",
    rating: 5,
  },
];

export function OurStudentsSection() {
  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance text-foreground">
            what our studetns say about us !
          </h2>
          <p className="text-lg font-semibold text-primary mb-2">
            Our students are our best ambassadors
          </p>
          <p className="text-default-600 max-w-2xl mx-auto">
            Our students are our best ambassadors and they are happy with our services
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ourStudents.map((student, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow bg-background border border-divider"
            >
              <CardBody className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(student.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-default-600 mb-6 italic">
                  &quot;{student.content}&quot;
                </p>
                <div className="border-t border-divider pt-4">
                  <p className="font-semibold text-foreground">
                    {student.name} <span className="text-sm text-default-600">{student.role}</span>
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
