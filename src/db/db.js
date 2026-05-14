import Dexie from 'dexie';

export const db = new Dexie('POSDatabase');

db.version(1).stores({
  products: '++id, name, barcode, price, stock, category',
  sales: '++id, timestamp, total, items',
  categories: '++id, name'
});
