import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-muted/50 py-12 sm:py-16 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/zirokash-logo.png" 
                alt="ZiroKash Fintech Solutions" 
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
              <li><Link to="/#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link to="/#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link to="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm sm:text-base">Company</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm sm:text-base">Legal</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-foreground/60">
          <p>© {currentYear} ZiroKash. All rights reserved.</p>
          
          <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
            <span className="text-xs font-medium">Product of</span>
            <a href="https://techverge.africa" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-bold text-foreground">
              <img src="/techverge-logo.png" alt="TechVerge Africa - Empowering African Innovation" className="h-6 w-auto" />
              TechVerge Africa
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
