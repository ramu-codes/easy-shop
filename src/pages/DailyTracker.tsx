import { useState, useMemo } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, TrendingUp, TrendingDown, Pencil, Trash2, Calculator } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = ['Sales', 'Shop Expense', 'Personal', 'Transport', 'Food', 'Supplier Payment', 'Rent', 'Utility', 'Other'];

export default function DailyTracker() {
  const { dailyEntries, addDailyEntry, updateDailyEntry, deleteDailyEntry } = useShop();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    type: 'revenue' as 'revenue' | 'expenditure',
    title: '', amount: 0, category: 'Other',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
  });
  const [viewTab, setViewTab] = useState('daily');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  const reset = () => {
    setForm({ type: 'revenue', title: '', amount: 0, category: 'Other', date: new Date().toISOString().split('T')[0], time: new Date().toTimeString().slice(0, 5) });
    setEditId(null);
  };

  const handleSave = () => {
    if (!form.title.trim()) { toast.error('Enter title'); return; }
    if (form.amount <= 0) { toast.error('Enter valid amount'); return; }
    if (editId) { updateDailyEntry(editId, form); toast.success('Updated'); }
    else { addDailyEntry(form); toast.success('Entry added'); }
    reset(); setOpen(false);
  };

  const handleEdit = (e: typeof dailyEntries[0]) => {
    setForm({ type: e.type, title: e.title, amount: e.amount, category: e.category, date: e.date, time: e.time });
    setEditId(e.id); setOpen(true);
  };

  // Daily summary
  const dailySummary = useMemo(() => {
    const entries = dailyEntries.filter(e => e.date === filterDate);
    const revenue = entries.filter(e => e.type === 'revenue').reduce((s, e) => s + e.amount, 0);
    const expenditure = entries.filter(e => e.type === 'expenditure').reduce((s, e) => s + e.amount, 0);
    return { entries: entries.sort((a, b) => b.time.localeCompare(a.time)), revenue, expenditure, net: revenue - expenditure };
  }, [dailyEntries, filterDate]);

  // Weekly summary
  const weeklySummary = useMemo(() => {
    const today = new Date(filterDate);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const days: { date: string; revenue: number; expenditure: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const ds = d.toISOString().split('T')[0];
      const dayEntries = dailyEntries.filter(e => e.date === ds);
      days.push({
        date: ds,
        revenue: dayEntries.filter(e => e.type === 'revenue').reduce((s, e) => s + e.amount, 0),
        expenditure: dayEntries.filter(e => e.type === 'expenditure').reduce((s, e) => s + e.amount, 0),
      });
    }
    const totalRev = days.reduce((s, d) => s + d.revenue, 0);
    const totalExp = days.reduce((s, d) => s + d.expenditure, 0);
    return { days, totalRev, totalExp, net: totalRev - totalExp };
  }, [dailyEntries, filterDate]);

  // Monthly summary
  const monthlySummary = useMemo(() => {
    const month = filterDate.slice(0, 7);
    const entries = dailyEntries.filter(e => e.date.startsWith(month));
    const revenue = entries.filter(e => e.type === 'revenue').reduce((s, e) => s + e.amount, 0);
    const expenditure = entries.filter(e => e.type === 'expenditure').reduce((s, e) => s + e.amount, 0);

    // Category breakdown
    const catMap: Record<string, { rev: number; exp: number }> = {};
    entries.forEach(e => {
      if (!catMap[e.category]) catMap[e.category] = { rev: 0, exp: 0 };
      if (e.type === 'revenue') catMap[e.category].rev += e.amount;
      else catMap[e.category].exp += e.amount;
    });

    return { revenue, expenditure, net: revenue - expenditure, categories: Object.entries(catMap) };
  }, [dailyEntries, filterDate]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="page-title">Daily Tracker</h2>
          <p className="page-subtitle mb-0">Track daily revenue & expenses</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
          <DialogTrigger asChild><Button className="big-button"><Plus className="h-5 w-5 mr-2" />Add Entry</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Entry</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Type</Label>
                <Select value={form.type} onValueChange={v => setForm({ ...form, type: v as any })}>
                  <SelectTrigger className="h-12 mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">💰 Revenue</SelectItem>
                    <SelectItem value="expenditure">💸 Expenditure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="h-12 mt-1" placeholder="e.g. Shop sale, Tea expense" /></div>
              <div><Label>Amount (₹)</Label><Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: +e.target.value })} className="h-12 mt-1" /></div>
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger className="h-12 mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="h-12 mt-1" /></div>
                <div><Label>Time</Label><Input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="h-12 mt-1" /></div>
              </div>
              <Button onClick={handleSave} className="w-full big-button">{editId ? 'Update' : 'Add'} Entry</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Date Filter */}
      <div className="mb-4">
        <Input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="h-12 max-w-xs" />
      </div>

      <Tabs value={viewTab} onValueChange={setViewTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        {/* Daily View */}
        <TabsContent value="daily">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Card className="border-green-200">
              <CardContent className="pt-4 pb-3 text-center">
                <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-600" />
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="text-lg font-bold text-green-600">₹{dailySummary.revenue.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border-red-200">
              <CardContent className="pt-4 pb-3 text-center">
                <TrendingDown className="h-5 w-5 mx-auto mb-1 text-destructive" />
                <p className="text-xs text-muted-foreground">Expenditure</p>
                <p className="text-lg font-bold text-destructive">₹{dailySummary.expenditure.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className={dailySummary.net >= 0 ? 'border-green-200' : 'border-red-200'}>
              <CardContent className="pt-4 pb-3 text-center">
                <Calculator className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Net</p>
                <p className={`text-lg font-bold ${dailySummary.net >= 0 ? 'text-green-600' : 'text-destructive'}`}>₹{dailySummary.net.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          {dailySummary.entries.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground">No entries for {filterDate}</p>
          ) : (
            <div className="space-y-2">
              {dailySummary.entries.map(e => (
                <div key={e.id} className="stat-card flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${e.type === 'revenue' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-destructive'}`}>
                      {e.type === 'revenue' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{e.title}</p>
                      <p className="text-xs text-muted-foreground">{e.time} • {e.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${e.type === 'revenue' ? 'text-green-600' : 'text-destructive'}`}>
                      {e.type === 'revenue' ? '+' : '-'}₹{e.amount.toLocaleString()}
                    </span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(e)}><Pencil className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { deleteDailyEntry(e.id); toast.success('Deleted'); }}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Weekly View */}
        <TabsContent value="weekly">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Card className="border-green-200">
              <CardContent className="pt-4 pb-3 text-center">
                <p className="text-xs text-muted-foreground">Weekly Revenue</p>
                <p className="text-lg font-bold text-green-600">₹{weeklySummary.totalRev.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border-red-200">
              <CardContent className="pt-4 pb-3 text-center">
                <p className="text-xs text-muted-foreground">Weekly Expense</p>
                <p className="text-lg font-bold text-destructive">₹{weeklySummary.totalExp.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className={weeklySummary.net >= 0 ? 'border-green-200' : 'border-red-200'}>
              <CardContent className="pt-4 pb-3 text-center">
                <p className="text-xs text-muted-foreground">Net</p>
                <p className={`text-lg font-bold ${weeklySummary.net >= 0 ? 'text-green-600' : 'text-destructive'}`}>₹{weeklySummary.net.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            {weeklySummary.days.map(d => (
              <div key={d.date} className="stat-card flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600 font-medium">+₹{d.revenue.toLocaleString()}</span>
                  <span className="text-destructive font-medium">-₹{d.expenditure.toLocaleString()}</span>
                  <span className={`font-bold ${d.revenue - d.expenditure >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                    ₹{(d.revenue - d.expenditure).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Monthly View */}
        <TabsContent value="monthly">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Card className="border-green-200">
              <CardContent className="pt-4 pb-3 text-center">
                <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                <p className="text-lg font-bold text-green-600">₹{monthlySummary.revenue.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border-red-200">
              <CardContent className="pt-4 pb-3 text-center">
                <p className="text-xs text-muted-foreground">Monthly Expense</p>
                <p className="text-lg font-bold text-destructive">₹{monthlySummary.expenditure.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className={monthlySummary.net >= 0 ? 'border-green-200' : 'border-red-200'}>
              <CardContent className="pt-4 pb-3 text-center">
                <p className="text-xs text-muted-foreground">Net Profit</p>
                <p className={`text-lg font-bold ${monthlySummary.net >= 0 ? 'text-green-600' : 'text-destructive'}`}>₹{monthlySummary.net.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          {monthlySummary.categories.length > 0 && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Category Breakdown</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {monthlySummary.categories.map(([cat, data]) => (
                    <div key={cat} className="flex justify-between items-center py-1.5 border-b border-border last:border-0">
                      <span className="text-sm font-medium">{cat}</span>
                      <div className="flex gap-3 text-xs">
                        {data.rev > 0 && <span className="text-green-600">+₹{data.rev.toLocaleString()}</span>}
                        {data.exp > 0 && <span className="text-destructive">-₹{data.exp.toLocaleString()}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
