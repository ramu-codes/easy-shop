import { useState } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function Sellers() {
  const { sellers, addSeller, updateSeller, deleteSeller } = useShop();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', location: '' });

  const reset = () => { setForm({ name: '', location: '' }); setEditId(null); };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Enter seller name'); return; }
    if (editId) { updateSeller(editId, form); toast.success('Updated'); }
    else { addSeller(form); toast.success('Seller added'); }
    reset(); setOpen(false);
  };

  const handleEdit = (s: typeof sellers[0]) => {
    setForm({ name: s.name, location: s.location }); setEditId(s.id); setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="page-title">Sellers</h2>
          <p className="page-subtitle mb-0">Total: {sellers.length}</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
          <DialogTrigger asChild><Button className="big-button"><Plus className="h-5 w-5 mr-2" />Add</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Seller</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-12 mt-1" /></div>
              <div><Label>Location</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="h-12 mt-1" /></div>
              <Button onClick={handleSave} className="w-full big-button">{editId ? 'Update' : 'Add'} Seller</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {sellers.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <UserCheck className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>No sellers yet. Add your first seller!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sellers.map(s => (
            <div key={s.id} className="stat-card flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{s.name}</p>
                <p className="text-sm text-muted-foreground">{s.location}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(s)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" onClick={() => deleteSeller(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
