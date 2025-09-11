
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Shield, Globe, CreditCard, Zap } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    initParallaxElements();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const initParallaxElements = () => {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });
    
    parallaxElements.forEach(el => {
      observer.observe(el);
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Header/Navigation */}
      <header className="border-b border-white/10 backdrop-blur-lg fixed w-full z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl animate-float">
              Z
            </div>
            <span className="text-2xl font-bold gradient-text">ZiroKash</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link to="#features" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors hover-scale">
              Features
            </Link>
            <Link to="#benefits" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors hover-scale">
              Benefits
            </Link>
            <Link to="#security" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors hover-scale">
              Security
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="hover-scale">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover-scale">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 md:pt-40 md:pb-32 grid-pattern relative">
        <div className="hero-glow absolute inset-0 opacity-40"></div>
        <div className="hero-particles absolute inset-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 gradient-text animate-hero-title">
              African Fintech Revolution for Everyone
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-2xl mx-auto animate-hero-subtitle">
              Experience seamless mobile money, instant payments, and digital banking with ZiroKash's modern financial platform designed for Africa.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up-delayed">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 pulse-subtle">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="animate-pulse-subtle">
                  Login to Dashboard
                </Button>
              </Link>
            </div>
            
            <div className="mt-16 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none h-full"></div>
              <div className="dashboard-showcase" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
                <div className="cube-wrapper">
                  <div className="cube">
                    <div className="cube-face front"></div>
                    <div className="cube-face back"></div>
                    <div className="cube-face right"></div>
                    <div className="cube-face left"></div>
                    <div className="cube-face top"></div>
                    <div className="cube-face bottom"></div>
                  </div>
                </div>
                <img 
                  src="/images/hero.png" 
                  alt="ZiroKash Dashboard" 
                  className="w-full max-w-4xl mx-auto rounded-lg shadow-2xl border border-white/10 glow animate-float"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg className="relative block w-full h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
          </svg>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-20 md:py-32 bg-card relative overflow-hidden">
        <div className="floating-elements">
          <div className="floating-element element-1"></div>
          <div className="floating-element element-2"></div>
          <div className="floating-element element-3"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 parallax-element">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 gradient-text">
              Revolutionary Financial Features
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              ZiroKash combines the convenience of mobile money with modern digital banking to create a seamless African financial experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl glass-card transform-card parallax-element">
              <div className="bg-gradient-to-br from-primary to-secondary w-12 h-12 rounded-full flex items-center justify-center mb-4 icon-pulse">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Mobile Money</h3>
              <p className="text-foreground/70">
                Send money across Africa instantly with minimal fees using our mobile money network integration.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="p-6 rounded-xl glass-card transform-card parallax-element delay-100">
              <div className="bg-gradient-to-br from-primary to-secondary w-12 h-12 rounded-full flex items-center justify-center mb-4 icon-pulse">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Virtual Cards</h3>
              <p className="text-foreground/70">
                Access virtual and physical cards for secure online and offline spending with instant controls.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="p-6 rounded-xl glass-card transform-card parallax-element delay-200">
              <div className="bg-gradient-to-br from-primary to-secondary w-12 h-12 rounded-full flex items-center justify-center mb-4 icon-pulse">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Digital Credit</h3>
              <p className="text-foreground/70">
                Build your credit score digitally and access microloans with transparent terms and instant approvals.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section id="benefits" className="py-20 md:py-32 grid-pattern relative">
        <div className="moving-gradient"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 parallax-element">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 gradient-text">
              Why Choose ZiroKash
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Experience the future of African finance with benefits that traditional banks simply can't offer.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="grid gap-6">
              {/* Benefit 1 */}
              <div className="flex items-start gap-4 p-4 rounded-lg glass-card parallax-element slide-right">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Lower Transaction Fees</h3>
                  <p className="text-foreground/70">
                    Save up to 90% on cross-border payments compared to traditional banks and payment processors.
                  </p>
                </div>
              </div>
              
              {/* Benefit 2 */}
              <div className="flex items-start gap-4 p-4 rounded-lg glass-card parallax-element slide-right delay-100">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Instant Settlements</h3>
                    <p className="text-foreground/70">
                      No more waiting days for transactions to clear. ZiroKash settlements happen in seconds, not days.
                    </p>
                </div>
              </div>
              
              {/* Benefit 3 */}
              <div className="flex items-start gap-4 p-4 rounded-lg glass-card parallax-element slide-right delay-200">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Full Transparency</h3>
                    <p className="text-foreground/70">
                      Every transaction is recorded digitally, providing full transparency and real-time tracking.
                    </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Security Section */}
      <section id="security" className="py-20 md:py-32 bg-card relative overflow-hidden">
        <div className="security-glow absolute"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="parallax-element slide-up">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 gradient-text">
                Bank-Level Security with Digital Innovation
              </h2>
              <p className="text-lg text-foreground/70 mb-8">
                ZiroKash combines cutting-edge security practices with modern digital banking to keep your assets safe.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 security-feature">
                  <Shield className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Multi-Factor Authentication</h3>
                    <p className="text-sm text-foreground/70">
                      Protect your account with email, SMS, and biometric verification.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 security-feature delay-100">
                  <Shield className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Encrypted Data Storage</h3>
                    <p className="text-sm text-foreground/70">
                      Your sensitive information is encrypted using military-grade AES-256 encryption.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 security-feature delay-200">
                  <Shield className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Smart Contract Auditing</h3>
                    <p className="text-sm text-foreground/70">
                      All systems are regularly audited by independent security firms to ensure maximum safety.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center parallax-element slide-up delay-200">
              <div className="security-shield-container">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-50 animate-pulse-slow"></div>
                <div className="relative bg-card border border-white/10 p-6 rounded-xl security-shield-card">
                  <Shield className="h-24 w-24 mx-auto mb-6 text-primary opacity-80 security-shield" />
                  <h3 className="text-xl font-bold text-center mb-2">
                    Your Security is Our Priority
                  </h3>
                  <p className="text-center text-foreground/70">
                    ZiroKash employs a dedicated security team and regular security audits to maintain the highest levels of protection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 md:py-32 grid-pattern relative">
        <div className="cta-rays"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 gradient-text parallax-element zoom-in">
              Ready to Experience the Future of Finance?
            </h2>
            <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto parallax-element zoom-in delay-100">
              Join thousands of users who have already made the switch to ZiroKash's modern financial platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 parallax-element zoom-in delay-200">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 pulse-subtle">
                  Create Your Free Account <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-card py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl animate-float">
                Z
              </div>
              <span className="text-2xl font-bold gradient-text">ZiroKash</span>
            </div>
            
            <div className="flex gap-8">
              <Link to="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors story-link">
                Terms of Service
              </Link>
              <Link to="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors story-link">
                Privacy Policy
              </Link>
              <Link to="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors story-link">
                Contact Us
              </Link>
            </div>
          </div>
          
          <div className="text-center text-sm text-foreground/50">
            <p>© 2025 ZiroKash. All rights reserved.</p>
            <p className="mt-1">ZiroKash is a financial technology platform, not a bank.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
