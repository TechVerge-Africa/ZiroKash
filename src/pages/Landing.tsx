import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  Bot,
  Sparkles,
  LayoutTemplate,
  Shield,
  Zap,
  Globe,
  Lock,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/landing/AnimatedCounter";
import PublicLayout from "@/components/layout/PublicLayout";
import { useLandingStats } from "@/hooks/useLandingStats";
import {
  howItWorksSteps,
  features as originalFeatures,
  useCases,
  testimonials,
  pricingPlans,
  trustBadges,
  ANIMATION_CONFIG,
} from "@/data/landingData";

/**
 * Landing page component for ZiroKash
 * Redesigned with ui-ux-pro-max skill:
 * - Style: Exaggerated Minimalism / Fintech SaaS
 * - Palette: Amber Gold (#F59E0B) + Deep Navy (#0F172A)
 * - Typography: Calistoga (heading) + Inter (body)
 */
export default function Landing() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const realStats = useLandingStats();

  // Intersection observer for stats
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: ANIMATION_CONFIG.STATS_THRESHOLD }
    );
    if (statsRef.current) observer.observe(statsRef.current);
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
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  };

  const staggerContainer = {
    initial: {},
    animate: { transition: { staggerChildren: 0.08 } },
  };

  const displayStats = [
    { label: "Active Forms", value: realStats.totalForms, icon: LayoutTemplate, suffix: "" },
    { label: "Transactions", value: realStats.totalTransactions, icon: TrendingUp, suffix: "+" },
    { label: "Total Volume", value: realStats.totalVolume, icon: CreditCard, prefix: "₵", suffix: "+" },
    { label: "Happy Merchants", value: realStats.activeMerchants, icon: Bot, suffix: "+" },
  ];

  const updatedFeatures = [
    { icon: Bot, text: "AI Form Generator" },
    { icon: LayoutTemplate, text: "20+ Industry Templates" },
    ...originalFeatures.slice(0, 2),
  ];

  /* ── Shared section heading ── */
  const SectionHeading = ({
    label,
    title,
    sub,
    light = false,
  }: {
    label?: string;
    title: string;
    sub?: string;
    light?: boolean;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className="text-center mb-14 sm:mb-20"
    >
      {label && (
        <span
          className={`inline-block text-xs font-bold uppercase tracking-[0.2em] mb-4 ${
            light ? "text-amber-400" : "text-amber-600"
          }`}
        >
          {label}
        </span>
      )}
      <h2
        className={`font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 ${
          light ? "text-white" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={`text-lg max-w-2xl mx-auto leading-relaxed ${
            light ? "text-slate-400" : "text-muted-foreground"
          }`}
        >
          {sub}
        </p>
      )}
    </motion.div>
  );

  return (
    <PublicLayout transparentHeader>

      {/* ─────────────────────────────────────────
          HERO SECTION
          Dark-first with ambient amber + purple orbs
      ───────────────────────────────────────── */}
      <section
        className="relative overflow-hidden min-h-[100dvh] flex items-center"
        style={{ backgroundColor: '#0f172a' }}
      >
        {/* Ambient orbs */}
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] orb-amber opacity-70 animate-float"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] orb-purple opacity-60"
          aria-hidden="true"
          style={{ animationDelay: '3s' }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 dark grid-pattern opacity-20"
          aria-hidden="true"
        />
        {/* Noise overlay */}
        <div className="absolute inset-0 noise-overlay" aria-hidden="true" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-40 sm:py-48">
          <div className="max-w-5xl mx-auto text-center">

            {/* Trust pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-10"
              style={{
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.2)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center overflow-hidden"
                    style={{ borderColor: '#0f172a', background: 'rgba(245,158,11,0.2)' }}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold tracking-widest uppercase text-amber-400">
                {realStats.activeMerchants > 0
                  ? `${realStats.activeMerchants.toLocaleString()}+`
                  : "Thousands of"}{" "}
                businesses trust ZiroKash
              </span>
            </motion.div>

            {/* Headline — Calistoga, massive, amber shimmer */}
            <motion.h1
              className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-8"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <span className="gradient-shimmer">Create. Share.</span>
              <br />
              <span className="text-white">Get Paid.</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              className="text-lg sm:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Payments made as simple as creating a form. ZiroKash lets you create
              payment links using trusted African payment providers — no code, no complexity.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/auth">
                <Button
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-base px-8 py-6 rounded-xl shadow-2xl shadow-amber-500/30 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] cursor-pointer cta-button"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-6 rounded-xl transition-all duration-200 hover:bg-white/5 cursor-pointer"
                style={{
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: '#94a3b8',
                  background: 'transparent',
                }}
              >
                Learn More
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="mt-14 flex flex-wrap justify-center items-center gap-6 text-sm text-slate-500"
            >
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2">
                  <badge.icon className="h-4 w-4 text-amber-500" aria-hidden="true" />
                  <span>{badge.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom fade to next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #0f172a)' }}
          aria-hidden="true"
        />
      </section>


      {/* ─────────────────────────────────────────
          STATS SECTION — dark navy cards
      ───────────────────────────────────────── */}
      <section
        ref={statsRef}
        className="py-16 sm:py-20 relative"
        style={{ backgroundColor: '#0a1120' }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {displayStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                animate={statsVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group"
              >
                <div
                  className="h-full rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 hover:scale-[1.03]"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(245,158,11,0.12)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                  }}
                >
                  <div
                    className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-5 transition-transform group-hover:scale-110"
                    style={{ background: 'rgba(245,158,11,0.1)' }}
                  >
                    <stat.icon className="h-5 w-5 text-amber-400" aria-hidden="true" />
                  </div>
                  <div className="flex items-baseline justify-center gap-0.5">
                    {stat.prefix && (
                      <span className="text-lg font-bold text-slate-400 font-mono-data">{stat.prefix}</span>
                    )}
                    <AnimatedCounter
                      value={stat.value}
                      isVisible={statsVisible}
                      className="text-3xl sm:text-4xl font-black tracking-tighter text-white font-mono-data"
                    />
                    {stat.suffix && (
                      <span className="text-lg font-bold text-amber-500 font-mono-data">{stat.suffix}</span>
                    )}
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mt-2">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────
          HOW IT WORKS — light section
      ───────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 sm:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Simple Process"
            title="How It Works"
            sub="Get started in three simple steps — no technical knowledge required."
          />

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto relative"
          >
            {/* Connector line */}
            <div
              className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px opacity-20"
              style={{ background: 'linear-gradient(to right, transparent, hsl(var(--primary)), transparent)' }}
              aria-hidden="true"
            />

            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative"
              >
                <div
                  className="h-full rounded-3xl p-8 sm:p-10 text-center transition-all duration-300 hover:shadow-2xl bg-card border border-border hover:border-primary/20"
                  style={{ ['--tw-shadow' as string]: 'none' }}
                >
                  {/* Step number */}
                  <div className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-muted-foreground bg-muted">
                    0{index + 1}
                  </div>
                  {/* Icon */}
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))' }}
                  >
                    <step.icon className="h-8 w-8 text-amber-500" aria-hidden="true" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold mb-3 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ─────────────────────────────────────────
          FEATURES — dark section bento grid
      ───────────────────────────────────────── */}
      <section
        id="features"
        className="py-20 sm:py-32"
        style={{ backgroundColor: '#0a1120' }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Capabilities"
            title="Key Features"
            sub="Everything you need to collect payments seamlessly"
            light
          />

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-6xl mx-auto"
          >
            {updatedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -4, scale: 1.01 }}
                className="group flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-200 feature-card"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200 group-hover:scale-110"
                  style={{ background: 'rgba(245,158,11,0.12)' }}
                >
                  <feature.icon className="h-5 w-5 text-amber-400" aria-hidden="true" />
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ─────────────────────────────────────────
          WHO IT'S FOR — light section
      ───────────────────────────────────────── */}
      <section className="py-20 sm:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Use Cases"
            title="Perfect for"
            sub="Trusted by organizations of all sizes across Africa"
          />

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 max-w-5xl mx-auto"
          >
            {useCases.map((useCase, index) => (
              <motion.div key={index} variants={fadeInUp} className="group">
                <div className="h-full bg-card border border-border rounded-2xl p-7 text-center transition-all duration-300 hover:shadow-xl hover:border-primary/20 cursor-pointer">
                  <div
                    className={`inline-flex items-center justify-center w-13 h-13 rounded-2xl mb-5 mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 bg-gradient-to-br ${useCase.color}`}
                    style={{ width: 52, height: 52 }}
                  >
                    <useCase.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-xs uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                    {useCase.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ─────────────────────────────────────────
          TESTIMONIALS — dark carousel
      ───────────────────────────────────────── */}
      <section
        className="py-20 sm:py-32"
        style={{ backgroundColor: '#0a1120' }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Social Proof"
            title="What Our Customers Say"
            sub="Join thousands of satisfied users across Africa"
            light
          />

          <div className="max-w-3xl mx-auto relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className="rounded-3xl p-10 sm:p-14 relative overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(245,158,11,0.15)',
                  }}
                >
                  {/* Amber top accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.7), transparent)' }}
                    aria-hidden="true"
                  />

                  <div className="flex flex-col items-center text-center">
                    {/* Avatar */}
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center font-black text-xl mb-6"
                      style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}
                    >
                      {testimonials[currentTestimonial].avatar}
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1 mb-6" aria-label={`${testimonials[currentTestimonial].rating} out of 5 stars`}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonials[currentTestimonial].rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-700"
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>

                    <p className="text-xl sm:text-2xl font-semibold text-white leading-snug mb-8 max-w-xl">
                      &ldquo;{testimonials[currentTestimonial].content}&rdquo;
                    </p>

                    <div>
                      <p className="font-bold text-white">{testimonials[currentTestimonial].name}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mt-1">
                        {testimonials[currentTestimonial].role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() =>
                  setCurrentTestimonial(
                    (prev) => (prev - 1 + testimonials.length) % testimonials.length
                  )
                }
                className="p-2.5 rounded-full transition-all duration-200 hover:scale-110 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex gap-2" role="tablist" aria-label="Testimonials">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    role="tab"
                    aria-selected={index === currentTestimonial}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                      index === currentTestimonial
                        ? "w-8 bg-amber-500"
                        : "w-2 bg-slate-700 hover:bg-slate-500"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
                }
                className="p-2.5 rounded-full transition-all duration-200 hover:scale-110 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────
          PRICING — light section premium cards
      ───────────────────────────────────────── */}
      <section id="pricing" className="py-20 sm:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Pricing"
            title="Simple, Transparent Pricing"
            sub="No hidden fees. Pay only when you get paid."
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
          >
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`group relative bg-card rounded-3xl p-8 sm:p-12 transition-all duration-500 overflow-hidden border ${
                  plan.isPopular
                    ? "scale-[1.02] z-10"
                    : "hover:border-primary/20"
                }`}
                style={
                  plan.isPopular
                    ? {
                        borderColor: 'rgba(245,158,11,0.6)',
                        boxShadow: '0 0 0 4px rgba(245,158,11,0.06), 0 20px 40px rgba(0,0,0,0.15)',
                      }
                    : {}
                }
              >
                {plan.isPopular && (
                  <div className="absolute top-6 right-6">
                    <Badge
                      className="font-bold px-3 py-1 text-xs uppercase tracking-wide"
                      style={{ background: '#f59e0b', color: '#0f172a' }}
                    >
                      Popular
                    </Badge>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="font-heading text-5xl font-bold tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground font-medium">/txn</span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3.5 mb-10">
                  {plan.features.map((feature, fi) => (
                    <li key={fi} className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(245,158,11,0.1)' }}
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/auth" className="block">
                  <Button
                    className={`w-full py-6 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                      plan.ctaVariant === "default"
                        ? "hover:scale-[1.02] active:scale-[0.98]"
                        : ""
                    }`}
                    style={
                      plan.ctaVariant === "default"
                        ? {
                            background: '#f59e0b',
                            color: '#0f172a',
                            boxShadow: '0 4px 20px rgba(245,158,11,0.35)',
                          }
                        : {
                            background: 'hsl(var(--muted))',
                            color: 'hsl(var(--muted-foreground))',
                          }
                    }
                  >
                    {plan.ctaText}
                  </Button>
                </Link>
              </div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ─────────────────────────────────────────
          CTA — deep dark amber glow finale
      ───────────────────────────────────────── */}
      <section
        className="py-28 sm:py-40 relative overflow-hidden"
        style={{ backgroundColor: '#0f172a' }}
      >
        {/* Amber glow orb */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(245,158,11,0.12) 0%, rgba(139,92,246,0.06) 50%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 noise-overlay" aria-hidden="true" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-amber-500 mb-5">
              Get Started Today
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
              Ready to modernize your{" "}
              <span className="gradient-shimmer">payment experience?</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join{" "}
              {realStats.activeMerchants > 0
                ? `${realStats.activeMerchants.toLocaleString()}+`
                : ""}{" "}
              organizations streamlining their collections with ZiroKash.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-base px-10 py-7 rounded-xl transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] cursor-pointer cta-button"
                  style={{ boxShadow: '0 8px 32px rgba(245,158,11,0.35)' }}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Social proof row */}
            <div className="mt-12 flex items-center justify-center gap-3">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2"
                    style={{ borderColor: '#0f172a', background: 'rgba(255,255,255,0.08)' }}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="text-sm text-slate-500 ml-1">
                Empowering Africa&apos;s digital economy
              </span>
            </div>
          </motion.div>
        </div>
      </section>

    </PublicLayout>
  );
}
