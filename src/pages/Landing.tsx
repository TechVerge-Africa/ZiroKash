import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
              Z
            </div>
            <span className="text-2xl font-bold gradient-text">ZiroKash</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#business" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              For Business
            </a>
            <a href="#support" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Support
            </a>
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Get Started
              </Button>
            </Link>
          </div>

          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <a href="#features" className="block text-sm font-medium text-muted-foreground">Features</a>
              <a href="#how-it-works" className="block text-sm font-medium text-muted-foreground">How It Works</a>
              <a href="#business" className="block text-sm font-medium text-muted-foreground">For Business</a>
              <a href="#support" className="block text-sm font-medium text-muted-foreground">Support</a>
              <div className="flex flex-col gap-2 pt-4">
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="w-full">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="w-full bg-gradient-to-r from-primary to-secondary">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-20 relative overflow-hidden">
        <div className="hero-glow absolute inset-0 opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
              🚀 Africa's Leading Cashless Payment Ecosystem
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 gradient-text animate-fade-in">
              Africa's Future is Cashless with ZiroKash
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in">
              Fast, secure, and borderless payments for everyone. Send money, pay bills, and grow your wealth across Africa with zero borders.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 py-3">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                <Download className="mr-2 h-5 w-5" />
                Download App
              </Button>
            </div>

            {/* Hero Image */}
            <div className="relative mt-16" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none h-32 bottom-0"></div>
              <img 
                src="/images/hero.png" 
                alt="ZiroKash Mobile App and Cards"
                className="w-full max-w-4xl mx-auto rounded-lg shadow-2xl border border-border/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
              Everything You Need in One Wallet
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ZiroKash combines all your financial needs into one powerful platform designed for modern Africa.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-card transform-card">
              <CardContent className="p-6">
                <div className="bg-gradient-to-br from-primary to-secondary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Digital Wallet</h3>
                <p className="text-muted-foreground">Store your balance securely and track all your transactions in real-time with detailed analytics.</p>
              </CardContent>
            </Card>

            <Card className="glass-card transform-card">
              <CardContent className="p-6">
                <div className="bg-gradient-to-br from-primary to-secondary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Send className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">P2P Payments</h3>
                <p className="text-muted-foreground">Send and receive money instantly to anyone across Africa using phone numbers or QR codes.</p>
              </CardContent>
            </Card>

            <Card className="glass-card transform-card">
              <CardContent className="p-6">
                <div className="bg-gradient-to-br from-primary to-secondary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Bills & Utilities</h3>
                <p className="text-muted-foreground">Pay airtime, electricity, water, internet bills and more with just a few taps.</p>
              </CardContent>
            </Card>

            <Card className="glass-card transform-card">
              <CardContent className="p-6">
                <div className="bg-gradient-to-br from-primary to-secondary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <QrCode className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Merchant Payments</h3>
                <p className="text-muted-foreground">Pay at stores with QR codes and enjoy seamless in-app checkout experiences.</p>
              </CardContent>
            </Card>

            <Card className="glass-card transform-card">
              <CardContent className="p-6">
                <div className="bg-gradient-to-br from-primary to-secondary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Corporate Collections</h3>
                <p className="text-muted-foreground">Powerful APIs and SDKs for businesses to integrate seamless payment solutions.</p>
              </CardContent>
            </Card>

            <Card className="glass-card transform-card">
              <CardContent className="p-6">
                <div className="bg-gradient-to-br from-primary to-secondary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Bank-Level Security</h3>
                <p className="text-muted-foreground">Advanced fraud detection, biometric login, and full KYC/AML compliance for your safety.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
              How ZiroKash Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started with ZiroKash in three simple steps and join Africa's cashless revolution.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
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