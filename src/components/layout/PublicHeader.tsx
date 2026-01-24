import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

interface PublicHeaderProps {
  transparent?: boolean;
}

export default function PublicHeader({ transparent = false }: PublicHeaderProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll for header background
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isScrolled = scrollY > 50;
  // If not transparent mode, always show solid background
  const showBackground = !transparent || isScrolled;

  return (
    <motion.header 
      className="fixed w-full z-50 transition-all duration-300"
      style={{ 
        backgroundColor: showBackground ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
        backdropFilter: showBackground ? 'blur(12px)' : 'none',
        borderBottom: showBackground ? '1px solid rgba(0, 0, 0, 0.1)' : 'none'
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/zirokash-logo.png" 
              alt="ZiroKash - Custom Payment Forms & Digital Wallet for Africa" 
              className="h-20 sm:h-24 w-auto scale-[1.5] sm:scale-[1.8] transform origin-left transition-transform hover:scale-[1.9]"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link to="/#features" className={`text-sm font-medium transition-colors ${showBackground ? 'text-slate-900 hover:text-black' : 'text-foreground/70 hover:text-foreground'}`}>
              Features
            </Link>
            <Link to="/#how-it-works" className={`text-sm font-medium transition-colors ${showBackground ? 'text-slate-900 hover:text-black' : 'text-foreground/70 hover:text-foreground'}`}>
              How It Works
            </Link>
            <Link to="/#pricing" className={`text-sm font-medium transition-colors ${showBackground ? 'text-slate-900 hover:text-black' : 'text-foreground/70 hover:text-foreground'}`}>
              Pricing
            </Link>
          </nav>
          
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className={showBackground ? "text-slate-900 hover:text-black hover:bg-slate-100" : ""}>
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="bg-gradient-to-r from-primary to-secondary cta-button">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t bg-background/95 backdrop-blur-lg"
        >
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link to="/#features" className="block py-2 text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
              Features
            </Link>
            <Link to="/#how-it-works" className="block py-2 text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
              How It Works
            </Link>
            <Link to="/#pricing" className="block py-2 text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
              Pricing
            </Link>
            <div className="pt-2 space-y-2">
              <Link to="/auth" className="block">
                <Button variant="ghost" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign In
                </Button>
              </Link>
              <Link to="/auth" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
