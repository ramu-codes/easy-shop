import { useShop } from '@/contexts/ShopContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, UserCheck, TrendingUp, TrendingDown, AlertCircle, ShoppingCart, Wallet, UserCheck2, Eye, EyeOff, Store } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

const COLORS = ['hsl(174, 60%, 38%)', 'hsl(35, 90%, 55%)', 'hsl(210, 70%, 55%)', 'hsl(0, 70%, 50%)', 'hsl(145, 60%, 42%)'];

export default function Dashboard() {
  const { customers, sellers, products, sales, expenses, purchases, employees, salaryPayments, shopName } = useShop();
  const [showAdmin, setShowAdmin] = useState(false);

  const totalSales = sales.reduce((s, x) => s + x.totalBill, 0);
  const totalExpenses = expenses.reduce((s, x) => s + x.amount, 0);
  const totalPurchases = purchases.reduce((s, x) => s + x.totalAmount, 0);
  const totalDue = customers.reduce((s, c) => s + c.dueAmount, 0);
  const totalSalaryPaid = salaryPayments.reduce((s, p) => s + p.amount, 0);
  const totalInvestment = totalPurchases + totalExpenses + totalSalaryPaid;
  const profit = totalSales - totalInvestment;

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlySales = sales.filter(s => s.date.startsWith(currentMonth)).reduce((s, x) => s + x.totalBill, 0);
  const monthlyExpenses = expenses.filter(e => e.date.startsWith(currentMonth)).reduce((s, x) => s + x.amount, 0);
  const monthlyPurchases = purchases.filter(p => p.date.startsWith(currentMonth)).reduce((s, x) => s + x.totalAmount, 0);
  const monthlySalary = salaryPayments.filter(p => p.month === currentMonth).reduce((s, x) => s + x.amount, 0);
  const monthlyProfit = monthlySales - monthlyPurchases - monthlyExpenses - monthlySalary;

  const adminStats = [
    { label: 'Total Revenue', value: totalSales, icon: TrendingUp, color: 'text-accent-foreground' },
    { label: 'Total Expenses', value: totalExpenses, icon: TrendingDown, color: 'text-destructive' },
    { label: 'Total Due', value: totalDue, icon: AlertCircle, color: 'text-destructive' },
    { label: 'Total Investment', value: totalInvestment, icon: ShoppingCart, color: 'text-foreground' },
    { label: 'Net Profit', value: profit, icon: Wallet, color: profit >= 0 ? 'text-accent-foreground' : 'text-destructive' },
    { label: 'Salary Paid', value: totalSalaryPaid, icon: UserCheck2, color: 'text-foreground' },
  ];

  const quickStats = [
    { label: 'Products', value: products.length, icon: Package },
    { label: 'Customers', value: customers.length, icon: Users },
    { label: 'Sellers', value: sellers.length, icon: UserCheck },
    { label: 'Employees', value: employees.length, icon: UserCheck2 },
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

  const topCustomers = useMemo(() => {
    const map: Record<string, { name: string; total: number }> = {};
    sales.forEach(s => {
      if (!map[s.customerId]) map[s.customerId] = { name: s.customerName, total: 0 };
      map[s.customerId].total += s.totalBill;
    });
    return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 10);
  }, [sales]);

  const expenseByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(e => { map[e.category || 'Other'] = (map[e.category || 'Other'] || 0) + e.amount; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const lowStockProducts = useMemo(() => {
    return products.filter(p => p.stock <= 5).sort((a, b) => a.stock - b.stock).slice(0, 10);
  }, [products]);

  const maskValue = (val: number) => showAdmin ? `₹${val.toLocaleString()}` : '₹ • • • • •';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Store className="h-7 w-7 text-primary" />
        <div>
          <h2 className="page-title mb-0">{shopName || 'Verma Fancy Store'}</h2>
          <p className="text-xs text-muted-foreground">Dashboard Overview</p>
        </div>
      </div>

      {/* Monthly Summary */}
      <Card className="mb-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="pt-5 pb-4">
          <h3 className="font-semibold text-sm mb-3 text-foreground">📊 This Month ({new Date().toLocaleString('default', { month: 'long', year: 'numeric' })})</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div><p className="text-xs text-muted-foreground">Sales</p><p className="text-lg font-bold text-accent-foreground">₹{monthlySales.toLocaleString()}</p></div>
            <div><p className="text-xs text-muted-foreground">Purchases</p><p className="text-lg font-bold text-foreground">₹{monthlyPurchases.toLocaleString()}</p></div>
            <div><p className="text-xs text-muted-foreground">Expenses</p><p className="text-lg font-bold text-destructive">₹{monthlyExpenses.toLocaleString()}</p></div>
            <div><p className="text-xs text-muted-foreground">Salaries</p><p className="text-lg font-bold text-foreground">₹{monthlySalary.toLocaleString()}</p></div>
            <div><p className="text-xs text-muted-foreground">Profit</p><p className={`text-lg font-bold ${monthlyProfit >= 0 ? 'text-accent-foreground' : 'text-destructive'}`}>₹{monthlyProfit.toLocaleString()}</p></div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Section - Hidden by default */}
      <Card className="mb-4 border-primary/30">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base">🔒 Admin Section</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowAdmin(!showAdmin)} className="gap-2">
            {showAdmin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showAdmin ? 'Hide' : 'Show'}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {adminStats.map(s => (
              <div key={s.label} className="stat-card flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
                <span className={`text-lg font-bold ${s.color}`}>{maskValue(s.value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Counts */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {quickStats.map(s => (
          <div key={s.label} className="stat-card text-center">
            <s.icon className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">🔥 Top 10 Selling Products</CardTitle></CardHeader>
          <CardContent>
            {topProducts.length === 0 ? <p className="text-sm text-muted-foreground py-4 text-center">No sales data yet</p> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={topProducts}>
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="qty" fill="hsl(174, 60%, 38%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">📉 Least Selling Products</CardTitle></CardHeader>
          <CardContent>
            {leastProducts.length === 0 ? <p className="text-sm text-muted-foreground py-4 text-center">No sales data yet</p> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={leastProducts}>
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="qty" fill="hsl(0, 70%, 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">👑 Top 10 Customers</CardTitle></CardHeader>
          <CardContent>
            {topCustomers.length === 0 ? <p className="text-sm text-muted-foreground py-4 text-center">No data yet</p> : (
              <div className="space-y-1.5">
                {topCustomers.map((c, i) => (
                  <div key={i} className="flex justify-between items-center py-1 border-b border-border last:border-0">
                    <span className="text-sm font-medium">{i + 1}. {c.name}</span>
                    <span className="text-sm text-muted-foreground">₹{c.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">💰 Expenses by Category</CardTitle></CardHeader>
          <CardContent>
            {expenseByCategory.length === 0 ? <p className="text-sm text-muted-foreground py-4 text-center">No data yet</p> : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {expenseByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Low Stock */}
      {lowStockProducts.length > 0 && (
        <Card className="mb-4">
          <CardHeader className="pb-2"><CardTitle className="text-sm">⚠️ Low Stock Alert</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {lowStockProducts.map(p => (
                <div key={p.id} className="flex justify-between items-center py-1 border-b border-border last:border-0">
                  <div className="flex items-center gap-2">
                    {p.image && <img src={p.image} alt="" className="h-6 w-6 rounded object-cover" />}
                    <span className="text-sm font-medium">{p.itemName}</span>
                  </div>
                  <span className={`text-sm font-bold ${p.stock === 0 ? 'text-destructive' : 'text-warning'}`}>
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
