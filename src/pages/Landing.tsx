import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  CheckCircle, 
  Shield, 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  FileText, 
  Share2, 
  Zap,
  GraduationCap,
  Church,
  Users,
  Building2,
  Calendar,
  Heart,
  TrendingUp,
  Receipt,
  BarChart3,
  Download,
  Wallet,
  Lock,
  Menu,
  X,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  const howItWorksSteps = [
    {
      icon: FileText,
      title: "Create a payment form",
      description: "Customize fields, upload logo & signature."
    },
    {
      icon: Share2,
      title: "Share your payment link",
      description: "Send via WhatsApp, email, SMS or embed on your site."
    },
    {
      icon: Zap,
      title: "Get paid instantly",
      description: "Automatic receipt generation and customization + real-time dashboard."
    }
  ];

  const features = [
    { icon: FileText, text: "Customizable payment forms" },
    { icon: Smartphone, text: "Mobile Money + bank/card payments" },
    { icon: Receipt, text: "Auto-generated and customizable receipts" },
    { icon: BarChart3, text: "Real-time transaction dashboard" },
    { icon: Download, text: "Bulk reports & exports" },
    { icon: Wallet, text: "Wallet + withdrawals" },
    { icon: Users, text: "Multiple branches/teams" },
    { icon: Lock, text: "Secure & compliant" }
  ];

  const useCases = [
    { icon: GraduationCap, title: "Schools", color: "from-blue-500 to-cyan-500" },
    { icon: Church, title: "Churches", color: "from-purple-500 to-pink-500" },
    { icon: Users, title: "Associations", color: "from-green-500 to-emerald-500" },
    { icon: Users, title: "Groups & Clubs", color: "from-orange-500 to-red-500" },
    { icon: Building2, title: "SMEs", color: "from-indigo-500 to-blue-500" },
    { icon: Calendar, title: "Event organizers", color: "from-pink-500 to-rose-500" },
    { icon: Heart, title: "Nonprofits", color: "from-red-500 to-pink-500" }
  ];

  const testimonials = [
    {
      name: "Sarah Mensah",
      role: "School Administrator",
      content: "ZiroPay has made collecting school fees so much easier. Parents can pay anytime, anywhere!",
      rating: 5
    },
    {
      name: "Pastor John",
      role: "Church Leader",
      content: "Our tithes and offerings collection has increased by 40% since using ZiroPay. Highly recommended!",
      rating: 5
    },
    {
      name: "Ama Asante",
      role: "Event Organizer",
      content: "The payment forms are beautiful and easy to customize. Our event registration is now seamless.",
      rating: 5
    },
    {
      name: "Kwame Osei",
      role: "SME Owner",
      content: "Real-time dashboard and instant notifications help me track all payments. Game changer!",
      rating: 5
    }
  ];

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
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                Z
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ZiroPay
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link to="#features" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                Features
              </Link>
              <Link to="#how-it-works" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link to="#pricing" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                Pricing
              </Link>
            </nav>
            
            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/auth">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
              <Link to="#features" className="block py-2 text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                Features
              </Link>
              <Link to="#how-it-works" className="block py-2 text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                How It Works
              </Link>
              <Link to="#pricing" className="block py-2 text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
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

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Create. Share. Get Paid
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-foreground/70 mb-8 sm:mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Create custom payment forms, share payment links, and get paid instantly through MoMo or bank. No technical setup required.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-base sm:text-lg px-6 sm:px-8 py-6 sm:py-7"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-muted/30">
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
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto"
          >
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative"
              >
                <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <motion.div
                      className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4 sm:mb-6 mx-auto"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <step.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </motion.div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
                      {step.title}
                    </h3>
                    <p className="text-foreground/70 text-sm sm:text-base">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-16 sm:py-24">
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
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted border border-transparent hover:border-primary/20 transition-all"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm sm:text-base font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Who Is It For */}
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
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full border-2 hover:border-primary/50 transition-all cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${useCase.color} mb-4 mx-auto`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <useCase.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                    </motion.div>
                    <h3 className="font-semibold text-sm sm:text-base">{useCase.title}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
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
              What Our Customers Say
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-2 hover:border-primary/50 transition-all">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-foreground/80 mb-4 text-sm sm:text-base italic">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">{testimonial.name}</p>
                      <p className="text-sm text-foreground/60">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-24 bg-muted/30">
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
            <Card className="border-2">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Free Activation</h3>
                  <p className="text-3xl sm:text-4xl font-bold text-primary mb-2">₵0</p>
                  <p className="text-foreground/70 text-sm">Get started today</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Unlimited payment forms</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Custom branding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Real-time dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Email support</span>
                  </li>
                </ul>
                <Link to="/auth" className="block">
                  <Button className="w-full" variant="outline">
                    Get Started Free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <Badge className="mb-2">Popular</Badge>
                  <h3 className="text-2xl font-bold mb-2">Pay as You Earn</h3>
                  <p className="text-3xl sm:text-4xl font-bold text-primary mb-2">2.5%</p>
                  <p className="text-foreground/70 text-sm">Transaction fee</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Everything in Free</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Mobile Money & Bank payments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Instant settlements</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Priority support</span>
                  </li>
                </ul>
                <Link to="/auth" className="block">
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                    Activate ZiroPay
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Block */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Start collecting payments in minutes — no coding needed.
            </h2>
            <p className="text-lg text-foreground/70 mb-8 sm:mb-12">
              Join thousands of organizations already using ZiroPay to streamline their payment collection.
            </p>
            <Link to="/auth">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7"
              >
                Activate ZiroPay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 sm:py-16 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                  Z
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ZiroPay
                </span>
              </div>
              <p className="text-sm text-foreground/70">
                The easiest way to collect payments online. Trusted by schools, churches, and businesses across Africa.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Product</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><Link to="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link to="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link to="#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Company</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><Link to="#" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Legal</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><Link to="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t text-center text-sm text-foreground/60">
            <p>© 2025 ZiroPay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
