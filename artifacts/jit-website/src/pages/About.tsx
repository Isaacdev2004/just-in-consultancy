import { Link } from "wouter";
import { motion } from "framer-motion";
import SiteLayout from "@/components/SiteLayout";
import PageHeader, { SectionHeading } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  SUBPOSITIONING,
  POSITIONING,
  journeyTimeline,
  PHONE,
  PHONE_HREF,
} from "@/lib/siteContent";

export default function About() {
  return (
    <SiteLayout>
      <PageHeader
        title="About Us"
        subtitle="Just-In-Time Consultancy helps businesses and organizations source quality goods, compare suppliers, manage purchasing, and receive reliable procurement support."
      />

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading
              eyebrow="Who We Are"
              title={SUBPOSITIONING}
              subtitle={POSITIONING}
            />
            <p className="text-muted-foreground leading-relaxed mb-6 -mt-8">
              We help clients source, purchase, supply, and manage goods or services efficiently — from product
              identification and vendor comparison through purchase coordination and delivery.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              With operations spanning four continents and deep expertise in cross-border trade, we have helped
              hundreds of businesses reduce procurement costs, eliminate supplier risk, and build supply chains that
              scale.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="/images/sourcing-logistics.jpg" alt="Logistics operations" className="rounded-2xl object-cover h-48 w-full shadow-lg col-span-2" />
            <img src="/images/sourcing-vacuum.png" alt="Commercial equipment" className="rounded-2xl object-cover h-36 w-full shadow-lg" />
            <img src="/images/sourcing-vehicle.png" alt="Fleet procurement" className="rounded-2xl object-cover h-36 w-full shadow-lg" />
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading eyebrow="Mission & Vision" title="What Drives Us" />
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <h3 className="font-bold text-primary mb-3">Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Empower businesses through reliable procurement, sourcing, and supply solutions that save time,
                  reduce costs, and improve operational efficiency.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8">
                <h3 className="font-bold text-primary mb-3">Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Become a leading global procurement partner through innovation, transparent processes, and
                  exceptional customer service.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeading eyebrow="Our Journey" title="Company Timeline" />
          <div className="space-y-0">
            {journeyTimeline.map(({ year, title, desc }, i) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-6 pb-10 relative border-l-2 border-accent/30 pl-8 ml-4 last:pb-0"
              >
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-accent ring-4 ring-background" />
                <div>
                  <span className="text-accent font-bold text-sm">{year}</span>
                  <h4 className="font-bold text-primary mt-1 mb-2">{title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="leadership" className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Leadership"
            title="Meet Our Founder"
            subtitle="In procurement, people buy people. Albert Ofori Appiah leads Just-In-Time Consultancy with deep global trade experience."
          />
          <div className="max-w-4xl mx-auto grid md:grid-cols-[240px_1fr] gap-10 items-start">
            <img
              src="/images/team/founder-albert.jpg"
              alt="Albert Ofori Appiah, Founder & CEO"
              className="w-full rounded-2xl object-cover aspect-[3/4] shadow-xl ring-4 ring-accent/20"
            />
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-primary mb-1">Albert Ofori Appiah</h3>
              <p className="text-accent font-semibold mb-4">Founder & CEO</p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Albert founded Just-In-Time Consultancy to give businesses of every size access to world-class
                procurement intelligence. With deep experience in global trade and supplier development, he leads a
                team dedicated to delivering smarter sourcing, faster turnaround, and measurable cost savings for
                clients across 45+ countries.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Contact our U.S. headquarters at{" "}
                <a href={PHONE_HREF} className="text-accent font-semibold hover:underline">
                  {PHONE}
                </a>
                .
              </p>
              <Link href="/request">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  Request a Procurement Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
