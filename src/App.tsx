
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import Cards from "./pages/Cards";
import Payments from "./pages/Payments";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Investments from "./pages/Investments";
import Credit from "./pages/Credit";
import Settings from "./pages/Settings";
import Landing from "./pages/Landing";
import MainLayout from "./components/layout/MainLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./hooks/use-theme";

const queryClient = new QueryClient();

// Protected Route component moved outside of main App component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// App Routes component moved outside of main App component
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
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
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Main App component properly wrapped with providers
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
