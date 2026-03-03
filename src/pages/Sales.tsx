import { useState, useMemo, useRef } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, Plus, Trash2, Share2, MessageCircle, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { SaleItem } from '@/types/shop';

export default function Sales() {
  const { customers, products, sales, addSale, addCustomer, getNextInvoiceNo, shopName } = useShop();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Online' | 'Due'>('Cash');
  const [items, setItems] = useState<SaleItem[]>([]);
  const [date] = useState(new Date().toISOString().split('T')[0]);
  const [selProduct, setSelProduct] = useState('');
  const [selQty, setSelQty] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [lastInvoice, setLastInvoice] = useState<string | null>(null);

  const totalBill = items.reduce((s, i) => s + i.total, 0);

  // Customer suggestions
  const suggestions = useMemo(() => {
    if (!customerName.trim()) return [];
    return customers.filter(c =>
      c.name.toLowerCase().includes(customerName.toLowerCase())
    ).slice(0, 5);
  }, [customerName, customers]);

  const selectCustomer = (c: typeof customers[0]) => {
    setCustomerName(c.name);
    setCustomerPhone(c.phone || '');
    setShowSuggestions(false);
  };

  const addItem = () => {
    const p = products.find(x => x.id === selProduct);
    if (!p) { toast.error('Select a product'); return; }
    if (items.find(i => i.productId === p.id)) { toast.error('Product already added'); return; }
    const discount = p.printPrice - p.sellPrice;
    setItems([...items, {
      productId: p.id, productName: p.itemName, quantity: selQty,
      sellPrice: p.sellPrice, mrp: p.printPrice, discount,
      total: selQty * p.sellPrice
    }]);
    setSelProduct(''); setSelQty(1);
  };

  const removeItem = (pid: string) => setItems(items.filter(i => i.productId !== pid));

  const generateInvoiceText = (invoiceNo: string) => {
    const shop = shopName || 'Verma Fancy Store';
    let text = `*${shop}*\n`;
    text += `Invoice: ${invoiceNo}\nDate: ${date}\n`;
    text += `Customer: ${customerName}\n`;
    if (customerPhone) text += `Phone: ${customerPhone}\n`;
    text += `─────────────────\n`;
    items.forEach((i, idx) => {
      text += `${idx + 1}. ${i.productName}\n   ${i.quantity} × ₹${i.sellPrice} = ₹${i.total}`;
      if (i.discount > 0) text += ` (MRP: ₹${i.mrp})`;
      text += `\n`;
    });
    text += `─────────────────\n`;
    text += `*Total: ₹${totalBill.toLocaleString()}*\n`;
    text += `Payment: ${paymentMode}\n\nThank you for shopping! 🙏`;
    return text;
  };

  const handleSale = () => {
    if (!customerName.trim()) { toast.error('Enter customer name'); return; }
    if (items.length === 0) { toast.error('Add at least one product'); return; }

    // Find or create customer
    let customer = customers.find(c => c.name.toLowerCase() === customerName.toLowerCase());
    let customerId = customer?.id || '';

    if (!customer) {
      const newId = Math.random().toString(36).slice(2, 10);
      addCustomer({ name: customerName, phone: customerPhone, location: '', dueAmount: 0 });
      customerId = newId;
      // Get the newly added customer
      setTimeout(() => {}, 0);
    }

    const invoiceNo = getNextInvoiceNo();
    addSale({ customerId: customer?.id || customerId, customerName, customerPhone, items, totalBill, paymentMode, date });
    setLastInvoice(invoiceNo);
    toast.success('Sale recorded! Invoice: ' + invoiceNo);
    setItems([]);
    setCustomerName('');
    setCustomerPhone('');
  };

  const shareWhatsApp = () => {
    if (!lastInvoice) return;
    const text = generateInvoiceText(lastInvoice);
    const phone = customerPhone ? customerPhone.replace(/\D/g, '') : '';
    const url = phone
      ? `https://wa.me/91${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareEmail = () => {
    if (!lastInvoice) return;
    const text = generateInvoiceText(lastInvoice);
    const subject = `Invoice ${lastInvoice} - ${shopName || 'Verma Fancy Store'}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`);
  };

  return (
    <div>
      <h2 className="page-title">Sales</h2>
      <p className="page-subtitle">Create new invoice</p>

      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">New Invoice</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {/* Customer Name with Suggestions */}
          <div className="relative">
            <Label>Customer Name</Label>
            <Input
              value={customerName}
              onChange={e => { setCustomerName(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              className="h-12 mt-1"
              placeholder="Enter customer name"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                {suggestions.map(c => (
                  <button key={c.id} className="w-full px-4 py-2.5 text-left hover:bg-muted transition-colors text-sm" onClick={() => selectCustomer(c)}>
                    <span className="font-medium">{c.name}</span>
                    {c.phone && <span className="text-muted-foreground ml-2">{c.phone}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Customer Phone */}
          <div>
            <Label>Phone Number</Label>
            <Input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="h-12 mt-1" placeholder="Enter phone number" />
          </div>

          {/* Product Selection */}
          <div className="p-3 bg-muted rounded-lg">
            <Label className="text-sm font-medium mb-2 block">Add Products</Label>
            <div className="flex gap-2">
              <Select value={selProduct} onValueChange={setSelProduct}>
                <SelectTrigger className="h-10 flex-1"><SelectValue placeholder="Product" /></SelectTrigger>
                <SelectContent>
                  {products.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      <div className="flex items-center gap-2">
                        {p.image && <img src={p.image} alt="" className="h-5 w-5 rounded object-cover" />}
                        <span>{p.itemName} (₹{p.sellPrice})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input type="number" value={selQty} onChange={e => setSelQty(+e.target.value)} className="h-10 w-20" min={1} />
              <Button onClick={addItem} size="icon" className="h-10 w-10 shrink-0"><Plus className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* Items List */}
          {items.length > 0 && (
            <div className="space-y-2">
              {items.map(i => (
                <div key={i.productId} className="flex items-center justify-between p-2.5 bg-card border rounded-lg">
                  <div>
                    <span className="text-sm font-medium">{i.productName}</span>
                    <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>Qty: {i.quantity}</span>
                      <span>MRP: ₹{i.mrp}</span>
                      {i.discount > 0 && <span className="text-accent-foreground">Disc: ₹{i.discount}</span>}
                      <span className="font-semibold text-foreground">= ₹{i.total}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(i.productId)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
            </div>
          )}

          {/* Payment Mode */}
          <div>
            <Label>Payment Mode</Label>
            <Select value={paymentMode} onValueChange={v => setPaymentMode(v as 'Cash' | 'Online' | 'Due')}>
              <SelectTrigger className="h-12 mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">💵 Cash</SelectItem>
                <SelectItem value="Online">📱 Online</SelectItem>
                <SelectItem value="Due">📋 Due</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Total */}
          <div className="p-4 bg-accent rounded-xl text-center">
            <span className="text-sm text-accent-foreground">Total Bill: </span>
            <span className="text-2xl font-bold text-accent-foreground">₹{totalBill.toLocaleString()}</span>
          </div>

          <Button onClick={handleSale} className="w-full big-button">Create Invoice</Button>

          {/* Share Buttons */}
          {lastInvoice && (
            <div className="flex gap-2">
              <Button onClick={shareWhatsApp} variant="outline" className="flex-1 gap-2 h-11">
                <MessageCircle className="h-4 w-4" />WhatsApp
              </Button>
              <Button onClick={shareEmail} variant="outline" className="flex-1 gap-2 h-11">
                <Mail className="h-4 w-4" />Email
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Sales */}
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
                  <p className="text-sm text-muted-foreground">{s.invoiceNo} • {s.items.length} items • {s.paymentMode}</p>
                  {s.customerPhone && <p className="text-xs text-muted-foreground">📞 {s.customerPhone}</p>}
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
