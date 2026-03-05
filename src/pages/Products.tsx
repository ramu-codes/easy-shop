import { useState, useRef, useMemo } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Package, Camera, ImageIcon, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useShop();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ itemName: '', printPrice: 0, purchasePrice: 0, sellPrice: 0, image: '' });
  const [search, setSearch] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const reset = () => { setForm({ itemName: '', printPrice: 0, purchasePrice: 0, sellPrice: 0, image: '' }); setEditId(null); };

  const compressImage = (file: File, maxSizeKB: number = 800): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          // Max dimension 1200px
          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            if (width > height) { height = (height / width) * maxDim; width = maxDim; }
            else { width = (width / height) * maxDim; height = maxDim; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, width, height);
          // Try JPEG at 0.6 quality
          let result = canvas.toDataURL('image/jpeg', 0.6);
          if (result.length > maxSizeKB * 1024) {
            result = canvas.toDataURL('image/jpeg', 0.4);
          }
          resolve(result);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('Image too large. Max 10MB'); return; }
    try {
      const compressed = await compressImage(file);
      setForm(f => ({ ...f, image: compressed }));
      toast.success('Image added');
    } catch {
      toast.error('Failed to process image');
    }
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

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    return products.filter(p => p.itemName.toLowerCase().includes(search.toLowerCase()));
  }, [products, search]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Products</h2>
          <p className="text-xs text-muted-foreground">{products.length} items in stock</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
          <DialogTrigger asChild><Button size="sm" className="gap-1"><Plus className="h-4 w-4" />Add</Button></DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Product</DialogTitle></DialogHeader>
            <div className="space-y-3 pt-2">
              <div>
                <Label className="text-xs">Product Image</Label>
                <div className="mt-1 flex items-center gap-3">
                  {form.image ? (
                    <img src={form.image} alt="Preview" className="h-16 w-16 rounded-lg object-cover border border-border" />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center border border-border">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <Button type="button" variant="outline" size="sm" onClick={() => cameraRef.current?.click()} className="gap-1.5 h-8 text-xs">
                      <Camera className="h-3.5 w-3.5" />Capture
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="gap-1.5 h-8 text-xs">
                      <ImageIcon className="h-3.5 w-3.5" />Browse
                    </Button>
                    {form.image && <Button type="button" variant="ghost" size="sm" onClick={() => setForm(f => ({...f, image: ''}))} className="h-8 text-xs text-destructive">Remove</Button>}
                  </div>
                  <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>
              </div>
              <div><Label className="text-xs">Item Name</Label><Input value={form.itemName} onChange={e => setForm({ ...form, itemName: e.target.value })} className="h-10 mt-1" /></div>
              <div className="grid grid-cols-3 gap-2">
                <div><Label className="text-xs">MRP (₹)</Label><Input type="number" value={form.printPrice} onChange={e => setForm({ ...form, printPrice: +e.target.value })} className="h-10 mt-1" /></div>
                <div><Label className="text-xs">Buy (₹)</Label><Input type="number" value={form.purchasePrice} onChange={e => setForm({ ...form, purchasePrice: +e.target.value })} className="h-10 mt-1" /></div>
                <div><Label className="text-xs">Sell (₹)</Label><Input type="number" value={form.sellPrice} onChange={e => setForm({ ...form, sellPrice: +e.target.value })} className="h-10 mt-1" /></div>
              </div>
              <Button onClick={handleSave} className="w-full h-10 font-semibold">{editId ? 'Update' : 'Add'} Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} className="h-9 pl-9 text-sm" placeholder="Search products..." />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">{search ? 'No products found' : 'No products yet'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {filtered.map(p => (
            <div key={p.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-all group">
              {/* Image */}
              <div className="aspect-square bg-muted relative">
                {p.image ? (
                  <img src={p.image} alt={p.itemName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                )}
                {/* Stock badge */}
                <span className={`absolute top-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  p.stock === 0 ? 'bg-red-500 text-white' : p.stock <= 5 ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white'
                }`}>
                  {p.stock}
                </span>
                {/* Edit/Delete overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                  <Button variant="secondary" size="icon" className="h-7 w-7" onClick={() => handleEdit(p)}><Pencil className="h-3 w-3" /></Button>
                  <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => { deleteProduct(p.id); toast.success('Deleted'); }}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
              {/* Info */}
              <div className="p-2">
                <p className="text-xs font-semibold text-foreground truncate">{p.itemName}</p>
                <div className="flex justify-between mt-0.5 text-[10px] text-muted-foreground">
                  <span>₹{p.sellPrice}</span>
                  <span className="line-through">₹{p.printPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
