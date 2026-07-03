import { Link } from "wouter";
import SiteLayout from "@/components/SiteLayout";
import PageHeader, { SectionHeading, ServiceList } from "@/components/PageHeader";
import { Stagger, StaggerItem, HoverLift, Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  POSITIONING,
  heroServiceCards,
  procurementServices,
  supplyChainServices,
  tenderServices,
} from "@/lib/siteContent";

export default function Services() {
  return (
    <SiteLayout>
      <PageHeader
        title="Our Services"
        subtitle={`${POSITIONING} — we help businesses source quality products, manage suppliers, and reduce purchasing stress.`}
      />

      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Core Services"
            title="Procurement Solutions"
            subtitle="End-to-end support from sourcing through delivery."
          />
          <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroServiceCards.map(({ name, desc, icon }) => (
              <StaggerItem key={name}>
                <HoverLift>
                  <Card className="h-full hover:shadow-xl transition-shadow duration-300 hover:border-accent/30">
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
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
          <Reveal direction="left">
            <h3 className="text-2xl font-extrabold text-primary mb-2">Procurement Services</h3>
            <p className="text-muted-foreground mb-6">Full-service procurement from identification through purchase.</p>
            <ServiceList items={procurementServices} />
          </Reveal>
          <Reveal direction="right" delay={0.1}>
            <h3 className="text-2xl font-extrabold text-primary mb-2">Supply Chain Support</h3>
            <p className="text-muted-foreground mb-6">Professional logistics and supplier management beyond the purchase order.</p>
            <ServiceList items={supplyChainServices} />
          </Reveal>
        </div>
      </section>

      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 animate-shimmer pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeading
            eyebrow="Institutional Buyers"
            title="Tender & Contract Support"
            subtitle="Critical support for government contractors, NGOs, and organizations running formal procurement processes."
            light
          />
          <div className="max-w-3xl mx-auto bg-white/5 rounded-2xl p-8 border border-white/10">
            <ServiceList items={tenderServices} light />
          </div>
          <Reveal className="text-center mt-10">
            <Link href="/request">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 h-12 hover-glow animate-shimmer">
                Request a Procurement Quote
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
