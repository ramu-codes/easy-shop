import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ShopProvider, useShop } from "@/contexts/ShopContext";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import Sellers from "@/pages/Sellers";
import Customers from "@/pages/Customers";
import Purchase from "@/pages/Purchase";
import Sales from "@/pages/Sales";
import DailyIncome from "@/pages/DailyIncome";
import DailyExpense from "@/pages/DailyExpense";
import BalanceDue from "@/pages/BalanceDue";
import PayBalance from "@/pages/PayBalance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isLoggedIn } = useShop();

  if (!isLoggedIn) return <Login />;

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/sellers" element={<Sellers />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/daily-income" element={<DailyIncome />} />
        <Route path="/daily-expense" element={<DailyExpense />} />
        <Route path="/balance-due" element={<BalanceDue />} />
        <Route path="/pay-balance" element={<PayBalance />} />
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
