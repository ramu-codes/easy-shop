import { useState, useMemo } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit2, Trash2, IndianRupee, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Employees() {
  const { employees, attendance, salaryPayments, addEmployee, updateEmployee, deleteEmployee, markAttendance, addSalaryPayment } = useShop();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', role: '', salary: 0, joinDate: new Date().toISOString().split('T')[0] });
  const [calMonth, setCalMonth] = useState(new Date().toISOString().slice(0, 7));
  const [salaryOpen, setSalaryOpen] = useState(false);
  const [salaryForm, setSalaryForm] = useState({ employeeId: '', amount: 0, month: new Date().toISOString().slice(0, 7), date: new Date().toISOString().split('T')[0], note: '' });

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Enter name'); return; }
    if (editId) { updateEmployee(editId, form); toast.success('Updated'); }
    else { addEmployee(form); toast.success('Added'); }
    setForm({ name: '', phone: '', role: '', salary: 0, joinDate: new Date().toISOString().split('T')[0] });
    setEditId(null); setOpen(false);
  };

  const startEdit = (e: typeof employees[0]) => {
    setEditId(e.id);
    setForm({ name: e.name, phone: e.phone, role: e.role, salary: e.salary, joinDate: e.joinDate });
    setOpen(true);
  };

  const handlePaySalary = () => {
    const emp = employees.find(e => e.id === salaryForm.employeeId);
    if (!emp) { toast.error('Select employee'); return; }
    addSalaryPayment({ ...salaryForm, employeeName: emp.name });
    toast.success('Salary paid');
    setSalaryForm({ employeeId: '', amount: 0, month: new Date().toISOString().slice(0, 7), date: new Date().toISOString().split('T')[0], note: '' });
    setSalaryOpen(false);
  };

  const calendarData = useMemo(() => {
    const [year, month] = calMonth.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => ({
      date: `${calMonth}-${String(i + 1).padStart(2, '0')}`,
      day: i + 1
    }));
  }, [calMonth]);

  const getStatus = (empId: string, date: string) => {
    return attendance.find(x => x.employeeId === empId && x.date === date)?.status || null;
  };

  const statusColor = (s: string | null) => {
    if (s === 'Present') return 'bg-emerald-500 text-white';
    if (s === 'Absent') return 'bg-red-500 text-white';
    if (s === 'Half Day') return 'bg-yellow-500 text-white';
    return 'bg-muted text-muted-foreground';
  };

  const statusLabel = (s: string | null) => s === 'Present' ? 'P' : s === 'Absent' ? 'A' : s === 'Half Day' ? 'H' : '—';

  const cycleStatus = (empId: string, date: string) => {
    const current = getStatus(empId, date);
    const next = !current ? 'Present' : current === 'Present' ? 'Absent' : current === 'Absent' ? 'Half Day' : 'Present';
    markAttendance({ employeeId: empId, date, status: next as any });
  };

  const prevMonth = () => { const [y, m] = calMonth.split('-').map(Number); setCalMonth(new Date(y, m - 2, 1).toISOString().slice(0, 7)); };
  const nextMonth = () => { const [y, m] = calMonth.split('-').map(Number); setCalMonth(new Date(y, m, 1).toISOString().slice(0, 7)); };

  const monthlySummary = useMemo(() => {
    return employees.map(emp => {
      const monthAtt = attendance.filter(a => a.employeeId === emp.id && a.date.startsWith(calMonth));
      const present = monthAtt.filter(a => a.status === 'Present').length;
      const absent = monthAtt.filter(a => a.status === 'Absent').length;
      const halfDay = monthAtt.filter(a => a.status === 'Half Day').length;
      const paid = salaryPayments.filter(p => p.employeeId === emp.id && p.month === calMonth).reduce((s, p) => s + p.amount, 0);
      return { ...emp, present, absent, halfDay, paid };
    });
  }, [employees, attendance, salaryPayments, calMonth]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Employees</h2>
          <p className="text-xs text-muted-foreground">{employees.length} staff members</p>
        </div>
        <div className="flex gap-1.5">
          <Dialog open={salaryOpen} onOpenChange={setSalaryOpen}>
            <DialogTrigger asChild><Button variant="outline" size="sm" className="gap-1 text-xs"><IndianRupee className="h-3.5 w-3.5" />Pay</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Pay Salary</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
                <div>
                  <Label className="text-xs">Employee</Label>
                  <Select value={salaryForm.employeeId} onValueChange={v => {
                    const emp = employees.find(e => e.id === v);
                    setSalaryForm({ ...salaryForm, employeeId: v, amount: emp?.salary || 0 });
                  }}>
                    <SelectTrigger className="h-10 mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{employees.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs">Amount (₹)</Label><Input type="number" value={salaryForm.amount} onChange={e => setSalaryForm({ ...salaryForm, amount: +e.target.value })} className="h-10 mt-1" /></div>
                <div><Label className="text-xs">Month</Label><Input type="month" value={salaryForm.month} onChange={e => setSalaryForm({ ...salaryForm, month: e.target.value })} className="h-10 mt-1" /></div>
                <div><Label className="text-xs">Date</Label><Input type="date" value={salaryForm.date} onChange={e => setSalaryForm({ ...salaryForm, date: e.target.value })} className="h-10 mt-1" /></div>
                <div><Label className="text-xs">Note</Label><Input value={salaryForm.note} onChange={e => setSalaryForm({ ...salaryForm, note: e.target.value })} className="h-10 mt-1" placeholder="Optional" /></div>
                <Button onClick={handlePaySalary} className="w-full h-10 font-semibold">Pay Salary</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditId(null); setForm({ name: '', phone: '', role: '', salary: 0, joinDate: new Date().toISOString().split('T')[0] }); } }}>
            <DialogTrigger asChild><Button size="sm" className="gap-1 text-xs"><Plus className="h-3.5 w-3.5" />Add</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Employee</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
                <div><Label className="text-xs">Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-10 mt-1" /></div>
                <div><Label className="text-xs">Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="h-10 mt-1" /></div>
                <div><Label className="text-xs">Role</Label><Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="h-10 mt-1" placeholder="e.g. Cashier" /></div>
                <div><Label className="text-xs">Salary (₹)</Label><Input type="number" value={form.salary} onChange={e => setForm({ ...form, salary: +e.target.value })} className="h-10 mt-1" /></div>
                <div><Label className="text-xs">Join Date</Label><Input type="date" value={form.joinDate} onChange={e => setForm({ ...form, joinDate: e.target.value })} className="h-10 mt-1" /></div>
                <Button onClick={handleSave} className="w-full h-10 font-semibold">{editId ? 'Update' : 'Add'}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="grid">
        <TabsList className="mb-3">
          <TabsTrigger value="grid" className="text-xs">Attendance</TabsTrigger>
          <TabsTrigger value="list" className="text-xs">Staff</TabsTrigger>
          <TabsTrigger value="salary" className="text-xs">Salary</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
            <h3 className="font-semibold text-xs">{new Date(calMonth + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
          </div>

          {employees.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground text-xs">No employees</p>
          ) : (
            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="bg-muted">
                    <th className="sticky left-0 bg-muted px-2 py-1.5 text-left font-semibold min-w-[80px] border-r border-border">Name</th>
                    {calendarData.map(d => (
                      <th key={d.date} className="px-0.5 py-1.5 text-center font-medium min-w-[26px] border-r border-border">{d.day}</th>
                    ))}
                    <th className="px-1.5 py-1.5 text-center font-semibold min-w-[28px]">P</th>
                    <th className="px-1.5 py-1.5 text-center font-semibold min-w-[28px]">A</th>
                    <th className="px-1.5 py-1.5 text-center font-semibold min-w-[28px]">H</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlySummary.map(emp => (
                    <tr key={emp.id} className="border-t border-border hover:bg-muted/50">
                      <td className="sticky left-0 bg-card px-2 py-1 font-medium border-r border-border">
                        <div className="truncate max-w-[80px]">{emp.name}</div>
                      </td>
                      {calendarData.map(d => {
                        const status = getStatus(emp.id, d.date);
                        return (
                          <td key={d.date} className="px-0 py-0.5 text-center border-r border-border">
                            <button onClick={() => cycleStatus(emp.id, d.date)}
                              className={`w-5 h-5 rounded text-[9px] font-bold ${statusColor(status)} hover:opacity-80 transition-opacity`}>
                              {statusLabel(status)}
                            </button>
                          </td>
                        );
                      })}
                      <td className="px-1 py-1 text-center font-bold text-emerald-600">{emp.present}</td>
                      <td className="px-1 py-1 text-center font-bold text-red-500">{emp.absent}</td>
                      <td className="px-1 py-1 text-center font-bold text-yellow-600">{emp.halfDay}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex gap-3 mt-2 text-[10px]">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-emerald-500" /><span>P</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-500" /><span>A</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-yellow-500" /><span>H</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-muted border border-border" /><span>—</span></div>
          </div>
        </TabsContent>

        <TabsContent value="list">
          {employees.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground text-xs">No employees</p>
          ) : (
            <div className="space-y-2">
              {monthlySummary.map(e => (
                <div key={e.id} className="stat-card">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{e.name}</p>
                      <p className="text-xs text-muted-foreground">{e.role} • {e.phone}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">₹{e.salary.toLocaleString()}/mo • Joined: {e.joinDate}</p>
                    </div>
                    <div className="flex gap-0.5">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(e)}><Edit2 className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { deleteEmployee(e.id); toast.success('Deleted'); }}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-1.5 text-[10px]">
                    <span className="text-emerald-600 font-medium">P: {e.present}</span>
                    <span className="text-red-500 font-medium">A: {e.absent}</span>
                    <span className="text-yellow-600 font-medium">H: {e.halfDay}</span>
                    <span className="text-muted-foreground">Paid: ₹{e.paid.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="salary">
          {salaryPayments.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground text-xs">No salary payments</p>
          ) : (
            <div className="space-y-2">
              {[...salaryPayments].reverse().map(p => (
                <div key={p.id} className="stat-card flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm">{p.employeeName}</p>
                    <p className="text-xs text-muted-foreground">{p.month} • {p.date}</p>
                    {p.note && <p className="text-[10px] text-muted-foreground">{p.note}</p>}
                  </div>
                  <span className="font-bold text-sm text-accent-foreground">₹{p.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
