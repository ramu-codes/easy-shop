import { useState, useMemo } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp } from 'lucide-react';

export default function DailyIncome() {
  const { sales } = useShop();
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  const dailyData = useMemo(() => {
    const map: Record<string, number> = {};
    sales.forEach(s => { map[s.date] = (map[s.date] || 0) + s.totalBill; });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [sales]);

  const filtered = filterDate ? dailyData.filter(([d]) => d === filterDate) : dailyData;
  const total = filtered.reduce((s, [, v]) => s + v, 0);

  return (
    <div>
      <h2 className="page-title">Daily Income</h2>
      <p className="page-subtitle">Date-wise sales income</p>

      <div className="mb-4">
        <Label>Filter by Date</Label>
        <Input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="h-12 mt-1 max-w-xs" />
      </div>

      <div className="stat-card mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent-foreground" />
          <span className="text-sm text-muted-foreground">Total Income</span>
        </div>
        <p className="text-2xl font-bold mt-1">₹{total.toLocaleString()}</p>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center py-10 text-muted-foreground">No income data for this date</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(([date, amount]) => (
            <div key={date} className="stat-card flex justify-between items-center">
              <span className="font-medium">{date}</span>
              <span className="font-bold text-accent-foreground">₹{amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
