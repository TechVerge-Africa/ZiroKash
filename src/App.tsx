
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import Cards from "./pages/Cards";
import Payments from "./pages/Payments";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Investments from "./pages/Investments";
import Credit from "./pages/Credit";
import Settings from "./pages/Settings";
import Landing from "./pages/Landing";
import KYC from "./pages/KYC";
import Security from "./pages/Security";
import Insurance from "./pages/Insurance";
import MerchantTools from "./pages/MerchantTools";
import OfflineUSSD from "./pages/OfflineUSSD";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import About from "./pages/About";
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
      <Route path="/cards" element={
        <ProtectedRoute>
          <MainLayout>
            <Cards />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/payments" element={
        <ProtectedRoute>
          <MainLayout>
            <Payments />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/investments" element={
        <ProtectedRoute>
          <MainLayout>
            <Investments />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/credit" element={
        <ProtectedRoute>
          <MainLayout>
            <Credit />
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
      <Route path="/kyc" element={
        <ProtectedRoute>
          <MainLayout>
            <KYC />
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
      <Route path="/insurance" element={
        <ProtectedRoute>
          <MainLayout>
            <Insurance />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/merchant" element={
        <ProtectedRoute>
          <MainLayout>
            <MerchantTools />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/offline" element={
        <ProtectedRoute>
          <MainLayout>
            <OfflineUSSD />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/rewards" element={
        <ProtectedRoute>
          <MainLayout>
            <Rewards />
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
