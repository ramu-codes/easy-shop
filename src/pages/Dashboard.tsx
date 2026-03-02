import { useShop } from '@/contexts/ShopContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, UserCheck, TrendingUp, TrendingDown, AlertCircle, ShoppingCart, Wallet, UserCheck2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useMemo } from 'react';

const COLORS = ['hsl(174, 60%, 38%)', 'hsl(35, 90%, 55%)', 'hsl(210, 70%, 55%)', 'hsl(0, 70%, 50%)', 'hsl(145, 60%, 42%)'];

export default function Dashboard() {
  const { customers, sellers, products, sales, expenses, purchases, employees, salaryPayments } = useShop();

  const totalSales = sales.reduce((s, x) => s + x.totalBill, 0);
  const totalExpenses = expenses.reduce((s, x) => s + x.amount, 0);
  const totalPurchases = purchases.reduce((s, x) => s + x.totalAmount, 0);
  const totalDue = customers.reduce((s, c) => s + c.dueAmount, 0);
  const totalSalaryPaid = salaryPayments.reduce((s, p) => s + p.amount, 0);
  const profit = totalSales - totalPurchases - totalExpenses - totalSalaryPaid;

  // Monthly summary
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlySales = sales.filter(s => s.date.startsWith(currentMonth)).reduce((s, x) => s + x.totalBill, 0);
  const monthlyExpenses = expenses.filter(e => e.date.startsWith(currentMonth)).reduce((s, x) => s + x.amount, 0);
  const monthlyPurchases = purchases.filter(p => p.date.startsWith(currentMonth)).reduce((s, x) => s + x.totalAmount, 0);

  const stats = [
    { label: 'Total Sales', value: `₹${totalSales.toLocaleString()}`, icon: TrendingUp, color: 'text-accent-foreground' },
    { label: 'Total Expenses', value: `₹${totalExpenses.toLocaleString()}`, icon: TrendingDown, color: 'text-destructive' },
    { label: 'Total Purchases', value: `₹${totalPurchases.toLocaleString()}`, icon: ShoppingCart, color: 'text-accent-foreground' },
    { label: 'Net Profit', value: `₹${profit.toLocaleString()}`, icon: Wallet, color: profit >= 0 ? 'text-accent-foreground' : 'text-destructive' },
    { label: 'Balance Due', value: `₹${totalDue.toLocaleString()}`, icon: AlertCircle, color: 'text-destructive' },
    { label: 'Products', value: products.length, icon: Package, color: 'text-accent-foreground' },
    { label: 'Customers', value: customers.length, icon: Users, color: 'text-accent-foreground' },
    { label: 'Sellers', value: sellers.length, icon: UserCheck, color: 'text-accent-foreground' },
    { label: 'Employees', value: employees.length, icon: UserCheck2, color: 'text-accent-foreground' },
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

  const topSellers = useMemo(() => {
    const map: Record<string, { name: string; total: number }> = {};
    purchases.forEach(p => {
      if (!map[p.sellerId]) map[p.sellerId] = { name: p.sellerName, total: 0 };
      map[p.sellerId].total += p.totalAmount;
    });
    return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 10);
  }, [purchases]);

  const expenseByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(e => { map[e.category || 'Other'] = (map[e.category || 'Other'] || 0) + e.amount; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const lowStockProducts = useMemo(() => {
    return products.filter(p => p.stock <= 5).sort((a, b) => a.stock - b.stock).slice(0, 10);
  }, [products]);

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      <p className="page-subtitle">Your business at a glance</p>

      {/* Monthly Summary Banner */}
      <Card className="mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="pt-6 pb-4">
          <h3 className="font-semibold text-base mb-3 text-foreground">📊 This Month's Summary ({currentMonth})</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Sales</p>
              <p className="text-lg font-bold text-accent-foreground">₹{monthlySales.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Purchases</p>
              <p className="text-lg font-bold text-foreground">₹{monthlyPurchases.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Expenses</p>
              <p className="text-lg font-bold text-destructive">₹{monthlyExpenses.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className="stat-card flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
            </div>
            <span className="text-xl font-bold text-foreground">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">🔥 Top 10 Most Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No sales data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={topProducts}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="qty" fill="hsl(174, 60%, 38%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">📉 Top 10 Least Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            {leastProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No sales data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={leastProducts}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="qty" fill="hsl(0, 70%, 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">👑 Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            {topCustomers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No sales data yet</p>
            ) : (
              <div className="space-y-2">
                {topCustomers.map((c, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-border last:border-0">
                    <span className="text-sm font-medium">{c.name}</span>
                    <span className="text-sm text-muted-foreground">₹{c.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">🏪 Top Sellers</CardTitle>
          </CardHeader>
          <CardContent>
            {topSellers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No purchase data yet</p>
            ) : (
              <div className="space-y-2">
                {topSellers.map((s, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-border last:border-0">
                    <span className="text-sm font-medium">{s.name}</span>
                    <span className="text-sm text-muted-foreground">₹{s.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">💰 Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {expenseByCategory.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No expense data yet</p>
            ) : (
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

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">⚠️ Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">All products well-stocked 👍</p>
            ) : (
              <div className="space-y-2">
                {lowStockProducts.map(p => (
                  <div key={p.id} className="flex justify-between items-center py-1.5 border-b border-border last:border-0">
                    <span className="text-sm font-medium">{p.itemName}</span>
                    <span className={`text-sm font-bold ${p.stock === 0 ? 'text-destructive' : 'text-orange-500'}`}>
                      {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
