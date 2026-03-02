import { useState } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export default function PayBalance() {
  const { customers, payments, addPayment } = useShop();
  const [form, setForm] = useState({ customerId: '', amount: 0, date: new Date().toISOString().split('T')[0] });

  const dueCustomers = customers.filter(c => c.dueAmount > 0);
  const selected = customers.find(c => c.id === form.customerId);

  const handlePay = () => {
    if (!form.customerId) { toast.error('Select customer'); return; }
    if (form.amount <= 0) { toast.error('Enter amount'); return; }
    addPayment({ customerId: form.customerId, customerName: selected?.name || '', amount: form.amount, date: form.date });
    toast.success('Payment recorded!');
    setForm({ customerId: '', amount: 0, date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div>
      <h2 className="page-title">Pay Balance</h2>
      <p className="page-subtitle">Record payments from customers</p>

      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">Record Payment</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Customer</Label>
            <Select value={form.customerId} onValueChange={v => setForm({ ...form, customerId: v })}>
              <SelectTrigger className="h-12 mt-1"><SelectValue placeholder="Select customer with due" /></SelectTrigger>
              <SelectContent>{dueCustomers.map(c => <SelectItem key={c.id} value={c.id}>{c.name} (Due: ₹{c.dueAmount})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {selected && (
            <div className="p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Current Due: </span>
              <span className="font-bold text-destructive">₹{selected.dueAmount.toLocaleString()}</span>
            </div>
          )}
          <div><Label>Amount (₹)</Label><Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: +e.target.value })} className="h-12 mt-1" /></div>
          <div><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="h-12 mt-1" /></div>
          <Button onClick={handlePay} className="w-full big-button">Record Payment</Button>
        </CardContent>
      </Card>

      <h3 className="text-lg font-semibold mb-3">Payment History</h3>
      {payments.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <CreditCard className="h-10 w-10 mx-auto mb-2 opacity-40" /><p>No payments recorded yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...payments].reverse().map(p => (
            <div key={p.id} className="stat-card flex justify-between items-center">
              <div>
                <p className="font-semibold">{p.customerName}</p>
                <p className="text-sm text-muted-foreground">{p.date}</p>
              </div>
              <span className="font-bold text-accent-foreground">₹{p.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
