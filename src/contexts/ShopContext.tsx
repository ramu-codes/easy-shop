import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Customer, Seller, Product, PurchaseEntry, SaleEntry, Expense, PaymentRecord, Employee, AttendanceRecord, SalaryPayment, DailyEntry } from '@/types/shop';

interface ShopContextType {
  customers: Customer[];
  sellers: Seller[];
  products: Product[];
  purchases: PurchaseEntry[];
  sales: SaleEntry[];
  expenses: Expense[];
  payments: PaymentRecord[];
  employees: Employee[];
  attendance: AttendanceRecord[];
  salaryPayments: SalaryPayment[];
  dailyEntries: DailyEntry[];
  isLoggedIn: boolean;
  shopName: string;
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
  updatePurchase: (id: string, p: Partial<PurchaseEntry>) => void;
  deletePurchase: (id: string) => void;
  addSale: (s: Omit<SaleEntry, 'id' | 'invoiceNo'>) => void;
  updateSale: (id: string, s: Partial<SaleEntry>) => void;
  deleteSale: (id: string) => void;
  addExpense: (e: Omit<Expense, 'id'>) => void;
  addPayment: (p: Omit<PaymentRecord, 'id'>) => void;
  addEmployee: (e: Omit<Employee, 'id' | 'createdAt'>) => void;
  updateEmployee: (id: string, e: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  markAttendance: (a: Omit<AttendanceRecord, 'id'>) => void;
  addSalaryPayment: (p: Omit<SalaryPayment, 'id'>) => void;
  addDailyEntry: (e: Omit<DailyEntry, 'id' | 'createdAt'>) => void;
  updateDailyEntry: (id: string, e: Partial<DailyEntry>) => void;
  deleteDailyEntry: (id: string) => void;
  getNextInvoiceNo: () => string;
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
  const [employees, setEmployees] = useState<Employee[]>(() => load('shop_employees', []));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => load('shop_attendance', []));
  const [salaryPayments, setSalaryPayments] = useState<SalaryPayment[]>(() => load('shop_salary_payments', []));
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>(() => load('shop_daily_entries', []));
  const [isLoggedIn, setIsLoggedIn] = useState(() => load('shop_logged_in', false));
  const [shopName, setShopName] = useState(() => load('shop_name', ''));

