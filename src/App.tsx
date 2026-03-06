import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ShopProvider, useShop } from "@/contexts/ShopContext";
import Layout from "@/components/Layout";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import Sellers from "@/pages/Sellers";
import Customers from "@/pages/Customers";
import Sales from "@/pages/Sales";
import Employees from "@/pages/Employees";
import DailyTracker from "@/pages/DailyTracker";
import Expenditure from "@/pages/Expenditure";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isLoggedIn } = useShop();
  if (!isLoggedIn) return <LandingPage />;

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/sellers" element={<Sellers />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/daily-tracker" element={<DailyTracker />} />
        <Route path="/expenditure" element={<Expenditure />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ShopProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ShopProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
