import { useShop } from '@/contexts/ShopContext';
import { Clock } from 'lucide-react';

export default function BalanceDue() {
  const { customers } = useShop();
  const dueCustomers = customers.filter(c => c.dueAmount > 0);
  const totalDue = dueCustomers.reduce((s, c) => s + c.dueAmount, 0);

  return (
    <div>
      <h2 className="page-title">Balance Due</h2>
      <p className="page-subtitle">Pending payments from customers</p>

      <div className="stat-card mb-6">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-destructive" />
          <span className="text-sm text-muted-foreground">Total Pending</span>
        </div>
        <p className="text-2xl font-bold mt-1 text-destructive">₹{totalDue.toLocaleString()}</p>
      </div>

      {dueCustomers.length === 0 ? (
        <p className="text-center py-10 text-muted-foreground">No pending dues! 🎉</p>
      ) : (
        <div className="space-y-3">
          {dueCustomers.sort((a, b) => b.dueAmount - a.dueAmount).map(c => (
            <div key={c.id} className="stat-card flex justify-between items-center">
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-muted-foreground">{c.location}</p>
              </div>
              <span className="font-bold text-destructive">₹{c.dueAmount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
