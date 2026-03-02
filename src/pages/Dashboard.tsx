import { useShop } from '@/contexts/ShopContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, UserCheck, Receipt, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

export default function Dashboard() {
  const { customers, sellers, products, sales, expenses, purchases } = useShop();

  const totalSales = sales.reduce((s, x) => s + x.totalBill, 0);
  const totalExpenses = expenses.reduce((s, x) => s + x.amount, 0);
  const totalDue = customers.reduce((s, c) => s + c.dueAmount, 0);

  const stats = [
    { label: 'Total Sales', value: `₹${totalSales.toLocaleString()}`, icon: TrendingUp, color: 'text-accent-foreground' },
    { label: 'Total Expenses', value: `₹${totalExpenses.toLocaleString()}`, icon: TrendingDown, color: 'text-destructive' },
    { label: 'Total Customers', value: customers.length, icon: Users, color: 'text-accent-foreground' },
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-accent-foreground' },
    { label: 'Total Sellers', value: sellers.length, icon: UserCheck, color: 'text-accent-foreground' },
    { label: 'Balance Due', value: `₹${totalDue.toLocaleString()}`, icon: AlertCircle, color: 'text-destructive' },
  ];

  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; qty: number }> = {};
    sales.forEach(s => s.items.forEach(i => {
      if (!map[i.productId]) map[i.productId] = { name: i.productName, qty: 0 };
      map[i.productId].qty += i.quantity;
    }));
    return Object.values(map).sort((a, b) => b.qty - a.qty).slice(0, 10);
  }, [sales]);

  const topCustomers = useMemo(() => {
    const map: Record<string, { name: string; total: number }> = {};
    sales.forEach(s => {
      if (!map[s.customerId]) map[s.customerId] = { name: s.customerName, total: 0 };
      map[s.customerId].total += s.totalBill;
    });
    return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 10);
  }, [sales]);

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      <p className="page-subtitle">Your business at a glance</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
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

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No sales data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={topProducts}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
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
            <CardTitle className="text-base">Top Customers</CardTitle>
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
      </div>
    </div>
  );
}
