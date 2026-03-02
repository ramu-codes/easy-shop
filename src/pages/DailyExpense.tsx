import { useState } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

const categories = ['Rent', 'Electricity', 'Salary', 'Transport', 'Supplies', 'Other'];

export default function DailyExpense() {
  const { expenses, addExpense } = useShop();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', amount: 0, date: new Date().toISOString().split('T')[0], category: '' });
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAdd = () => {
    if (!form.title.trim()) { toast.error('Enter expense title'); return; }
    addExpense(form);
    toast.success('Expense added');
    setForm({ title: '', amount: 0, date: new Date().toISOString().split('T')[0], category: '' });
    setOpen(false);
  };

  const filtered = filterDate ? expenses.filter(e => e.date === filterDate) : expenses;
  const total = filtered.reduce((s, e) => s + e.amount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="page-title">Daily Expense</h2>
          <p className="page-subtitle mb-0">Track your daily expenses</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="big-button"><Plus className="h-5 w-5 mr-2" />Add</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="h-12 mt-1" /></div>
              <div><Label>Amount (₹)</Label><Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: +e.target.value })} className="h-12 mt-1" /></div>
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger className="h-12 mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="h-12 mt-1" /></div>
              <Button onClick={handleAdd} className="w-full big-button">Add Expense</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Label>Filter by Date</Label>
        <Input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="h-12 mt-1 max-w-xs" />
      </div>

      <div className="stat-card mb-4">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-destructive" />
          <span className="text-sm text-muted-foreground">Total Expenses</span>
        </div>
        <p className="text-2xl font-bold mt-1">₹{total.toLocaleString()}</p>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center py-10 text-muted-foreground">No expenses for this date</p>
      ) : (
        <div className="space-y-3">
          {[...filtered].reverse().map(e => (
            <div key={e.id} className="stat-card flex justify-between items-center">
              <div>
                <p className="font-semibold">{e.title}</p>
                <p className="text-sm text-muted-foreground">{e.category} • {e.date}</p>
              </div>
              <span className="font-bold text-destructive">₹{e.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
