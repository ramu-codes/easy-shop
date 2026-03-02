import { useState } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useShop();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ itemName: '', printPrice: 0, purchasePrice: 0, sellPrice: 0 });

  const reset = () => { setForm({ itemName: '', printPrice: 0, purchasePrice: 0, sellPrice: 0 }); setEditId(null); };

  const handleSave = () => {
    if (!form.itemName.trim()) { toast.error('Enter product name'); return; }
    if (editId) { updateProduct(editId, form); toast.success('Updated'); }
    else { addProduct(form); toast.success('Product added'); }
    reset(); setOpen(false);
  };

  const handleEdit = (p: typeof products[0]) => {
    setForm({ itemName: p.itemName, printPrice: p.printPrice, purchasePrice: p.purchasePrice, sellPrice: p.sellPrice });
    setEditId(p.id); setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="page-title">Products</h2>
          <p className="page-subtitle mb-0">Total: {products.length}</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
          <DialogTrigger asChild><Button className="big-button"><Plus className="h-5 w-5 mr-2" />Add</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Product</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Item Name</Label><Input value={form.itemName} onChange={e => setForm({ ...form, itemName: e.target.value })} className="h-12 mt-1" /></div>
              <div><Label>Print Price / MRP (₹)</Label><Input type="number" value={form.printPrice} onChange={e => setForm({ ...form, printPrice: +e.target.value })} className="h-12 mt-1" /></div>
              <div><Label>Purchase Price (₹)</Label><Input type="number" value={form.purchasePrice} onChange={e => setForm({ ...form, purchasePrice: +e.target.value })} className="h-12 mt-1" /></div>
              <div><Label>Sell Price (₹)</Label><Input type="number" value={form.sellPrice} onChange={e => setForm({ ...form, sellPrice: +e.target.value })} className="h-12 mt-1" /></div>
              <Button onClick={handleSave} className="w-full big-button">{editId ? 'Update' : 'Add'} Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>No products yet. Add your first product!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{p.itemName}</p>
                  <div className="flex gap-3 mt-1 text-sm text-muted-foreground">
                    <span>MRP: ₹{p.printPrice}</span>
                    <span>Buy: ₹{p.purchasePrice}</span>
                    <span>Sell: ₹{p.sellPrice}</span>
                  </div>
                  <p className="text-sm mt-1 font-medium text-accent-foreground">Stock: {p.stock}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(p)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" onClick={() => { deleteProduct(p.id); toast.success('Deleted'); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
