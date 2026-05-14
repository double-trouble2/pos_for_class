export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  barcode?: string;
  lowStockThreshold?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  discount: number;
  tax: number;
  paymentMethod: 'cash' | 'card' | 'mobile';
  timestamp: string;
  customerId?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  points: number;
  lastPurchase?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'cashier';
  avatar?: string;
}
