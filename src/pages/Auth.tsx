import { useEffect } from "react";
import Loader from "@/components/ui/loader";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { X, Globe, ShieldCheck, Zap } from "lucide-react";

export default function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (user && !loading) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="relative">
          <Loader variant="spinner" size="lg" />
          <div className="absolute inset-0 animate-pulse bg-primary/20 rounded-full blur-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-pattern flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse-slow delay-700" />
        <div className="moving-gradient opacity-30" />
      </div>

      {/* Floating Decorative Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[15%] left-[10%] animate-float opacity-20">
          <Globe className="h-12 w-12 text-primary" />
        </div>
        <div className="absolute top-[20%] right-[15%] animate-float-delayed opacity-20">
          <ShieldCheck className="h-10 w-10 text-secondary" />
        </div>
        <div className="absolute bottom-[20%] left-[15%] animate-float opacity-20">
          <Zap className="h-8 w-8 text-primary" />
        </div>
        
        {/* Particle System Effect */}
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 1.5}s`,
              transform: `scale(${0.5 + Math.random()})`
            }}
          />
        ))}
      </div>

      {/* Close Button */}
      <Link to="/" className="absolute top-6 right-6 z-50 group">
        <Button variant="ghost" size="icon" className="rounded-full bg-background/20 backdrop-blur-md border border-white/10 hover:bg-background/40 hover:scale-110 transition-all duration-300">
          <X className="h-5 w-5 group-hover:rotate-90 transition-transform" />
        </Button>
      </Link>
      
      <div className="relative z-10 w-full max-w-md">
        <AuthForm />
      </div>
      
      <div className="mt-12 text-center text-sm text-muted-foreground max-w-md relative z-10 px-4">
        <div className="flex items-center justify-center gap-6 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="h-6 w-auto flex items-center gap-2 font-semibold">
            <ShieldCheck size={16} /> Secure
          </div>
          <div className="h-6 w-auto flex items-center gap-2 font-semibold">
            <Zap size={16} /> Instant
          </div>
          <div className="h-6 w-auto flex items-center gap-2 font-semibold">
            <Globe size={16} /> Global
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite 2s;
        }
      `}} />
    </div>
  );
}