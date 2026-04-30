import { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { StoreProvider, useStore } from './Store';
import { Navigation } from './components/Navigation';
import { BuyerFlow } from './components/BuyerFlow';
import { SellerFlow } from './components/SellerFlow';
import { CartDrawer } from './components/CartDrawer';
import { LoginScreen } from './components/LoginScreen';

function MarketplaceApp() {
  const { role, user, isLoading } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

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
  const clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID || '1234567890-mock.apps.googleusercontent.com'; // fallback for dev without env
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <StoreProvider>
        <MarketplaceApp />
      </StoreProvider>
    </GoogleOAuthProvider>
  );
}

