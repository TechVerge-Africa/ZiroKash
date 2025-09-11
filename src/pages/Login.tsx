
import { Link } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen grid-pattern flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <Link to="/" className="inline-block">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
              Z
            </div>
            <span className="text-2xl font-bold gradient-text">ZiroKash</span>
          </div>
        </Link>
        <h1 className="text-xl font-medium text-foreground">Modern African fintech</h1>
      </div>
      
      <LoginForm />
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>© 2025 ZiroKash. All rights reserved.</p>
      </div>
    </div>
  );
}
