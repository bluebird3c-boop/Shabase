import { ShoppingBag, Store, User, ShoppingCart } from 'lucide-react';
import { useStore } from '../Store';

export function Navigation({ onCartClick }: { onCartClick: () => void }) {
  const { role, setRole, cart } = useStore();

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 font-bold text-xl text-gray-900 tracking-tight">
          <ShoppingBag className="h-6 w-6 text-indigo-600" />
          <span>Market</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 p-1 rounded-full items-center">
            <button
              onClick={() => setRole('buyer')}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${role === 'buyer' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <User className="h-4 w-4" />
              Buyer
            </button>
            <button
              onClick={() => setRole('seller')}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${role === 'seller' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <Store className="h-4 w-4" />
              Seller
            </button>
          </div>

          {role === 'buyer' && (
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {cartItemsCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
