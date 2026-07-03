import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, useInView } from "framer-motion";
import SiteLayout from "@/components/SiteLayout";
import { SectionHeading } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  TAGLINE,
  POSITIONING,
  SUBPOSITIONING,
  HERO_BG,
  heroServiceCards,
  whyChooseUs,
  industries,
  processSteps,
  productCategories,
  testimonials,
  faqs,
} from "@/lib/siteContent";

const sourcingShowcase = [
  { src: "/images/sourcing-logistics.jpg", title: "Industrial & Logistics" },
  { src: "/images/sourcing-vacuum.png", title: "Commercial Equipment" },
  { src: "/images/sourcing-cleaning.png", title: "Specialty Systems" },
  { src: "/images/sourcing-vehicle.png", title: "Fleet & Logistics" },
];

function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const [, setLocation] = useLocation();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <SiteLayout>
      {/* Hero */}
      <section
        className="min-h-[calc(100vh-5.5rem)] md:min-h-[calc(100vh-7rem)] flex flex-col relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1A365D 0%, #152e4f 40%, #0f2340 100%)" }}
      >
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-[0.12] mix-blend-luminosity" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(26,54,93,0.92) 0%, rgba(21,46,79,0.88) 45%, rgba(15,35,64,0.95) 100%)" }} />
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, hsl(46,66%,52%) 0%, transparent 70%)" }} />
        </div>

        <div className="flex-1 flex items-center relative z-10">
          <div className="max-w-7xl mx-auto px-6 w-full py-10 md:py-14 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-accent text-xs font-semibold tracking-[0.15em] uppercase">{POSITIONING}</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-[clamp(2.25rem,4.5vw,4rem)] font-black text-white leading-[1.05] tracking-tight mb-6"
              >
                Smart Procurement Solutions Delivered Just in Time
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-lg text-white/60 max-w-lg leading-relaxed mb-8"
              >
                Just-In-Time Consultancy helps businesses and organizations source quality goods, compare suppliers,
                manage purchasing, and receive reliable procurement support.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setLocation("/request")}
                  className="h-14 px-8 text-base font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/30"
                >
                  Request a Procurement Quote
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/services")}
                  className="h-14 px-8 text-base font-semibold text-white border-white/20 bg-white/5 hover:bg-white/10 hover:text-white"
                >
                  View Our Services
                </Button>
              </motion.div>

              <p className="text-white/40 text-sm mt-8 italic">{TAGLINE}</p>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-3 p-2">
                {sourcingShowcase.map(({ src, title }, i) => (
                  <div key={title} className={`relative overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 h-44" : "h-36"}`}>
                    <img src={src} alt={title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
                    <p className="absolute bottom-3 left-4 text-white text-sm font-bold">{title}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="What We Do"
            title="Procurement Services"
            subtitle={SUBPOSITIONING}
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroServiceCards.map(({ name, desc, icon }) => (
              <Card key={name} className="h-full hover:shadow-lg transition-all hover:-translate-y-0.5">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                    </svg>
                  </div>
                  <CardTitle className="text-lg text-primary">{name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/services">
              <Button variant="outline" className="font-semibold">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading eyebrow="Why Choose Us" title="Trusted Procurement Partner" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map(({ title, desc }, i) => (
              <div key={title} className="p-6 rounded-2xl bg-secondary hover:bg-primary hover:text-white transition-all duration-300 group">
                <div className="w-8 h-8 rounded-lg bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center mb-4">
                  <span className="text-accent text-sm font-bold">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h4 className="font-bold text-primary group-hover:text-white mb-2 transition-colors">{title}</h4>
                <p className="text-sm text-muted-foreground group-hover:text-white/75 leading-relaxed transition-colors">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories preview */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Product Categories"
            title="Business & Institutional Supplies"
            subtitle="Office, medical, industrial, and more — sourced from verified global suppliers."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {productCategories.slice(0, 10).map(({ name }) => (
              <div key={name} className="p-4 rounded-xl bg-card border border-border text-center text-sm font-semibold text-primary">
                {name}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90 font-semibold">Browse All Categories</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading eyebrow="Industries Served" title="Who We Serve" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {industries.map(({ name, desc, icon }) => (
              <div key={name} className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-secondary hover:bg-primary transition-all text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 group-hover:bg-white/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                  </svg>
                </div>
                <span className="font-semibold text-sm text-primary group-hover:text-white">{name}</span>
                <p className="text-sm text-muted-foreground group-hover:text-white/75 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/industries">
              <Button variant="outline" className="font-semibold">
                Learn More About Our Industries
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-24 bg-primary relative overflow-hidden">
        <img src={HERO_BG} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-[0.06]" />
        <div className="absolute inset-0 bg-primary/95" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeading eyebrow="How It Works" title="Our Procurement Process" subtitle="A simple four-step process from quote to delivery." light />
          <div className="grid md:grid-cols-4 gap-4">
            {processSteps.map(({ step, title, desc }, i) => (
              <button
                key={step}
                type="button"
                onClick={() => setActiveStep(i)}
                className={`text-left rounded-2xl p-5 transition-all duration-300 ${activeStep === i ? "bg-accent text-accent-foreground shadow-xl" : "bg-white/5 hover:bg-white/10 text-white"}`}
              >
                <div className={`text-xs font-bold mb-3 ${activeStep === i ? "text-white/80" : "text-accent"}`}>{step}</div>
                <h4 className="font-bold text-sm mb-2">{title}</h4>
                <p className={`text-xs leading-relaxed ${activeStep === i ? "text-white/80" : "text-white/50"}`}>{desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Supplier CTA */}
      <section className="py-16 bg-accent">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">Become a Supplier Partner</h2>
          <p className="text-white/80 mb-8 leading-relaxed">
            Vendors can submit company details, product categories, pricing, and certifications to join our verified supplier network.
          </p>
          <Link href="/supplier-registration">
            <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 h-12">
              Register as a Supplier
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            {[
              { end: 500, suffix: "+", label: "Projects Completed" },
              { end: 350, suffix: "+", label: "Satisfied Clients" },
              { end: 1200, suffix: "+", label: "Verified Suppliers" },
              { end: 45, suffix: "+", label: "Countries Served" },
              { end: 8, suffix: "+", label: "Years of Experience" },
              { end: 97, suffix: "%", label: "Client Satisfaction" },
            ].map(({ end, suffix, label }) => (
              <div key={label}>
                <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">
                  <AnimatedCounter end={end} suffix={suffix} />
                </div>
                <p className="text-muted-foreground text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground text-xs md:text-sm mt-10 max-w-3xl mx-auto">
            Client satisfaction rate based on post-project surveys (2022–2025). References available upon request.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading eyebrow="Client Stories" title="What Our Clients Say" />
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map(({ name, company, role, text, avatar }) => (
              <Card key={name} className="h-full">
                <CardContent className="p-8">
                  <p className="text-foreground/80 leading-relaxed mb-6 italic">&ldquo;{text}&rdquo;</p>
                  <div className="flex items-center gap-4">
                    <img src={avatar} alt={name} className="w-14 h-14 rounded-full object-cover ring-2 ring-accent/30" />
                    <div>
                      <p className="font-bold text-primary text-sm">{name}</p>
                      <p className="text-xs text-muted-foreground">
                        {role}, {company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold text-primary hover:no-underline py-5">{q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Ready to Start Your Procurement Project?</h2>
          <p className="text-white/70 mb-8">{TAGLINE}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setLocation("/request")} className="h-14 px-10 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base">
              Request a Procurement Quote
            </Button>
            <Button onClick={() => setLocation("/contact")} variant="outline" className="h-14 px-10 text-white border-white/25 bg-white/5 hover:bg-white/10 hover:text-white font-semibold">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
