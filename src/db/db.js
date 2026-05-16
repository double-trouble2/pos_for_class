import Dexie from 'dexie';

export const db = new Dexie('POSDatabase');

db.version(2).stores({
  products: '++id, name, barcode, price, stock, category',
  sales: '++id, timestamp, total, items, customerId, paymentMethod',
  categories: '++id, name',
  customers: '++id, name, phone, email'
});
