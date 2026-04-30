import { useState } from 'react';
import { StoreProvider, useStore } from './Store';
import { Navigation } from './components/Navigation';
import { BuyerFlow } from './components/BuyerFlow';
import { SellerFlow } from './components/SellerFlow';
import { CartDrawer } from './components/CartDrawer';

function MarketplaceApp() {
  const { role } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navigation onCartClick={() => setIsCartOpen(true)} />
      <main>
        {role === 'buyer' ? <BuyerFlow /> : <SellerFlow />}
      </main>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MarketplaceApp />
    </StoreProvider>
  );
}

