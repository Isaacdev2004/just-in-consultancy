import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, useInView, useAnimation } from "framer-motion";
import { useSubmitContact } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

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

  return <span ref={ref}>{count}{suffix}</span>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const sourcingShowcase = [
  { src: "/images/sourcing-logistics.jpg", title: "Industrial & Logistics", desc: "Well-lit warehouse, port, and distribution facilities from audited global partners." },
  { src: "/images/sourcing-vacuum.png", title: "Commercial Equipment", desc: "Facility management and professional cleaning systems." },
  { src: "/images/sourcing-cleaning.png", title: "Specialty Systems", desc: "Professional-grade maintenance and extraction solutions." },
  { src: "/images/sourcing-vehicle.png", title: "Fleet & Logistics", desc: "Commercial vehicles and fleet procurement worldwide." },
];

const HERO_BG = "/images/hero-professional.jpg";
const PHONE = "+1 (508) 388-1790";
const PHONE_HREF = "tel:+15083881790";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const contactMutation = useSubmitContact();

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onSubmit = (values: z.infer<typeof contactSchema>) => {
    contactMutation.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({ title: "Message Sent", description: "We'll get back to you shortly." });
          form.reset();
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
        },
      }
    );
  };

  const services = [
    { name: "Market Research", desc: "Deep market analysis and competitive intelligence to inform your procurement strategy with data-driven insights.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { name: "Product Sourcing", desc: "Access our global network of verified suppliers to find the exact products you need at competitive prices.", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
    { name: "Procurement", desc: "End-to-end procurement management from RFQ to PO issuance, ensuring optimal terms and conditions.", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { name: "Supplier Vetting", desc: "Rigorous due diligence and verification of suppliers to protect your business from fraud and substandard quality.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { name: "Quality Assurance", desc: "Comprehensive quality inspection and control processes ensuring every product meets your exact specifications.", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
    { name: "Supply Chain Management", desc: "Strategic optimization of your entire supply chain for maximum efficiency, resilience, and cost savings.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { name: "Logistics Coordination", desc: "Seamless coordination of shipping, customs clearance, and last-mile delivery to get goods where they need to be.", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { name: "Business Advisory", desc: "Strategic consulting to help businesses build robust procurement frameworks and sustainable supplier relationships.", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  ];

  const whyChooseUs = [
    { title: "Reliable Supplier Network", desc: "1,200+ pre-vetted manufacturers and suppliers across 45+ countries, ready to fulfill your requirements." },
    { title: "Competitive Pricing", desc: "Our scale and relationships guarantee you get market-best pricing without compromising on quality." },
    { title: "Fast Turnaround", desc: "Dedicated procurement teams deliver quotations within 24–48 hours and close deals in record time." },
    { title: "Verified Manufacturers", desc: "Every supplier undergoes rigorous background checks, factory audits, and compliance verification." },
    { title: "Global Procurement Expertise", desc: "Deep knowledge of international trade regulations, incoterms, and cross-border logistics." },
    { title: "Quality Assurance", desc: "In-house QC inspectors and third-party lab testing ensure every shipment meets your standards." },
    { title: "Professional Customer Support", desc: "Dedicated account managers available during business hours across multiple time zones." },
    { title: "Technology Driven Process", desc: "Digital procurement workflows, real-time tracking, and transparent reporting at every stage." },
  ];

  const processSteps = [
    { step: "01", title: "Research", desc: "We conduct thorough market research to understand your product requirements and market landscape." },
    { step: "02", title: "Supplier Identification", desc: "Our global network is activated to identify the best-fit suppliers for your specific needs." },
    { step: "03", title: "Quotation", desc: "We obtain competitive quotes, negotiate terms, and present you with a comprehensive comparison." },
    { step: "04", title: "Procurement", desc: "Upon approval, we manage the entire purchase process including contract execution and payment terms." },
    { step: "05", title: "Quality Inspection", desc: "Pre-shipment inspections are conducted to verify product quality against your specifications." },
    { step: "06", title: "Shipping", desc: "We coordinate freight forwarding, export documentation, and customs clearance." },
    { step: "07", title: "Delivery", desc: "End-to-end tracking and last-mile coordination ensures your goods arrive safely and on time." },
  ];

  const industries = [
    { name: "Healthcare", desc: "Medical devices, PPE, and hospital supplies sourced to FDA and ISO standards.", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
    { name: "Manufacturing", desc: "Raw materials, components, and production equipment for lean global supply chains.", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
    { name: "Construction", desc: "Heavy machinery, building materials, and site equipment from audited suppliers.", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { name: "Agriculture", desc: "Farm equipment, irrigation systems, and agri-inputs for commercial growers worldwide.", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { name: "Retail", desc: "Consumer goods, packaging, and private-label products at competitive wholesale volumes.", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
    { name: "Technology", desc: "Electronics, IT hardware, and components with full spec verification and warranty support.", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { name: "Hospitality", desc: "Commercial kitchen, housekeeping, and guest amenity supplies for hotels and resorts.", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "Government", desc: "Compliant procurement for public-sector tenders, NGOs, and institutional buyers.", icon: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" },
  ];

  const testimonials = [
    { name: "Sarah Mitchell", company: "TechNova Solutions", role: "Head of Procurement", avatar: "/images/team/testimonial-sarah.jpg", text: "Just-In-Time Consultancy transformed our sourcing process completely. We cut procurement costs by 28% in the first year while improving supplier quality significantly. Their global network is genuinely impressive." },
    { name: "David Okonkwo", company: "Meridian Healthcare Ltd", role: "Operations Director", avatar: "/images/team/testimonial-david.jpg", text: "For medical equipment sourcing in markets where trust is everything, JIT has been an invaluable partner. Their supplier verification process is thorough and their team is incredibly responsive." },
    { name: "Amara Diallo", company: "West Africa Trading Co.", role: "Managing Director", avatar: "/images/team/testimonial-amara.jpg", text: "We've worked with JIT on over 40 procurement projects across 12 countries. Their logistics coordination and customs expertise has saved us countless hours and significant costs." },
    { name: "James Thornton", company: "Thornton Manufacturing Group", role: "CEO", avatar: "/images/team/testimonial-james.jpg", text: "Professional, reliable, and results-driven. JIT helped us establish a robust supply chain for our new product line in under 3 months. I highly recommend them to any business scaling globally." },
  ];

  const faqs = [
    { q: "How long does a typical procurement project take?", a: "Timelines vary based on complexity and product type. Simple sourcing requests are typically completed in 5–10 business days. Complex supply chain projects may take 4–8 weeks. We always provide a clear timeline upfront." },
    { q: "Which countries do you source from?", a: "We source from 45+ countries globally, with strong networks in China, India, Southeast Asia, Europe, the Middle East, and Africa. Our team has local expertise in each region." },
    { q: "How do you verify your suppliers?", a: "All suppliers undergo a rigorous vetting process including business registration verification, factory audits, trade reference checks, financial background checks, and compliance assessments. We maintain a regularly updated approved supplier database." },
    { q: "What happens if the product quality doesn't meet our specifications?", a: "We conduct pre-shipment quality inspections at all our engagements. In the rare case of a quality issue, we manage the dispute resolution process with the supplier and ensure the matter is resolved — including replacements or refunds where applicable." },
    { q: "Do you handle customs and import documentation?", a: "Yes. Our logistics team coordinates all export documentation, customs clearance, and import compliance. We work with licensed customs brokers in key jurisdictions to ensure smooth border crossings." },
    { q: "What is your fee structure?", a: "We operate on a service fee model based on the scope of the engagement. Fees are agreed upfront before any work begins. Contact us for a detailed quote tailored to your specific requirements." },
    { q: "Can you handle urgent or rush procurement requests?", a: "Yes, we offer expedited procurement services for time-sensitive requirements. Please indicate urgency in your request and our team will prioritize accordingly." },
    { q: "Do you work with small businesses and startups?", a: "Absolutely. We work with businesses of all sizes — from solo e-commerce entrepreneurs to large multinational corporations. Our services scale to your needs and budget." },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/98 backdrop-blur-md shadow-sm border-b border-border" : "bg-white/95 backdrop-blur-md shadow-sm"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[5.5rem] md:h-28 flex items-center justify-between gap-3 md:gap-6">
          <Link href="/" className="flex items-center shrink min-w-0">
            <img
              src="/logo.png"
              alt="Just-In-Time Consultancy LLC"
              className="h-[3.25rem] sm:h-16 md:h-[5.25rem] w-auto object-contain"
            />
          </Link>
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {[["About", "about"], ["Team", "leadership"], ["Sourcing", "sourcing"], ["Services", "services"], ["Process", "process"], ["Industries", "industries"], ["Contact", "contact"]].map(([label, id]) => (
              <a key={id} href={`#${id}`} className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors duration-200">{label}</a>
            ))}
          </div>
          <Button onClick={() => setLocation("/request")} className="shrink-0 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg shadow-accent/25 text-sm md:text-base px-4 md:px-6 h-10 md:h-11">
            Request a Service
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col relative overflow-hidden pt-[5.5rem] md:pt-28" style={{ background: "linear-gradient(135deg, #1A365D 0%, #152e4f 40%, #0f2340 100%)" }}>
        {/* Background layers */}
        <div className="absolute inset-0">
          {/* Hero background photo */}
          <img
            src={HERO_BG}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-[0.12] mix-blend-luminosity"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(26,54,93,0.92) 0%, rgba(21,46,79,0.88) 45%, rgba(15,35,64,0.95) 100%)" }} />
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "128px" }} />
          {/* Radial accent glow left */}
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, hsl(46,66%,52%) 0%, transparent 70%)" }} />
          {/* Radial deep blue glow right */}
          <div className="absolute -bottom-60 -right-20 w-[700px] h-[700px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, #1a4a9a 0%, transparent 70%)" }} />
          {/* Subtle horizontal line grid */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(255,255,255,0.6) 25%, rgba(255,255,255,0.6) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.6) 75%, rgba(255,255,255,0.6) 76%, transparent 77%), linear-gradient(90deg, transparent 24%, rgba(255,255,255,0.6) 25%, rgba(255,255,255,0.6) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.6) 75%, rgba(255,255,255,0.6) 76%, transparent 77%)", backgroundSize: "80px 80px" }} />
        </div>

        {/* Main hero content */}
        <div className="flex-1 flex items-center relative z-10">
          <div className="max-w-7xl mx-auto px-6 w-full py-10 md:py-14 lg:py-16 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">

            {/* Left — Text */}
            <div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">Global Procurement Consultancy</span>
                </div>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                className="text-[clamp(3rem,5.5vw,5rem)] font-black text-white leading-[1.0] tracking-tight mb-6">
                We Research.<br />
                We{" "}
                <span className="relative inline-block">
                  <span style={{ WebkitTextStroke: "2px hsl(46,66%,52%)", color: "transparent" }}>Source.</span>
                  <span className="absolute inset-0 text-accent" style={{ clipPath: "inset(0 60% 0 0)", transition: "clip-path 1.5s ease" }}>Source.</span>
                </span>
                <br />
                We Deliver.
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg text-white/50 max-w-lg leading-relaxed mb-10">
                Helping businesses source quality products smarter, faster, and more affordably — across{" "}
                <span className="text-white/80 font-semibold">45+ countries</span> and{" "}
                <span className="text-white/80 font-semibold">1,200+ verified suppliers</span>.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-col sm:flex-row gap-3 mb-12">
                <button onClick={() => setLocation("/request")}
                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-white overflow-hidden transition-all duration-300"
                  style={{ background: "linear-gradient(135deg, hsl(46,66%,45%) 0%, hsl(46,66%,58%) 100%)", boxShadow: "0 0 40px rgba(212,175,55,0.3), 0 4px 15px rgba(0,0,0,0.3)" }}>
                  <span className="relative z-10">Request a Service</span>
                  <svg className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base text-white/70 hover:text-white border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 transition-all duration-300">
                  Book Consultation
                </button>
              </motion.div>

              {/* Trust bar */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-wrap items-center gap-6">
                {[
                  { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "Verified Suppliers" },
                  { icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "45+ Countries" },
                  { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "48hr Turnaround" },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon}/></svg>
                    </div>
                    <span className="text-white/40 text-sm font-medium">{label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — Photo collage */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-3 p-2">
                {sourcingShowcase.map(({ src, title }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className={`relative overflow-hidden rounded-2xl group ${i === 0 ? "col-span-2 h-44" : "h-36"}`}
                    style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.45)" }}>
                    <img src={src} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-sm font-bold">{title}</p>
                    </div>
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent animate-pulse" />
                  </motion.div>
                ))}
              </div>

              {/* Floating stat cards */}
              <motion.div animate={{ y: [-6, 6, -6] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 z-30 flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-md border border-white/10"
                style={{ background: "rgba(10,22,40,0.85)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div>
                  <p className="text-white text-sm font-bold leading-tight">1,200+</p>
                  <p className="text-white/40 text-xs">Verified Suppliers</p>
                </div>
              </motion.div>

              <motion.div animate={{ y: [6, -6, 6] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -left-6 bottom-8 z-30 flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-md border border-white/10"
                style={{ background: "rgba(10,22,40,0.85)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(26,74,154,0.4)" }}>
                  <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <p className="text-white text-sm font-bold leading-tight">45+ Nations</p>
                  <p className="text-white/40 text-xs">Global Reach</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom marquee ticker */}
        <div className="relative z-10 border-t border-white/5 py-4 overflow-hidden">
          <div className="flex gap-0" style={{ animation: "marquee 30s linear infinite", whiteSpace: "nowrap" }}>
            {[...Array(2)].map((_, repeat) => (
              <div key={repeat} className="flex items-center gap-8 pr-8">
                {["China", "India", "UAE", "Germany", "UK", "USA", "Ghana", "Kenya", "Singapore", "Brazil", "Japan", "South Korea", "Turkey", "Nigeria", "South Africa", "Indonesia", "Malaysia", "Netherlands", "Italy", "Canada"].map((country) => (
                  <span key={country} className="flex items-center gap-2 text-white/25 text-sm font-medium">
                    <span className="w-1 h-1 rounded-full bg-accent/50" />
                    {country}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-16 left-8 z-10 hidden lg:flex flex-col items-center gap-2">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          <span className="text-white/20 text-[10px] tracking-[0.2em] uppercase rotate-90 origin-center translate-y-4">Scroll</span>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* Global Sourcing Showcase */}
      <section id="sourcing" className="py-24 bg-primary relative overflow-hidden">
        <img
          src={HERO_BG}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-[0.08]"
        />
        <div className="absolute inset-0 bg-primary/90" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <span className="text-accent font-semibold text-sm tracking-widest uppercase">What We Source</span>
            <h2 className="text-4xl font-extrabold text-white mt-3 mb-4">Global Sourcing in Action</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              From industrial equipment to fleet vehicles and commercial systems — we connect you with the right suppliers across every category.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sourcingShowcase.map(({ src, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={src}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="w-8 h-0.5 bg-accent mb-3" />
                  <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="text-accent font-semibold text-sm tracking-widest uppercase">About Us</span>
              <h2 className="text-4xl font-extrabold text-primary mt-3 mb-6 leading-tight">Redefining Global Procurement Excellence</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Just-In-Time Consultancy was founded on a simple but powerful idea: that businesses of every size deserve access to the same procurement intelligence and supplier networks that large corporations rely on. We bridge the gap between buyers and the world's best manufacturers.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                With operations spanning four continents and deep expertise in cross-border trade, we've helped hundreds of businesses reduce procurement costs, eliminate supplier risk, and build supply chains that scale.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Mission", text: "Empower businesses through high-quality research, sourcing, and procurement solutions that save time, reduce costs, and improve operational efficiency." },
                  { label: "Vision", text: "Become one of the leading global procurement and research consultancy firms through innovation, technology, and exceptional customer service." },
                ].map(({ label, text }) => (
                  <div key={label} className="border border-border rounded-xl p-5">
                    <div className="w-8 h-1 bg-accent rounded-full mb-3" />
                    <h4 className="font-bold text-primary mb-2">{label}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="relative">
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="space-y-3">
                  <div className="rounded-2xl overflow-hidden h-48 shadow-lg">
                    <img src="/images/sourcing-cleaning.png" alt="Commercial cleaning equipment" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-32 shadow-lg">
                    <img src="/images/sourcing-vacuum.png" alt="Facility equipment" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-3 pt-8">
                  <div className="rounded-2xl overflow-hidden h-32 shadow-lg">
                    <img src="/images/sourcing-logistics.jpg" alt="Logistics and warehouse operations" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-48 shadow-lg">
                    <img src="/images/sourcing-vehicle.png" alt="Fleet and logistics" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-primary mb-8">Our Journey</h3>
              {[
                { year: "2016", title: "Founded in Massachusetts", desc: "Albert Ofori Appiah launches Just-In-Time Consultancy in the U.S., helping SMBs source industrial equipment, facility supplies, and MRO products domestically and abroad." },
                { year: "2018", title: "West Africa & Asia Networks", desc: "Established verified supplier partnerships in Ghana, Nigeria, India, and Southeast Asia — focused on manufacturing inputs and commercial equipment." },
                { year: "2020", title: "Digital Procurement Platform", desc: "Rolled out online request workflows, supplier scorecards, and pre-shipment QC inspection reporting for remote international buyers." },
                { year: "2022", title: "1,000+ Verified Suppliers", desc: "Crossed 1,000 audited suppliers across 40+ countries, with dedicated pipelines for healthcare, construction, and hospitality procurement." },
                { year: "2024", title: "350+ Active Clients", desc: "Serving buyers in 45+ countries from our U.S. headquarters (+1 508 388-1790), with a 97% post-project satisfaction rate from client surveys." },
              ].map(({ year, title, desc }, i) => (
                <motion.div key={year} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex gap-6 pb-8 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold shrink-0 z-10">{year.slice(2)}</div>
                    {i < 4 && <div className="w-0.5 flex-1 bg-border mt-2" />}
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-accent font-semibold tracking-wide">{year}</p>
                    <h4 className="font-bold text-primary mt-1">{title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section id="leadership" className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="text-accent font-semibold text-sm tracking-widest uppercase">Leadership</span>
            <h2 className="text-4xl font-extrabold text-primary mt-3 mb-4">Meet Our Founder</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Built on decades of procurement expertise and a commitment to connecting businesses with the world's best suppliers.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto bg-card border border-border rounded-2xl overflow-hidden shadow-lg grid md:grid-cols-5">
            <div className="md:col-span-2 aspect-square md:aspect-auto">
              <img
                src="/images/team/founder-albert.jpg"
                alt="Albert Ofori Appiah, Founder & CEO"
                className="w-full h-full object-cover min-h-[280px]"
              />
            </div>
            <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center">
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-2">Founder & CEO</p>
              <h3 className="text-2xl md:text-3xl font-extrabold text-primary mb-4">Albert Ofori Appiah</h3>
              <p className="text-muted-foreground leading-relaxed">
                Albert founded Just-In-Time Consultancy to give businesses of every size access to world-class procurement intelligence. With deep experience in global trade and supplier development, he leads a team dedicated to delivering smarter sourcing, faster turnaround, and measurable cost savings for clients across 45+ countries.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <span className="text-accent font-semibold text-sm tracking-widest uppercase">What We Do</span>
            <h2 className="text-4xl font-extrabold text-primary mt-3 mb-4">Premium Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Comprehensive procurement solutions designed for businesses that refuse to compromise on quality, speed, or value.</p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.div key={service.name} variants={fadeUp} transition={{ duration: 0.5 }}>
                <Card className="h-full group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border hover:border-accent/40 cursor-default bg-card">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-accent transition-colors duration-300">
                      <svg className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={service.icon} />
                      </svg>
                    </div>
                    <CardTitle className="text-base font-bold text-primary">{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <span className="text-accent font-semibold text-sm tracking-widest uppercase">Why Choose Us</span>
            <h2 className="text-4xl font-extrabold text-primary mt-3 mb-4">Built for Results</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Eight reasons why leading businesses trust Just-In-Time Consultancy with their most critical procurement needs.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map(({ title, desc }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl bg-secondary hover:bg-primary hover:text-white transition-all duration-300 group cursor-default">
                <div className="w-8 h-8 rounded-lg bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center mb-4">
                  <span className="text-accent text-sm font-bold">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h4 className="font-bold text-primary group-hover:text-white mb-2 transition-colors">{title}</h4>
                <p className="text-sm text-muted-foreground group-hover:text-white/70 leading-relaxed transition-colors">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Procurement Process */}
      <section id="process" className="py-24 bg-primary relative overflow-hidden">
        <img
          src={HERO_BG}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-[0.06]"
        />
        <div className="absolute inset-0 bg-primary/95" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <span className="text-accent font-semibold text-sm tracking-widest uppercase">How It Works</span>
            <h2 className="text-4xl font-extrabold text-white mt-3 mb-4">Our Procurement Process</h2>
            <p className="text-white/60 max-w-2xl mx-auto">A proven seven-step methodology that ensures precision, transparency, and results at every stage.</p>
          </motion.div>
          <div className="grid md:grid-cols-7 gap-4">
            {processSteps.map(({ step, title, desc }, i) => (
              <motion.div key={step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`relative cursor-pointer rounded-2xl p-5 transition-all duration-300 ${activeStep === i ? "bg-accent text-accent-foreground shadow-xl shadow-accent/30" : "bg-white/5 hover:bg-white/10 text-white"}`}
                onClick={() => setActiveStep(i)}>
                {i < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-2 w-4 z-10">
                    <svg className="w-4 h-4 text-white/20" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                )}
                <div className={`text-xs font-bold mb-3 ${activeStep === i ? "text-white/80" : "text-accent"}`}>{step}</div>
                <h4 className="font-bold text-sm mb-2">{title}</h4>
                <p className={`text-xs leading-relaxed hidden lg:block ${activeStep === i ? "text-white/80" : "text-white/50"}`}>{desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div className="mt-8 p-6 bg-white/5 rounded-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={activeStep}>
            <h4 className="text-accent font-bold mb-2">{processSteps[activeStep].step} — {processSteps[activeStep].title}</h4>
            <p className="text-white/70">{processSteps[activeStep].desc}</p>
          </motion.div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <span className="text-accent font-semibold text-sm tracking-widest uppercase">Industries Served</span>
            <h2 className="text-4xl font-extrabold text-primary mt-3 mb-4">Cross-Industry Expertise</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Our procurement expertise spans the full spectrum of industries, each with its own compliance, quality, and supply chain demands.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {industries.map(({ name, desc, icon }, i) => (
              <motion.div key={name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="group flex flex-col items-center gap-3 p-6 md:p-8 rounded-2xl bg-secondary hover:bg-primary hover:shadow-lg transition-all duration-300 cursor-default text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 group-hover:bg-white/10 flex items-center justify-center transition-colors shrink-0">
                  <svg className="w-7 h-7 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                  </svg>
                </div>
                <span className="font-semibold text-sm text-primary group-hover:text-white transition-colors">{name}</span>
                <p className="text-sm text-muted-foreground group-hover:text-white/75 leading-relaxed transition-colors">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-24 bg-accent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            {[
              { end: 500, suffix: "+", label: "Projects Completed" },
              { end: 350, suffix: "+", label: "Satisfied Clients" },
              { end: 1200, suffix: "+", label: "Verified Suppliers" },
              { end: 45, suffix: "+", label: "Countries Served" },
              { end: 8, suffix: "+", label: "Years of Experience" },
              { end: 97, suffix: "%", label: "Client Satisfaction" },
            ].map(({ end, suffix, label }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                  <AnimatedCounter end={end} suffix={suffix} />
                </div>
                <p className="text-white/70 text-sm font-medium">{label}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-white/60 text-xs md:text-sm mt-10 max-w-3xl mx-auto leading-relaxed">
            Figures reflect completed procurement engagements through 2025. Client satisfaction rate based on post-project surveys conducted with 200+ buyers (2022–2025). References available upon request.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <span className="text-accent font-semibold text-sm tracking-widest uppercase">Client Stories</span>
            <h2 className="text-4xl font-extrabold text-primary mt-3 mb-4">What Our Clients Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Verified client feedback from procurement leaders across healthcare, manufacturing, and international trade.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map(({ name, company, role, text, avatar }, i) => (
              <motion.div key={name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="h-full bg-card border-border hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <svg key={j} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                        Verified Client
                      </span>
                    </div>
                    <p className="text-foreground/80 leading-relaxed mb-6 italic">"{text}"</p>
                    <div className="flex items-center gap-4">
                      <img
                        src={avatar}
                        alt={name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-accent/30"
                      />
                      <div>
                        <p className="font-bold text-primary text-sm">{name}</p>
                        <p className="text-xs text-muted-foreground">{role}, {company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-10 max-w-2xl mx-auto leading-relaxed">
            Client references and detailed case studies are available upon request.{" "}
            <a href="#contact" className="text-accent font-semibold hover:underline">Contact us</a> to speak with a reference client in your industry.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <span className="text-accent font-semibold text-sm tracking-widest uppercase">FAQ</span>
            <h2 className="text-4xl font-extrabold text-primary mt-3 mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about working with Just-In-Time Consultancy.</p>
          </motion.div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow">
                <AccordionTrigger className="text-left font-semibold text-primary hover:no-underline py-5">{q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <span className="text-accent font-semibold text-sm tracking-widest uppercase">Contact Us</span>
            <h2 className="text-4xl font-extrabold text-primary mt-3 mb-4">Ready to Optimize Your Procurement?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Our team of experts is ready to help. Send us a message and we'll get back to you within one business day.</p>
          </motion.div>
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="space-y-6">
              {[
                { label: "Phone", value: PHONE, href: PHONE_HREF, icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
                { label: "General Inquiries", value: "info@justintimeconsultancy.com", href: "mailto:info@justintimeconsultancy.com", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                { label: "Support", value: "support@justintimeconsultancy.com", href: "mailto:support@justintimeconsultancy.com", icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" },
                { label: "Business Hours", value: "Mon – Fri: 8:00 AM – 6:00 PM (GMT)", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              ].map(({ label, value, href, icon }) => (
                <div key={label} className="flex gap-4 p-5 rounded-xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm text-foreground font-medium hover:text-accent transition-colors">{value}</a>
                    ) : (
                      <p className="text-sm text-foreground font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-2">
              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-5">
                        <FormField control={form.control} name="name" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Full Name</FormLabel>
                            <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}/>
                        <FormField control={form.control} name="email" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Email Address</FormLabel>
                            <FormControl><Input type="email" placeholder="john@company.com" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}/>
                      </div>
                      <div className="grid md:grid-cols-2 gap-5">
                        <FormField control={form.control} name="phone" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Phone (Optional)</FormLabel>
                            <FormControl><Input placeholder="+1 234 567 8900" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}/>
                        <FormField control={form.control} name="subject" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Subject</FormLabel>
                            <FormControl><Input placeholder="Procurement Inquiry" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}/>
                      </div>
                      <FormField control={form.control} name="message" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">Message</FormLabel>
                          <FormControl><Textarea placeholder="Tell us about your procurement needs..." className="min-h-[140px] resize-none" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-base" disabled={contactMutation.isPending}>
                        {contactMutation.isPending ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <img
                src="/logo.png"
                alt="Just-In-Time Consultancy LLC"
                className="h-28 md:h-36 w-auto object-contain mb-4 bg-white/95 rounded-lg px-2 py-1.5"
              />
              <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-xs">
                Empowering businesses through precision procurement, global sourcing, and supply chain excellence.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {[["About", "about"], ["Team", "leadership"], ["Sourcing", "sourcing"], ["Services", "services"], ["Process", "process"], ["Industries", "industries"], ["Contact", "contact"]].map(([label, id]) => (
                  <li key={id}><a href={`#${id}`} className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">{label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/60">
                <li><a href={PHONE_HREF} className="hover:text-accent transition-colors">{PHONE}</a></li>
                <li>info@justintimeconsultancy.com</li>
                <li>support@justintimeconsultancy.com</li>
                <li>Mon – Fri: 8AM – 6PM GMT</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/40">
              © {new Date().getFullYear()} Just-In-Time Consultancy. All rights reserved.
            </p>
            <button onClick={() => setLocation("/admin")} className="text-xs text-primary-foreground/20 hover:text-primary-foreground/40 transition-colors">
              Admin
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
