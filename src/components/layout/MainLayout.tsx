import { useIsMobile } from "@/hooks/use-mobile";
import Loader from "@/components/ui/loader";
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
  const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes idle timeout
  const { user } = useAuth();
  const [showPINOnboarding, setShowPINOnboarding] = useState(false);
  
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (!user) return false;
    const unlocked = sessionStorage.getItem(`zirokash_unlocked_${user.id}`) === 'true';
    const lastActivity = parseInt(localStorage.getItem(`zirokash_last_activity_${user.id}`) || "0");
    const isTimedOut = Date.now() - lastActivity > IDLE_TIMEOUT;
    
    return unlocked && !isTimedOut;
  });
  
  const [userHasPIN, setUserHasPIN] = useState<boolean | null>(null);
  const [checkingPIN, setCheckingPIN] = useState(true);

  useEffect(() => {
    if (user) {
      checkPINStatus();
    } else {
      setCheckingPIN(false);
    }
  }, [user]);

  // Idle Detection Logic
  useEffect(() => {
    if (!user || !isUnlocked) return;

    const updateActivity = () => {
      localStorage.setItem(`zirokash_last_activity_${user.id}`, Date.now().toString());
    };

    const checkIdle = () => {
      const lastActivity = parseInt(localStorage.getItem(`zirokash_last_activity_${user.id}`) || "0");
      if (Date.now() - lastActivity > IDLE_TIMEOUT) {
        setIsUnlocked(false);
        sessionStorage.setItem(`zirokash_unlocked_${user?.id}`, 'false');
      }
    };

    // Initial update
    updateActivity();

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    const handleEvent = () => updateActivity();
    
    events.forEach(ev => window.addEventListener(ev, handleEvent));
    const interval = setInterval(checkIdle, 10000); // Check every 10 seconds

    return () => {
      events.forEach(ev => window.removeEventListener(ev, handleEvent));
      clearInterval(interval);
    };
  }, [user, isUnlocked]);

  const checkPINStatus = async () => {
    if (!user) {
      setCheckingPIN(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('pin_setup_completed, pin_hash')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (!error && data) {
        const profile = data as any;
        setUserHasPIN(!!profile.pin_hash);

        if (profile.pin_setup_completed === false && !!profile.pin_hash) {
          // Show onboarding after a small delay for better UX
          setTimeout(() => setShowPINOnboarding(true), 2000);
        }
      } else {
        setUserHasPIN(false);
      }
    } catch (err) {
      console.error("Error checking PIN status:", err);
      setUserHasPIN(false);
    } finally {
      setCheckingPIN(false);
    }
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
    if (user) {
      sessionStorage.setItem(`zirokash_unlocked_${user.id}`, 'true');
      localStorage.setItem(`zirokash_last_activity_${user.id}`, Date.now().toString());
    }
  };
  
  // Show a local loader while checking PIN status
  if (checkingPIN) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader variant="spinner" size="md" />
      </div>
    );
  }

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
