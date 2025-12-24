import React from "react";
import { Bell, ChevronDown, User, LogOut, Settings as SettingsIcon, Menu, Lock as LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Header(): JSX.Element {
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  
  const fullName = (user?.user_metadata as { full_name?: string } | undefined)?.full_name;
  const firstName = fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'User';
  
  const getUserInitials = () => {
    const nameForInitials = fullName || user?.email || '';
    return nameForInitials
      .trim()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join('') || 'U';
  };
  
  return (
    <div className="sticky top-0 z-20 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className={cn(
        "relative flex h-14 md:h-16 items-center justify-between",
        isMobile ? "px-4" : "px-6 border-b border-border"
      )}>
        {/* Left side - Page Title (mobile) or Search (desktop) */}
        <div className="flex-1 flex items-center min-w-0 md:max-w-xs">
          {isMobile ? (
            <div></div>
          ) : (
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-full rounded-md border border-input bg-background pl-3 pr-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          )}
        </div>

        {/* Center - Logo (desktop only) */}
        {!isMobile && (
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            <Link to="/ziropay" className="flex items-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur-sm opacity-75 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-base">
                  Z
                </div>
              </div>
              <span className="text-xl font-bold gradient-text ml-2 tracking-tight">ZiroPay</span>
            </Link>
          </div>
        )}

        {/* Right side - Notifications & User menu */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {user ? (
            <>
              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "relative",
                  isMobile ? "h-8 w-8" : "h-9 w-9 rounded-lg bg-background/80 backdrop-blur-sm border border-white/10 hover:bg-background/90"
                )}
              >
                <Bell size={isMobile ? 20 : 18} className="text-foreground/80" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background"></span>
              </Button>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={cn(
                      "gap-2",
                      isMobile ? "h-8 w-8 p-0" : "h-9 rounded-lg bg-background/80 backdrop-blur-sm border border-white/10 hover:bg-background/90 px-2"
                    )}
                  >
                    <Avatar className={isMobile ? "h-8 w-8" : "h-7 w-7"}>
                      <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10 text-primary text-xs">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    {!isMobile && (
                      <>
                        <div className="flex flex-col items-start text-xs">
                          <span className="font-medium text-foreground">{firstName}</span>
                          <span className="text-foreground/60 text-[10px]">Premium</span>
                        </div>
                        <ChevronDown size={14} className="text-foreground/60" />
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-background/95 backdrop-blur-lg border border-white/10"
                >
                  <DropdownMenuItem className="hover:bg-foreground/5" asChild>
                    <Link to="/settings" className="w-full flex items-center">
                      <User className="mr-2 h-4 w-4 text-primary" />
                      <span>My Account</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-foreground/10" />
                  <DropdownMenuItem className="hover:bg-foreground/5" asChild>
                    <Link to="/settings" className="w-full flex items-center">
                      <SettingsIcon className="mr-2 h-4 w-4 text-primary" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-foreground/5" asChild>
                    <Link to="/settings" className="w-full flex items-center">
                      <Bell className="mr-2 h-4 w-4 text-primary" />
                      <span>Notifications</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-foreground/10" />
                  <DropdownMenuItem 
                    className="hover:bg-foreground/5 cursor-pointer" 
                    onClick={() => {
                      if (user) {
                        sessionStorage.removeItem(`ziropay_unlocked_${user.id}`);
                        window.location.reload();
                      }
                    }}
                  >
                    <LockIcon className="mr-2 h-4 w-4 text-primary" />
                    <span>Lock System</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="hover:bg-destructive/10 hover:text-destructive cursor-pointer" 
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="h-9 font-bold bg-primary hover:bg-primary/90">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}