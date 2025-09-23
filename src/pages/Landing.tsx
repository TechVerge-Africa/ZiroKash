import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { HeroScene } from "@/components/3d/HeroScene";
import { Suspense } from "react";
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  Globe,
  CreditCard,
  Smartphone,
  DollarSign,
  Send,
  Users,
  Building,
  QrCode,
  Clock,
  Heart,
  Star,
  Twitter,
  Linkedin,
  Instagram,
  Menu,
  X,
  Wallet,
  TrendingUp,
  FileText,
  HeadphonesIcon,
  UserPlus,
  BarChart3,
  Layers,
  Lock,
  Eye,
  Download
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg sm:text-xl animate-pulse-subtle">
              Z
            </div>
            <span className="text-xl sm:text-2xl font-bold gradient-text">ZiroKash</span>
          </div>
          
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
              How It Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#business" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
              For Business
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#support" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
              Support
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>
          
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started
              </Button>
            </Link>
          </div>

          <button 
            onClick={toggleMenu}
            className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border/50 animate-fade-in">
            <div className="container mx-auto px-4 sm:px-6 py-6 space-y-6">
              <div className="space-y-4">
                <a 
                  href="#features" 
                  className="block text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#how-it-works" 
                  className="block text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </a>
                <a 
                  href="#business" 
                  className="block text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  For Business
                </a>
                <a 
                  href="#support" 
                  className="block text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Support
                </a>
              </div>
              <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" size="lg" className="w-full justify-center">Sign In</Button>
                </Link>
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button size="lg" className="w-full bg-gradient-to-r from-primary to-secondary shadow-lg">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-12 md:pt-28 md:pb-20 relative overflow-hidden min-h-screen flex items-center">
        {/* 3D Background Scene */}
        <div className="absolute inset-0 w-full h-full opacity-60">
          <Suspense fallback={<div className="hero-glow absolute inset-0 opacity-30" />}>
            <HeroScene />
          </Suspense>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4 md:mb-6 bg-primary/10 text-primary border-primary/20 text-xs sm:text-sm">
              🚀 Africa's Leading Cashless Payment Ecosystem
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 gradient-text animate-hero-title leading-tight">
              Africa's Future is Cashless with ZiroKash
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 md:mb-8 max-w-4xl mx-auto animate-hero-subtitle leading-relaxed px-4 sm:px-0">
              Fast, secure, and borderless payments for everyone. Send money, pay bills, and grow your wealth across Africa with zero borders.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-8 md:mb-12 animate-fade-up-delayed px-4 sm:px-0">
              <Link to="/auth" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-base md:text-lg px-6 md:px-8 py-3 h-12 md:h-14 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  Get Started <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-3 h-12 md:h-14 border-2 hover:bg-primary/5 transition-all duration-300">
                <Download className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Download App
              </Button>
            </div>

            {/* Hero Image - Mobile Optimized */}
            <div className="relative mt-8 md:mt-16 parallax-element slide-up" style={{ transform: `translateY(${scrollY * 0.05}px)` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none h-20 md:h-32 bottom-0"></div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-2xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                <img 
                  src="/images/hero.png" 
                  alt="ZiroKash Mobile App and Cards"
                  className="relative w-full max-w-3xl md:max-w-4xl mx-auto rounded-xl md:rounded-2xl shadow-2xl border border-border/50 hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 lg:py-32 bg-muted/30 relative overflow-hidden">
        {/* Subtle background animation */}
        <div className="absolute inset-0 moving-gradient opacity-10"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 gradient-text leading-tight">
              Everything You Need in One Wallet
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4 sm:px-0 leading-relaxed">
              ZiroKash combines all your financial needs into one powerful platform designed for modern Africa.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <Card className="glass-card transform-card group">
              <CardContent className="p-4 sm:p-6">
                <div className="bg-gradient-to-br from-primary to-secondary w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Digital Wallet</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Store your balance securely and track all your transactions in real-time with detailed analytics.</p>
              </CardContent>
            </Card>

            <Card className="glass-card transform-card group">
              <CardContent className="p-4 sm:p-6">
                <div className="bg-gradient-to-br from-primary to-secondary w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Send className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">P2P Payments</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Send and receive money instantly to anyone across Africa using phone numbers or QR codes.</p>
              </CardContent>
            </Card>

            <Card className="glass-card transform-card group">
              <CardContent className="p-4 sm:p-6">
                <div className="bg-gradient-to-br from-primary to-secondary w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Bills & Utilities</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Pay airtime, electricity, water, internet bills and more with just a few taps.</p>
              </CardContent>
            </Card>

            <Card className="glass-card transform-card group">
              <CardContent className="p-4 sm:p-6">
                <div className="bg-gradient-to-br from-primary to-secondary w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <QrCode className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Merchant Payments</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Pay at stores with QR codes and enjoy seamless in-app checkout experiences.</p>
              </CardContent>
            </Card>

            <Card className="glass-card transform-card group">
              <CardContent className="p-4 sm:p-6">
                <div className="bg-gradient-to-br from-primary to-secondary w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Building className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Corporate Collections</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Powerful APIs and SDKs for businesses to integrate seamless payment solutions.</p>
              </CardContent>
            </Card>

            <Card className="glass-card transform-card group">
              <CardContent className="p-4 sm:p-6">
                <div className="bg-gradient-to-br from-primary to-secondary w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Bank-Level Security</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Advanced fraud detection, biometric login, and full KYC/AML compliance for your safety.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 gradient-text leading-tight">
              How ZiroKash Works
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4 sm:px-0 leading-relaxed">
              Get started with ZiroKash in three simple steps and join Africa's cashless revolution.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-gradient-to-br from-primary to-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Create Your Account</h3>
              <p className="text-muted-foreground">Sign up with your phone number and complete our quick verification process in minutes.</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-primary to-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Add Money</h3>
              <p className="text-muted-foreground">Fund your wallet via Mobile Money, bank transfer, or visit any of our agent locations.</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-primary to-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Start Transacting</h3>
              <p className="text-muted-foreground">Pay bills, send money, shop with QR codes, and enjoy seamless financial freedom.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
              Why Choose ZiroKash
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of African finance with benefits that traditional banks simply can't match.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="glass-card text-center">
              <CardContent className="p-6">
                <Globe className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">No Borders</h3>
                <p className="text-muted-foreground">Pay anywhere in Africa without worrying about different currencies or borders.</p>
              </CardContent>
            </Card>

            <Card className="glass-card text-center">
              <CardContent className="p-6">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">No Forex Needed</h3>
                <p className="text-muted-foreground">One wallet, one Africa. No need for multiple currencies or forex exchanges.</p>
              </CardContent>
            </Card>

            <Card className="glass-card text-center">
              <CardContent className="p-6">
                <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">Safe, secure, and lightning-fast transactions that complete in seconds, not days.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Businesses Section */}
      <section id="business" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-text">
                Built for Businesses
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Powerful tools and APIs designed to help African businesses accept payments, manage finances, and grow faster.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Easy Integration</h4>
                    <p className="text-muted-foreground">Simple APIs and SDKs that integrate with your existing systems in minutes.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Instant Settlements</h4>
                    <p className="text-muted-foreground">Get paid instantly with real-time settlements directly to your business account.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Analytics Dashboard</h4>
                    <p className="text-muted-foreground">Track payments, analyze trends, and manage your business finances from one dashboard.</p>
                  </div>
                </div>
              </div>
              
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Integrate ZiroKash for Your Business
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="relative">
              <Card className="glass-card p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">99.9%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">2s</div>
                    <div className="text-sm text-muted-foreground">Avg Settlement</div>
                  </div>
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">256-bit</div>
                    <div className="text-sm text-muted-foreground">Encryption</div>
                  </div>
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm text-muted-foreground">Support</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our users and partners are saying about their ZiroKash experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "ZiroKash has revolutionized how I manage my finances. Sending money home to my family is now instant and affordable."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <div className="font-semibold">Amara Okafor</div>
                    <div className="text-sm text-muted-foreground">Lagos, Nigeria</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "As a small business owner, ZiroKash's merchant tools have helped me increase sales and manage payments effortlessly."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                    K
                  </div>
                  <div>
                    <div className="font-semibold">Kwame Asante</div>
                    <div className="text-sm text-muted-foreground">Accra, Ghana</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The security features and ease of use make ZiroKash my go-to app for all financial transactions across Africa."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                    F
                  </div>
                  <div>
                    <div className="font-semibold">Fatima Diallo</div>
                    <div className="text-sm text-muted-foreground">Dakar, Senegal</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Partner Logos */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground mb-8">Trusted by leading financial institutions across Africa</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              <div className="text-2xl font-bold">MTN</div>
              <div className="text-2xl font-bold">Airtel</div>
              <div className="text-2xl font-bold">Vodacom</div>
              <div className="text-2xl font-bold">Standard Bank</div>
              <div className="text-2xl font-bold">Ecobank</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="cta-rays"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-text">
            Join the Cashless Movement
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Be part of Africa's financial revolution. Start your ZiroKash journey today and experience the future of money.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 py-3">
                Sign Up Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              <Download className="mr-2 h-5 w-5" />
              Get the App
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                  Z
                </div>
                <span className="text-xl font-bold gradient-text">ZiroKash</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Africa's leading cashless payment ecosystem. Fast, secure, and borderless financial services for everyone.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">About</a>
                <a href="#features" className="block text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#business" className="block text-muted-foreground hover:text-foreground transition-colors">For Businesses</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Careers</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Help Center</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Contact</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Security</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex items-center gap-3">
                <a href="#" className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2025 ZiroKash. All rights reserved. Making Africa cashless, one transaction at a time.
          </div>
        </div>
      </footer>
    </div>
  );
}