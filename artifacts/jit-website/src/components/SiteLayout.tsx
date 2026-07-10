import { useState, useEffect, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS, PHONE, PHONE_HREF, TAGLINE, POSITIONING } from "@/lib/siteContent";

export default function SiteLayout({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled ? "bg-white/98 backdrop-blur-md shadow-md border-b border-border" : "bg-white/95 backdrop-blur-md shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[5.75rem] md:h-[8.5rem] flex items-center justify-between gap-2 md:gap-4">
          <Link href="/" className="flex items-center shrink-0 h-full py-1 sm:py-1.5 md:py-2 group">
            <motion.img
              src="/logo.png"
              alt="Just-In-Time Consultancy LLC"
              className="h-full w-auto max-w-[min(320px,48vw)] sm:max-w-[min(380px,40vw)] md:max-w-none object-contain object-left transition-transform duration-300 group-hover:scale-[1.02]"
              whileTap={{ scale: 0.97 }}
            />
          </Link>

          <div className="hidden xl:flex items-center gap-5">
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={href} href={href} className="relative group py-1">
                <span
                  className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                    isActive(href) ? "text-primary" : "text-foreground/60 group-hover:text-primary"
                  }`}
                >
                  {label}
                </span>
                <span
                  className={`absolute -bottom-0.5 left-0 h-0.5 bg-accent rounded-full transition-all duration-300 ${
                    isActive(href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={() => setLocation("/request")}
                className="hidden sm:inline-flex bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg shadow-accent/25 text-sm px-4 md:px-5 h-10 md:h-11 animate-shimmer hover-glow"
              >
                Request a Procurement Quote
              </Button>
            </motion.div>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="xl:hidden shrink-0" aria-label="Open menu">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(100vw-2rem,320px)]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 mt-6">
                  {NAV_LINKS.map(({ label, href }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium ${
                        isActive(href) ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted"
                      }`}
                    >
                      {label}
                    </Link>
                  ))}
                  <Button
                    onClick={() => setLocation("/request")}
                    className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold w-full"
                  >
                    Request a Procurement Quote
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-[5.75rem] md:pt-[8.5rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <img
                src="/logo.png"
                alt="Just-In-Time Consultancy LLC"
                className="h-28 md:h-36 w-auto object-contain mb-4 bg-white/95 rounded-lg px-2 py-1.5"
              />
              <p className="text-accent font-semibold text-sm mb-2">{POSITIONING}</p>
              <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-sm">{TAGLINE}</p>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {NAV_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/request" className="text-sm text-accent hover:text-accent/80 transition-colors font-semibold">
                    Request a Quote
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/60">
                <li>
                  <a href={PHONE_HREF} className="hover:text-accent transition-colors">
                    {PHONE}
                  </a>
                </li>
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
            <button
              onClick={() => setLocation("/admin")}
              className="text-xs text-primary-foreground/20 hover:text-primary-foreground/40 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
