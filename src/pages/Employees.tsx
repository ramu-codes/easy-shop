import { useState, useMemo } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, UserCheck, Edit2, Trash2, Calendar, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

export default function Employees() {
  const { employees, attendance, salaryPayments, addEmployee, updateEmployee, deleteEmployee, markAttendance, addSalaryPayment } = useShop();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', role: '', salary: 0, joinDate: new Date().toISOString().split('T')[0] });
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [salaryOpen, setSalaryOpen] = useState(false);
  const [salaryForm, setSalaryForm] = useState({ employeeId: '', amount: 0, month: new Date().toISOString().slice(0, 7), date: new Date().toISOString().split('T')[0], note: '' });

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Enter employee name'); return; }
    if (editId) {
      updateEmployee(editId, form);
      toast.success('Employee updated');
    } else {
      addEmployee(form);
      toast.success('Employee added');
    }
    setForm({ name: '', phone: '', role: '', salary: 0, joinDate: new Date().toISOString().split('T')[0] });
    setEditId(null);
    setOpen(false);
  };

  const startEdit = (e: typeof employees[0]) => {
    setEditId(e.id);
    setForm({ name: e.name, phone: e.phone, role: e.role, salary: e.salary, joinDate: e.joinDate });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteEmployee(id);
    toast.success('Employee deleted');
  };

  const getAttendanceForDate = (empId: string, date: string) => {
    return attendance.find(a => a.employeeId === empId && a.date === date);
  };

  const handleMarkAttendance = (empId: string, status: 'Present' | 'Absent' | 'Half Day') => {
    markAttendance({ employeeId: empId, date: attDate, status });
    toast.success(`Marked ${status}`);
  };

  const handlePaySalary = () => {
    const emp = employees.find(e => e.id === salaryForm.employeeId);
    if (!emp) { toast.error('Select employee'); return; }
    addSalaryPayment({ ...salaryForm, employeeName: emp.name });
    toast.success('Salary paid');
    setSalaryForm({ employeeId: '', amount: 0, month: new Date().toISOString().slice(0, 7), date: new Date().toISOString().split('T')[0], note: '' });
    setSalaryOpen(false);
  };

  const monthlySummary = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return employees.map(emp => {
      const monthAtt = attendance.filter(a => a.employeeId === emp.id && a.date.startsWith(currentMonth));
      const present = monthAtt.filter(a => a.status === 'Present').length;
      const absent = monthAtt.filter(a => a.status === 'Absent').length;
      const halfDay = monthAtt.filter(a => a.status === 'Half Day').length;
      const paid = salaryPayments.filter(p => p.employeeId === emp.id && p.month === currentMonth).reduce((s, p) => s + p.amount, 0);
      return { ...emp, present, absent, halfDay, paid };
    });
  }, [employees, attendance, salaryPayments]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="page-title">Employees</h2>
          <p className="page-subtitle mb-0">Manage staff, attendance & salary</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={salaryOpen} onOpenChange={setSalaryOpen}>
            <DialogTrigger asChild><Button variant="outline" className="big-button"><IndianRupee className="h-5 w-5 mr-2" />Pay Salary</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Pay Salary</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <Label>Employee</Label>
                  <Select value={salaryForm.employeeId} onValueChange={v => {
                    const emp = employees.find(e => e.id === v);
                    setSalaryForm({ ...salaryForm, employeeId: v, amount: emp?.salary || 0 });
                  }}>
                    <SelectTrigger className="h-12 mt-1"><SelectValue placeholder="Select employee" /></SelectTrigger>
                    <SelectContent>{employees.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Amount (₹)</Label><Input type="number" value={salaryForm.amount} onChange={e => setSalaryForm({ ...salaryForm, amount: +e.target.value })} className="h-12 mt-1" /></div>
                <div><Label>Month</Label><Input type="month" value={salaryForm.month} onChange={e => setSalaryForm({ ...salaryForm, month: e.target.value })} className="h-12 mt-1" /></div>
                <div><Label>Payment Date</Label><Input type="date" value={salaryForm.date} onChange={e => setSalaryForm({ ...salaryForm, date: e.target.value })} className="h-12 mt-1" /></div>
                <div><Label>Note</Label><Input value={salaryForm.note} onChange={e => setSalaryForm({ ...salaryForm, note: e.target.value })} className="h-12 mt-1" placeholder="Optional note" /></div>
                <Button onClick={handlePaySalary} className="w-full big-button">Pay Salary</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditId(null); setForm({ name: '', phone: '', role: '', salary: 0, joinDate: new Date().toISOString().split('T')[0] }); } }}>
            <DialogTrigger asChild><Button className="big-button"><Plus className="h-5 w-5 mr-2" />Add</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Employee</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-12 mt-1" /></div>
                <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="h-12 mt-1" /></div>
                <div><Label>Role</Label><Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="h-12 mt-1" placeholder="e.g. Cashier, Helper" /></div>
                <div><Label>Monthly Salary (₹)</Label><Input type="number" value={form.salary} onChange={e => setForm({ ...form, salary: +e.target.value })} className="h-12 mt-1" /></div>
                <div><Label>Join Date</Label><Input type="date" value={form.joinDate} onChange={e => setForm({ ...form, joinDate: e.target.value })} className="h-12 mt-1" /></div>
                <Button onClick={handleSave} className="w-full big-button">{editId ? 'Update' : 'Add'} Employee</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="stat-card mb-4 flex items-center gap-3">
        <UserCheck className="h-6 w-6 text-accent-foreground" />
        <div>
          <p className="text-sm text-muted-foreground">Total Employees</p>
          <p className="text-2xl font-bold">{employees.length}</p>
        </div>
      </div>

      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Employee List</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="salary">Salary History</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {employees.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground">No employees yet</p>
          ) : (
            <div className="space-y-3">
              {monthlySummary.map(e => (
                <div key={e.id} className="stat-card">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-foreground">{e.name}</p>
                      <p className="text-sm text-muted-foreground">{e.role} • {e.phone}</p>
                      <p className="text-xs text-muted-foreground mt-1">Salary: ₹{e.salary.toLocaleString()} • Joined: {e.joinDate}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(e)}><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="text-green-600 font-medium">Present: {e.present}</span>
                    <span className="text-red-500 font-medium">Absent: {e.absent}</span>
                    <span className="text-yellow-600 font-medium">Half Day: {e.halfDay}</span>
                    <span className="text-muted-foreground">Paid: ₹{e.paid.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="attendance">
          <div className="mb-4">
            <Label>Date</Label>
            <Input type="date" value={attDate} onChange={e => setAttDate(e.target.value)} className="h-12 mt-1 max-w-xs" />
          </div>
          {employees.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground">No employees yet</p>
          ) : (
            <div className="space-y-3">
              {employees.map(emp => {
                const att = getAttendanceForDate(emp.id, attDate);
                return (
                  <div key={emp.id} className="stat-card flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{emp.name}</p>
                      <p className="text-sm text-muted-foreground">{emp.role}</p>
                    </div>
                    <div className="flex gap-2">
                      {(['Present', 'Half Day', 'Absent'] as const).map(status => (
                        <Button
                          key={status}
                          size="sm"
                          variant={att?.status === status ? 'default' : 'outline'}
                          className={att?.status === status ? (status === 'Present' ? 'bg-green-600 hover:bg-green-700' : status === 'Absent' ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600') : ''}
                          onClick={() => handleMarkAttendance(emp.id, status)}
                        >
                          {status === 'Half Day' ? '½' : status.charAt(0)}
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="salary">
          {salaryPayments.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground">No salary payments yet</p>
          ) : (
            <div className="space-y-3">
              {[...salaryPayments].reverse().map(p => (
                <div key={p.id} className="stat-card flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{p.employeeName}</p>
                    <p className="text-sm text-muted-foreground">{p.month} • {p.date}</p>
                    {p.note && <p className="text-xs text-muted-foreground">{p.note}</p>}
                  </div>
                  <span className="font-bold text-accent-foreground">₹{p.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
