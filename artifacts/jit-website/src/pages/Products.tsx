import { Link } from "wouter";
import SiteLayout from "@/components/SiteLayout";
import PageHeader, { SectionHeading } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { productCategories } from "@/lib/siteContent";

export default function Products() {
  return (
    <SiteLayout>
      <PageHeader
        title="Product Categories"
        subtitle="Business and institutional supplies we procure for clients worldwide — from office essentials to industrial equipment."
      />

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="What We Procure"
            title="Business & Institutional Supplies"
            subtitle="We source across these categories from verified global suppliers. Don't see your category? Request a quote — we likely cover it."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productCategories.map(({ name, desc }) => (
              <Card key={name} className="h-full hover:shadow-md transition-shadow hover:border-accent/30">
                <CardHeader>
                  <CardTitle className="text-base text-primary">{name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/request">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 h-12">
                Request a Procurement Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
