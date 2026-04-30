import { X, Minus, Plus, ShoppingBag, Star } from 'lucide-react';
import { useStore } from '../Store';
import { motion, AnimatePresence } from 'motion/react';

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, removeFromCart, updateQuantity, checkoutCart } = useStore();

  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 transition-opacity"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">আপনার কার্ট</h2>
              <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-900 rounded bg-gray-50 hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <ShoppingBag className="h-20 w-20 text-gray-200 mb-6" />
                  <p className="text-xl font-medium text-gray-900">কার্ট খালি</p>
                  <p className="text-base mt-2">আপনি এখনো কিছু যোগ করেননি।</p>
                  <button onClick={onClose} className="mt-8 rounded bg-gray-100 px-6 py-3 text-sm font-semibold text-sky-600 hover:bg-gray-200 transition-colors">কেনাকাটা শুরু করুন</button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <li key={item.product.id} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-50">
                        <img src={item.product.imageUrl} alt={item.product.title} className="h-full w-full object-cover object-center" />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3 className="line-clamp-2 pr-4">{item.product.title}</h3>
                            <p className="whitespace-nowrap font-bold text-gray-900">৳ {(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className={`h-3 w-3 ${item.product.averageRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                            <span className="text-[10px] uppercase font-bold text-gray-500">
                              {item.product.averageRating ? item.product.averageRating.toFixed(1) : 'NEW'}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">৳ {item.product.price.toLocaleString('en-IN')} (প্রতিটি)</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm mt-4">
                          <div className="flex items-center border border-gray-200 rounded">
                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1.5 text-gray-500 hover:bg-gray-100 transition-colors rounded-l-lg"><Minus className="h-4 w-4" /></button>
                            <span className="w-10 text-center font-medium text-gray-900">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1.5 text-gray-500 hover:bg-gray-100 transition-colors rounded-r-lg"><Plus className="h-4 w-4" /></button>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id)} type="button" className="font-medium text-red-600 hover:text-red-500">মুছে ফেলুন</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-6 bg-gray-50">
                <div className="flex justify-between text-base font-semibold text-gray-900 mb-4">
                  <p>মোট মূল্য</p>
                  <p className="text-gray-900">৳ {total.toLocaleString('en-IN')}</p>
                </div>
                <p className="text-sm text-gray-500 mb-6">শিপিং চার্জ প্রযোজ্য হতে পারে।</p>
                <button
                  onClick={async () => {
                    const success = await checkoutCart();
                    if (success) {
                      alert('ধন্যবাদ! আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে। (Order placed)');
                      onClose();
                    }
                  }}
                  className="flex w-full items-center justify-center rounded bg-sky-500 px-6 py-4 text-base font-bold text-white shadow-sm hover:bg-sky-600 transition-colors"
                >
                  চেকআউট করুন
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
