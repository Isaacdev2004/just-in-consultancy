import { Link } from "wouter";
import SiteLayout from "@/components/SiteLayout";
import PageHeader, { SectionHeading } from "@/components/PageHeader";
import { Stagger, StaggerItem, Reveal } from "@/components/motion";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { industries } from "@/lib/siteContent";

export default function IndustriesPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="Industries Served"
        subtitle="We support procurement for businesses, institutions, and organizations across sectors — each with its own compliance and supply chain requirements."
      />

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Who We Serve"
            title="Cross-Industry Procurement"
            subtitle="From schools and hospitals to construction firms and government contractors."
          />
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {industries.map(({ name, desc, icon }) => (
              <StaggerItem key={name}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="group flex flex-col items-center gap-3 p-6 md:p-8 rounded-2xl bg-secondary hover:bg-primary hover:shadow-lg transition-colors duration-300 text-center h-full"
                >
                <div className="w-14 h-14 rounded-2xl bg-primary/5 group-hover:bg-white/10 flex items-center justify-center transition-colors shrink-0">
                  <svg className="w-7 h-7 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                  </svg>
                </div>
                <span className="font-semibold text-sm text-primary group-hover:text-white transition-colors">{name}</span>
                <p className="text-sm text-muted-foreground group-hover:text-white/75 leading-relaxed transition-colors">{desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="text-center mt-12">
            <Link href="/request">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 h-12">
                Request a Procurement Quote
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
