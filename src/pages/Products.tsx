import { useState, useRef } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Package, Camera, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useShop();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ itemName: '', printPrice: 0, purchasePrice: 0, sellPrice: 0, image: '' });
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const reset = () => { setForm({ itemName: '', printPrice: 0, purchasePrice: 0, sellPrice: 0, image: '' }); setEditId(null); };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500000) { toast.error('Image too large. Max 500KB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => setForm(f => ({ ...f, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.itemName.trim()) { toast.error('Enter product name'); return; }
    if (editId) { updateProduct(editId, form); toast.success('Updated'); }
    else { addProduct(form); toast.success('Product added'); }
    reset(); setOpen(false);
  };

  const handleEdit = (p: typeof products[0]) => {
    setForm({ itemName: p.itemName, printPrice: p.printPrice, purchasePrice: p.purchasePrice, sellPrice: p.sellPrice, image: p.image || '' });
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
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Product</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              {/* Image Upload */}
              <div>
                <Label>Product Image</Label>
                <div className="mt-2 flex items-center gap-3">
                  {form.image ? (
                    <img src={form.image} alt="Preview" className="h-20 w-20 rounded-xl object-cover border border-border" />
                  ) : (
                    <div className="h-20 w-20 rounded-xl bg-muted flex items-center justify-center border border-border">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => cameraRef.current?.click()} className="gap-2">
                      <Camera className="h-4 w-4" />Capture Photo
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="gap-2">
                      <ImageIcon className="h-4 w-4" />Choose File
                    </Button>
                  </div>
                  <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>
              </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {products.map(p => (
            <div key={p.id} className="stat-card">
              <div className="flex gap-3">
                {p.image ? (
                  <img src={p.image} alt={p.itemName} className="h-16 w-16 rounded-lg object-cover shrink-0 border border-border" />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <p className="font-semibold text-foreground truncate">{p.itemName}</p>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { deleteProduct(p.id); toast.success('Deleted'); }}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                    <span>MRP: ₹{p.printPrice}</span>
                    <span>Buy: ₹{p.purchasePrice}</span>
                    <span>Sell: ₹{p.sellPrice}</span>
                  </div>
                  <p className={`text-xs mt-1 font-semibold ${p.stock <= 5 ? (p.stock === 0 ? 'text-destructive' : 'text-warning') : 'text-accent-foreground'}`}>
                    Stock: {p.stock} {p.stock === 0 ? '(Out)' : p.stock <= 5 ? '(Low)' : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
