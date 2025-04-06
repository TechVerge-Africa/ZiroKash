
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen grid-pattern flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-card border-white/10 p-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center text-4xl font-bold">
            404
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col gap-3">
          <Button asChild className="w-full">
            <Link to="/">Go Home</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
