
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes wrapped in MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/credit" element={<Credit />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
