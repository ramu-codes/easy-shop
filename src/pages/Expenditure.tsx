import { useState } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, TrendingDown, Filter } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = ['Rent', 'Electricity', 'Salary', 'Transport', 'Packaging', 'Marketing', 'Maintenance', 'Other'];

export default function Expenditure() {
  const { expenses, addExpense } = useShop();
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount || !date) { toast.error('Fill all fields'); return; }
    addExpense({ category, amount: Number(amount), title: description, date });
    toast.success('Expense added');
    setCategory(''); setAmount(''); setDescription('');
    setShowForm(false);
  };

  const filtered = expenses.filter(e => e.date.startsWith(filterMonth)).sort((a, b) => b.date.localeCompare(a.date));
  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

  const byCategory: Record<string, number> = {};
  filtered.forEach(e => { byCategory[e.category || 'Other'] = (byCategory[e.category || 'Other'] || 0) + e.amount; });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-destructive" /> Expenditure
          </h2>
          <p className="text-xs text-muted-foreground">Track all shop expenses</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1.5">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {showForm && (
        <Card className="mb-4 border-destructive/30">
          <CardContent className="pt-4">
            <form onSubmit={handleAdd} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-1 h-10"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Amount (₹)</Label>
                  <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" className="mt-1 h-10" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Description</Label>
                <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional note" className="mt-1 h-10" />
              </div>
              <div>
                <Label className="text-xs">Date</Label>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 h-10" />
              </div>
              <Button type="submit" className="w-full h-10">Add Expense</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filter & Total */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="h-9 w-40 text-xs" />
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-lg font-bold text-destructive">₹{totalFiltered.toLocaleString()}</p>
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(byCategory).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => (
            <div key={cat} className="rounded-xl bg-destructive/5 border border-destructive/10 p-2.5 text-center">
              <p className="text-[10px] text-muted-foreground">{cat}</p>
              <p className="text-sm font-bold text-destructive">₹{amt.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No expenses this month</p>}
        {filtered.map(e => (
          <Card key={e.id} className="border-border/60">
            <CardContent className="py-3 px-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{e.category || 'Other'}</p>
                {e.title && <p className="text-xs text-muted-foreground">{e.title}</p>}
                <p className="text-[10px] text-muted-foreground mt-0.5">{e.date}</p>
              </div>
              <p className="text-base font-bold text-destructive">₹{e.amount.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
