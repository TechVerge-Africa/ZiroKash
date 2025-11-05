
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import Transactions from "./pages/Transactions";
import ZiroPay from "./pages/ZiroPay";
import Savings from "./pages/Savings";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
// Commented out features for future implementation
// import Cards from "./pages/Cards";
// import Credit from "./pages/Credit";
// import Investments from "./pages/Investments";
import MainLayout from "./components/layout/MainLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { ThemeProvider } from "./hooks/use-theme";

const queryClient = new QueryClient();

// Root redirect component
function RootRedirect() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" replace /> : <Landing />;
}

// App Routes component moved outside of main App component
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/wallet" element={
        <ProtectedRoute>
          <MainLayout>
            <Wallet />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/transactions" element={
        <ProtectedRoute>
          <MainLayout>
            <Transactions />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/ziropay" element={
        <ProtectedRoute>
          <MainLayout>
            <ZiroPay />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/savings" element={
        <ProtectedRoute>
          <MainLayout>
            <Savings />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <MainLayout>
            <Settings />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Main App component properly wrapped with providers
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
