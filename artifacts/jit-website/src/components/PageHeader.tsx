import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { HERO_BG } from "@/lib/siteContent";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  showQuoteCta?: boolean;
};

export default function PageHeader({ title, subtitle, showQuoteCta = true }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-primary">
      <img src={HERO_BG} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-primary/85" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-20">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">{title}</h1>
        {subtitle && <p className="text-white/70 text-lg max-w-3xl leading-relaxed">{subtitle}</p>}
        {showQuoteCta && (
          <Link href="/request">
            <Button className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 h-12 text-base">
              Request a Procurement Quote
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <div className="text-center mb-12 md:mb-16">
      <span className={`font-semibold text-sm tracking-widest uppercase ${light ? "text-accent" : "text-accent"}`}>
        {eyebrow}
      </span>
      <h2 className={`text-3xl md:text-4xl font-extrabold mt-3 mb-4 ${light ? "text-white" : "text-primary"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`max-w-2xl mx-auto ${light ? "text-white/60" : "text-muted-foreground"}`}>{subtitle}</p>
      )}
    </div>
  );
}

export function ServiceList({ items, light = false }: { items: string[]; light?: boolean }) {
  return (
    <ul className="grid sm:grid-cols-2 gap-3">
      {items.map((item) => (
        <li key={item} className={`flex items-start gap-2 text-sm ${light ? "text-white/80" : "text-muted-foreground"}`}>
          <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          {item}
        </li>
      ))}
    </ul>
  );
}
