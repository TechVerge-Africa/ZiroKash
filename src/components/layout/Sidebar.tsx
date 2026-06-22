import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Home, CreditCard, Send, LineChart, Wallet, Shield, ShieldCheck, Settings, Menu, X, DollarSign, Gift, User, HelpCircle, Info, Building, Phone, Car, CheckCircle, CheckCircle2, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useMerchant } from "@/hooks/useMerchant";
import { Badge } from "@/components/ui/badge";
type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
};
const mainNavItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: <Home size={20} /> },

  { name: "My Forms", href: "/zirokash", icon: <DollarSign size={20} /> },
  { name: "Transactions", href: "/transactions", icon: <Send size={20} /> },
];

// Commented out for future implementation
// const additionalNavItems: NavItem[] = [
//   { name: "Insurance", href: "/insurance", icon: <Shield size={20} /> },
//   { name: "Rewards", href: "/rewards", icon: <Gift size={20} /> },
//   { name: "Offline/USSD", href: "/offline", icon: <Phone size={20} /> },
// ];

const accountNavItems: NavItem[] = [{
  name: "Settings",
  href: "/settings",
  icon: <Settings size={20} />
}];
const supportNavItems: NavItem[] = [{
  name: "Support",
  href: "/support",
  icon: <HelpCircle size={20} />
}, {
  name: "About",
  href: "/about",
  icon: <Info size={20} />
}];
export default function Sidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { merchant, hasSubaccount, loading: merchantLoading } = useMerchant();
  const { isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  // Listen for toggle events from bottom nav
  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    document.addEventListener('toggle-sidebar', handleToggle);
    return () => document.removeEventListener('toggle-sidebar', handleToggle);
  }, []);
  const NavLink = ({
    item
  }: {
    item: NavItem;
  }) => {
    const isActive = location.pathname === item.href;
    return <Link to={item.href} className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all", isActive ? "bg-sidebar-accent text-primary font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground")} onClick={() => isMobile && setIsOpen(false)}>
        {item.icon}
        <span>{item.name}</span>
        {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
      </Link>;
  };
  const sidebarContent = <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2 px-3 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/zirokash-logo.png" 
              alt="ZiroKash" 
              className="h-16 w-auto"
            />
          </Link>
          {isMobile && <Button variant="ghost" size="icon" className="ml-auto" onClick={toggleSidebar}>
              <X size={20} />
            </Button>}
        </div>
      </div>

      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-accent scrollbar-track-transparent">
        <div className="px-3 py-2">
          {/* Only show main nav items on desktop */}
          {!isMobile && <div className="space-y-1">
              {mainNavItems.map(item => <NavLink key={item.name} item={item} />)}
            </div>}
          
          {/* Additional services commented out for now */}
          {/* <div className={cn("space-y-1", !isMobile && "mt-6")}>
            <p className="text-xs font-medium text-muted-foreground px-3 mb-2">SERVICES</p>
            {additionalNavItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
            </div> */}
          
          {/* Show account settings on both */}
          <div className={cn("space-y-1", !isMobile && "mt-6")}>
            <p className="text-xs font-medium text-muted-foreground px-3 mb-2">MANAGEMENT</p>
            {isAdmin && (
              <NavLink 
                item={{ 
                  name: "Admin Dashboard", 
                  href: "/admin", 
                  icon: <ShieldCheck size={20} className="text-emerald-500" /> 
                }} 
              />
            )}
            {accountNavItems.map(item => <NavLink key={item.name} item={item} />)}
          </div>
          
          {/* Show support links on both */}
          <div className="mt-6 space-y-1">
            <p className="text-xs font-medium text-muted-foreground px-3 mb-2">HELP</p>
            {supportNavItems.map(item => <NavLink key={item.name} item={item} />)}
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 px-3 py-4 border-t border-sidebar-border bg-sidebar">
        {!merchantLoading && merchant ? (
          <Link to="/settings" className="block">
            <div className="group/footer flex items-center gap-3 p-2 rounded-xl border border-transparent hover:border-slate-800/40 hover:bg-slate-900/30 active:bg-slate-900/50 transition-all duration-300 cursor-pointer">
              {/* Gold Gradient Initials Avatar */}
              <div className="relative h-9 w-9 rounded-full flex items-center justify-center bg-gradient-to-br from-amber-500/25 to-amber-500/5 border border-amber-500/20 text-amber-500 font-bold text-sm uppercase flex-shrink-0 select-none">
                {merchant.business_name ? merchant.business_name.charAt(0) : "M"}
                {/* Overlay pulsing dot representing verification status */}
                <span className={cn(
                  "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-sidebar flex-shrink-0",
                  (hasSubaccount || merchant.verification_status === 'verified')
                    ? "bg-emerald-500" 
                    : merchant.verification_status === 'pending'
                    ? "bg-amber-500 animate-pulse"
                    : "bg-rose-500 animate-pulse"
                )} />
              </div>
              
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-200 truncate group-hover/footer:text-amber-500 transition-colors duration-200">
                  {merchant.business_name}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                  {(hasSubaccount || merchant.verification_status === 'verified')
                    ? "Verified Business" 
                    : merchant.verification_status === 'pending'
                    ? "Verification Pending"
                    : merchant.verification_status === 'rejected'
                    ? "Action Required"
                    : "Unverified Account"}
                </p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground/40 group-hover/footer:text-amber-500 group-hover/footer:translate-x-0.5 transition-all duration-200 flex-shrink-0" />
            </div>
          </Link>
        ) : (
          <Link to="/settings" className="block">
            <div className="relative overflow-hidden group/upgrade bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-slate-950/40 hover:from-amber-500/15 hover:via-amber-600/10 hover:to-slate-950/60 border border-amber-500/15 hover:border-amber-500/30 rounded-xl p-3.5 transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.03)] hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]">
              {/* Subtle background light orb */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl -mr-8 -mt-8 group-hover/upgrade:bg-amber-500/10 transition-colors duration-300" />
              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Become a Merchant</p>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    Unlock online payments & business tools
                  </p>
                </div>
                <div className="h-7 w-7 rounded-lg flex items-center justify-center bg-amber-500/10 text-amber-500 group-hover/upgrade:bg-amber-500 group-hover/upgrade:text-slate-950 transition-all duration-300 flex-shrink-0">
                  <ChevronRight size={14} className="group-hover/upgrade:translate-x-0.5 transition-transform duration-200" />
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>;
  const menuButton = isMobile && <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm" onClick={toggleSidebar}>
      <Menu size={20} />
    </Button>;
  return <>
      {menuButton}
      <aside className={cn("flex flex-col h-screen bg-sidebar fixed inset-y-0 left-0 z-50 border-r border-sidebar-border transition-transform duration-300", "w-64", isMobile ? isOpen ? "translate-x-0" : "-translate-x-full" : "translate-x-0")}>
        {sidebarContent}
      </aside>
      {isMobile && isOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />}
    </>;
}