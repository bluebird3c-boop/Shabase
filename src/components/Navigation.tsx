import { useState } from 'react';
import { ShoppingBag, PlusCircle, User, ShoppingCart, LogOut, Menu, X } from 'lucide-react';
import { useStore } from '../Store';

export function Navigation({ onCartClick }: { onCartClick: () => void }) {
  const { tab, setTab, cart, user, logout } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full bg-sky-500 shadow-md text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-2 -ml-2 text-white hover:bg-white/20 rounded transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          <div 
            className="flex items-center gap-2 font-bold text-2xl tracking-tight cursor-pointer"
            onClick={() => setTab('home')}
          >
            <div className="bg-white rounded-full p-1.5 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-sky-500" fill="currentColor" />
            </div>
            <span>Shathe</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium ml-8 flex-1">
          <button onClick={() => setTab('home')} className={`transition-colors border-b-2 py-5 ${tab === 'home' ? 'border-white text-white font-bold' : 'border-transparent text-sky-100 hover:text-white'}`}>Home</button>
          <button onClick={() => setTab('buy')} className={`transition-colors border-b-2 py-5 ${tab === 'buy' ? 'border-white text-white font-bold' : 'border-transparent text-sky-100 hover:text-white'}`}>Buy</button>
          <button onClick={() => setTab('sell')} className={`transition-colors border-b-2 py-5 ${tab === 'sell' ? 'border-white text-white font-bold' : 'border-transparent text-sky-100 hover:text-white'}`}>Sell</button>
          <button onClick={() => setTab('wallet')} className={`transition-colors border-b-2 py-5 ${tab === 'wallet' ? 'border-white text-white font-bold' : 'border-transparent text-sky-100 hover:text-white'}`}>Wallet</button>
          <button onClick={() => setTab('profile')} className={`transition-colors border-b-2 py-5 ${tab === 'profile' ? 'border-white text-white font-bold' : 'border-transparent text-sky-100 hover:text-white'}`}>Profile</button>
          <button onClick={() => setTab('about')} className={`transition-colors border-b-2 py-5 ${tab === 'about' ? 'border-white text-white font-bold' : 'border-transparent text-sky-100 hover:text-white'}`}>About</button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTab('sell')}
            className="flex items-center gap-2 rounded bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-bold text-sky-600 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            <span className="hidden sm:inline">বিজ্ঞাপন দিন</span>
            <span className="sm:hidden">POST</span>
          </button>

          {tab === 'buy' && (
            <button
              onClick={onCartClick}
              className="relative p-2 text-white hover:text-gray-200 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-sky-500">
                  {cartItemsCount}
                </span>
              )}
            </button>
          )}

          <div className="h-6 w-px bg-white/30 mx-1 hidden sm:block"></div>

          <div className="hidden sm:flex items-center gap-3">
            <button onClick={() => setTab('profile')} className="text-sm font-medium text-white/90 flex items-center gap-1.5 hover:text-white transition-colors">
              <User className="h-4 w-4 text-white" />
              {user?.name}
            </button>
            <button
              onClick={logout}
              className="flex items-center justify-center rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
              title="Logout / লগ আউট"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-sky-400 bg-sky-500 pb-4 pt-2">
          <nav className="flex flex-col space-y-1 px-4">
            {[
              { id: 'home', label: 'Home / হোম' },
              { id: 'buy', label: 'Buy / কিনুন' },
              { id: 'sell', label: 'Sell / বিক্রি করুন' },
              { id: 'wallet', label: 'Wallet / আপনার ওয়ালেট' },
              { id: 'profile', label: 'Profile / আপনার প্রোফাইল' },
              { id: 'about', label: 'About / আমাদের সম্পর্কে' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setTab(item.id as any);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex w-full items-center rounded-md px-3 py-2.5 text-base font-medium transition-colors ${
                  tab === item.id ? 'bg-sky-600 text-white font-bold' : 'text-sky-100 hover:bg-sky-600 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="mt-4 border-t border-sky-400 pt-4 pb-2">
               <div className="flex items-center justify-between px-3">
                 <div className="flex items-center gap-2">
                   <div className="rounded-full bg-sky-600 p-2">
                     <User className="h-5 w-5 text-white" />
                   </div>
                   <div className="text-sm font-bold text-white">{user?.name}</div>
                 </div>
                 <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 text-sky-100 hover:text-white transition-colors p-2 text-sm font-semibold">
                   <LogOut className="h-5 w-5" /> লগ আউট
                 </button>
               </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
