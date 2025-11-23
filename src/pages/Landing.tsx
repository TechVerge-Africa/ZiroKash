
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Shield, Globe, CreditCard, Zap, Smartphone, DollarSign, Send, TrendingUp, Menu, User, Wallet } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      <header className="fixed w-full z-50 transition-all duration-300" style={{ 
        backgroundColor: scrollY > 0 ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
        backdropFilter: scrollY > 0 ? 'blur(12px)' : 'none',
        borderBottom: scrollY > 0 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
      }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur-sm opacity-75 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl animate-float">
                  Z
                </div>
              </div>
              <span className="text-2xl font-bold gradient-text tracking-tight">ZiroPay</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="#features" className="nav-link group">
                <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                  Features
                </span>
                <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"></div>
              </Link>
              <Link to="#benefits" className="nav-link group">
                <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                  Benefits
                </span>
                <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"></div>
              </Link>
              <Link to="#security" className="nav-link group">
                <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                  Security
                </span>
                <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"></div>
              </Link>
            </nav>
            
            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/auth">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative overflow-hidden group hover:text-primary transition-colors duration-300"
                >
                  <span className="relative z-10">Sign In</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </Button>
              </Link>
              <Link to="/auth">
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-primary/50"
                >
                  <span>Get Started</span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
                </Button>
              </Link>
            </div>

            {/* Mobile Menu and Auth */}
            <div className="md:hidden flex items-center gap-3">
              {/* Avatar Dropdown for Auth */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary/50 transition-colors duration-200">
                      <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10">
                        <User className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-lg border border-white/10">
                  <DropdownMenuItem asChild>
                    <Link to="/auth" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Sign In</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link 
                      to="/auth" 
                      className="bg-gradient-to-r from-primary to-secondary text-white rounded-md hover:opacity-90"
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      <span>Get Started</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Menu Button for Navigation */}
              <button 
                className="p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-white/10"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5 text-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`
          fixed inset-0 bg-background/95 backdrop-blur-lg transform transition-transform duration-300 md:hidden
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <Link 
              to="#features" 
              className="text-xl font-medium text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="#benefits" 
              className="text-xl font-medium text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Benefits
            </Link>
            <Link 
              to="#security" 
              className="text-xl font-medium text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Security
            </Link>
          </div>
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-white/10"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>
      
      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 md:pt-40 md:pb-32 grid-pattern relative">
        <div className="hero-glow absolute inset-0 opacity-40"></div>
        <div className="hero-particles absolute inset-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 gradient-text animate-hero-title">
                Accept Payments Like a Pro
              </h1>
              <p className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-2xl mx-auto animate-hero-subtitle">
                Create beautiful payment forms, collect payments instantly, and manage your business finances all in one place. Perfect for schools, churches, NGOs, and businesses.
              </p>            {/* Key Features Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
              <div className="flex flex-col items-center p-3 rounded-lg bg-white/5 backdrop-blur-sm">
                <DollarSign className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm font-medium">Payment Forms</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-white/5 backdrop-blur-sm">
                <Wallet className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm font-medium">Digital Wallet</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-white/5 backdrop-blur-sm">
                <Send className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm font-medium">Send & Receive</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-white/5 backdrop-blur-sm">
                <TrendingUp className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm font-medium">Analytics</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up-delayed">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 pulse-subtle">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="lg" className="animate-pulse-subtle">
                  Sign In
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
                  alt="ZiroPay Dashboard" 
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
              Everything You Need to Collect Payments
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              ZiroPay makes it easy for businesses, schools, churches, and organizations to accept payments online with customizable forms, instant notifications, and detailed analytics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl glass-card transform-card parallax-element">
              <div className="bg-gradient-to-br from-primary to-secondary w-12 h-12 rounded-full flex items-center justify-center mb-4 icon-pulse">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Custom Payment Forms</h3>
              <p className="text-foreground/70">
                Create beautiful, customizable payment forms with drag-and-drop fields. Perfect for school fees, event tickets, donations, and more.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="p-6 rounded-xl glass-card transform-card parallax-element delay-100">
              <div className="bg-gradient-to-br from-primary to-secondary w-12 h-12 rounded-full flex items-center justify-center mb-4 icon-pulse">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Digital Wallet</h3>
              <p className="text-foreground/70">
                Manage your finances with a secure digital wallet. Send and receive money instantly, track transactions, and view your balance.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="p-6 rounded-xl glass-card transform-card parallax-element delay-200">
              <div className="bg-gradient-to-br from-primary to-secondary w-12 h-12 rounded-full flex items-center justify-center mb-4 icon-pulse">
                <Send className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Send & Receive Money</h3>
              <p className="text-foreground/70">
                Transfer money to friends, family, or businesses instantly. Support for mobile money and bank transfers.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="p-6 rounded-xl glass-card transform-card parallax-element delay-300">
              <div className="bg-gradient-to-br from-primary to-secondary w-12 h-12 rounded-full flex items-center justify-center mb-4 icon-pulse">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Payment Analytics</h3>
              <p className="text-foreground/70">
                Track your payment collections with detailed analytics. See total collected, active forms, and submission statistics.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="p-6 rounded-xl glass-card transform-card parallax-element delay-400">
              <div className="bg-gradient-to-br from-primary to-secondary w-12 h-12 rounded-full flex items-center justify-center mb-4 icon-pulse">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Bill Payments</h3>
              <p className="text-foreground/70">
                Pay for airtime, data, electricity, water, and other utilities directly from your wallet. Quick and convenient.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="p-6 rounded-xl glass-card transform-card parallax-element delay-500">
              <div className="bg-gradient-to-br from-primary to-secondary w-12 h-12 rounded-full flex items-center justify-center mb-4 icon-pulse">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Notifications</h3>
              <p className="text-foreground/70">
                Get notified instantly when payments are received. Email receipts and real-time transaction updates.
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
              Perfect for Every Business
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Whether you're a school collecting fees, a church accepting donations, or a business selling products, ZiroPay makes payment collection simple.
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
                  <h3 className="text-lg font-medium mb-1">Easy Setup</h3>
                  <p className="text-foreground/70">
                    Get started in minutes. Create your first payment form with our intuitive form builder - no coding required.
                  </p>
                </div>
              </div>
              
              {/* Benefit 2 */}
              <div className="flex items-start gap-4 p-4 rounded-lg glass-card parallax-element slide-right delay-100">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Secure Payments</h3>
                    <p className="text-foreground/70">
                      All payments are processed securely through trusted payment gateways. Your customers' data is always protected.
                    </p>
                </div>
              </div>
              
              {/* Benefit 3 */}
              <div className="flex items-start gap-4 p-4 rounded-lg glass-card parallax-element slide-right delay-200">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Real-Time Tracking</h3>
                    <p className="text-foreground/70">
                      Monitor all your payments in real-time. Get instant notifications and detailed transaction history.
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
                Secure & Reliable Payment Processing
              </h2>
              <p className="text-lg text-foreground/70 mb-8">
                Your payments are protected with industry-standard encryption and security measures. We take your security seriously.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 security-feature">
                  <Shield className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Secure Payment Processing</h3>
                    <p className="text-sm text-foreground/70">
                      All transactions are processed through secure payment gateways with PCI DSS compliance.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 security-feature delay-100">
                  <Shield className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Data Protection</h3>
                    <p className="text-sm text-foreground/70">
                      Your data is encrypted and stored securely. We never share your information with third parties.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 security-feature delay-200">
                  <Shield className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">PIN Protection</h3>
                    <p className="text-sm text-foreground/70">
                      Your account is protected with a secure PIN. Failed attempts are automatically locked for your safety.
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
                    ZiroPay uses industry-standard security practices to protect your payments and personal information.
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
              Start Collecting Payments Today
            </h2>
            <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto parallax-element zoom-in delay-100">
              Join thousands of businesses, schools, and organizations using ZiroPay to accept payments online.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 parallax-element zoom-in delay-200">
              <Link to="/auth">
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
              <span className="text-2xl font-bold gradient-text">ZiroPay</span>
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
            <p>© 2025 ZiroPay. All rights reserved.</p>
            <p className="mt-1">ZiroPay is a financial technology platform, not a bank.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
