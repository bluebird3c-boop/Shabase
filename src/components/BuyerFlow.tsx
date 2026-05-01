import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Star, X, MapPin, Phone, AlertTriangle } from 'lucide-react';
import { useStore } from '../Store';
import { Product, Review } from '../types';
import { collection, query, where, onSnapshot, orderBy, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export function BuyerFlow() {
  const { products, addToCart, user, setShowLoginModal } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory || (!p.category && filterCategory === 'Others');
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">সকল বিজ্ঞাপন</h1>
            <p className="text-gray-500 mt-1">আপনার প্রয়োজনীয় সব কিছু খুঁজুন</p>
          </div>
          <div className="flex flex-1 items-center gap-3 md:justify-end">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="block rounded border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 bg-white"
            >
              <option value="All">সব ক্যাটাগরি (All)</option>
              <option value="Electronics">ইলেকট্রনিক্স</option>
              <option value="Fashion">ফ্যাশন</option>
              <option value="Home">হোম ও লিভিং</option>
              <option value="Vehicles">গাড়ি</option>
              <option value="Properties">প্রপার্টি</option>
              <option value="Others">অন্যান্য</option>
            </select>
            <div className="relative flex-1 max-w-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="কী খুঁজছেন?"
                className="block w-full rounded border-0 py-3 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Search className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-900">কোনো বিজ্ঞাপন পাওয়া যায়নি</p>
            <p className="text-sm">অন্য কিছু লিখে চেষ্টা করুন।</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
            {filtered.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAdd={() => {
                  if (!user) {
                    setShowLoginModal(true);
                    return;
                  }
                  addToCart(product);
                }} 
                onClick={() => setSelectedProduct(product)} 
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAdd={() => {
              if (!user) {
                setShowLoginModal(true);
                return;
              }
              addToCart(selectedProduct);
              setSelectedProduct(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductCard({ product, onAdd, onClick }: { key?: string | number, product: Product, onAdd: () => void, onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col overflow-hidden rounded border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover object-center transition-transform hover:scale-105 duration-300"
        />
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-base font-semibold text-sky-700 line-clamp-1">{product.title}</h3>
        <div className="flex items-center gap-1.5 mt-1">
          <Star className={`h-4 w-4 ${product.averageRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
          <span className="text-xs font-medium text-gray-600">
            {product.averageRating ? product.averageRating.toFixed(1) : 'No ratings'} 
            {product.ratingCount ? ` (${product.ratingCount})` : ''}
          </span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 flex-1">{product.description}</p>
        <div className="flex items-center justify-between pt-4">
          <p className="text-lg font-bold text-gray-900">৳ {product.price.toLocaleString('en-IN')}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="inline-flex h-9 px-4 items-center justify-center rounded bg-sky-500 text-white font-medium transition-colors hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 text-sm"
          >
            কিনুন (Buy)
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ProductDetailsModal({ product, onClose, onAdd }: { product: Product, onClose: () => void, onAdd: () => void }) {
  const { user, setShowLoginModal } = useStore();
  const [sellerInfo, setSellerInfo] = useState<{name: string, phone: string, location: string} | null>(null);

  useEffect(() => {
    if (!product.sellerId) return;
    const fetchSeller = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', product.sellerId));
        if (snap.exists()) {
          const data = snap.data();
          setSellerInfo({
            name: data.name || product.sellerName || '',
            phone: data.phone || product.phone || '',
            location: data.location || product.location || ''
          });
        } else {
          setSellerInfo({
            name: product.sellerName || '',
            phone: product.phone || '',
            location: product.location || ''
          });
        }
      } catch (e) {
        console.error(e);
        setSellerInfo({
          name: product.sellerName || '',
          phone: product.phone || '',
          location: product.location || ''
        });
      }
    };
    fetchSeller();
  }, [product]);

  const displaySellerName = sellerInfo?.name || product.sellerName || 'অজানা বিক্রেতা';
  const displayLocation = sellerInfo?.location || product.location || '';
  const displayPhone = sellerInfo?.phone || product.phone || '';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl flex flex-col">
        <button onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
          <X className="h-5 w-5" />
        </button>
        
        <div className="grid md:grid-cols-2 gap-0 overflow-hidden">
          <div className="bg-gray-100 aspect-square md:aspect-auto">
            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-4 md:p-6 flex flex-col h-full overflow-y-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{product.title}</h2>
            
            {(product.location || product.category) && (
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {product.category && <span className="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800">{product.category}</span>}
                {product.location && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                    <MapPin className="h-3 w-3" /> {product.location}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 mb-3">
              <Star className={`h-4 w-4 ${product.averageRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
              <span className="text-xs font-medium text-gray-700">
                {product.averageRating ? `${product.averageRating.toFixed(1)} rating` : 'No ratings yet'} 
                {product.ratingCount ? ` (${product.ratingCount} reviews)` : ''}
              </span>
            </div>
            <p className="text-2xl font-bold text-sky-600 mb-3">৳ {product.price.toLocaleString('en-IN')}</p>
            <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{product.description}</p>
            
            <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1.5">বিক্রেতার তথ্য (Seller)</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500 font-medium w-14">নাম:</span>
                  <span className="font-bold text-slate-900">{displaySellerName}</span>
                </div>
                {displayLocation && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500 font-medium w-14">লোকেশন:</span>
                    <span className="font-medium text-slate-800">{displayLocation}</span>
                  </div>
                )}
                {displayPhone ? (
                  <div className="flex items-center gap-3 mt-1">
                    <div className="bg-sky-500 p-2 rounded-full text-white shadow-sm">
                      <Phone className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-sky-600 font-medium leading-tight">কল করুন</p>
                      <a href={`tel:${displayPhone}`} className="text-base font-bold text-sky-700 hover:text-sky-800 transition-colors leading-tight">
                        {displayPhone}
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic mt-1">ফোন নম্বর দেওয়া হয়নি</p>
                )}
              </div>
            </div>

            <div className="mb-4 p-2.5 bg-amber-50 rounded border border-amber-200 flex gap-2 items-start">
              <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-tight">
                <span className="font-bold">সতর্কবার্তা:</span> পণ্য হাতে পাওয়ার আগে অগ্রিম টাকা দেবেন না!
              </p>
            </div>
            
            <button onClick={() => {
              if (!user) {
                setShowLoginModal(true);
                return;
              }
              onAdd();
            }} className="mt-auto w-full bg-sky-500 text-white font-bold py-2.5 px-4 rounded hover:bg-sky-600 transition-colors flex items-center justify-center gap-2">
              <Plus className="h-5 w-5" /> Add to Cart
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}