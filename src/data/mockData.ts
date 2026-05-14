import type { Product, Customer, Sale } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Fresh Milk 1L',
    category: 'Dairy',
    price: 12.50,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1563636619-e9107da8a7ac?auto=format&fit=crop&q=80&w=200',
    lowStockThreshold: 10
  },
  {
    id: '2',
    name: 'Whole Wheat Bread',
    category: 'Bakery',
    price: 4.20,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200',
    lowStockThreshold: 5
  },
  {
    id: '3',
    name: 'Organic Eggs (12pk)',
    category: 'Dairy',
    price: 18.00,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=200',
    lowStockThreshold: 10
  },
  {
    id: '4',
    name: 'Coca Cola 1.5L',
    category: 'Beverages',
    price: 15.00,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200',
    lowStockThreshold: 15
  },
  {
    id: '5',
    name: 'Red Apples (1kg)',
    category: 'Produce',
    price: 22.00,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?auto=format&fit=crop&q=80&w=200',
    lowStockThreshold: 10
  }
];

export const customers: Customer[] = [
  {
    id: 'c1',
    name: 'John Doe',
    phone: '+1 234 567 890',
    points: 150,
  },
  {
    id: 'c2',
    name: 'Jane Smith',
    phone: '+1 987 654 321',
    points: 45,
  }
];

export const sales: Sale[] = [
  {
    id: 's1',
    items: [
      { ...products[0], quantity: 2 },
      { ...products[1], quantity: 1 }
    ],
    total: 29.20,
    discount: 0,
    tax: 0,
    paymentMethod: 'card',
    timestamp: new Date().toISOString(),
  }
];
