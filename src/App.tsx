import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import { InventoryProvider } from './context/InventoryContext';
import { CartProvider } from './context/CartContext';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'pos':
        return <div className="p-8 text-slate-500">POS Interface (Coming Soon)</div>;
      case 'inventory':
        return <div className="p-8 text-slate-500">Inventory Management (Coming Soon)</div>;
      case 'customers':
        return <div className="p-8 text-slate-500">Customer Management (Coming Soon)</div>;
      case 'settings':
        return <div className="p-8 text-slate-500">Settings (Coming Soon)</div>;
      default:
        return <Dashboard />;
    }
  };

  const getTitle = () => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      pos: 'Point of Sale',
      inventory: 'Inventory Management',
      customers: 'Customer Database',
      settings: 'System Settings',
    };
    return titles[activeTab] || 'Dashboard';
  };

  return (
    <InventoryProvider>
      <CartProvider>
        <div className="min-h-screen bg-slate-50 flex">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 ml-64 min-h-screen">
            <Header title={getTitle()} />
            {renderContent()}
          </main>
        </div>
      </CartProvider>
    </InventoryProvider>
  );
}

export default App;
