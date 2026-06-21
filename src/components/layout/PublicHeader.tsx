import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PublicHeaderProps {
  transparent?: boolean;
}

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
];

export default function PublicHeader({ transparent = false }: PublicHeaderProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isScrolled = scrollY > 60;
  const showBackground = !transparent || isScrolled;

  return (
    <motion.header
      className="fixed w-full z-50 transition-all duration-500"
      style={{
        backgroundColor: showBackground
          ? 'rgba(15, 23, 42, 0.92)'
          : 'transparent',
        backdropFilter: showBackground ? 'blur(20px) saturate(1.5)' : 'none',
        borderBottom: showBackground
          ? '1px solid rgba(245, 158, 11, 0.12)'
          : 'none',
        boxShadow: showBackground
          ? '0 4px 32px rgba(0,0,0,0.3)'
          : 'none',
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg"
            aria-label="ZiroKash - Home"
          >
            <img
              src="/zirokash-logo.png"
              alt="ZiroKash"
              className="h-20 sm:h-24 w-auto scale-[1.5] sm:scale-[1.8] transform origin-left transition-all duration-300 group-hover:scale-[1.9] group-hover:drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="relative px-4 py-2 text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors duration-200 rounded-lg hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/auth">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-400/35 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] cursor-pointer cta-button"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.98)',
              borderTop: '1px solid rgba(245, 158, 11, 0.12)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="container mx-auto px-4 py-5 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.href}
                    className="block px-4 py-3 text-sm font-medium text-slate-300 hover:text-amber-400 hover:bg-white/5 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-3 space-y-2 border-t border-white/10">
                <Link to="/auth" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full text-slate-300 hover:text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold shadow-lg shadow-amber-500/25">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
