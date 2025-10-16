import { Card, CardBody } from "@heroui/react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Aisha Rahman",
    role: "Hifz Student from USA",
    content:
      "The structured approach and patient teachers helped me memorize 5 Juz in just 8 months. The revision system keeps everything fresh in my memory. Alhamdulillah!",
    rating: 5,
  },
  {
    name: "Muhammad Ali",
    role: "Tajweed Student from UK",
    content:
      "My Tajweed improved significantly. The one-on-one sessions with personalized feedback are incredibly effective. I can now recite with confidence.",
    rating: 5,
  },
  {
    name: "Fatima Yusuf",
    role: "Working Professional from Canada",
    content:
      "Flexible timing allowed me to balance my career and learning. The quality of instruction is exceptional. Best decision I made this year!",
    rating: 5,
  },
  {
    name: "Omar Hassan",
    role: "Arabic Student from Australia",
    content:
      "Learning Quranic Arabic has transformed my understanding of the Quran. The instructors make complex grammar simple and enjoyable.",
    rating: 5,
  },
  {
    name: "Maryam Ahmed",
    role: "Fiqh Student from Malaysia",
    content:
      "The Islamic jurisprudence course answered so many questions I had. The scholars are knowledgeable and approachable.",
    rating: 5,
  },
  {
    name: "Ibrahim Khan",
    role: "Parent from UAE",
    content:
      "Both my children are enrolled and loving their classes. The platform is safe, professional, and the progress tracking is excellent!",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance text-foreground">
            Testimonials
          </h2>
          <p className="text-lg font-semibold text-primary mb-2">
            Transforming Lives Through Islamic Education
          </p>
          <p className="text-default-600 max-w-2xl mx-auto">
            Join thousands of students who have transformed their relationship
            with Islamic knowledge
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow bg-background border border-divider"
            >
              <CardBody className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-default-600 mb-6 italic">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="border-t border-divider pt-4">
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-default-600">{testimonial.role}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
