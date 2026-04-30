import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Plus } from 'lucide-react';
import { useStore } from '../Store';
import { Product } from '../types';

export function BuyerFlow() {
  const { products, addToCart } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">সকল বিজ্ঞাপন</h1>
            <p className="text-gray-500 mt-1">আপনার প্রয়োজনীয় সব কিছু খুঁজুন</p>
          </div>
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="কী খুঁজছেন?"
              className="block w-full rounded border-0 py-3 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
              <ProductCard key={product.id} product={product} onAdd={() => addToCart(product)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product, onAdd }: { key?: string | number, product: Product, onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col overflow-hidden rounded border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
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
        <p className="text-sm text-gray-500 line-clamp-2 flex-1">{product.description}</p>
        <div className="flex items-center justify-between pt-4">
          <p className="text-lg font-bold text-gray-900">৳ {product.price.toLocaleString('en-IN')}</p>
          <button
            onClick={onAdd}
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
