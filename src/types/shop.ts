export interface Customer {
  id: string;
  name: string;
  phone: string;
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
  image: string;
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
  mrp: number;
  discount: number;
  total: number;
}

export interface SaleEntry {
  id: string;
  invoiceNo: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: SaleItem[];
  totalBill: number;
  paymentMode: 'Cash' | 'Online' | 'Due';
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

export interface Employee {
  id: string;
  name: string;
  phone: string;
  role: string;
  salary: number;
  joinDate: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Half Day';
}

export interface SalaryPayment {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  month: string;
  date: string;
  note: string;
}

export interface DailyEntry {
  id: string;
  type: 'revenue' | 'expenditure';
  title: string;
  amount: number;
  category: string;
  date: string;
  time: string;
  createdAt: string;
}
