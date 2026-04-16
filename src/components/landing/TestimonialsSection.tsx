import { useScrollReveal } from "@/hooks/useScrollReveal";
import testimonialCarlos from "@/assets/testimonial-carlos.jpg";
import testimonialSarah from "@/assets/testimonial-sarah.jpg";
import testimonialAhmed from "@/assets/testimonial-ahmed.jpg";
import testimonialMei from "@/assets/testimonial-mei.jpg";
import testimonialDavid from "@/assets/testimonial-david.jpg";
import testimonialAmara from "@/assets/testimonial-amara.jpg";

const testimonials = [
  {
    name: "Carlos M.",
    business: "Shopify Store Owner",
    quote: "I opened my US LLC in 3 days. The team handled everything - I just filled out a form. Incredible service!",
    image: testimonialCarlos,
  },
  {
    name: "Sarah L.",
    business: "Amazon FBA Seller",
    quote: "As a non-US resident, I was worried about the process. They made it feel effortless. My EIN came through right on time.",
    image: testimonialSarah,
  },
  {
    name: "Ahmed K.",
    business: "Freelance Developer",
    quote: "Best investment I made for my business. Professional team, fast turnaround, and they even helped with my Mercury bank account.",
    image: testimonialAhmed,
  },
  {
    name: "Mei W.",
    business: "Online Course Creator",
    quote: "I was selling courses internationally but couldn't accept USD payments easily. Now with my LLC and Stripe account, everything flows smoothly.",
    image: testimonialMei,
  },
  {
    name: "David R.",
    business: "Digital Marketing Agency",
    quote: "Setting up a US entity seemed impossible from Europe. These guys made it happen in under a week. Highly recommend!",
    image: testimonialDavid,
  },
  {
    name: "Amara T.",
    business: "E-Commerce Entrepreneur",
    quote: "From filing to EIN to bank account - they handled it all. I could focus on growing my business instead of paperwork.",
    image: testimonialAmara,
  },
];

export function TestimonialsSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-20 bg-muted">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Hundreds of entrepreneurs trust us ⭐
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            Real stories from real clients around the world
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((t, i) => (
            <div
              key={i}
              className={`bg-card rounded-xl border border-border p-8 shadow-sm ${
                isVisible ? `animate-fade-up delay-${(i + 1) * 100}` : "opacity-0"
              }`}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-foreground mb-6 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                  loading="lazy"
                  width={48}
                  height={48}
                />
                <div>
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.business}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MiniTestimonialsSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-10 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            More success stories 💬
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.slice(3).map((t, i) => (
            <div
              key={i}
              className={`bg-card rounded-lg border border-border p-5 shadow-sm ${
                isVisible ? `animate-fade-up delay-${(i + 1) * 100}` : "opacity-0"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-9 h-9 rounded-full object-cover"
                  loading="lazy"
                  width={36}
                  height={36}
                />
                <div>
                  <p className="font-medium text-sm text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.business}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-sm text-foreground/90 italic">"{t.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
