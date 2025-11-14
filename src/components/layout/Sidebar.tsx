import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  CreditCard, 
  Send, 
  LineChart, 
  Wallet, 
  Shield, 
  ShieldCheck, 
  Settings, 
  Menu, 
  X,
  DollarSign,
  Gift,
  User,
  HelpCircle,
  Info,
  Building,
  Phone,
  Car,
  CheckCircle
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

const mainNavItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: <Home size={20} /> },
  { name: "My Forms", href: "/ziropay", icon: <DollarSign size={20} /> },
  { name: "Transactions", href: "/transactions", icon: <Send size={20} /> },
];

// Commented out for future implementation
// const additionalNavItems: NavItem[] = [
//   { name: "Insurance", href: "/insurance", icon: <Shield size={20} /> },
//   { name: "Merchant", href: "/merchant", icon: <Building size={20} /> },
//   { name: "Rewards", href: "/rewards", icon: <Gift size={20} /> },
//   { name: "Offline/USSD", href: "/offline", icon: <Phone size={20} /> },
// ];

const accountNavItems: NavItem[] = [
  { name: "Profile", href: "/profile", icon: <User size={20} /> },
  { name: "Security", href: "/security", icon: <ShieldCheck size={20} /> },
  { name: "Settings", href: "/settings", icon: <Settings size={20} /> },
];

const supportNavItems: NavItem[] = [
  { name: "Support", href: "/support", icon: <HelpCircle size={20} /> },
  { name: "About", href: "/about", icon: <Info size={20} /> },
];

export default function Sidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Listen for toggle events from bottom nav
  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    document.addEventListener('toggle-sidebar', handleToggle);
    return () => document.removeEventListener('toggle-sidebar', handleToggle);
  }, []);

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <Link
        to={item.href}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
          isActive 
            ? "bg-sidebar-accent text-primary font-medium" 
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
        )}
        onClick={() => isMobile && setIsOpen(false)}
      >
        {item.icon}
        <span>{item.name}</span>
        {isActive && (
          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2 px-3 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
              Z
            </div>
            <span className="text-xl font-bold gradient-text">ZiroPay</span>
          </Link>
          {isMobile && (
            <Button variant="ghost" size="icon" className="ml-auto" onClick={toggleSidebar}>
              <X size={20} />
            </Button>
          )}
        </div>
      </div>

      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-accent scrollbar-track-transparent">
        <div className="px-3 py-2">
          {/* Only show main nav items on desktop */}
          {!isMobile && (
            <div className="space-y-1">
              {mainNavItems.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </div>
          )}
          
          {/* Additional services commented out for now */}
          {/* <div className={cn("space-y-1", !isMobile && "mt-6")}>
            <p className="text-xs font-medium text-muted-foreground px-3 mb-2">SERVICES</p>
            {additionalNavItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div> */}
          
          {/* Show account settings on both */}
          <div className="mt-6 space-y-1">
            <p className="text-xs font-medium text-muted-foreground px-3 mb-2">ACCOUNT</p>
            {accountNavItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>
          
          {/* Show support links on both */}
          <div className="mt-6 space-y-1">
            <p className="text-xs font-medium text-muted-foreground px-3 mb-2">HELP</p>
            {supportNavItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 px-3 py-4 border-t border-sidebar-border bg-sidebar">
        <div className="glass-card rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Go Pro</p>
          <p className="text-sm font-medium mt-1">Upgrade to Premium</p>
          <Button size="sm" className="mt-2 w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
            Upgrade Now
          </Button>
        </div>
      </div>
    </div>
  );

  const menuButton = isMobile && (
    <Button 
      variant="ghost" 
      size="icon" 
      className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm"
      onClick={toggleSidebar}
    >
      <Menu size={20} />
    </Button>
  );

  return (
    <>
      {menuButton}
      <aside
        className={cn(
          "flex flex-col h-screen bg-sidebar fixed inset-y-0 left-0 z-50 border-r border-sidebar-border transition-transform duration-300",
          "w-64",
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
        )}
      >
        {sidebarContent}
      </aside>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
