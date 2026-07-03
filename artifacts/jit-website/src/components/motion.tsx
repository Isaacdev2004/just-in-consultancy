import { motion, type Variants, useInView, AnimatePresence } from "framer-motion";
import { useRef, type ReactNode } from "react";

export const easeSmooth = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeSmooth } },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeSmooth } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: easeSmooth } },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -36 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easeSmooth } },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 36 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easeSmooth } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
};

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const variants: Record<string, Variants> = {
    up: fadeUp,
    down: fadeDown,
    left: slideInLeft,
    right: slideInRight,
    scale: scaleIn,
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants[direction]}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  slow = false,
}: {
  children: ReactNode;
  className?: string;
  slow?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: slow ? 0.12 : 0.08,
            delayChildren: 0.04,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

export function HoverLift({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FloatingOrbs() {
  return (
    <>
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-25 animate-float-slow pointer-events-none" style={{ background: "radial-gradient(circle, hsl(46,66%,52%) 0%, transparent 70%)" }} />
      <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full opacity-15 animate-float-delayed pointer-events-none" style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }} />
      <div className="absolute bottom-20 left-1/4 w-64 h-64 rounded-full opacity-10 animate-float-reverse pointer-events-none" style={{ background: "radial-gradient(circle, hsl(46,66%,52%) 0%, transparent 70%)" }} />
    </>
  );
}

export function MarqueeTicker({ items }: { items: string[] }) {
  return (
    <div className="relative overflow-hidden border-t border-white/10 py-4">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={`${item}-${i}`} className="inline-flex items-center gap-2 mx-6 text-white/30 text-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AnimatedPresenceSwap({
  activeKey,
  children,
  className,
}: {
  activeKey: string | number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeKey}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: easeSmooth }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