  useEffect(() => { localStorage.setItem('shop_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('shop_sellers', JSON.stringify(sellers)); }, [sellers]);
  useEffect(() => { localStorage.setItem('shop_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('shop_purchases', JSON.stringify(purchases)); }, [purchases]);
  useEffect(() => { localStorage.setItem('shop_sales', JSON.stringify(sales)); }, [sales]);
  useEffect(() => { localStorage.setItem('shop_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('shop_payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem('shop_employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('shop_attendance', JSON.stringify(attendance)); }, [attendance]);
  useEffect(() => { localStorage.setItem('shop_salary_payments', JSON.stringify(salaryPayments)); }, [salaryPayments]);
  useEffect(() => { localStorage.setItem('shop_daily_entries', JSON.stringify(dailyEntries)); }, [dailyEntries]);

  const login = useCallback((name: string, password: string) => {
    if (password === 'admin123') {
      setIsLoggedIn(true); setShopName(name);
      localStorage.setItem('shop_logged_in', 'true');
      localStorage.setItem('shop_name', JSON.stringify(name));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => { setIsLoggedIn(false); localStorage.setItem('shop_logged_in', 'false'); }, []);

  const addCustomer = useCallback((c: Omit<Customer, 'id' | 'createdAt'>) => {
    setCustomers(prev => [...prev, { ...c, id: uid(), createdAt: new Date().toISOString() }]);
  }, []);
  const updateCustomer = useCallback((id: string, c: Partial<Customer>) => {
    setCustomers(prev => prev.map(x => x.id === id ? { ...x, ...c } : x));
  }, []);
  const deleteCustomer = useCallback((id: string) => { setCustomers(prev => prev.filter(x => x.id !== id)); }, []);

  const addSeller = useCallback((s: Omit<Seller, 'id' | 'createdAt'>) => {
    setSellers(prev => [...prev, { ...s, id: uid(), createdAt: new Date().toISOString() }]);
  }, []);
  const updateSeller = useCallback((id: string, s: Partial<Seller>) => {
    setSellers(prev => prev.map(x => x.id === id ? { ...x, ...s } : x));
  }, []);
  const deleteSeller = useCallback((id: string) => { setSellers(prev => prev.filter(x => x.id !== id)); }, []);

  const addProduct = useCallback((p: Omit<Product, 'id' | 'createdAt' | 'stock'>) => {
    setProducts(prev => [...prev, { ...p, id: uid(), stock: 0, createdAt: new Date().toISOString() }]);
  }, []);
  const updateProduct = useCallback((id: string, p: Partial<Product>) => {
    setProducts(prev => prev.map(x => x.id === id ? { ...x, ...p } : x));
  }, []);
  const deleteProduct = useCallback((id: string) => { setProducts(prev => prev.filter(x => x.id !== id)); }, []);

  const addPurchase = useCallback((p: Omit<PurchaseEntry, 'id'>) => {
    setPurchases(prev => [...prev, { ...p, id: uid() }]);
    // Update stock
    setProducts(prev => {
      const existing = prev.find(x => x.id === p.itemId);
      if (existing) {
        return prev.map(x => x.id === p.itemId ? { ...x, stock: x.stock + p.quantity, purchasePrice: p.purchasePrice, sellPrice: p.sellPrice || x.sellPrice } : x);
      }
      // New product from purchase
      return [...prev, { id: p.itemId || uid(), itemName: p.itemName, printPrice: p.sellPrice || 0, purchasePrice: p.purchasePrice, sellPrice: p.sellPrice || 0, stock: p.quantity, image: p.image || '', createdAt: new Date().toISOString() }];
    });
  }, []);
  const updatePurchase = useCallback((id: string, p: Partial<PurchaseEntry>) => {
    setPurchases(prev => prev.map(x => x.id === id ? { ...x, ...p } : x));
  }, []);
  const deletePurchase = useCallback((id: string) => {
    setPurchases(prev => {
      const purchase = prev.find(x => x.id === id);
      if (purchase) {
        setProducts(prods => prods.map(p => p.id === purchase.itemId ? { ...p, stock: Math.max(0, p.stock - purchase.quantity) } : p));
      }
      return prev.filter(x => x.id !== id);
    });
  }, []);

  const getNextInvoiceNo = useCallback(() => {
    return `INV-${String(sales.length + 1).padStart(4, '0')}`;
  }, [sales.length]);

  const addSale = useCallback((s: Omit<SaleEntry, 'id' | 'invoiceNo'>) => {
    const invoiceNo = `INV-${String(sales.length + 1).padStart(4, '0')}`;
    setSales(prev => [...prev, { ...s, id: uid(), invoiceNo }]);
    setProducts(prev => {
      let updated = [...prev];
      s.items.forEach(item => {
        updated = updated.map(p => p.id === item.productId ? { ...p, stock: Math.max(0, p.stock - item.quantity) } : p);
      });
      return updated;
    });
    if (s.paymentMode === 'Due') {
      const existing = customers.find(c => c.id === s.customerId);
      if (existing) {
        setCustomers(prev => prev.map(c => c.id === s.customerId ? { ...c, dueAmount: c.dueAmount + s.totalBill } : c));
      }
    }
  }, [sales.length, customers]);

  const updateSale = useCallback((id: string, s: Partial<SaleEntry>) => {
    setSales(prev => prev.map(x => x.id === id ? { ...x, ...s } : x));
  }, []);
  const deleteSale = useCallback((id: string) => {
    setSales(prev => {
      const sale = prev.find(x => x.id === id);
      if (sale) {
        // Restore stock
        setProducts(prods => {
          let updated = [...prods];
          sale.items.forEach(item => {
            updated = updated.map(p => p.id === item.productId ? { ...p, stock: p.stock + item.quantity } : p);
          });
          return updated;
        });
        // Restore due
        if (sale.paymentMode === 'Due') {
          setCustomers(prev => prev.map(c => c.id === sale.customerId ? { ...c, dueAmount: Math.max(0, c.dueAmount - sale.totalBill) } : c));
        }
      }
      return prev.filter(x => x.id !== id);
    });
  }, []);

  const addExpense = useCallback((e: Omit<Expense, 'id'>) => { setExpenses(prev => [...prev, { ...e, id: uid() }]); }, []);

  const addPayment = useCallback((p: Omit<PaymentRecord, 'id'>) => {
    setPayments(prev => [...prev, { ...p, id: uid() }]);
    setCustomers(prev => prev.map(c => c.id === p.customerId ? { ...c, dueAmount: Math.max(0, c.dueAmount - p.amount) } : c));
  }, []);

  const addEmployee = useCallback((e: Omit<Employee, 'id' | 'createdAt'>) => {
    setEmployees(prev => [...prev, { ...e, id: uid(), createdAt: new Date().toISOString() }]);
  }, []);
  const updateEmployee = useCallback((id: string, e: Partial<Employee>) => {
    setEmployees(prev => prev.map(x => x.id === id ? { ...x, ...e } : x));
  }, []);
  const deleteEmployee = useCallback((id: string) => { setEmployees(prev => prev.filter(x => x.id !== id)); }, []);

  const markAttendance = useCallback((a: Omit<AttendanceRecord, 'id'>) => {
    setAttendance(prev => {
      const existing = prev.findIndex(x => x.employeeId === a.employeeId && x.date === a.date);
      if (existing >= 0) return prev.map((x, i) => i === existing ? { ...x, status: a.status } : x);
      return [...prev, { ...a, id: uid() }];
    });
  }, []);

  const addSalaryPayment = useCallback((p: Omit<SalaryPayment, 'id'>) => {
    setSalaryPayments(prev => [...prev, { ...p, id: uid() }]);
  }, []);

  const addDailyEntry = useCallback((e: Omit<DailyEntry, 'id' | 'createdAt'>) => {
    setDailyEntries(prev => [...prev, { ...e, id: uid(), createdAt: new Date().toISOString() }]);
  }, []);
  const updateDailyEntry = useCallback((id: string, e: Partial<DailyEntry>) => {
    setDailyEntries(prev => prev.map(x => x.id === id ? { ...x, ...e } : x));
  }, []);
  const deleteDailyEntry = useCallback((id: string) => { setDailyEntries(prev => prev.filter(x => x.id !== id)); }, []);

  return (
    <ShopContext.Provider value={{
      customers, sellers, products, purchases, sales, expenses, payments,
      employees, attendance, salaryPayments, dailyEntries,
      isLoggedIn, shopName, login, logout,
      addCustomer, updateCustomer, deleteCustomer,
      addSeller, updateSeller, deleteSeller,
      addProduct, updateProduct, deleteProduct,
      addPurchase, updatePurchase, deletePurchase,
      addSale, updateSale, deleteSale,
      addExpense, addPayment,
      addEmployee, updateEmployee, deleteEmployee,
      markAttendance, addSalaryPayment,
      addDailyEntry, updateDailyEntry, deleteDailyEntry,
      getNextInvoiceNo,
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
