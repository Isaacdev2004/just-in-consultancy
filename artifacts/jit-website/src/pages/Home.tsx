import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, useInView, AnimatePresence } from "framer-motion";
import SiteLayout from "@/components/SiteLayout";
import { SectionHeading } from "@/components/PageHeader";
import {
  Stagger,
  StaggerItem,
  HoverLift,
  FloatingOrbs,
  MarqueeTicker,
  easeSmooth,
  Reveal,
} from "@/components/motion";
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

const MARQUEE_COUNTRIES = [
  "China", "India", "UAE", "Germany", "UK", "USA", "Ghana", "Kenya",
  "Singapore", "Brazil", "Japan", "Nigeria", "South Africa", "Malaysia",
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

export default function Home() {
  const [, setLocation] = useLocation();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % processSteps.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <SiteLayout>
      {/* Hero */}
      <section
        className="min-h-[calc(100vh-5.75rem)] md:min-h-[calc(100vh-8.5rem)] flex flex-col relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1A365D 0%, #152e4f 40%, #0f2340 100%)" }}
      >
        <div className="absolute inset-0">
          <img
            src={HERO_BG}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-[0.14] mix-blend-luminosity animate-ken-burns"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(26,54,93,0.92) 0%, rgba(21,46,79,0.88) 45%, rgba(15,35,64,0.95) 100%)" }}
          />
          <FloatingOrbs />
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(0deg, transparent 24%, rgba(255,255,255,0.5) 25%, rgba(255,255,255,0.5) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.5) 75%, rgba(255,255,255,0.5) 76%, transparent 77%), linear-gradient(90deg, transparent 24%, rgba(255,255,255,0.5) 25%, rgba(255,255,255,0.5) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.5) 75%, rgba(255,255,255,0.5) 76%, transparent 77%)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <div className="flex-1 flex items-center relative z-10">
          <div className="max-w-7xl mx-auto px-6 w-full py-10 md:py-14 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, ease: easeSmooth }}
                className="mb-6"
              >
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
                  <span className="text-accent text-xs font-semibold tracking-[0.15em] uppercase">{POSITIONING}</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08, ease: easeSmooth }}
                className="text-[clamp(2.25rem,4.5vw,4rem)] font-black text-white leading-[1.05] tracking-tight mb-6"
              >
                Smart Procurement Solutions Delivered{" "}
                <span className="relative inline-block">
                  <span className="text-accent">Just in Time</span>
                  <motion.span
                    className="absolute -bottom-1 left-0 h-1 bg-accent/60 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.6, ease: easeSmooth }}
                  />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.22, ease: easeSmooth }}
                className="text-lg text-white/60 max-w-lg leading-relaxed mb-8"
              >
                Just-In-Time Consultancy helps businesses and organizations source quality goods, compare suppliers,
                manage purchasing, and receive reliable procurement support.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.38, ease: easeSmooth }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => setLocation("/request")}
                    className="h-14 px-8 text-base font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/30 animate-shimmer hover-glow w-full sm:w-auto"
                  >
                    Request a Procurement Quote
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/services")}
                    className="h-14 px-8 text-base font-semibold text-white border-white/20 bg-white/5 hover:bg-white/10 hover:text-white w-full sm:w-auto"
                  >
                    View Our Services
                  </Button>
                </motion.div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-white/40 text-sm mt-8 italic"
              >
                {TAGLINE}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.15, ease: easeSmooth }}
              className="relative hidden lg:block"
            >
              <div className="grid grid-cols-2 gap-3 p-2">
                {sourcingShowcase.map(({ src, title }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 + i * 0.1, ease: easeSmooth }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    className={`relative overflow-hidden rounded-2xl group cursor-default shadow-2xl ${i === 0 ? "col-span-2 h-44" : "h-36"}`}
                  >
                    <img
                      src={src}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
                    <p className="absolute bottom-3 left-4 text-white text-sm font-bold">{title}</p>
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
                  </motion.div>
                ))}
              </div>

              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 z-20 flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-md border border-white/10 bg-primary/80 shadow-xl"
              >
                <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center">
                  <span className="text-accent text-xs font-bold">1.2K+</span>
                </div>
                <div>
                  <p className="text-white text-sm font-bold leading-tight">Verified Suppliers</p>
                  <p className="text-white/40 text-xs">Global network</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [6, -6, 6] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -left-4 bottom-6 z-20 flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-md border border-white/10 bg-primary/80 shadow-xl"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-300 text-xs font-bold">
                  45+
                </div>
                <div>
                  <p className="text-white text-sm font-bold leading-tight">Countries</p>
                  <p className="text-white/40 text-xs">Worldwide reach</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <MarqueeTicker items={MARQUEE_COUNTRIES} />
      </section>

      {/* Services */}
      <section id="services" className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading eyebrow="What We Do" title="Procurement Services" subtitle={SUBPOSITIONING} />
          <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroServiceCards.map(({ name, desc, icon }) => (
              <StaggerItem key={name}>
                <HoverLift>
                  <Card className="h-full hover:shadow-xl transition-shadow duration-300 border-border/80 hover:border-accent/30 group">
                    <CardHeader>
                      <motion.div
                        className="w-12 h-12 rounded-xl bg-primary/5 group-hover:bg-accent flex items-center justify-center mb-3 transition-colors duration-300"
                        whileHover={{ rotate: [0, -8, 8, 0] }}
                        transition={{ duration: 0.4 }}
                      >
                        <svg className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                        </svg>
                      </motion.div>
                      <CardTitle className="text-lg text-primary">{name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                    </CardContent>
                  </Card>
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="text-center mt-10" delay={0.1}>
            <Link href="/services">
              <Button variant="outline" className="font-semibold hover-glow">
                View All Services
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading eyebrow="Why Choose Us" title="Trusted Procurement Partner" />
          <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map(({ title, desc }, i) => (
              <StaggerItem key={title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-2xl bg-secondary hover:bg-primary hover:text-white transition-colors duration-300 group h-full"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center mb-4">
                    <span className="text-accent text-sm font-bold">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h4 className="font-bold text-primary group-hover:text-white mb-2 transition-colors">{title}</h4>
                  <p className="text-sm text-muted-foreground group-hover:text-white/75 leading-relaxed transition-colors">{desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Product Categories"
            title="Business & Institutional Supplies"
            subtitle="Office, medical, industrial, and more — sourced from verified global suppliers."
          />
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {productCategories.slice(0, 10).map(({ name }) => (
              <StaggerItem key={name}>
                <motion.div
                  whileHover={{ scale: 1.04, y: -3 }}
                  className="p-4 rounded-xl bg-card border border-border text-center text-sm font-semibold text-primary hover:border-accent/40 hover:shadow-md transition-shadow cursor-default"
                >
                  {name}
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="text-center mt-10">
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90 font-semibold hover-glow">Browse All Categories</Button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading eyebrow="Industries Served" title="Who We Serve" />
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {industries.map(({ name, desc, icon }) => (
              <StaggerItem key={name}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-secondary hover:bg-primary transition-colors duration-300 text-center h-full"
                >
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.08 }}
                    className="w-14 h-14 rounded-2xl bg-primary/5 group-hover:bg-white/10 flex items-center justify-center"
                  >
                    <svg className="w-7 h-7 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                    </svg>
                  </motion.div>
                  <span className="font-semibold text-sm text-primary group-hover:text-white">{name}</span>
                  <p className="text-sm text-muted-foreground group-hover:text-white/75 leading-relaxed">{desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-24 bg-primary relative overflow-hidden">
        <img src={HERO_BG} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-[0.06] animate-ken-burns" />
        <div className="absolute inset-0 bg-primary/95" />
        <FloatingOrbs />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeading eyebrow="How It Works" title="Our Procurement Process" subtitle="A simple four-step process from quote to delivery." light />
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {processSteps.map(({ step, title, desc }, i) => (
              <motion.button
                key={step}
                type="button"
                onClick={() => setActiveStep(i)}
                layout
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  scale: activeStep === i ? 1.02 : 1,
                  boxShadow: activeStep === i ? "0 20px 40px -12px rgba(212,175,55,0.4)" : "0 0 0 rgba(0,0,0,0)",
                }}
                transition={{ duration: 0.35, ease: easeSmooth }}
                className={`text-left rounded-2xl p-5 transition-colors duration-300 ${activeStep === i ? "bg-accent text-accent-foreground" : "bg-white/5 hover:bg-white/10 text-white"}`}
              >
                <div className={`text-xs font-bold mb-3 ${activeStep === i ? "text-white/80" : "text-accent"}`}>{step}</div>
                <h4 className="font-bold text-sm mb-2">{title}</h4>
                <p className={`text-xs leading-relaxed hidden md:block ${activeStep === i ? "text-white/80" : "text-white/50"}`}>{desc}</p>
              </motion.button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: easeSmooth }}
              className="p-6 bg-white/5 rounded-2xl border border-white/10 md:hidden"
            >
              <p className="text-accent font-bold text-sm mb-1">{processSteps[activeStep].step}</p>
              <h4 className="text-white font-bold mb-2">{processSteps[activeStep].title}</h4>
              <p className="text-white/70 text-sm">{processSteps[activeStep].desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Supplier CTA */}
      <Reveal>
        <section className="py-16 bg-accent relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 animate-shimmer pointer-events-none" />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">Become a Supplier Partner</h2>
            <p className="text-white/80 mb-8 leading-relaxed">
              Vendors can submit company details, product categories, pricing, and certifications to join our verified supplier network.
            </p>
            <Link href="/supplier-registration">
              <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 h-12 hover-glow">
                Register as a Supplier
              </Button>
            </Link>
          </div>
        </section>
      </Reveal>

      {/* Stats */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            {[
              { end: 500, suffix: "+", label: "Projects Completed" },
              { end: 350, suffix: "+", label: "Satisfied Clients" },
              { end: 1200, suffix: "+", label: "Verified Suppliers" },
              { end: 45, suffix: "+", label: "Countries Served" },
              { end: 8, suffix: "+", label: "Years of Experience" },
              { end: 97, suffix: "%", label: "Client Satisfaction" },
            ].map(({ end, suffix, label }) => (
              <StaggerItem key={label}>
                <motion.div whileHover={{ scale: 1.05 }} className="py-2">
                  <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">
                    <AnimatedCounter end={end} suffix={suffix} />
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">{label}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading eyebrow="Client Stories" title="What Our Clients Say" />
          <Stagger className="grid md:grid-cols-2 gap-6">
            {testimonials.map(({ name, company, role, text, avatar }) => (
              <StaggerItem key={name}>
                <HoverLift>
                  <Card className="h-full hover:shadow-lg transition-shadow border-border/80">
                    <CardContent className="p-8">
                      <p className="text-foreground/80 leading-relaxed mb-6 italic">&ldquo;{text}&rdquo;</p>
                      <div className="flex items-center gap-4">
                        <motion.img
                          whileHover={{ scale: 1.08 }}
                          src={avatar}
                          alt={name}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-accent/30"
                        />
                        <div>
                          <p className="font-bold text-primary text-sm">{name}</p>
                          <p className="text-xs text-muted-foreground">
                            {role}, {company}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />
          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map(({ q, a }, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow">
                  <AccordionTrigger className="text-left font-semibold text-primary hover:no-underline py-5">{q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <FloatingOrbs />
        <Reveal className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl font-extrabold text-white mb-4">Ready to Start Your Procurement Project?</h2>
          <p className="text-white/70 mb-8">{TAGLINE}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={() => setLocation("/request")} className="h-14 px-10 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base animate-shimmer hover-glow w-full sm:w-auto">
                Request a Procurement Quote
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={() => setLocation("/contact")} variant="outline" className="h-14 px-10 text-white border-white/25 bg-white/5 hover:bg-white/10 hover:text-white font-semibold w-full sm:w-auto">
                Contact Us
              </Button>
            </motion.div>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
