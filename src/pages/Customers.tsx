import { useState } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

export default function Customers() {
  const { customers, sales, addCustomer, updateCustomer, deleteCustomer } = useShop();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', location: '', dueAmount: 0 });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const reset = () => { setForm({ name: '', phone: '', location: '', dueAmount: 0 }); setEditId(null); };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Enter customer name'); return; }
    if (editId) { updateCustomer(editId, form); toast.success('Updated'); }
    else { addCustomer(form); toast.success('Added'); }
    reset(); setOpen(false);
  };

  const handleEdit = (c: typeof customers[0]) => {
    setForm({ name: c.name, phone: c.phone || '', location: c.location, dueAmount: c.dueAmount });
    setEditId(c.id); setOpen(true);
  };

  const getCustomerHistory = (customerId: string) => {
    return sales.filter(s => s.customerId === customerId).sort((a, b) => b.date.localeCompare(a.date));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="page-title">Customers</h2>
          <p className="page-subtitle mb-0">Total: {customers.length}</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
          <DialogTrigger asChild><Button className="big-button"><Plus className="h-5 w-5 mr-2" />Add</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Customer</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-12 mt-1" /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="h-12 mt-1" placeholder="Phone number" /></div>
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
          <p>No customers yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {customers.map(c => {
            const history = getCustomerHistory(c.id);
            const isExpanded = expandedId === c.id;
            return (
              <div key={c.id} className="stat-card">
                <div className="flex items-center justify-between">
                  <div className="flex-1" onClick={() => setExpandedId(isExpanded ? null : c.id)}>
                    <p className="font-semibold text-foreground">{c.name}</p>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      {c.phone && <span>📞 {c.phone}</span>}
                      {c.location && <span>📍 {c.location}</span>}
                    </div>
                    {c.dueAmount > 0 && <p className="text-sm text-destructive font-medium mt-1">Due: ₹{c.dueAmount.toLocaleString()}</p>}
                    <p className="text-xs text-muted-foreground mt-1">{history.length} orders</p>
                  </div>
                  <div className="flex gap-1 items-center">
                    <Button variant="ghost" size="icon" onClick={() => setExpandedId(isExpanded ? null : c.id)}>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(c)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { deleteCustomer(c.id); toast.success('Deleted'); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
                {/* Purchase History */}
                {isExpanded && history.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">Purchase History</p>
                    {history.slice(0, 10).map(s => (
                      <div key={s.id} className="flex justify-between items-center text-sm py-1">
                        <div>
                          <span className="font-medium">{s.invoiceNo}</span>
                          <span className="text-muted-foreground ml-2">{s.items.length} items</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">₹{s.totalBill.toLocaleString()}</span>
                          <span className={`ml-2 text-xs ${s.paymentMode === 'Cash' ? 'text-green-600' : s.paymentMode === 'Online' ? 'text-blue-600' : 'text-orange-500'}`}>{s.paymentMode}</span>
                          <span className="text-xs text-muted-foreground ml-2">{s.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
