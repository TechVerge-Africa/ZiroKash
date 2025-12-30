
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ZiroPay from "./pages/ZiroPay";
import Dashboard from "./pages/Dashboard";
import MainLayout from "@/components/layout/MainLayout";
import PaymentForm from "./pages/PaymentForm";
import PaymentSuccess from "./pages/PaymentSuccess";
import FormDetails from "./pages/FormDetails";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { ThemeProvider } from "./hooks/use-theme";
import Transactions from "./pages/Transactions";
import Support from "./pages/Support";
import About from "./pages/About";
import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient();


// App Routes component
function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Landing page is now at the root */}
      <Route path="/" element={user ? <Navigate to="/ziropay" replace /> : <Landing />} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Fallback for legacy /landing links */}
      <Route path="/landing" element={<Navigate to="/" replace />} />
      
      {/* Public payment form routes */}
      <Route path="/pay/:formId" element={<PaymentForm />} />
      <Route path="/pay/:formId/success" element={<PaymentSuccess />} />
      
      {/* Protected Routes */}
        <Route path="/ziropay" element={
          <ProtectedRoute>
            <MainLayout>
              <ZiroPay />
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

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/forms/:formId" element={
        <ProtectedRoute>
          <MainLayout>
            <FormDetails />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/ziropay/:formId" element={
        <ProtectedRoute>
          <MainLayout>
            <FormDetails />
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

      <Route path="/support" element={
        <MainLayout>
          <Support />
        </MainLayout>
      } />

      <Route path="/about" element={
        <MainLayout>
          <About />
        </MainLayout>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Main App component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
