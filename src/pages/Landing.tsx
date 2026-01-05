import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  CheckCircle, 
  Menu,
  X,
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/landing/AnimatedCounter";
import {
  stats,
  howItWorksSteps,
  features,
  useCases,
  testimonials,
  pricingPlans,
  trustBadges,
  ANIMATION_CONFIG
} from "@/data/landingData";

/**
 * Landing page component for ZiroKash
 * Premium design with animated sections and interactive elements
 */
export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Handle scroll for header background
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: ANIMATION_CONFIG.STATS_THRESHOLD }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, ANIMATION_CONFIG.TESTIMONIAL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <motion.header 
        className="fixed w-full z-50 transition-all duration-300"
        style={{ 
          backgroundColor: scrollY > 50 ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          backdropFilter: scrollY > 50 ? 'blur(12px)' : 'none',
          borderBottom: scrollY > 50 ? '1px solid rgba(0, 0, 0, 0.1)' : 'none'
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
                alt="ZiroKash" 
                className="h-20 sm:h-24 w-auto scale-[1.5] sm:scale-[1.8] transform origin-left transition-transform hover:scale-[1.9]"
              />
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <a href="#features" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                Pricing
              </a>
            </nav>
            
            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/auth">
                <Button variant="ghost" size="sm">
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
              <a href="#features" className="block py-2 text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                Features
              </a>
              <a href="#how-it-works" className="block py-2 text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                How It Works
              </a>
              <a href="#pricing" className="block py-2 text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                Pricing
              </a>
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

      {/* Hero Section */}
      <section className="pt-32 sm:pt-40 pb-20 sm:pb-32 relative overflow-hidden">
        {/* Superior background depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.08),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(var(--accent-rgb),0.05),transparent_50%)]" aria-hidden="true"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-8 backdrop-blur-sm shadow-sm"
            >
              <div className="flex -space-x-2 mr-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
                  </div>
                ))}
              </div>
              <span className="text-xs font-semibold tracking-wide text-primary/80 uppercase">10k+ businesses trust ZiroKash</span>
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="gradient-shimmer">Create. Share. Get Paid</span>
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              The digital wallet for Africa. Create custom payment links, accept local payments, and settle instantly in your currency.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-5 justify-center items-center"
            >
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white font-bold text-lg px-10 py-7 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-10 py-7 rounded-2xl border-border/50 backdrop-blur-sm bg-background/30 transition-all hover:bg-background/80"
              >
                Learn More
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-foreground/60"
            >
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2">
                  <badge.icon className="h-4 w-4 text-green-500" />
                  <span>{badge.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-12 sm:py-16 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-50" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={statsVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group p-1"
              >
                <div className="h-full bg-background border border-border/40 rounded-3xl p-6 sm:p-8 text-center transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/5 text-primary mb-6 transition-transform group-hover:scale-110`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col items-center">
                    <AnimatedCounter value={stat.value} isVisible={statsVisible} className="text-3xl sm:text-4xl font-black tracking-tighter" />
                    <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-muted-foreground mt-2">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto relative"
          >
            {/* Connecting arrows for desktop */}
            <div className="hidden md:block absolute top-1/3 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary opacity-30" aria-hidden="true" />
            
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative group p-1"
              >
                <div className="h-full bg-background border border-border/40 rounded-[2.5rem] p-8 sm:p-10 text-center transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary text-white mb-8 transition-transform group-hover:scale-110">
                    <step.icon className="h-10 w-10" />
                  </div>
                  <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-muted flex items-center justify-center font-black text-xs text-muted-foreground opacity-50">
                    0{index + 1}
                  </div>
                  <h3 className="text-2xl font-black mb-4 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Key Features
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Everything you need to collect payments seamlessly
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-background hover:bg-muted border-2 border-transparent hover:border-primary/20 transition-all feature-card cursor-pointer"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm sm:text-base font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Who Is It For */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Perfect for
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Trusted by organizations of all sizes
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto"
          >
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group p-1"
              >
                <div className="h-full bg-background border border-border/40 rounded-3xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 cursor-pointer">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${useCase.color} mb-5 mx-auto transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                    <useCase.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-black text-sm uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">{useCase.title}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-foreground/70">
              Join thousands of satisfied users
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-background border border-border/40 rounded-[3rem] p-10 sm:p-20 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
                  <div className="flex flex-col items-center text-center relative z-10">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-primary font-black text-2xl mb-8 shadow-inner">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    
                    {/* Stars */}
                    <div className="flex gap-1.5 mb-8">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < testimonials[currentTestimonial].rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />
                      ))}
                    </div>
                    
                    {/* Content */}
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground/90 mb-10 max-w-2xl leading-tight">
                      "{testimonials[currentTestimonial].content}"
                    </p>
                    
                    {/* Author */}
                    <div>
                      <p className="font-black text-lg tracking-tight">{testimonials[currentTestimonial].name}</p>
                      <p className="text-sm font-bold uppercase tracking-widest text-primary/60">{testimonials[currentTestimonial].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentTestimonial 
                        ? 'bg-primary w-8' 
                        : 'bg-primary/30 hover:bg-primary/50'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              No hidden fees. Pay only when you get paid.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
          >
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className={`group relative bg-background border rounded-[3rem] p-8 sm:p-12 transition-all duration-500 overflow-hidden ${
                  plan.isPopular ? 'border-primary ring-4 ring-primary/5 scale-105 z-10' : 'border-border/40 hover:border-primary/20'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute top-8 right-8">
                    <Badge className="bg-primary text-white font-black px-4 py-1">POPULAR</Badge>
                  </div>
                )}
                <div className="relative z-10">
                  <div className="mb-10">
                    <h3 className="text-xl font-black uppercase tracking-widest text-muted-foreground mb-4">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                      <span className="text-muted-foreground font-bold">/txn</span>
                    </div>
                    <p className="text-muted-foreground font-medium mt-4">{plan.description}</p>
                  </div>
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/auth" className="block">
                    <Button 
                      className={`w-full py-8 rounded-2xl font-black text-lg transition-all ${
                        plan.ctaVariant === 'default' 
                          ? 'bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20' 
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {plan.ctaText}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Block */}
      <section className="py-24 sm:py-32 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.15),transparent_70%)]" aria-hidden="true"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 tracking-tighter leading-tight">
              Ready to modernize your <span className="text-primary italic">payment experience?</span>
            </h2>
            <p className="text-xl sm:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium">
              Join 10,000+ organizations streamlining their global collections with ZiroKash.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white font-black text-xl px-12 py-8 rounded-2xl shadow-2xl shadow-primary/40 transition-all hover:scale-[1.05] active:scale-[0.95]"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-2">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-950 bg-slate-800" />
                ))}
              </div>
              <span className="text-slate-500 font-bold ml-4">Empowering Africa's digital economy</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 sm:py-16 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="/zirokash-logo.png" 
                  alt="ZiroKash" 
                  className="h-16 w-auto"
                />
              </div>
              <p className="text-sm text-foreground/70 mb-4">
                The easiest way to collect payments online. Trusted by schools, churches, and businesses across Africa.
              </p>
              
              {/* Newsletter */}
              <div className="mt-4">
                <p className="text-sm font-semibold mb-2">Stay updated</p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="flex-1 px-3 py-2 text-sm rounded-lg border bg-background"
                    aria-label="Email for newsletter"
                  />
                  <Button size="sm" className="bg-primary">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Product</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Company</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link to="/support" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link to="/support" className="hover:text-foreground transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Legal</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><Link to="/about" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="/about" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t text-center text-sm text-foreground/60">
            <p>© 2025 ZiroKash. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
