
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { BottomNav } from "./BottomNav";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-background text-foreground scrollbar-none">
      <Sidebar />
      <div className={cn(
        "flex flex-col min-h-screen",
        isMobile ? "ml-0" : "ml-64"
      )}>
        <Header />
        <main className={cn(
          "flex-1 overflow-auto scrollbar-none",
          isMobile ? "px-4 pt-3 pb-24" : "p-6" // Added extra bottom padding (pb-24) on mobile
        )}>
          {children}
        </main>
        {isMobile && <BottomNav />}
      </div>
    </div>
  );
}
