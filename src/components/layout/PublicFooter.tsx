import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "How It Works", href: "/#how-it-works" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Support", href: "/support" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden"
      style={{ backgroundColor: '#0a1120' }}
    >
      {/* Ambient orb */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(245,158,11,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 border-t" style={{ borderColor: 'rgba(245,158,11,0.1)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          
          {/* Top grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12 mb-14">
            
            {/* Brand column — takes 2 cols */}
            <div className="lg:col-span-2">
              <Link to="/" aria-label="ZiroKash - Home">
                <img
                  src="/zirokash-logo.png"
                  alt="ZiroKash"
                  className="h-16 w-auto mb-5"
                />
              </Link>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
                The easiest way to collect payments online. Trusted by schools, churches, and businesses across Africa.
              </p>

              {/* Newsletter */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-3">
                  Stay updated
                </p>
                <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                  <label htmlFor="footer-email" className="sr-only">Email address</label>
                  <input
                    id="footer-email"
                    type="email"
                    placeholder="Your email"
                    autoComplete="email"
                    className="flex-1 px-3 py-2 text-sm rounded-lg border bg-white/5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    style={{ borderColor: 'rgba(245,158,11,0.2)' }}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold shrink-0 cursor-pointer"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-5">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-sm text-slate-400 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:text-amber-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div
            className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <p className="text-xs text-slate-500">
              © {currentYear} ZiroKash. All rights reserved.
            </p>

            <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-200">
              <span className="text-xs text-slate-500 font-medium">Product of</span>
              <a
                href="https://techverge.africa"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
                aria-label="TechVerge Africa (opens in new tab)"
              >
                <img
                  src="/techverge-logo.png"
                  alt="TechVerge Africa"
                  className="h-5 w-auto"
                />
                <span className="text-xs font-bold">TechVerge Africa</span>
              </a>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-600">
              <Zap className="h-3 w-3 text-amber-600" aria-hidden="true" />
              <span>Empowering Africa's digital economy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
