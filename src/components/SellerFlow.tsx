import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Plus, Package, Trash2 } from 'lucide-react';
import { useStore } from '../Store';
import { Product } from '../types';

export function SellerFlow() {
  const { products, addProduct, removeProduct, user, setTab } = useStore();
  const myProducts = products.filter(p => p.sellerId === (user ? user.id : 'me') || p.sellerId === 'me');
  const [isAdding, setIsAdding] = useState(false);

  const isProfileComplete = user && user.name && user.phone && user.location;

  if (!isProfileComplete) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 shadow-sm inline-block max-w-2xl w-full">
          <h2 className="text-2xl font-bold text-amber-800 mb-4">অনুগ্রহ করে আপনার প্রোফাইল সম্পূর্ণ করুন</h2>
          <p className="text-amber-700 text-lg mb-8">
            বিজ্ঞাপন দেওয়া শুরু করার আগে আপনার প্রোফাইলে নাম (Name), ফোন নম্বর (Number) এবং লোকেশন (Location) যোগ করা বাধ্যতামূলক।
          </p>
          <button
            onClick={() => setTab('profile')}
            className="rounded bg-amber-500 px-6 py-3 text-lg font-bold text-white shadow-sm hover:bg-amber-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          >
            প্রোফাইলে যান (Go to Profile)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">আপনার বিজ্ঞাপনসমূহ</h1>
            <p className="text-gray-500 mt-1">বিজ্ঞাপন দিন এবং আপনার বিক্রয় পরিচালনা করুন।</p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center justify-center gap-2 rounded bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors"
          >
            {isAdding ? 'বাতিল করুন' : <><Plus className="h-5 w-5" /> বিজ্ঞাপন দিন</>}
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

        <div className="rounded border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
            <h3 className="text-base font-semibold leading-6 text-gray-900">প্রকাশিত বিজ্ঞাপন ({myProducts.length})</h3>
          </div>
          {myProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500">
              <Package className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-xl font-medium text-gray-900">কোনো বিজ্ঞাপন নেই</p>
              <p className="text-sm mt-1">বিক্রয় শুরু করতে আপনার প্রথম বিজ্ঞাপন দিন!</p>
              <button
                onClick={() => setIsAdding(true)}
                className="mt-6 font-medium text-sky-600 hover:text-sky-700 transition-colors"
              >
                বিজ্ঞাপন দিন &rarr;
              </button>
            </div>
          ) : (
            <ul role="list" className="divide-y divide-gray-200">
              {myProducts.map((product) => (
                <li key={product.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-6 py-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    <img src={product.imageUrl} alt={product.title} className="h-20 w-20 rounded object-cover bg-gray-100 flex-shrink-0 border border-gray-200" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-gray-900">{product.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {product.category && <span className="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800">{product.category}</span>}
                        {product.location && <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">{product.location}</span>}
                        <p className="truncate text-sm text-gray-500">{product.description}</p>
                      </div>
                      <p className="text-sm font-bold text-sky-600 mt-2">৳ {product.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600"
                      title="মুছে ফেলুন (Delete)"
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
  const { user } = useStore();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState('');
  const [category, setCategory] = useState('Others');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAdd({
      title,
      price: parseFloat(price) || 0,
      description: desc,
      imageUrl: img || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
      category,
      location: user?.location || '',
      phone: user?.phone || '',
      sellerName: user?.name || ''
    });
    setTitle('');
    setPrice('');
    setDesc('');
    setImg('');
    setCategory('Others');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded border border-gray-200 bg-white p-6 md:p-8 space-y-6 shadow-sm">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">পণ্যের নাম</label>
          <div className="mt-2">
            <input required type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="block w-full rounded border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 px-4 bg-white" placeholder="যেমন: আইফোন ১৩ প্রো..." />
          </div>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">মূল্য (৳)</label>
          <div className="mt-2 relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="text-gray-500 sm:text-sm">৳</span>
            </div>
            <input required type="number" min="0" step="1" id="price" value={price} onChange={e => setPrice(e.target.value)} className="block w-full rounded border-0 py-3 pl-8 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 bg-white" placeholder="0" />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">ক্যাটাগরি</label>
          <div className="mt-2 text-gray-900">
            <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="block w-full rounded border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 bg-white">
              <option value="Others">অন্যান্য (Others)</option>
              <option value="Electronics">ইলেকট্রনিক্স (Electronics)</option>
              <option value="Fashion">ফ্যাশন (Fashion)</option>
              <option value="Home">হোম ও লিভিং (Home)</option>
              <option value="Vehicles">গাড়ি (Vehicles)</option>
              <option value="Properties">প্রপার্টি (Properties)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900">পণ্যের ছবি (Image)</label>
          <div className="mt-2 space-y-3">
            <div className="flex items-center gap-4">
              {img && <img src={img} alt="Preview" className="h-16 w-16 object-cover rounded border border-gray-300 bg-gray-50" />}
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 800000) {
                    alert('ছবি অনেক বড়! দয়া করে ছোট ছবি আপলোড করুন (< 800KB)। (File too large)');
                    return;
                  }
                  const reader = new FileReader();
                  reader.onloadend = () => setImg(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-600 hover:file:bg-sky-100 cursor-pointer focus:outline-none" />
            </div>
            <p className="text-xs text-gray-500">অথবা ছবির URL দিন:</p>
            <input type="url" id="image" value={img} onChange={e => setImg(e.target.value)} className="block w-full rounded border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 px-4 bg-white" placeholder="https://..." />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">বিবরণ</label>
          <div className="mt-2">
            <textarea required id="description" rows={3} value={desc} onChange={e => setDesc(e.target.value)} className="block w-full rounded border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 px-4 bg-white" placeholder="পণ্যের বিস্তারিত বিবরণ দিন..." />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
        <button type="button" onClick={onClose} className="rounded px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors">বাতিল</button>
        <button type="submit" className="rounded bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-sky-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500">বিজ্ঞাপন প্রকাশ করুন</button>
      </div>
    </form>
  );
}
