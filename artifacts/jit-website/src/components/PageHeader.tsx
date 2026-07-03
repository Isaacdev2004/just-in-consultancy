import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HERO_BG } from "@/lib/siteContent";
import { FloatingOrbs, fadeUp, easeSmooth } from "@/components/motion";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  showQuoteCta?: boolean;
};

export default function PageHeader({ title, subtitle, showQuoteCta = true }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-primary">
      <motion.img
        src={HERO_BG}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-20 animate-ken-burns"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: easeSmooth }}
      />
      <div className="absolute inset-0 bg-primary/85" />
      <FloatingOrbs />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-20">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeSmooth }}
          className="text-3xl md:text-5xl font-extrabold text-white mb-4"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: easeSmooth }}
            className="text-white/70 text-lg max-w-3xl leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
        {showQuoteCta && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: easeSmooth }}
          >
            <Link href="/request">
              <Button className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 h-12 text-base animate-shimmer hover-glow">
                Request a Procurement Quote
              </Button>
            </Link>
          </motion.div>
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
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      className="text-center mb-12 md:mb-16"
    >
      <motion.span
        variants={fadeUp}
        className="font-semibold text-sm tracking-widest uppercase text-accent inline-block"
      >
        {eyebrow}
      </motion.span>
      <motion.h2
        variants={fadeUp}
        className={`text-3xl md:text-4xl font-extrabold mt-3 mb-4 ${light ? "text-white" : "text-primary"}`}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeUp}
          className={`max-w-2xl mx-auto ${light ? "text-white/60" : "text-muted-foreground"}`}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

export function ServiceList({ items, light = false }: { items: string[]; light?: boolean }) {
  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05 } },
      }}
      className="grid sm:grid-cols-2 gap-3"
    >
      {items.map((item) => (
        <motion.li
          key={item}
          variants={fadeUp}
          className={`flex items-start gap-2 text-sm ${light ? "text-white/80" : "text-muted-foreground"}`}
        >
          <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}
