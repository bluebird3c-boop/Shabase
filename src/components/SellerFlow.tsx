import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Plus, Package, Trash2 } from 'lucide-react';
import { useStore } from '../Store';
import { Product } from '../types';

export function SellerFlow() {
  const { products, addProduct, removeProduct } = useStore();
  const myProducts = products.filter(p => p.sellerId === 'me');
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your products and store details.</p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
          >
            {isAdding ? 'Cancel' : <><Plus className="h-5 w-5" /> Add Product</>}
          </button>
        </div>

        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden"
          >
            <AddProductForm onClose={() => setIsAdding(false)} onAdd={addProduct} />
          </motion.div>
        )}

        <div className="rounded-3xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
            <h3 className="text-base font-semibold leading-6 text-gray-900">My Listings ({myProducts.length})</h3>
          </div>
          {myProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500">
              <Package className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-xl font-medium text-gray-900">No products listed yet</p>
              <p className="text-sm mt-1">Add your first product to start selling!</p>
              <button
                onClick={() => setIsAdding(true)}
                className="mt-6 font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Add a product &rarr;
              </button>
            </div>
          ) : (
            <ul role="list" className="divide-y divide-gray-200">
              {myProducts.map((product) => (
                <li key={product.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-6 py-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    <img src={product.imageUrl} alt={product.title} className="h-20 w-20 rounded-xl object-cover bg-gray-100 flex-shrink-0 border border-gray-200" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-gray-900">{product.title}</p>
                      <p className="truncate text-sm text-gray-500 mt-1">{product.description}</p>
                      <p className="text-sm font-medium text-gray-900 mt-2">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600"
                      title="Delete product"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function AddProductForm({ onClose, onAdd }: { onClose: () => void, onAdd: (p: Omit<Product, 'id'|'sellerId'>) => void }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAdd({
      title,
      price: parseFloat(price) || 0,
      description: desc,
      imageUrl: img || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'
    });
    setTitle('');
    setPrice('');
    setDesc('');
    setImg('');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded-3xl border border-gray-200 bg-gray-50 p-6 md:p-8 space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">Product Title</label>
          <div className="mt-2">
            <input required type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="block w-full rounded-xl border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4 bg-white" placeholder="e.g. Handmade Leather Wallet" />
          </div>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">Price ($)</label>
          <div className="mt-2 relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input required type="number" min="0" step="0.01" id="price" value={price} onChange={e => setPrice(e.target.value)} className="block w-full rounded-xl border-0 py-3 pl-8 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white" placeholder="0.00" />
          </div>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">Image URL</label>
          <div className="mt-2">
            <input type="url" id="image" value={img} onChange={e => setImg(e.target.value)} className="block w-full rounded-xl border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4 bg-white" placeholder="https://..." />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Description</label>
          <div className="mt-2">
            <textarea required id="description" rows={3} value={desc} onChange={e => setDesc(e.target.value)} className="block w-full rounded-xl border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4 bg-white" placeholder="Describe the item..." />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
        <button type="button" onClick={onClose} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors">Cancel</button>
        <button type="submit" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save Product</button>
      </div>
    </form>
  );
}
