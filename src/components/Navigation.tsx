import { ShoppingBag, PlusCircle, User, ShoppingCart, LogOut } from 'lucide-react';
import { useStore } from '../Store';

export function Navigation({ onCartClick }: { onCartClick: () => void }) {
  const { role, setRole, cart, user, logout } = useStore();

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full bg-sky-500 shadow-md text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div 
          className="flex items-center gap-2 font-bold text-2xl tracking-tight cursor-pointer"
          onClick={() => setRole('buyer')}
        >
          <div className="bg-white rounded-full p-1.5 flex items-center justify-center">
            <ShoppingBag className="h-6 w-6 text-sky-500" fill="currentColor" />
          </div>
          <span>Shathe</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setRole('seller')}
            className="flex items-center gap-2 rounded bg-amber-400 px-4 py-2 text-sm font-bold text-sky-900 shadow-sm hover:bg-amber-500 transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            <span className="hidden sm:inline">বিজ্ঞাপন দিন</span>
            <span className="sm:hidden">POST</span>
          </button>

          {role === 'buyer' && (
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
            <span className="text-sm font-medium text-white/90 flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {user?.name}
            </span>
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
    </header>
  );
}
