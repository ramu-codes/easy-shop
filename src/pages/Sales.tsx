import { useState } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { SaleItem } from '@/types/shop';

export default function Sales() {
  const { customers, products, sales, addSale } = useShop();
  const [customerId, setCustomerId] = useState('');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Due'>('Cash');
  const [items, setItems] = useState<SaleItem[]>([]);
  const [date] = useState(new Date().toISOString().split('T')[0]);
  const [selProduct, setSelProduct] = useState('');
  const [selQty, setSelQty] = useState(1);

  const totalBill = items.reduce((s, i) => s + i.total, 0);
  const customer = customers.find(c => c.id === customerId);

  const addItem = () => {
    const p = products.find(x => x.id === selProduct);
    if (!p) { toast.error('Select a product'); return; }
    if (items.find(i => i.productId === p.id)) { toast.error('Product already added'); return; }
    setItems([...items, { productId: p.id, productName: p.itemName, quantity: selQty, sellPrice: p.sellPrice, total: selQty * p.sellPrice }]);
    setSelProduct(''); setSelQty(1);
  };

  const removeItem = (pid: string) => setItems(items.filter(i => i.productId !== pid));

  const handleSale = () => {
    if (!customerId) { toast.error('Select customer'); return; }
    if (items.length === 0) { toast.error('Add at least one product'); return; }
    addSale({ customerId, customerName: customer?.name || '', items, totalBill, paymentMode, date });
    toast.success('Sale recorded!');
    setItems([]); setCustomerId('');
  };

  return (
    <div>
      <h2 className="page-title">Sales</h2>
      <p className="page-subtitle">Create new invoice</p>

      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">New Invoice</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Customer</Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger className="h-12 mt-1"><SelectValue placeholder="Select customer" /></SelectTrigger>
              <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <Label className="text-sm font-medium mb-2 block">Add Products</Label>
            <div className="flex gap-2">
              <Select value={selProduct} onValueChange={setSelProduct}>
                <SelectTrigger className="h-10 flex-1"><SelectValue placeholder="Product" /></SelectTrigger>
                <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.itemName} (₹{p.sellPrice})</SelectItem>)}</SelectContent>
              </Select>
              <Input type="number" value={selQty} onChange={e => setSelQty(+e.target.value)} className="h-10 w-20" min={1} />
              <Button onClick={addItem} size="icon" className="h-10 w-10 shrink-0"><Plus className="h-4 w-4" /></Button>
            </div>
          </div>

          {items.length > 0 && (
            <div className="space-y-2">
              {items.map(i => (
                <div key={i.productId} className="flex items-center justify-between p-2 bg-card border rounded-lg">
                  <div>
                    <span className="text-sm font-medium">{i.productName}</span>
                    <span className="text-sm text-muted-foreground ml-2">×{i.quantity} = ₹{i.total}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(i.productId)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
            </div>
          )}

          <div>
            <Label>Payment Mode</Label>
            <Select value={paymentMode} onValueChange={v => setPaymentMode(v as 'Cash' | 'Due')}>
              <SelectTrigger className="h-12 mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Due">Due</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-accent rounded-xl text-center">
            <span className="text-sm text-accent-foreground">Total Bill: </span>
            <span className="text-2xl font-bold text-accent-foreground">₹{totalBill.toLocaleString()}</span>
          </div>

          <Button onClick={handleSale} className="w-full big-button">Create Invoice</Button>
        </CardContent>
      </Card>

      <h3 className="text-lg font-semibold mb-3">Recent Sales</h3>
      {sales.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <Receipt className="h-10 w-10 mx-auto mb-2 opacity-40" /><p>No sales yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...sales].reverse().slice(0, 20).map(s => (
            <div key={s.id} className="stat-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{s.customerName}</p>
                  <p className="text-sm text-muted-foreground">{s.items.length} items • {s.paymentMode}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{s.totalBill.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{s.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
