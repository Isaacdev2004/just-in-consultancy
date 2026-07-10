import { Link } from "wouter";
import { motion } from "framer-motion";
import SiteLayout from "@/components/SiteLayout";
import PageHeader, { SectionHeading } from "@/components/PageHeader";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  SUBPOSITIONING,
  POSITIONING,
  journeyTimeline,
  founderProfile,
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
          <Reveal direction="right">
            <img
              src={founderProfile.photoFull}
              alt={`${founderProfile.name}, ${founderProfile.title}`}
              className="rounded-2xl object-cover w-full max-h-[520px] shadow-xl ring-4 ring-accent/15"
            />
          </Reveal>
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
        <div className="max-w-5xl mx-auto px-6">
          <SectionHeading
            eyebrow="Leadership"
            title="Founder & CEO"
            subtitle="In procurement, people buy people. Albert Ofori Appiah brings engineering rigor, project discipline, and 10+ years in regulated industries to every client engagement."
          />

          <div className="grid lg:grid-cols-[280px_1fr] gap-10 items-start">
            <Reveal direction="left">
              <img
                src={founderProfile.photo}
                alt={`${founderProfile.name}, ${founderProfile.title}`}
                className="w-full rounded-2xl object-cover aspect-[3/4] shadow-xl ring-4 ring-accent/20 sticky top-32"
              />
            </Reveal>

            <div className="space-y-5">
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-primary mb-1">{founderProfile.name}</h3>
                <p className="text-accent font-semibold">{founderProfile.title}</p>
              </div>

              <p className="text-foreground/90 leading-relaxed font-medium">{founderProfile.intro}</p>

              <Stagger className="flex flex-wrap gap-2">
                {founderProfile.credentials.map((credential) => (
                  <StaggerItem key={credential}>
                    <Badge variant="secondary" className="text-xs font-semibold px-3 py-1 bg-primary/5 text-primary border border-primary/10">
                      {credential}
                    </Badge>
                  </StaggerItem>
                ))}
              </Stagger>

              {founderProfile.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}

              <Card className="border-accent/30 bg-accent/5">
                <CardContent className="p-6">
                  <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-2">Albert&apos;s Mission at JIT</p>
                  <p className="text-primary font-medium leading-relaxed italic">
                    &ldquo;{founderProfile.mission}&rdquo;
                  </p>
                </CardContent>
              </Card>

              <p className="text-muted-foreground leading-relaxed">
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
