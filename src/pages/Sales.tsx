import { useState, useMemo } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Receipt, Plus, Trash2, MessageCircle, Mail, Printer, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { SaleItem } from '@/types/shop';

export default function Sales() {
  const { customers, products, sales, addSale, deleteSale, addCustomer, getNextInvoiceNo, shopName } = useShop();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Online' | 'Due'>('Cash');
  const [items, setItems] = useState<SaleItem[]>([]);
  const [date] = useState(new Date().toISOString().split('T')[0]);
  const [selProduct, setSelProduct] = useState('');
  const [selQty, setSelQty] = useState(1);
  const [selDiscount, setSelDiscount] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [expandedSale, setExpandedSale] = useState<string | null>(null);
  const [invoiceDialog, setInvoiceDialog] = useState<string | null>(null);

  const totalDiscount = items.reduce((s, i) => s + (i.discount * i.quantity), 0);
  const totalBill = items.reduce((s, i) => s + i.total, 0);
  const shop = shopName || 'Verma Fancy Store';

  const suggestions = useMemo(() => {
    if (!customerName.trim()) return [];
    return customers.filter(c => c.name.toLowerCase().includes(customerName.toLowerCase())).slice(0, 5);
  }, [customerName, customers]);

  const selectCustomer = (c: typeof customers[0]) => {
    setCustomerName(c.name);
    setCustomerPhone(c.phone || '');
    setShowSuggestions(false);
  };

  const addItem = () => {
    const p = products.find(x => x.id === selProduct);
    if (!p) { toast.error('Select a product'); return; }
    if (items.find(i => i.productId === p.id)) { toast.error('Already added'); return; }
    const itemDiscount = selDiscount || (p.printPrice - p.sellPrice);
    const price = p.printPrice - itemDiscount;
    setItems([...items, {
      productId: p.id, productName: p.itemName, quantity: selQty,
      sellPrice: price, mrp: p.printPrice, discount: itemDiscount,
      total: selQty * price
    }]);
    setSelProduct(''); setSelQty(1); setSelDiscount(0);
  };

  const removeItem = (pid: string) => setItems(items.filter(i => i.productId !== pid));

  const generateInvoiceText = (sale: typeof sales[0]) => {
    let text = `*${shop}*\nInvoice: ${sale.invoiceNo}\nDate: ${sale.date}\n`;
    text += `Customer: ${sale.customerName}\n`;
    if (sale.customerPhone) text += `Phone: ${sale.customerPhone}\n`;
    text += `─────────────────\n`;
    sale.items.forEach((i, idx) => {
      text += `${idx + 1}. ${i.productName}\n   ${i.quantity} × ₹${i.sellPrice} = ₹${i.total}`;
      if (i.discount > 0) text += ` (Save ₹${i.discount * i.quantity})`;
      text += `\n`;
    });
    text += `─────────────────\n`;
    if (sale.totalDiscount > 0) text += `Discount: ₹${sale.totalDiscount}\n`;
    text += `*Total: ₹${sale.totalBill.toLocaleString()}*\n`;
    text += `Payment: ${sale.paymentMode}\n\nThank you! 🙏`;
    return text;
  };

  const shareWhatsApp = (sale: typeof sales[0]) => {
    const text = generateInvoiceText(sale);
    const phone = sale.customerPhone?.replace(/\D/g, '') || '';
    window.open(phone ? `https://wa.me/91${phone}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareEmail = (sale: typeof sales[0]) => {
    const text = generateInvoiceText(sale);
    window.open(`mailto:?subject=${encodeURIComponent(`Invoice ${sale.invoiceNo} - ${shop}`)}&body=${encodeURIComponent(text)}`);
  };

  const printInvoice = (sale: typeof sales[0]) => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<html><head><title>Invoice ${sale.invoiceNo}</title>
      <style>body{font-family:Arial;padding:20px;max-width:400px;margin:auto}table{width:100%;border-collapse:collapse;margin:12px 0}th,td{border:1px solid #ddd;padding:6px 8px;text-align:left;font-size:12px}th{background:#f5f5f5}.center{text-align:center}.total{font-size:18px;font-weight:bold;text-align:right;margin-top:10px}.footer{text-align:center;margin-top:20px;font-size:10px;color:#888}</style>
      </head><body>
      <div class="center"><h2 style="margin:0">${shop}</h2><p style="color:#888;font-size:12px">Invoice: ${sale.invoiceNo} | ${sale.date}</p></div>
      <p><b>Customer:</b> ${sale.customerName}${sale.customerPhone ? ` | ${sale.customerPhone}` : ''}</p>
      <table><thead><tr><th>#</th><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>
      ${sale.items.map((i, idx) => `<tr><td>${idx + 1}</td><td>${i.productName}</td><td>${i.quantity}</td><td>₹${i.sellPrice}</td><td>₹${i.total}</td></tr>`).join('')}
      </tbody></table>
      ${sale.totalDiscount > 0 ? `<p style="text-align:right;color:green">You saved ₹${sale.totalDiscount}</p>` : ''}
      <div class="total">Total: ₹${sale.totalBill.toLocaleString()}</div>
      <p>Payment: ${sale.paymentMode}</p>
      <div class="footer">Thank you for shopping at ${shop}! 🙏</div>
      </body></html>`);
    win.document.close();
    win.print();
  };

  const handleSale = () => {
    if (!customerName.trim()) { toast.error('Enter customer name'); return; }
    if (items.length === 0) { toast.error('Add products'); return; }

    let customer = customers.find(c => c.name.toLowerCase() === customerName.toLowerCase());
    if (!customer) {
      addCustomer({ name: customerName, phone: customerPhone, location: '', dueAmount: 0 });
    }

    addSale({ customerId: customer?.id || '', customerName, customerPhone, items, totalBill, totalDiscount, paymentMode, date });
    toast.success('Sale recorded!');
    setItems([]); setCustomerName(''); setCustomerPhone('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-foreground mb-1">Sales</h2>
      <p className="text-xs text-muted-foreground mb-4">Create invoice & manage sales</p>

      <Card className="mb-4">
        <CardHeader className="pb-2"><CardTitle className="text-sm">New Invoice</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {/* Customer */}
          <div className="relative">
            <Label className="text-xs">Customer Name</Label>
            <Input value={customerName} onChange={e => { setCustomerName(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)} className="h-10 mt-1 text-sm" placeholder="Customer name" />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-0.5 bg-popover border border-border rounded-lg shadow-lg max-h-36 overflow-y-auto">
                {suggestions.map(c => (
                  <button key={c.id} className="w-full px-3 py-2 text-left hover:bg-muted text-xs" onClick={() => selectCustomer(c)}>
                    <span className="font-medium">{c.name}</span>
                    {c.phone && <span className="text-muted-foreground ml-2">📞 {c.phone}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <Label className="text-xs">Phone</Label>
            <Input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="h-10 mt-1 text-sm" placeholder="Phone number" />
          </div>

          {/* Product Selection */}
          <div className="p-2.5 bg-muted rounded-lg space-y-2">
            <Label className="text-xs font-medium">Add Product</Label>
            <div className="flex gap-1.5">
              <Select value={selProduct} onValueChange={v => {
                setSelProduct(v);
                const p = products.find(x => x.id === v);
                if (p) setSelDiscount(p.printPrice - p.sellPrice);
              }}>
                <SelectTrigger className="h-9 flex-1 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {products.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      <div className="flex items-center gap-1.5">
                        {p.image && <img src={p.image} alt="" className="h-4 w-4 rounded object-cover" />}
                        <span className="text-xs">{p.itemName} (₹{p.sellPrice}) [{p.stock}]</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input type="number" value={selQty} onChange={e => setSelQty(+e.target.value)} className="h-9 w-14 text-xs" min={1} placeholder="Qty" />
              <Input type="number" value={selDiscount} onChange={e => setSelDiscount(+e.target.value)} className="h-9 w-16 text-xs" min={0} placeholder="Disc" />
              <Button onClick={addItem} size="icon" className="h-9 w-9 shrink-0"><Plus className="h-3.5 w-3.5" /></Button>
            </div>
          </div>

          {/* Items */}
          {items.length > 0 && (
            <div className="space-y-1.5">
              {items.map(i => (
                <div key={i.productId} className="flex items-center justify-between p-2 bg-card border rounded-lg text-xs">
                  <div>
                    <span className="font-medium">{i.productName}</span>
                    <div className="flex gap-2 text-muted-foreground mt-0.5">
                      <span>Qty: {i.quantity}</span>
                      <span>MRP: ₹{i.mrp}</span>
                      {i.discount > 0 && <span className="text-emerald-600">-₹{i.discount}</span>}
                      <span className="font-semibold text-foreground">= ₹{i.total}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeItem(i.productId)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                </div>
              ))}
            </div>
          )}

          {/* Payment */}
          <Select value={paymentMode} onValueChange={v => setPaymentMode(v as any)}>
            <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Cash">💵 Cash</SelectItem>
              <SelectItem value="Online">📱 Online</SelectItem>
              <SelectItem value="Due">📋 Due</SelectItem>
            </SelectContent>
          </Select>

          {/* Total */}
          <div className="p-3 bg-accent rounded-xl text-center">
            {totalDiscount > 0 && <p className="text-xs text-emerald-600 mb-0.5">Discount: ₹{totalDiscount}</p>}
            <span className="text-xl font-bold text-accent-foreground">₹{totalBill.toLocaleString()}</span>
          </div>

          <Button onClick={handleSale} className="w-full h-10 font-semibold">Create Invoice</Button>
        </CardContent>
      </Card>

      {/* Sales History */}
      <h3 className="text-sm font-semibold mb-2">Sales History ({sales.length})</h3>
      {sales.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Receipt className="h-8 w-8 mx-auto mb-2 opacity-40" /><p className="text-xs">No sales yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {[...sales].reverse().map(s => {
            const isExpanded = expandedSale === s.id;
            return (
              <div key={s.id} className="stat-card">
                <div className="flex justify-between items-start" onClick={() => setExpandedSale(isExpanded ? null : s.id)}>
                  <div>
                    <p className="font-semibold text-sm">{s.customerName}</p>
                    <p className="text-xs text-muted-foreground">{s.invoiceNo} • {s.items.length} items • {s.paymentMode}</p>
                  </div>
                  <div className="text-right flex items-center gap-1">
                    <div>
                      <p className="font-bold text-sm">₹{s.totalBill.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">{s.date}</p>
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>
                {isExpanded && (
                  <div className="mt-2 pt-2 border-t border-border">
                    {s.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between text-xs py-0.5">
                        <span>{i.productName} × {i.quantity}</span>
                        <span>₹{i.total}</span>
                      </div>
                    ))}
                    {s.totalDiscount > 0 && <p className="text-xs text-emerald-600 mt-1">Discount: ₹{s.totalDiscount}</p>}
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => printInvoice(s)}>
                        <Printer className="h-3 w-3" />Print
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => shareWhatsApp(s)}>
                        <MessageCircle className="h-3 w-3" />WhatsApp
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => shareEmail(s)}>
                        <Mail className="h-3 w-3" />Email
                      </Button>
                      <Button size="sm" variant="destructive" className="h-7 text-xs gap-1" onClick={() => { deleteSale(s.id); toast.success('Sale deleted, stock restored'); }}>
                        <Trash2 className="h-3 w-3" />Delete
                      </Button>
                    </div>
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
