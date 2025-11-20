import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  Wallet,
  Receipt,
  DollarSign,
  Settings
} from 'lucide-react';
import { cn } from "@/lib/utils";
import type { LucideIcon } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      href: '/ziropay'
    },
    {
      icon: DollarSign,
      label: 'Forms',
      href: '/ziropay'
    },
    {
      icon: Receipt,
      label: 'Transactions',
      href: '/transactions'
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/settings'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-background border-t shadow-lg md:hidden dark:bg-background/80 dark:backdrop-blur-lg">
      <div 
        className={cn(
          "grid h-full grid-cols-4 mx-auto max-w-md",
          "bg-white dark:bg-transparent",
          "shadow-[0_-4px_10px_rgba(0,0,0,0.03)] dark:shadow-none" // Subtle shadow in light mode
        )}
      >
        {navItems.map((item, index) => {
          const isActive = currentPath === item.href;
          return (
            <Link
              key={index}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1",
                "transition-all duration-200",
                "hover:text-primary hover:bg-primary/5", // Light hover background
                "active:opacity-70",
                isActive 
                  ? "text-primary bg-primary/10 border-t-2 border-primary" // Active state with top border
                  : "text-muted-foreground"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                "transition-transform duration-200",
                "hover:scale-110", // Icon scale effect on hover
                isActive && "animate-pulse-subtle" // Subtle animation for active icon
              )} />
              <span className={cn(
                "text-[10px] font-medium",
                "transition-colors duration-200"
              )}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
