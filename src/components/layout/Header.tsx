
import { Bell, ChevronDown, User, LogOut, Settings as SettingsIcon } from "lucide-react";
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

export default function Header() {
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  
  const fullName = (user?.user_metadata as { full_name?: string } | undefined)?.full_name;
  const firstName = fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'User';
  
  // Function to get user initials
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-2 sm:px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Left side - Logo (visible on mobile) and Search (hidden on mobile) */}
      <div className="flex-1 flex items-center min-w-0">
        {isMobile && (
          <Link to="/dashboard" className="flex items-center min-w-0 mr-2 sm:mr-4">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm sm:text-base">
              Z
            </div>
            <span className="text-lg sm:text-xl font-bold gradient-text ml-1 sm:ml-2 truncate">ZiroKash</span>
          </Link>
        )}
        
        {!isMobile && (
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-full rounded-md border border-input bg-background pl-3 pr-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        )}
      </div>
      
      {/* Right side - User menu */}
      <div className="flex items-center gap-1 sm:gap-2 ml-auto flex-shrink-0">
        <Button variant="ghost" size="icon" className="relative h-8 w-8 sm:h-10 sm:w-10">
          <Bell size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-destructive"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-1 sm:gap-2 pl-1 pr-2 sm:pl-2 sm:pr-3 h-8 sm:h-10">
              <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                <AvatarFallback className="bg-secondary text-xs sm:text-sm">{getUserInitials()}</AvatarFallback>
              </Avatar>
              {!isMobile && (
                <>
                  <div className="flex flex-col items-start text-xs">
                    <span className="font-medium">{firstName}</span>
                    <span className="text-muted-foreground">Premium</span>
                  </div>
                  <ChevronDown size={14} className="text-muted-foreground" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>My Account</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              <span>Notifications</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
