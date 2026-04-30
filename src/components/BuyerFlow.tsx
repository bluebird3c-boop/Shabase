import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Star, X } from 'lucide-react';
import { useStore } from '../Store';
import { Product, Review } from '../types';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export function BuyerFlow() {
  const { products, addToCart, submitReview } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
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
              <ProductCard key={product.id} product={product} onAdd={() => addToCart(product)} onClick={() => setSelectedProduct(product)} />
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
              addToCart(selectedProduct);
              setSelectedProduct(null);
            }}
            onSubmitReview={(rating, comment) => submitReview(selectedProduct.id, rating, comment)}
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
              onAdd();
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded bg-gray-100 text-sky-500 transition-colors hover:bg-sky-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            aria-label="Add to cart"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ProductDetailsModal({ product, onClose, onAdd, onSubmitReview }: { product: Product, onClose: () => void, onAdd: () => void, onSubmitReview: (r: number, c: string) => Promise<void> }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'reviews'), where('productId', '==', product.id), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Review)));
    });
    return () => unsub();
  }, [product.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setIsSubmitting(true);
    await onSubmitReview(rating, comment);
    setComment('');
    setRating(5);
    setIsSubmitting(false);
  };

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
          <div className="p-6 md:p-8 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h2>
            <div className="flex items-center gap-2 mb-4">
              <Star className={`h-5 w-5 ${product.averageRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
              <span className="text-sm font-medium text-gray-700">
                {product.averageRating ? `${product.averageRating.toFixed(1)} rating` : 'No ratings yet'} 
                {product.ratingCount ? ` (${product.ratingCount} reviews)` : ''}
              </span>
            </div>
            <p className="text-3xl font-bold text-sky-600 mb-6">৳ {product.price.toLocaleString('en-IN')}</p>
            <p className="text-gray-600 mb-8 whitespace-pre-wrap flex-1">{product.description}</p>
            
            <button onClick={onAdd} className="w-full bg-sky-500 text-white font-bold py-3 px-4 rounded hover:bg-sky-600 transition-colors flex items-center justify-center gap-2">
              <Plus className="h-5 w-5" /> Add to Cart
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Reviews</h3>
          
          <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 sm:p-6 rounded border border-gray-200">
            <h4 className="text-sm font-bold text-gray-900 mb-4">Write a Review</h4>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star className={`h-6 w-6 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Tell others what you think about this product..."
              className="block w-full rounded border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 mb-4"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gray-900 text-white font-bold py-2 px-6 rounded text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>

          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this product!</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">{review.userName || 'Anonymous'}</span>
                    <span className="text-xs text-gray-500">
                      {review.createdAt ? new Date(review.createdAt.toMillis()).toLocaleDateString() : 'Just now'}
                    </span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`h-4 w-4 ${star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
