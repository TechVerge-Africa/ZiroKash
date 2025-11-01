import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneAuthForm } from "@/components/auth/PhoneAuthForm";
import { useAuth } from "@/hooks/useAuth";

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
    <div className="min-h-screen grid-pattern flex flex-col items-center justify-center p-4">
      <PhoneAuthForm />
      
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