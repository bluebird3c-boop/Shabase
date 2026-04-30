import { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { StoreProvider, useStore } from './Store';
import { Navigation } from './components/Navigation';
import { HomeFlow } from './components/HomeFlow';
import { BuyerFlow } from './components/BuyerFlow';
import { SellerFlow } from './components/SellerFlow';
import { WalletFlow } from './components/WalletFlow';
import { ProfileFlow } from './components/ProfileFlow';
import { AboutFlow } from './components/AboutFlow';
import { CartDrawer } from './components/CartDrawer';
import { LoginScreen as LoginModal } from './components/LoginScreen';
import { OnboardingFlow } from './components/OnboardingFlow';

function MarketplaceApp() {
  const { tab, isLoading, showLoginModal, user } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('hasSeenOnboarding'));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-emerald-600"></div>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => {
      localStorage.setItem('hasSeenOnboarding', 'true');
      setShowOnboarding(false);
    }} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navigation onCartClick={() => setIsCartOpen(true)} />
      <main>
        {tab === 'home' && <HomeFlow />}
        {tab === 'buy' && <BuyerFlow />}
        {tab === 'sell' && user && <SellerFlow />}
        {tab === 'wallet' && user && <WalletFlow />}
        {tab === 'profile' && user && <ProfileFlow />}
        {tab === 'about' && <AboutFlow />}
      </main>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      {showLoginModal && <LoginModal />}
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

