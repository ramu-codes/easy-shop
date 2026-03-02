import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Customer, Seller, Product, PurchaseEntry, SaleEntry, Expense, PaymentRecord } from '@/types/shop';

interface ShopState {
  customers: Customer[];
  sellers: Seller[];
  products: Product[];
  purchases: PurchaseEntry[];
  sales: SaleEntry[];
  expenses: Expense[];
  payments: PaymentRecord[];
  isLoggedIn: boolean;
  shopName: string;
}

interface ShopContextType extends ShopState {
  login: (shopName: string, password: string) => boolean;
  logout: () => void;
  addCustomer: (c: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (id: string, c: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addSeller: (s: Omit<Seller, 'id' | 'createdAt'>) => void;
  updateSeller: (id: string, s: Partial<Seller>) => void;
  deleteSeller: (id: string) => void;
  addProduct: (p: Omit<Product, 'id' | 'createdAt' | 'stock'>) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addPurchase: (p: Omit<PurchaseEntry, 'id'>) => void;
  addSale: (s: Omit<SaleEntry, 'id'>) => void;
  addExpense: (e: Omit<Expense, 'id'>) => void;
  addPayment: (p: Omit<PaymentRecord, 'id'>) => void;
}

const ShopContext = createContext<ShopContextType | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);

const load = <T,>(key: string, fallback: T): T => {
  try {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : fallback;
  } catch { return fallback; }
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(() => load('shop_customers', []));
  const [sellers, setSellers] = useState<Seller[]>(() => load('shop_sellers', []));
  const [products, setProducts] = useState<Product[]>(() => load('shop_products', []));
  const [purchases, setPurchases] = useState<PurchaseEntry[]>(() => load('shop_purchases', []));
  const [sales, setSales] = useState<SaleEntry[]>(() => load('shop_sales', []));
  const [expenses, setExpenses] = useState<Expense[]>(() => load('shop_expenses', []));
  const [payments, setPayments] = useState<PaymentRecord[]>(() => load('shop_payments', []));
  const [isLoggedIn, setIsLoggedIn] = useState(() => load('shop_logged_in', false));
  const [shopName, setShopName] = useState(() => load('shop_name', ''));

  useEffect(() => { localStorage.setItem('shop_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('shop_sellers', JSON.stringify(sellers)); }, [sellers]);
  useEffect(() => { localStorage.setItem('shop_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('shop_purchases', JSON.stringify(purchases)); }, [purchases]);
  useEffect(() => { localStorage.setItem('shop_sales', JSON.stringify(sales)); }, [sales]);
  useEffect(() => { localStorage.setItem('shop_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('shop_payments', JSON.stringify(payments)); }, [payments]);

  const login = useCallback((name: string, password: string) => {
    if (password === 'admin123') {
      setIsLoggedIn(true);
      setShopName(name);
      localStorage.setItem('shop_logged_in', 'true');
      localStorage.setItem('shop_name', JSON.stringify(name));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.setItem('shop_logged_in', 'false');
  }, []);

  const addCustomer = useCallback((c: Omit<Customer, 'id' | 'createdAt'>) => {
    setCustomers(prev => [...prev, { ...c, id: uid(), createdAt: new Date().toISOString() }]);
  }, []);
  const updateCustomer = useCallback((id: string, c: Partial<Customer>) => {
    setCustomers(prev => prev.map(x => x.id === id ? { ...x, ...c } : x));
  }, []);
  const deleteCustomer = useCallback((id: string) => {
    setCustomers(prev => prev.filter(x => x.id !== id));
  }, []);

  const addSeller = useCallback((s: Omit<Seller, 'id' | 'createdAt'>) => {
    setSellers(prev => [...prev, { ...s, id: uid(), createdAt: new Date().toISOString() }]);
  }, []);
  const updateSeller = useCallback((id: string, s: Partial<Seller>) => {
    setSellers(prev => prev.map(x => x.id === id ? { ...x, ...s } : x));
  }, []);
  const deleteSeller = useCallback((id: string) => {
    setSellers(prev => prev.filter(x => x.id !== id));
  }, []);

  const addProduct = useCallback((p: Omit<Product, 'id' | 'createdAt' | 'stock'>) => {
    setProducts(prev => [...prev, { ...p, id: uid(), stock: 0, createdAt: new Date().toISOString() }]);
  }, []);
  const updateProduct = useCallback((id: string, p: Partial<Product>) => {
    setProducts(prev => prev.map(x => x.id === id ? { ...x, ...p } : x));
  }, []);
  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(x => x.id !== id));
  }, []);

  const addPurchase = useCallback((p: Omit<PurchaseEntry, 'id'>) => {
    setPurchases(prev => [...prev, { ...p, id: uid() }]);
    setProducts(prev => prev.map(x => x.id === p.itemId ? { ...x, stock: x.stock + p.quantity } : x));
  }, []);

  const addSale = useCallback((s: Omit<SaleEntry, 'id'>) => {
    setSales(prev => [...prev, { ...s, id: uid() }]);
    setProducts(prev => {
      let updated = [...prev];
      s.items.forEach(item => {
        updated = updated.map(p => p.id === item.productId ? { ...p, stock: Math.max(0, p.stock - item.quantity) } : p);
      });
      return updated;
    });
    if (s.paymentMode === 'Due') {
      setCustomers(prev => prev.map(c => c.id === s.customerId ? { ...c, dueAmount: c.dueAmount + s.totalBill } : c));
    }
  }, []);

  const addExpense = useCallback((e: Omit<Expense, 'id'>) => {
    setExpenses(prev => [...prev, { ...e, id: uid() }]);
  }, []);

  const addPayment = useCallback((p: Omit<PaymentRecord, 'id'>) => {
    setPayments(prev => [...prev, { ...p, id: uid() }]);
    setCustomers(prev => prev.map(c => c.id === p.customerId ? { ...c, dueAmount: Math.max(0, c.dueAmount - p.amount) } : c));
  }, []);

  return (
    <ShopContext.Provider value={{
      customers, sellers, products, purchases, sales, expenses, payments,
      isLoggedIn, shopName,
      login, logout,
      addCustomer, updateCustomer, deleteCustomer,
      addSeller, updateSeller, deleteSeller,
      addProduct, updateProduct, deleteProduct,
      addPurchase, addSale, addExpense, addPayment,
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be inside ShopProvider');
  return ctx;
};
