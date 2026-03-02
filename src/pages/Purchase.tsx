import { useState } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

export default function Purchase() {
  const { sellers, products, purchases, addPurchase } = useShop();
  const [form, setForm] = useState({ sellerId: '', itemId: '', quantity: 1, purchasePrice: 0, dueAmount: 0, date: new Date().toISOString().split('T')[0] });

  const seller = sellers.find(s => s.id === form.sellerId);
  const product = products.find(p => p.id === form.itemId);
  const total = form.quantity * form.purchasePrice;

  const handleAdd = () => {
    if (!form.sellerId || !form.itemId) { toast.error('Select seller and product'); return; }
    addPurchase({
      sellerId: form.sellerId, sellerName: seller?.name || '',
      itemId: form.itemId, itemName: product?.itemName || '',
      quantity: form.quantity, purchasePrice: form.purchasePrice,
      totalAmount: total, dueAmount: form.dueAmount, date: form.date,
    });
    toast.success('Purchase recorded! Stock updated.');
    setForm({ sellerId: '', itemId: '', quantity: 1, purchasePrice: 0, dueAmount: 0, date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div>
      <h2 className="page-title">Purchase</h2>
      <p className="page-subtitle">Record new purchases from sellers</p>

      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">New Purchase Entry</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Seller</Label>
            <Select value={form.sellerId} onValueChange={v => setForm({ ...form, sellerId: v })}>
              <SelectTrigger className="h-12 mt-1"><SelectValue placeholder="Select seller" /></SelectTrigger>
              <SelectContent>{sellers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Product</Label>
            <Select value={form.itemId} onValueChange={v => { const p = products.find(x => x.id === v); setForm({ ...form, itemId: v, purchasePrice: p?.purchasePrice || 0 }); }}>
              <SelectTrigger className="h-12 mt-1"><SelectValue placeholder="Select product" /></SelectTrigger>
              <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.itemName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Quantity</Label><Input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: +e.target.value })} className="h-12 mt-1" /></div>
            <div><Label>Price (₹)</Label><Input type="number" value={form.purchasePrice} onChange={e => setForm({ ...form, purchasePrice: +e.target.value })} className="h-12 mt-1" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Due Amount (₹)</Label><Input type="number" value={form.dueAmount} onChange={e => setForm({ ...form, dueAmount: +e.target.value })} className="h-12 mt-1" /></div>
            <div><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="h-12 mt-1" /></div>
          </div>
          <div className="p-3 bg-muted rounded-lg text-center">
            <span className="text-sm text-muted-foreground">Total: </span>
            <span className="text-lg font-bold text-foreground">₹{total.toLocaleString()}</span>
          </div>
          <Button onClick={handleAdd} className="w-full big-button">Record Purchase</Button>
        </CardContent>
      </Card>

      <h3 className="text-lg font-semibold mb-3">Recent Purchases</h3>
      {purchases.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <ShoppingCart className="h-10 w-10 mx-auto mb-2 opacity-40" /><p>No purchases yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...purchases].reverse().slice(0, 20).map(p => (
            <div key={p.id} className="stat-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{p.itemName}</p>
                  <p className="text-sm text-muted-foreground">From: {p.sellerName} • Qty: {p.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{p.totalAmount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{p.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
