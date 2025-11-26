import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-pattern flex flex-col items-center justify-center p-4 relative">
      {/* Close Button */}
      <Link to="/landing" className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <Button variant="ghost" size="icon" className="rounded-full">
          <X className="h-5 w-5" />
        </Button>
      </Link>
      
      <AuthForm />
      
      <div className="mt-8 text-center text-sm text-muted-foreground max-w-md">
        <p>© 2025 ZiroKash. All rights reserved.</p>
        <p className="mt-2">
          By signing up, you agree to our{" "}
          <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>{" "}
          and{" "}
          <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}