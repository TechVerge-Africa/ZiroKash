import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  Receipt,
  DollarSign
} from 'lucide-react';
import { cn } from "@/lib/utils";

export function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      href: '/dashboard'
    },
    {
      icon: DollarSign,
      label: 'Forms',
      href: '/zirokash'
    },
    {
      icon: Receipt,
      label: 'Transactions',
      href: '/transactions'
    }
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-background border-t shadow-lg md:hidden dark:bg-background/80 dark:backdrop-blur-lg"
      style={{ touchAction: 'manipulation' }}
    >
      <div 
        className={cn(
          "grid h-full grid-cols-3 mx-auto max-w-md",
          "bg-white dark:bg-transparent",
          "shadow-[0_-4px_10px_rgba(0,0,0,0.03)] dark:shadow-none"
        )}
      >
        {navItems.map((item, index) => {
          const isActive = currentPath === item.href;
          const Icon = item.icon;
          
          return (
            <div
              key={index}
              className="relative h-full w-full overflow-hidden"
            >
              <Link
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1",
                  "h-full w-full relative",
                  "box-border",
                  "active:opacity-70",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
                style={{ touchAction: 'manipulation' }}
              >
                {/* Active background - absolutely positioned, doesn't affect layout */}
                {isActive && (
                  <div 
                    className="absolute inset-0 bg-primary/10 z-0"
                    aria-hidden="true"
                  />
                )}
                
                {/* Active indicator - absolutely positioned at top, doesn't affect box model */}
                {isActive && (
                  <div 
                    className="absolute top-0 left-0 right-0 h-[2px] bg-primary z-0"
                    aria-hidden="true"
                  />
                )}
                
                {/* Content with proper z-index to stay above indicators */}
                <Icon 
                  className="w-5 h-5 relative z-10"
                />
                <span className="text-[10px] font-medium relative z-10">
                  {item.label}
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
