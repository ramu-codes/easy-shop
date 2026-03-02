export interface Customer {
  id: string;
  name: string;
  location: string;
  dueAmount: number;
  createdAt: string;
}

export interface Seller {
  id: string;
  name: string;
  location: string;
  createdAt: string;
}

export interface Product {
  id: string;
  itemName: string;
  printPrice: number;
  purchasePrice: number;
  sellPrice: number;
  stock: number;
  createdAt: string;
}

export interface PurchaseEntry {
  id: string;
  sellerId: string;
  sellerName: string;
  itemId: string;
  itemName: string;
  quantity: number;
  purchasePrice: number;
  totalAmount: number;
  dueAmount: number;
  date: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  sellPrice: number;
  total: number;
}

export interface SaleEntry {
  id: string;
  customerId: string;
  customerName: string;
  items: SaleItem[];
  totalBill: number;
  paymentMode: 'Cash' | 'Due';
  date: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
}

export interface PaymentRecord {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  date: string;
}
