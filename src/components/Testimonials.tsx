import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "María G.",
    initials: "MG",
    quote:
      "¡No podía creerlo cuando me llamaron! Gané un iPhone con solo 2 boletos. El proceso fue súper fácil y transparente.",
    rating: 5,
  },
  {
    name: "Carlos R.",
    initials: "CR",
    quote:
      "Llevo participando varios meses y la experiencia siempre ha sido excelente. Los sorteos en vivo te dan total confianza.",
    rating: 5,
  },
  {
    name: "Ana P.",
    initials: "AP",
    quote:
      "Me encanta que puedo verificar mis boletos en cualquier momento. El soporte por WhatsApp es rapidísimo. ¡Muy recomendado!",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section id="testimonios" className="py-20 bg-background-alt">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-3">
            Testimonios
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Lo Que Dicen Nuestros Ganadores
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Historias reales de personas que curaron su suerte.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="p-6 bg-gradient-card border-card-border hover:shadow-elegant transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-warning fill-warning"
                  />
                ))}
              </div>

              <blockquote className="text-foreground/90 text-sm leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 pt-4 border-t border-card-border">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground text-sm font-bold">
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ganador verificado
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
