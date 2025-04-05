
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Shield, Globe, CreditCard, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header/Navigation */}
      <header className="border-b border-white/10 backdrop-blur-lg fixed w-full z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
              P
            </div>
            <span className="text-2xl font-bold gradient-text">PayNex</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link to="#features" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="#benefits" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Benefits
            </Link>
            <Link to="#security" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Security
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 grid-pattern">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Blockchain-Powered Finance for Everyone
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              Experience seamless cross-border payments, decentralized credit, and global investments with PayNex's next-generation financial platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Login to Dashboard
                </Button>
              </Link>
            </div>
            
            <div className="mt-16 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none h-full"></div>
              <img 
                src="/placeholder.svg" 
                alt="PayNex Dashboard" 
                className="w-full max-w-4xl mx-auto rounded-lg shadow-2xl border border-white/10 glow"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Revolutionary Financial Features
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              PayNex combines the security of blockchain with the convenience of traditional banking to create a seamless financial experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl glass-card">
              <div className="bg-gradient-to-br from-primary to-secondary w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Global Payments</h3>
              <p className="text-foreground/70">
                Send money across borders instantly with minimal fees using our blockchain-powered payment network.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="p-6 rounded-xl glass-card">
              <div className="bg-gradient-to-br from-primary to-secondary w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Contract Cards</h3>
              <p className="text-foreground/70">
                Access virtual and physical cards powered by smart contracts for secure and transparent spending.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="p-6 rounded-xl glass-card">
              <div className="bg-gradient-to-br from-primary to-secondary w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Decentralized Credit</h3>
              <p className="text-foreground/70">
                Build your credit score on the blockchain and access loans with transparent terms enforced by smart contracts.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section id="benefits" className="py-20 md:py-32 grid-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Why Choose PayNex
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Experience the future of finance with benefits that traditional banks simply can't offer.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="grid gap-6">
              {/* Benefit 1 */}
              <div className="flex items-start gap-4 p-4 rounded-lg glass-card">
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
              <div className="flex items-start gap-4 p-4 rounded-lg glass-card">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Instant Settlements</h3>
                  <p className="text-foreground/70">
                    No more waiting days for transactions to clear. PayNex settlements happen in seconds, not days.
                  </p>
                </div>
              </div>
              
              {/* Benefit 3 */}
              <div className="flex items-start gap-4 p-4 rounded-lg glass-card">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Full Transparency</h3>
                  <p className="text-foreground/70">
                    Every transaction is recorded on the blockchain, providing unmatched transparency and accountability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Security Section */}
      <section id="security" className="py-20 md:py-32 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
                Bank-Level Security with Blockchain Transparency
              </h2>
              <p className="text-lg text-foreground/70 mb-8">
                PayNex combines cutting-edge security practices with the inherent security benefits of blockchain technology to keep your assets safe.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Multi-Factor Authentication</h3>
                    <p className="text-sm text-foreground/70">
                      Protect your account with email, SMS, and biometric verification.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Encrypted Data Storage</h3>
                    <p className="text-sm text-foreground/70">
                      Your sensitive information is encrypted using military-grade AES-256 encryption.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Smart Contract Auditing</h3>
                    <p className="text-sm text-foreground/70">
                      All smart contracts are audited by independent security firms to ensure safety.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-50"></div>
                <div className="relative bg-card border border-white/10 p-6 rounded-xl">
                  <Shield className="h-24 w-24 mx-auto mb-6 text-primary opacity-80" />
                  <h3 className="text-xl font-bold text-center mb-2">
                    Your Security is Our Priority
                  </h3>
                  <p className="text-center text-foreground/70">
                    PayNex employs a dedicated security team and regular security audits to maintain the highest levels of protection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 md:py-32 grid-pattern">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Ready to Experience the Future of Finance?
            </h2>
            <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already made the switch to PayNex's blockchain-powered financial platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
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
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                P
              </div>
              <span className="text-2xl font-bold gradient-text">PayNex</span>
            </div>
            
            <div className="flex gap-8">
              <Link to="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
          
          <div className="text-center text-sm text-foreground/50">
            <p>© 2025 PayNex. All rights reserved.</p>
            <p className="mt-1">PayNex is a financial technology platform, not a bank.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
