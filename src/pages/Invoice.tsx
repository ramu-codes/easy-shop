import { useState, useRef } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Printer, Search, MessageCircle, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Invoice() {
  const { sales, shopName } = useShop();
  const [selectedId, setSelectedId] = useState('');
  const [search, setSearch] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  const sale = sales.find(s => s.id === selectedId);
  const shop = shopName || 'Verma Fancy Store';

  const filteredSales = sales.filter(s =>
    s.customerName.toLowerCase().includes(search.toLowerCase()) ||
    s.invoiceNo?.toLowerCase().includes(search.toLowerCase())
  );

  const handlePrint = () => {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>Invoice</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
        th { background: #f5f5f5; font-weight: 600; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 24px; }
        .info { display: flex; justify-content: space-between; margin: 12px 0; }
        .total { text-align: right; font-size: 20px; font-weight: bold; margin-top: 12px; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #888; }
      </style>
      </head><body>${content}</body></html>
    `);
    win.document.close();
    win.print();
  };

  const generateInvoiceText = () => {
    if (!sale) return '';
    let text = `*${shop}*\nInvoice: ${sale.invoiceNo}\nDate: ${sale.date}\n`;
    text += `Customer: ${sale.customerName}\n`;
    if (sale.customerPhone) text += `Phone: ${sale.customerPhone}\n`;
    text += `─────────────────\n`;
    sale.items.forEach((i, idx) => {
      text += `${idx + 1}. ${i.productName}\n   ${i.quantity} × ₹${i.sellPrice} = ₹${i.total}`;
      if (i.mrp && i.mrp > i.sellPrice) text += ` (MRP: ₹${i.mrp})`;
      text += `\n`;
    });
    text += `─────────────────\n`;
    text += `*Total: ₹${sale.totalBill.toLocaleString()}*\nPayment: ${sale.paymentMode}\n\nThank you! 🙏`;
    return text;
  };

  const shareWhatsApp = () => {
    const text = generateInvoiceText();
    const phone = sale?.customerPhone?.replace(/\D/g, '') || '';
    const url = phone ? `https://wa.me/91${phone}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareEmail = () => {
    const text = generateInvoiceText();
    window.open(`mailto:?subject=${encodeURIComponent(`Invoice ${sale?.invoiceNo} - ${shop}`)}&body=${encodeURIComponent(text)}`);
  };

  return (
    <div>
      <h2 className="page-title">Invoice</h2>
      <p className="page-subtitle">View, print & share invoices</p>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="md:col-span-2">
          <Label>Search</Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} className="h-12 pl-9" placeholder="Search by customer or invoice no." />
          </div>
        </div>
        <div>
          <Label>Select Invoice</Label>
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="h-12 mt-1"><SelectValue placeholder="Choose" /></SelectTrigger>
            <SelectContent>{[...filteredSales].reverse().map(s => <SelectItem key={s.id} value={s.id}>{s.invoiceNo} - {s.customerName}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      {!sale ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Select an invoice to view</p>
        </div>
      ) : (
        <>
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div ref={printRef}>
                <div className="header" style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <h1 style={{ margin: 0, fontSize: '24px' }}>{shop}</h1>
                  <p style={{ color: '#888', fontSize: '14px' }}>Invoice</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '12px 0' }}>
                  <div>
                    <p><strong>Customer:</strong> {sale.customerName}</p>
                    {sale.customerPhone && <p><strong>Phone:</strong> {sale.customerPhone}</p>}
                    <p><strong>Payment:</strong> {sale.paymentMode}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p><strong>Invoice:</strong> {sale.invoiceNo}</p>
                    <p><strong>Date:</strong> {sale.date}</p>
                  </div>
                </div>
                <table>
                  <thead>
                    <tr><th>#</th><th>Product</th><th>Qty</th><th>MRP</th><th>Price</th><th>Disc</th><th>Total</th></tr>
                  </thead>
                  <tbody>
                    {sale.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{item.productName}</td>
                        <td>{item.quantity}</td>
                        <td>₹{(item.mrp || item.sellPrice).toLocaleString()}</td>
                        <td>₹{item.sellPrice.toLocaleString()}</td>
                        <td>₹{(item.discount || 0).toLocaleString()}</td>
                        <td>₹{item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ textAlign: 'right', fontSize: '20px', fontWeight: 'bold', marginTop: '12px' }}>
                  Total: ₹{sale.totalBill.toLocaleString()}
                </div>
                <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '12px', color: '#888' }}>
                  Thank you for shopping at {shop}! 🙏
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handlePrint} className="big-button gap-2"><Printer className="h-5 w-5" />Print</Button>
            <Button onClick={shareWhatsApp} variant="outline" className="big-button gap-2"><MessageCircle className="h-5 w-5" />WhatsApp</Button>
            <Button onClick={shareEmail} variant="outline" className="big-button gap-2"><Mail className="h-5 w-5" />Email</Button>
          </div>
        </>
      )}

      <h3 className="text-lg font-semibold mt-8 mb-3">All Invoices</h3>
      {sales.length === 0 ? (
        <p className="text-center py-10 text-muted-foreground">No invoices yet.</p>
      ) : (
        <div className="space-y-3">
          {[...sales].reverse().map(s => (
            <div key={s.id} className={`stat-card cursor-pointer transition-all ${selectedId === s.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedId(s.id)}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{s.invoiceNo}</p>
                  <p className="text-sm text-muted-foreground">{s.customerName} • {s.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{s.totalBill.toLocaleString()}</p>
                  <p className={`text-xs font-medium ${s.paymentMode === 'Cash' ? 'text-green-600' : s.paymentMode === 'Online' ? 'text-blue-600' : 'text-orange-500'}`}>{s.paymentMode}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
