import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock background body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const isScrolled = scrollY > 60;
  const showBackground = !transparent || isScrolled;

  return (
    <motion.header
      className={`fixed w-full transition-all duration-500 ${isMobileMenuOpen ? 'z-[100]' : 'z-50'}`}
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

      {/* Mobile Menu (Slide-out Drawer) rendered via Portal */}
      {mounted && createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[999] md:hidden"
              />
              
              {/* Drawer Panel */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-[80%] max-w-[300px] bg-slate-950/95 border-l border-slate-800 shadow-2xl z-[1000] md:hidden flex flex-col"
                style={{
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <img src="/favicon.png" alt="ZiroKash" className="h-8 w-8" />
                    <span className="font-bold text-lg text-white bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
                      ZiroKash
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Drawer Links */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto" role="navigation" aria-label="Mobile navigation">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={link.href}
                        className="block px-4 py-3 text-base font-semibold text-slate-300 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-all duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Drawer Actions */}
                <div className="p-6 border-t border-slate-800/60 space-y-3 bg-slate-950/20">
                  <Link to="/auth" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-slate-300 hover:text-white hover:bg-white/10 h-11 rounded-xl">
                      Sign In
                  </Button>
                  </Link>
                  <Link to="/auth" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold shadow-lg shadow-amber-500/25 h-11 rounded-xl">
                      Get Started
                  </Button>
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.header>
  );
}
