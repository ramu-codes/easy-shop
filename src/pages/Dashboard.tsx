import { useShop } from '@/contexts/ShopContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, UserCheck, TrendingUp, TrendingDown, AlertCircle, ShoppingCart, Wallet, UserCheck2, Eye, EyeOff, Store, Clock, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const COLORS = ['hsl(174, 60%, 38%)', 'hsl(35, 90%, 55%)', 'hsl(210, 70%, 55%)', 'hsl(0, 70%, 50%)', 'hsl(145, 60%, 42%)'];

export default function Dashboard() {
  const { customers, sellers, products, sales, expenses, purchases, employees, salaryPayments, payments, shopName } = useShop();
  const [showAdmin, setShowAdmin] = useState(false);
  const navigate = useNavigate();

  const totalSales = sales.reduce((s, x) => s + x.totalBill, 0);
  const totalExpenses = expenses.reduce((s, x) => s + x.amount, 0);
  const totalPurchases = purchases.reduce((s, x) => s + x.totalAmount, 0);
  const totalDue = customers.reduce((s, c) => s + c.dueAmount, 0);
  const totalSalaryPaid = salaryPayments.reduce((s, p) => s + p.amount, 0);
  const totalInvestment = totalPurchases + totalExpenses + totalSalaryPaid;
  const profit = totalSales - totalInvestment;
  const totalPaymentsReceived = payments.reduce((s, p) => s + p.amount, 0);

  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(s => s.date === today).reduce((s, x) => s + x.totalBill, 0);
  const todayExpenses = expenses.filter(e => e.date === today).reduce((s, x) => s + x.amount, 0);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlySales = sales.filter(s => s.date.startsWith(currentMonth)).reduce((s, x) => s + x.totalBill, 0);
  const monthlyExpenses = expenses.filter(e => e.date.startsWith(currentMonth)).reduce((s, x) => s + x.amount, 0);
  const monthlyPurchases = purchases.filter(p => p.date.startsWith(currentMonth)).reduce((s, x) => s + x.totalAmount, 0);
  const monthlySalary = salaryPayments.filter(p => p.month === currentMonth).reduce((s, x) => s + x.amount, 0);
  const monthlyProfit = monthlySales - monthlyPurchases - monthlyExpenses - monthlySalary;

  const adminStats = [
    { label: 'Total Revenue', value: totalSales, icon: TrendingUp, bg: 'bg-emerald-50 dark:bg-emerald-950', iconColor: 'text-emerald-600', valueColor: 'text-emerald-700' },
    { label: 'Total Expenses', value: totalExpenses, icon: TrendingDown, bg: 'bg-red-50 dark:bg-red-950', iconColor: 'text-red-500', valueColor: 'text-red-600' },
    { label: 'Total Due', value: totalDue, icon: AlertCircle, bg: 'bg-orange-50 dark:bg-orange-950', iconColor: 'text-orange-500', valueColor: 'text-orange-600' },
    { label: 'Investment', value: totalInvestment, icon: ShoppingCart, bg: 'bg-blue-50 dark:bg-blue-950', iconColor: 'text-blue-500', valueColor: 'text-blue-600' },
    { label: 'Net Profit', value: profit, icon: Wallet, bg: profit >= 0 ? 'bg-emerald-50 dark:bg-emerald-950' : 'bg-red-50 dark:bg-red-950', iconColor: profit >= 0 ? 'text-emerald-600' : 'text-red-500', valueColor: profit >= 0 ? 'text-emerald-700' : 'text-red-600' },
    { label: 'Salary Paid', value: totalSalaryPaid, icon: UserCheck2, bg: 'bg-purple-50 dark:bg-purple-950', iconColor: 'text-purple-500', valueColor: 'text-purple-600' },
  ];

  const quickStats = [
    { label: 'Products', value: products.length, icon: Package, route: '/products' },
    { label: 'Customers', value: customers.length, icon: Users, route: '/customers' },
    { label: 'Sellers', value: sellers.length, icon: UserCheck, route: '/sellers' },
    { label: 'Employees', value: employees.length, icon: UserCheck2, route: '/employees' },
  ];

  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; qty: number }> = {};
    sales.forEach(s => s.items.forEach(i => {
      if (!map[i.productId]) map[i.productId] = { name: i.productName, qty: 0 };
      map[i.productId].qty += i.quantity;
    }));
    return Object.values(map).sort((a, b) => b.qty - a.qty).slice(0, 10);
  }, [sales]);

  const leastProducts = useMemo(() => {
    const map: Record<string, { name: string; qty: number }> = {};
    sales.forEach(s => s.items.forEach(i => {
      if (!map[i.productId]) map[i.productId] = { name: i.productName, qty: 0 };
      map[i.productId].qty += i.quantity;
    }));
    return Object.values(map).sort((a, b) => a.qty - b.qty).slice(0, 10);
  }, [sales]);

  // Top customers by visits AND revenue
  const topCustomersByVisits = useMemo(() => {
    const map: Record<string, { name: string; visits: number; total: number }> = {};
    sales.forEach(s => {
      if (!map[s.customerId]) map[s.customerId] = { name: s.customerName, visits: 0, total: 0 };
      map[s.customerId].visits++;
      map[s.customerId].total += s.totalBill;
    });
    return Object.values(map).sort((a, b) => b.visits - a.visits).slice(0, 10);
  }, [sales]);

  const topCustomersByRevenue = useMemo(() => {
    const map: Record<string, { name: string; visits: number; total: number }> = {};
    sales.forEach(s => {
      if (!map[s.customerId]) map[s.customerId] = { name: s.customerName, visits: 0, total: 0 };
      map[s.customerId].visits++;
      map[s.customerId].total += s.totalBill;
    });
    return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 10);
  }, [sales]);

  const expenseByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(e => { map[e.category || 'Other'] = (map[e.category || 'Other'] || 0) + e.amount; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const lowStockProducts = useMemo(() => products.filter(p => p.stock <= 5).sort((a, b) => a.stock - b.stock).slice(0, 10), [products]);

  const maskValue = (val: number) => showAdmin ? `₹${val.toLocaleString()}` : '₹ • • • • •';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Store className="h-7 w-7 text-primary" />
        <div>
          <h2 className="text-xl font-bold text-foreground mb-0">{shopName || 'Verma Fancy Store'}</h2>
          <p className="text-xs text-muted-foreground">Dashboard</p>
        </div>
      </div>

      {/* Today's Quick */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="border-emerald-200 dark:border-emerald-800">
          <CardContent className="pt-3 pb-3 text-center">
            <p className="text-xs text-muted-foreground">Today's Sales</p>
            <p className="text-lg font-bold text-emerald-600">₹{todaySales.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-3 pb-3 text-center">
            <p className="text-xs text-muted-foreground">Today's Expenses</p>
            <p className="text-lg font-bold text-red-500">₹{todayExpenses.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Summary */}
      <Card className="mb-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="pt-4 pb-3">
          <h3 className="font-semibold text-sm mb-2 text-foreground">📊 {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div><p className="text-[10px] text-muted-foreground">Sales</p><p className="text-sm font-bold text-emerald-600">₹{monthlySales.toLocaleString()}</p></div>
            <div><p className="text-[10px] text-muted-foreground">Expenses</p><p className="text-sm font-bold text-red-500">₹{(monthlyExpenses + monthlyPurchases + monthlySalary).toLocaleString()}</p></div>
            <div><p className="text-[10px] text-muted-foreground">Profit</p><p className={`text-sm font-bold ${monthlyProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>₹{monthlyProfit.toLocaleString()}</p></div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Section */}
      <Card className="mb-4 border-secondary/40 bg-gradient-to-br from-secondary/5 to-primary/5">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold">🔒 Admin Section</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowAdmin(!showAdmin)} className="gap-1.5 h-8 text-xs">
            {showAdmin ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showAdmin ? 'Hide' : 'Show'}
          </Button>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-2 gap-2">
            {adminStats.map(s => (
              <div key={s.label} className={`rounded-xl p-3 ${s.bg} transition-all`}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <s.icon className={`h-3.5 w-3.5 ${s.iconColor}`} />
                  <span className="text-[10px] text-muted-foreground font-medium">{s.label}</span>
                </div>
                <span className={`text-base font-bold ${s.valueColor}`}>{maskValue(s.value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Counts - Clickable */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {quickStats.map(s => (
          <button key={s.label} onClick={() => navigate(s.route)} className="stat-card text-center py-3 px-2 hover:ring-2 hover:ring-primary/40 transition-all active:scale-95">
            <s.icon className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Income Summary - Daily Income, Expenses, Due, Pay Balance */}
      <Card className="mb-4">
        <CardHeader className="pb-2"><CardTitle className="text-sm">💰 Quick Summary</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => navigate('/daily-tracker')} className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950 hover:ring-2 hover:ring-emerald-300 transition-all">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <div className="text-left">
                <p className="text-[10px] text-muted-foreground">Total Income</p>
                <p className="text-sm font-bold text-emerald-600">₹{totalSales.toLocaleString()}</p>
              </div>
            </button>
            <button onClick={() => navigate('/daily-tracker')} className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950 hover:ring-2 hover:ring-red-300 transition-all">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <div className="text-left">
                <p className="text-[10px] text-muted-foreground">Total Expenses</p>
                <p className="text-sm font-bold text-red-500">₹{totalExpenses.toLocaleString()}</p>
              </div>
            </button>
            <button onClick={() => navigate('/customers')} className="flex items-center gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-950 hover:ring-2 hover:ring-orange-300 transition-all">
              <Clock className="h-4 w-4 text-orange-500" />
              <div className="text-left">
                <p className="text-[10px] text-muted-foreground">Balance Due</p>
                <p className="text-sm font-bold text-orange-600">₹{totalDue.toLocaleString()}</p>
              </div>
            </button>
            <button onClick={() => navigate('/customers')} className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950 hover:ring-2 hover:ring-blue-300 transition-all">
              <CreditCard className="h-4 w-4 text-blue-500" />
              <div className="text-left">
                <p className="text-[10px] text-muted-foreground">Payments Received</p>
                <p className="text-sm font-bold text-blue-600">₹{totalPaymentsReceived.toLocaleString()}</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-xs">🔥 Top 10 Products</CardTitle></CardHeader>
          <CardContent>
            {topProducts.length === 0 ? <p className="text-xs text-muted-foreground py-4 text-center">No data</p> : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={topProducts}>
                  <XAxis dataKey="name" tick={{ fontSize: 8 }} angle={-35} textAnchor="end" height={55} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Bar dataKey="qty" fill="hsl(174, 60%, 38%)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-xs">📉 Least Selling</CardTitle></CardHeader>
          <CardContent>
            {leastProducts.length === 0 ? <p className="text-xs text-muted-foreground py-4 text-center">No data</p> : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={leastProducts}>
                  <XAxis dataKey="name" tick={{ fontSize: 8 }} angle={-35} textAnchor="end" height={55} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Bar dataKey="qty" fill="hsl(0, 70%, 50%)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Customers by Visits & Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-xs">👑 Top Customers (Visits)</CardTitle></CardHeader>
          <CardContent>
            {topCustomersByVisits.length === 0 ? <p className="text-xs text-muted-foreground py-4 text-center">No data</p> : (
              <div className="space-y-1">
                {topCustomersByVisits.map((c, i) => (
                  <div key={i} className="flex justify-between items-center py-1 border-b border-border last:border-0 text-xs">
                    <span className="font-medium">{i + 1}. {c.name}</span>
                    <div className="flex gap-2">
                      <span className="text-primary font-semibold">{c.visits} visits</span>
                      <span className="text-muted-foreground">₹{c.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-xs">💰 Top Customers (Revenue)</CardTitle></CardHeader>
          <CardContent>
            {topCustomersByRevenue.length === 0 ? <p className="text-xs text-muted-foreground py-4 text-center">No data</p> : (
              <div className="space-y-1">
                {topCustomersByRevenue.map((c, i) => (
                  <div key={i} className="flex justify-between items-center py-1 border-b border-border last:border-0 text-xs">
                    <span className="font-medium">{i + 1}. {c.name}</span>
                    <div className="flex gap-2">
                      <span className="text-emerald-600 font-bold">₹{c.total.toLocaleString()}</span>
                      <span className="text-muted-foreground">{c.visits}x</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Expense Categories */}
      {expenseByCategory.length > 0 && (
        <Card className="mb-4">
          <CardHeader className="pb-1"><CardTitle className="text-xs">💸 Expenses by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {expenseByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Low Stock */}
      {lowStockProducts.length > 0 && (
        <Card className="mb-4">
          <CardHeader className="pb-1"><CardTitle className="text-xs">⚠️ Low Stock Alert</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1">
              {lowStockProducts.map(p => (
                <div key={p.id} className="flex justify-between items-center py-1 border-b border-border last:border-0">
                  <div className="flex items-center gap-2">
                    {p.image && <img src={p.image} alt="" className="h-6 w-6 rounded object-cover" />}
                    <span className="text-xs font-medium">{p.itemName}</span>
                  </div>
                  <span className={`text-xs font-bold ${p.stock === 0 ? 'text-red-500' : 'text-orange-500'}`}>
                    {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
