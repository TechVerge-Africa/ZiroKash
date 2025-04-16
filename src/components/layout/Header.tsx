
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
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

export default function Header() {
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();
  
  // Function to get user initials
  const getUserInitials = () => {
    if (!user) return "?";
    const name = user.name || user.email || "";
    return name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
  };
  
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Left side - Logo (visible on mobile) and Search (hidden on mobile) */}
      <div className="flex-1 mr-4 flex items-center">
        {isMobile && (
          <Link to="/dashboard" className="flex items-center mr-4">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
              P
            </div>
            <span className="text-xl font-bold gradient-text ml-2">PayNex</span>
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
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={18} />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-2 pr-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-secondary">{getUserInitials()}</AvatarFallback>
              </Avatar>
              {!isMobile && (
                <>
                  <div className="flex flex-col items-start text-xs">
                    <span className="font-medium">{user?.name || "User"}</span>
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
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
