
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
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            } />
            <Route path="/wallet" element={
              <MainLayout>
                <Wallet />
              </MainLayout>
            } />
            <Route path="/cards" element={
              <MainLayout>
                <Cards />
              </MainLayout>
            } />
            <Route path="/payments" element={
              <MainLayout>
                <Payments />
              </MainLayout>
            } />
            <Route path="/investments" element={
              <MainLayout>
                <Investments />
              </MainLayout>
            } />
            <Route path="/credit" element={
              <MainLayout>
                <Credit />
              </MainLayout>
            } />
            <Route path="/settings" element={
              <MainLayout>
                <Settings />
              </MainLayout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
