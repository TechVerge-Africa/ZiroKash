import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Wallet, DollarSign, CreditCard, Building2, QrCode, Globe, Shield, Menu, X } from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: Wallet,
    title: "Send & Receive Money",
    description: "Instant borderless transfers with unified digital currency across Africa"
  },
  {
    icon: DollarSign,
    title: "Bill Payments",
    description: "Pay for airtime, utilities, water, electricity, and internet services"
  },
  {
    icon: CreditCard,
    title: "Virtual Cards",
    description: "Access virtual cards for secure online shopping and subscriptions"
  },
  {
    icon: Building2,
    title: "Corporate Collections",
    description: "APIs and SDKs for businesses to receive payments efficiently"
  },
  {
    icon: QrCode,
    title: "Merchant Solutions",
    description: "QR code payments and seamless in-app checkout for merchants"
  },
  {
    icon: Globe,
    title: "Unified Digital Currency",
    description: "Borderless transactions eliminating forex barriers across Africa"
  }
];

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-xl font-bold text-white">Z</span>
              </div>
              <span className="text-xl font-bold gradient-text">ZiroKash</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#security" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Security</a>
            </nav>
            
            <div className="hidden md:flex items-center gap-3">
              <Link to="/auth">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
                  Get Started
                </Button>
              </Link>
            </div>

            <button 
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <a href="#features" className="text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
              <a href="#security" className="text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Security</a>
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">Sign In</Button>
                </Link>
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full bg-gradient-to-r from-primary to-secondary">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Africa's Borderless Digital Wallet
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Making cash obsolete with instant transfers, unified digital currency, and seamless financial solutions for a truly cashless African economy.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="lg">Sign In</Button>
              </Link>
            </div>
            
            <div className="relative">
              <img 
                src="/images/hero.png" 
                alt="ZiroKash Dashboard" 
                className="w-full max-w-3xl mx-auto rounded-lg shadow-2xl border border-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cloud-native infrastructure and AI-driven technology to eliminate cash barriers across Africa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Bank-Grade Security
              </h2>
              <p className="text-lg text-muted-foreground">
                Your money and data are protected with enterprise-level security measures
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="font-semibold mb-2">Multi-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">Two-step verification keeps your account secure</p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="font-semibold mb-2">Encrypted Data Storage</h3>
                <p className="text-sm text-muted-foreground">End-to-end encryption protects your information</p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="font-semibold mb-2">Real-time Monitoring</h3>
                <p className="text-sm text-muted-foreground">AI-powered fraud detection and prevention</p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="font-semibold mb-2">Compliance Ready</h3>
                <p className="text-sm text-muted-foreground">Meeting all regulatory requirements across Africa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Go Cashless?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of Africans making transactions easier, faster, and more secure
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary">
              Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-sm font-bold text-white">Z</span>
              </div>
              <span className="font-semibold">ZiroKash</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link to="/support" className="hover:text-foreground transition-colors">Support</Link>
            </div>
            
            <p className="text-sm text-muted-foreground">
              &copy; 2025 ZiroKash. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
