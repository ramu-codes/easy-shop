import { useState, useRef, useMemo } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { useLanguage, PRODUCT_CATEGORIES } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Package, Camera, ImageIcon, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useShop();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ itemName: '', printPrice: 0, purchasePrice: 0, sellPrice: 0, image: '', category: '' });
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const reset = () => { setForm({ itemName: '', printPrice: 0, purchasePrice: 0, sellPrice: 0, image: '', category: '' }); setEditId(null); };

  const compressImage = (file: File, maxSizeKB: number = 800): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            if (width > height) { height = (height / width) * maxDim; width = maxDim; }
            else { width = (width / height) * maxDim; height = maxDim; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, width, height);
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
    if (file.size > 10 * 1024 * 1024) { toast.error(t('Image too large. Max 10MB')); return; }
    try {
      const compressed = await compressImage(file);
      setForm(f => ({ ...f, image: compressed }));
      toast.success(t('Image added'));
    } catch {
      toast.error('Failed to process image');
    }
  };

  const handleSave = () => {
    if (!form.itemName.trim()) { toast.error(t('Enter product name')); return; }
    if (editId) { updateProduct(editId, form); toast.success(t('Updated')); }
    else { addProduct({ ...form, category: form.category || 'Other' }); toast.success(t('Product added')); }
    reset(); setOpen(false);
  };

  const handleEdit = (p: typeof products[0]) => {
    setForm({ itemName: p.itemName, printPrice: p.printPrice, purchasePrice: p.purchasePrice, sellPrice: p.sellPrice, image: p.image || '', category: p.category || '' });
    setEditId(p.id); setOpen(true);
  };

  // Get unique categories from products
  const usedCategories = useMemo(() => {
    const cats = new Set(products.map(p => p.category || 'Uncategorized'));
    return Array.from(cats).sort();
  }, [products]);

  const filtered = useMemo(() => {
    let result = products;
    if (selectedCategory !== 'all') {
      result = result.filter(p => (p.category || 'Uncategorized') === selectedCategory);
    }
    if (search.trim()) {
      result = result.filter(p => p.itemName.toLowerCase().includes(search.toLowerCase()));
    }
    return result;
  }, [products, search, selectedCategory]);

  // Suggestions based on existing product names
  const suggestions = useMemo(() => {
    if (!form.itemName.trim() || form.itemName.length < 2) return [];
    return products
      .filter(p => p.itemName.toLowerCase().includes(form.itemName.toLowerCase()) && p.id !== editId)
      .slice(0, 5);
  }, [form.itemName, products, editId]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">{t('Products')}</h2>
          <p className="text-xs text-muted-foreground">{products.length} {t('items in stock')}</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
          <DialogTrigger asChild><Button size="sm" className="gap-1"><Plus className="h-4 w-4" />{t('Add')}</Button></DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? t('Edit') : t('Add')} {t('Product')}</DialogTitle></DialogHeader>
            <div className="space-y-3 pt-2">
              <div>
                <Label className="text-xs">{t('Product Image')}</Label>
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
                      <Camera className="h-3.5 w-3.5" />{t('Capture')}
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="gap-1.5 h-8 text-xs">
                      <ImageIcon className="h-3.5 w-3.5" />{t('Browse')}
                    </Button>
                    {form.image && <Button type="button" variant="ghost" size="sm" onClick={() => setForm(f => ({...f, image: ''}))} className="h-8 text-xs text-destructive">{t('Remove')}</Button>}
                  </div>
                  <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>
              </div>
              <div className="relative">
                <Label className="text-xs">{t('Item Name')}</Label>
                <Input value={form.itemName} onChange={e => setForm({ ...form, itemName: e.target.value })} className="h-10 mt-1" placeholder={t('Enter product name')} />
                {suggestions.length > 0 && (
                  <div className="absolute z-10 left-0 right-0 top-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-32 overflow-y-auto">
                    {suggestions.map(s => (
                      <button key={s.id} className="w-full text-left px-3 py-2 text-xs hover:bg-accent transition-colors flex justify-between"
                        onClick={() => setForm({ ...form, itemName: s.itemName, printPrice: s.printPrice, purchasePrice: s.purchasePrice, sellPrice: s.sellPrice, category: s.category || '' })}>
                        <span className="font-medium">{s.itemName}</span>
                        <span className="text-muted-foreground">₹{s.sellPrice} | Stock: {s.stock}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label className="text-xs">{t('Category')}</Label>
                <Select value={form.category || 'Other'} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger className="h-10 mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map(c => (
                      <SelectItem key={c} value={c}>{t(c)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div><Label className="text-xs">MRP (₹)</Label><Input type="number" value={form.printPrice} onChange={e => setForm({ ...form, printPrice: +e.target.value })} className="h-10 mt-1" /></div>
                <div><Label className="text-xs">Buy (₹)</Label><Input type="number" value={form.purchasePrice} onChange={e => setForm({ ...form, purchasePrice: +e.target.value })} className="h-10 mt-1" /></div>
                <div><Label className="text-xs">Sell (₹)</Label><Input type="number" value={form.sellPrice} onChange={e => setForm({ ...form, sellPrice: +e.target.value })} className="h-10 mt-1" /></div>
              </div>
              <Button onClick={handleSave} className="w-full h-10 font-semibold">{editId ? t('Update') : t('Add')} {t('Product')}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search + Category Filter */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} className="h-9 pl-9 text-sm" placeholder={t('Search products...')} />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="h-9 w-auto min-w-[120px]">
            <Filter className="h-3.5 w-3.5 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('All Categories')}</SelectItem>
            {usedCategories.map(c => (
              <SelectItem key={c} value={c}>{t(c)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
        >
          {t('All')} ({products.length})
        </button>
        {usedCategories.map(c => {
          const count = products.filter(p => (p.category || 'Uncategorized') === c).length;
          return (
            <button key={c} onClick={() => setSelectedCategory(c)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedCategory === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
            >
              {t(c)} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">{search ? t('No products found') : t('No products yet')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {filtered.map(p => (
            <div key={p.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-all group">
              <div className="aspect-square bg-muted relative">
                {p.image ? (
                  <img src={p.image} alt={p.itemName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                )}
                <span className={`absolute top-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  p.stock === 0 ? 'bg-destructive text-destructive-foreground' : p.stock <= 5 ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'
                }`}>
                  {p.stock}
                </span>
                {p.category && (
                  <span className="absolute top-1 left-1 text-[8px] font-medium px-1.5 py-0.5 rounded-full bg-card/80 backdrop-blur-sm text-foreground">
                    {t(p.category)}
                  </span>
                )}
                <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                  <Button variant="secondary" size="icon" className="h-7 w-7" onClick={() => handleEdit(p)}><Pencil className="h-3 w-3" /></Button>
                  <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => { deleteProduct(p.id); toast.success(t('Deleted')); }}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
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
