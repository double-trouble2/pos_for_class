import Dexie from 'dexie';

export const db = new Dexie('POSDatabase');

db.version(2).stores({
  products: '++id, name, barcode, price, stock, category',
  sales: '++id, timestamp, total, items',
  categories: '++id, name',
  suppliers: '++id, name, phone, contactPerson',
  warehouse_logs: '++id, productId, productName, type, quantity, supplierId, timestamp'
});
