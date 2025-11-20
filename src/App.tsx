
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ZiroPay from "./pages/ZiroPay";
import Dashboard from "./pages/Dashboard";
import MainLayout from "@/components/layout/MainLayout";
import PaymentForm from "./pages/PaymentForm";
import FormDetails from "./pages/FormDetails";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { ThemeProvider } from "./hooks/use-theme";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import Security from "./pages/Security";
import Support from "./pages/Support";
import About from "./pages/About";

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
  
  return user ? <Navigate to="/ziropay" replace /> : <Navigate to="/auth" replace />;
}

// App Routes component
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Public payment form route */}
      <Route path="/form/:formId" element={<PaymentForm />} />
      
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

      <Route path="/profile" element={
        <ProtectedRoute>
          <MainLayout>
            <Profile />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/security" element={
        <ProtectedRoute>
          <MainLayout>
            <Security />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/support" element={
        <ProtectedRoute>
          <MainLayout>
            <Support />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/about" element={
        <ProtectedRoute>
          <MainLayout>
            <About />
          </MainLayout>
        </ProtectedRoute>
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
          <AppRoutes />
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
