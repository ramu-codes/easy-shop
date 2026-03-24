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
    { label: 'Total Revenue', value: totalSales, icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', route: '/sales' },
    { label: 'Total Expenses', value: totalExpenses, icon: TrendingDown, color: 'text-red-500 dark:text-red-400', bg: 'bg-red-500/10 dark:bg-red-500/20', route: '/expenditure' },
    { label: 'Total Due', value: totalDue, icon: AlertCircle, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-500/10 dark:bg-orange-500/20', route: '/customers' },
    { label: 'Investment', value: totalInvestment, icon: ShoppingCart, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/10 dark:bg-blue-500/20', route: '/sellers' },
    { label: 'Net Profit', value: profit, icon: Wallet, color: profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400', bg: profit >= 0 ? 'bg-emerald-500/10 dark:bg-emerald-500/20' : 'bg-red-500/10 dark:bg-red-500/20', route: '/daily-tracker' },
    { label: 'Salary Paid', value: totalSalaryPaid, icon: UserCheck2, color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-500/10 dark:bg-purple-500/20', route: '/employees' },
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

  const maskValue = (val: number) => showAdmin ? `₹${val.toLocaleString()}` : '₹ • • • •';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
          <Store className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-foreground">{shopName || 'Verma Fancy Store'}</h2>
          <p className="text-sm text-muted-foreground font-medium">Dashboard</p>
        </div>
      </div>

      {/* Today */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <button onClick={() => navigate('/sales')} className="group">
          <Card className="border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 transition-all group-active:scale-[0.98]">
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-sm font-semibold text-muted-foreground">Today's Sales</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{todaySales.toLocaleString()}</p>
            </CardContent>
          </Card>
        </button>
        <button onClick={() => navigate('/expenditure')} className="group">
          <Card className="border-2 border-red-200 dark:border-red-800 hover:border-red-400 transition-all group-active:scale-[0.98]">
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-sm font-semibold text-muted-foreground">Today's Expenses</p>
              <p className="text-2xl font-black text-red-500 dark:text-red-400">₹{todayExpenses.toLocaleString()}</p>
            </CardContent>
          </Card>
        </button>
      </div>

      {/* Monthly */}
      <Card className="mb-5 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 border-2">
        <CardContent className="pt-5 pb-4">
          <h3 className="font-bold text-base mb-3 text-foreground">📊 {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div><p className="text-xs font-semibold text-muted-foreground">Sales</p><p className="text-lg font-black text-emerald-600 dark:text-emerald-400">₹{monthlySales.toLocaleString()}</p></div>
            <div><p className="text-xs font-semibold text-muted-foreground">Expenses</p><p className="text-lg font-black text-red-500 dark:text-red-400">₹{(monthlyExpenses + monthlyPurchases + monthlySalary).toLocaleString()}</p></div>
            <div><p className="text-xs font-semibold text-muted-foreground">Profit</p><p className={`text-lg font-black ${monthlyProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>₹{monthlyProfit.toLocaleString()}</p></div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Section */}
      <Card className="mb-5 border-2 border-secondary/30 bg-gradient-to-br from-card to-secondary/5">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-black flex items-center gap-2">🔒 Admin Section</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowAdmin(!showAdmin)} className="gap-1.5 h-9 text-xs font-semibold">
            {showAdmin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showAdmin ? 'Hide' : 'Show'}
          </Button>
        </CardHeader>
        <CardContent className="pb-5">
          <div className="grid grid-cols-2 gap-3">
            {adminStats.map(s => (
              <button key={s.label} onClick={() => navigate(s.route)} className="group active:scale-[0.97] transition-transform">
                <div className={`rounded-2xl p-4 ${s.bg} transition-all group-hover:ring-2 group-hover:ring-primary/30`}>
                  <div className="flex items-center gap-2 mb-1">
                    <s.icon className={`h-4 w-4 ${s.color}`} />
                    <span className="text-xs text-muted-foreground font-bold">{s.label}</span>
                  </div>
                  <span className={`text-xl font-black ${s.color}`}>{maskValue(s.value)}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Counts */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {quickStats.map(s => (
          <button key={s.label} onClick={() => navigate(s.route)} className="bg-card rounded-2xl border-2 border-border text-center py-4 px-2 hover:border-primary/40 hover:shadow-lg transition-all active:scale-[0.95]">
            <s.icon className="h-6 w-6 mx-auto mb-1.5 text-primary" />
            <p className="text-2xl font-black text-foreground">{s.value}</p>
            <p className="text-xs font-semibold text-muted-foreground">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Quick Summary */}
      <Card className="mb-5">
        <CardHeader className="pb-2"><CardTitle className="text-base font-bold">💰 Quick Summary</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => navigate('/daily-tracker')} className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 hover:ring-2 hover:ring-emerald-400 transition-all active:scale-[0.97]">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <div className="text-left">
                <p className="text-xs font-semibold text-muted-foreground">Total Income</p>
                <p className="text-base font-black text-emerald-600 dark:text-emerald-400">₹{totalSales.toLocaleString()}</p>
              </div>
            </button>
            <button onClick={() => navigate('/expenditure')} className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 dark:bg-red-500/20 hover:ring-2 hover:ring-red-400 transition-all active:scale-[0.97]">
              <TrendingDown className="h-5 w-5 text-red-500 dark:text-red-400" />
              <div className="text-left">
                <p className="text-xs font-semibold text-muted-foreground">Total Expenses</p>
                <p className="text-base font-black text-red-500 dark:text-red-400">₹{totalExpenses.toLocaleString()}</p>
              </div>
            </button>
            <button onClick={() => navigate('/customers')} className="flex items-center gap-3 p-4 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 hover:ring-2 hover:ring-orange-400 transition-all active:scale-[0.97]">
              <Clock className="h-5 w-5 text-orange-500 dark:text-orange-400" />
              <div className="text-left">
                <p className="text-xs font-semibold text-muted-foreground">Balance Due</p>
                <p className="text-base font-black text-orange-600 dark:text-orange-400">₹{totalDue.toLocaleString()}</p>
              </div>
            </button>
            <button onClick={() => navigate('/customers')} className="flex items-center gap-3 p-4 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 hover:ring-2 hover:ring-blue-400 transition-all active:scale-[0.97]">
              <CreditCard className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              <div className="text-left">
                <p className="text-xs font-semibold text-muted-foreground">Payments Received</p>
                <p className="text-base font-black text-blue-600 dark:text-blue-400">₹{totalPaymentsReceived.toLocaleString()}</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">🔥 Top 10 Products</CardTitle></CardHeader>
          <CardContent>
            {topProducts.length === 0 ? <p className="text-sm text-muted-foreground py-6 text-center">No data yet</p> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={topProducts}>
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-35} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="qty" fill="hsl(174, 60%, 38%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">📉 Least Selling</CardTitle></CardHeader>
          <CardContent>
            {leastProducts.length === 0 ? <p className="text-sm text-muted-foreground py-6 text-center">No data yet</p> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={leastProducts}>
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-35} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="qty" fill="hsl(0, 70%, 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">👑 Top Customers (Visits)</CardTitle></CardHeader>
          <CardContent>
            {topCustomersByVisits.length === 0 ? <p className="text-sm text-muted-foreground py-6 text-center">No data</p> : (
              <div className="space-y-2">
                {topCustomersByVisits.map((c, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-border last:border-0 text-sm">
                    <span className="font-bold">{i + 1}. {c.name}</span>
                    <div className="flex gap-3">
                      <span className="text-primary font-bold">{c.visits} visits</span>
                      <span className="text-muted-foreground">₹{c.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">💰 Top Customers (Revenue)</CardTitle></CardHeader>
          <CardContent>
            {topCustomersByRevenue.length === 0 ? <p className="text-sm text-muted-foreground py-6 text-center">No data</p> : (
              <div className="space-y-2">
                {topCustomersByRevenue.map((c, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-border last:border-0 text-sm">
                    <span className="font-bold">{i + 1}. {c.name}</span>
                    <div className="flex gap-3">
                      <span className="text-emerald-600 dark:text-emerald-400 font-black">₹{c.total.toLocaleString()}</span>
                      <span className="text-muted-foreground">{c.visits}x</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Expense Pie */}
      {expenseByCategory.length > 0 && (
        <Card className="mb-5">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">💸 Expenses by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
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
        <Card className="mb-5">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">⚠️ Low Stock Alert</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockProducts.map(p => (
                <div key={p.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    {p.image && <img src={p.image} alt="" className="h-8 w-8 rounded-lg object-cover" />}
                    <span className="text-sm font-bold">{p.itemName}</span>
                  </div>
                  <span className={`text-sm font-black ${p.stock === 0 ? 'text-red-500' : 'text-orange-500'}`}>
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
