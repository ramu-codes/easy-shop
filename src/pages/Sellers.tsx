import { useState, useRef, useMemo } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2, UserCheck, ShoppingCart, Camera, ImageIcon, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function Sellers() {
  const { sellers, products, purchases, addSeller, updateSeller, deleteSeller, addPurchase, deletePurchase } = useShop();
  const [sellerOpen, setSellerOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', location: '', phone: '' });

  // Purchase form
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [pForm, setPForm] = useState({
    sellerId: '', itemName: '', quantity: 1, totalPrice: 0, sellPrice: 0, date: new Date().toISOString().split('T')[0], image: '', dueAmount: 0
  });
  const [itemSuggestions, setItemSuggestions] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const perUnit = pForm.quantity > 0 ? Math.round(pForm.totalPrice / pForm.quantity) : 0;
  const estimatedProfit = pForm.quantity * (pForm.sellPrice - perUnit);

  const reset = () => { setForm({ name: '', location: '', phone: '' }); setEditId(null); };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Enter seller name'); return; }
    if (editId) { updateSeller(editId, form); toast.success('Updated'); }
    else { addSeller(form); toast.success('Seller added'); }
    reset(); setSellerOpen(false);
  };

  const handleEdit = (s: typeof sellers[0]) => {
    setForm({ name: s.name, location: s.location, phone: s.phone || '' }); setEditId(s.id); setSellerOpen(true);
  };

  // Image handling
  const compressImage = (file: File): Promise<string> => {
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
          canvas.width = width; canvas.height = height;
          canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.5));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('Max 10MB'); return; }
    const compressed = await compressImage(file);
    setPForm(f => ({ ...f, image: compressed }));
  };

  const handleItemNameChange = (val: string) => {
    setPForm(f => ({ ...f, itemName: val }));
    if (val.trim()) {
      const matches = products.filter(p => p.itemName.toLowerCase().includes(val.toLowerCase())).map(p => p.itemName);
      setItemSuggestions(matches.slice(0, 5));
    } else setItemSuggestions([]);
  };

  const selectItemSuggestion = (name: string) => {
    const p = products.find(x => x.itemName === name);
    setPForm(f => ({
      ...f, itemName: name,
      sellPrice: p?.sellPrice || 0,
    }));
    setItemSuggestions([]);
  };

  const handlePurchase = () => {
    if (!pForm.sellerId) { toast.error('Select seller'); return; }
    if (!pForm.itemName.trim()) { toast.error('Enter item name'); return; }
    if (pForm.quantity <= 0) { toast.error('Enter quantity'); return; }

    const seller = sellers.find(s => s.id === pForm.sellerId);
    const existingProduct = products.find(p => p.itemName.toLowerCase() === pForm.itemName.toLowerCase());

    addPurchase({
      sellerId: pForm.sellerId, sellerName: seller?.name || '',
      itemId: existingProduct?.id || '', itemName: pForm.itemName,
      quantity: pForm.quantity, purchasePrice: perUnit,
      totalAmount: pForm.totalPrice, dueAmount: pForm.dueAmount,
      date: pForm.date, image: pForm.image, estimatedProfit,
      sellPrice: pForm.sellPrice,
    });
    toast.success('Purchase recorded! Stock updated.');
    setPForm({ sellerId: '', itemName: '', quantity: 1, totalPrice: 0, sellPrice: 0, date: new Date().toISOString().split('T')[0], image: '', dueAmount: 0 });
    setPurchaseOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Buy / Sellers</h2>
          <p className="text-xs text-muted-foreground">{sellers.length} sellers • {purchases.length} purchases</p>
        </div>
        <div className="flex gap-1.5">
          <Dialog open={purchaseOpen} onOpenChange={setPurchaseOpen}>
            <DialogTrigger asChild><Button size="sm" className="gap-1"><ShoppingCart className="h-4 w-4" />Buy</Button></DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>New Purchase</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
                <div>
                  <Label className="text-xs">Seller</Label>
                  <Select value={pForm.sellerId} onValueChange={v => setPForm({...pForm, sellerId: v})}>
                    <SelectTrigger className="h-10 mt-1 text-sm"><SelectValue placeholder="Select seller" /></SelectTrigger>
                    <SelectContent>{sellers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                {/* Item with suggestions */}
                <div className="relative">
                  <Label className="text-xs">Item Name</Label>
                  <Input value={pForm.itemName} onChange={e => handleItemNameChange(e.target.value)} className="h-10 mt-1 text-sm" placeholder="Search or add new item" />
                  {itemSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-0.5 bg-popover border border-border rounded-lg shadow-lg max-h-32 overflow-y-auto">
                      {itemSuggestions.map(name => (
                        <button key={name} className="w-full px-3 py-2 text-left hover:bg-muted text-xs" onClick={() => selectItemSuggestion(name)}>
                          {name}
                        </button>
                      ))}
                      <button className="w-full px-3 py-2 text-left hover:bg-muted text-xs text-primary font-medium" onClick={() => setItemSuggestions([])}>
                        + New product: "{pForm.itemName}"
                      </button>
                    </div>
                  )}
                </div>
                {/* Image */}
                <div>
                  <Label className="text-xs">Product Image</Label>
                  <div className="mt-1 flex items-center gap-2">
                    {pForm.image ? (
                      <img src={pForm.image} alt="" className="h-14 w-14 rounded-lg object-cover border" />
                    ) : (
                      <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center border"><ImageIcon className="h-5 w-5 text-muted-foreground" /></div>
                    )}
                    <div className="flex flex-col gap-1">
                      <Button type="button" variant="outline" size="sm" onClick={() => cameraRef.current?.click()} className="h-7 text-xs gap-1"><Camera className="h-3 w-3" />Capture</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="h-7 text-xs gap-1"><ImageIcon className="h-3 w-3" />Browse</Button>
                    </div>
                    <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="text-xs">Quantity</Label><Input type="number" value={pForm.quantity} onChange={e => setPForm({...pForm, quantity: +e.target.value})} className="h-10 mt-1" /></div>
                  <div><Label className="text-xs">Total Price (₹)</Label><Input type="number" value={pForm.totalPrice} onChange={e => setPForm({...pForm, totalPrice: +e.target.value})} className="h-10 mt-1" /></div>
                </div>
                {/* Calculated per unit */}
                <div className="p-2 bg-muted rounded-lg text-xs space-y-1">
                  <div className="flex justify-between"><span>Per Unit Price:</span><span className="font-bold">₹{perUnit}</span></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="text-xs">Sell Price (₹)</Label><Input type="number" value={pForm.sellPrice} onChange={e => setPForm({...pForm, sellPrice: +e.target.value})} className="h-10 mt-1" /></div>
                  <div><Label className="text-xs">Due Amount (₹)</Label><Input type="number" value={pForm.dueAmount} onChange={e => setPForm({...pForm, dueAmount: +e.target.value})} className="h-10 mt-1" /></div>
                </div>
                {/* Estimated profit */}
                <div className={`p-2 rounded-lg text-center text-xs font-bold ${estimatedProfit >= 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-950'}`}>
                  Est. Profit: ₹{estimatedProfit.toLocaleString()} ({pForm.quantity} × ₹{pForm.sellPrice - perUnit})
                </div>
                <div><Label className="text-xs">Date</Label><Input type="date" value={pForm.date} onChange={e => setPForm({...pForm, date: e.target.value})} className="h-10 mt-1" /></div>
                <Button onClick={handlePurchase} className="w-full h-10 font-semibold">Record Purchase</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={sellerOpen} onOpenChange={(v) => { setSellerOpen(v); if (!v) reset(); }}>
            <DialogTrigger asChild><Button size="sm" variant="outline" className="gap-1"><Plus className="h-4 w-4" />Seller</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Seller</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
                <div><Label className="text-xs">Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-10 mt-1" /></div>
                <div><Label className="text-xs">Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="h-10 mt-1" /></div>
                <div><Label className="text-xs">Location</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="h-10 mt-1" /></div>
                <Button onClick={handleSave} className="w-full h-10 font-semibold">{editId ? 'Update' : 'Add'} Seller</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="purchases">
        <TabsList className="mb-3">
          <TabsTrigger value="purchases" className="text-xs">Purchases</TabsTrigger>
          <TabsTrigger value="sellers" className="text-xs">Sellers</TabsTrigger>
        </TabsList>

        <TabsContent value="purchases">
          {purchases.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-40" /><p className="text-xs">No purchases yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {[...purchases].reverse().map(p => (
                <div key={p.id} className="stat-card">
                  <div className="flex gap-2">
                    {p.image && <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover shrink-0 border" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-sm">{p.itemName}</p>
                          <p className="text-xs text-muted-foreground">From: {p.sellerName} • Qty: {p.quantity} • ₹{p.purchasePrice}/unit</p>
                        </div>
                        <div className="text-right flex items-center gap-1">
                          <div>
                            <p className="font-bold text-sm">₹{p.totalAmount.toLocaleString()}</p>
                            <p className="text-[10px] text-muted-foreground">{p.date}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { deletePurchase(p.id); toast.success('Deleted, stock adjusted'); }}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      {p.estimatedProfit !== undefined && (
                        <p className={`text-[10px] font-medium mt-0.5 ${p.estimatedProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          Est. Profit: ₹{p.estimatedProfit.toLocaleString()}
                        </p>
                      )}
                      {p.dueAmount > 0 && <p className="text-[10px] text-orange-500 font-medium">Due: ₹{p.dueAmount}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sellers">
          {sellers.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <UserCheck className="h-8 w-8 mx-auto mb-2 opacity-40" /><p className="text-xs">No sellers yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sellers.map(s => (
                <div key={s.id} className="stat-card flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.phone && `📞 ${s.phone} • `}{s.location}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(s)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { deleteSeller(s.id); toast.success('Deleted'); }}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
