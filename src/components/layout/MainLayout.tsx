import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { BottomNav } from "./BottomNav";
import { PINSetupModal } from "../auth/PINSetupModal";
import { PINUnlockScreen } from "../auth/PINUnlockScreen";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [showPINOnboarding, setShowPINOnboarding] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(() => {
    // Session-based unlock state
    return sessionStorage.getItem(`zirokash_unlocked_${user?.id}`) === 'true';
  });
  const [userHasPIN, setUserHasPIN] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) {
      checkPINStatus();
    }
  }, [user]);

  const checkPINStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('pin_setup_completed, pin_code')
        .eq('user_id', user?.id)
        .single();
      
      if (!error && data) {
        const profile = data as any;
        setUserHasPIN(!!profile.pin_code);

        if (profile.pin_setup_completed === false) {
          // Show onboarding after a small delay for better UX
          setTimeout(() => setShowPINOnboarding(true), 2000);
        }
      }
    } catch (err) {
      console.error("Error checking PIN status:", err);
    }
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
    if (user) {
      sessionStorage.setItem(`zirokash_unlocked_${user.id}`, 'true');
    }
  };
  
  // If user has a PIN but isn't unlocked yet, show the unlock screen
  if (user && userHasPIN && !isUnlocked) {
    return <PINUnlockScreen onUnlock={handleUnlock} />;
  }
  
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
          isMobile ? "px-3 sm:px-4 pt-3 pb-20 sm:pb-24" : "p-4 sm:p-6" // Responsive padding
        )}>
          {children}
        </main>
        {isMobile && <BottomNav />}
      </div>

      <PINSetupModal 
        isOpen={showPINOnboarding} 
        onClose={() => setShowPINOnboarding(false)}
        onSuccess={() => setShowPINOnboarding(false)}
      />
    </div>
  );
}
