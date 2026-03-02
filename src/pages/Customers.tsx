import { useState } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useShop();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', location: '', dueAmount: 0 });

  const reset = () => { setForm({ name: '', location: '', dueAmount: 0 }); setEditId(null); };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Enter customer name'); return; }
    if (editId) {
      updateCustomer(editId, form);
      toast.success('Customer updated');
    } else {
      addCustomer(form);
      toast.success('Customer added');
    }
    reset(); setOpen(false);
  };

  const handleEdit = (c: typeof customers[0]) => {
    setForm({ name: c.name, location: c.location, dueAmount: c.dueAmount });
    setEditId(c.id); setOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteCustomer(id);
    toast.success('Customer deleted');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="page-title">Customers</h2>
          <p className="page-subtitle mb-0">Total: {customers.length}</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
          <DialogTrigger asChild>
            <Button className="big-button"><Plus className="h-5 w-5 mr-2" />Add</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Customer</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-12 mt-1" /></div>
              <div><Label>Location</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="h-12 mt-1" /></div>
              <div><Label>Due Amount (₹)</Label><Input type="number" value={form.dueAmount} onChange={e => setForm({ ...form, dueAmount: +e.target.value })} className="h-12 mt-1" /></div>
              <Button onClick={handleSave} className="w-full big-button">{editId ? 'Update' : 'Add'} Customer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>No customers yet. Add your first customer!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {customers.map(c => (
            <div key={c.id} className="stat-card flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{c.name}</p>
                <p className="text-sm text-muted-foreground">{c.location}</p>
                {c.dueAmount > 0 && <p className="text-sm text-destructive font-medium mt-1">Due: ₹{c.dueAmount.toLocaleString()}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(c)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
