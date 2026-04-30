import { useState } from 'react';
import { Wallet, CreditCard, ArrowUpRight, ArrowDownRight, Clock, Upload } from 'lucide-react';

export function WalletFlow() {
  const [receiptImg, setReceiptImg] = useState<string>('');
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">আপনার ওয়ালেট</h1>
        <p className="text-gray-500 mt-1">ব্যালেন্স দেখুন এবং লেনদেন পরিচালনা করুন</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="rounded border border-gray-200 bg-white p-6 shadow-sm col-span-full sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-sky-100 text-sky-600 rounded-full">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">বর্তমান ব্যালেন্স</p>
              <h2 className="text-2xl font-bold text-gray-900">৳ 12,450</h2>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button className="flex-1 bg-sky-500 text-white font-bold py-2 rounded text-sm hover:bg-sky-600 transition-colors">
              অ্যাড মানি
            </button>
            <button className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-2 rounded text-sm hover:bg-gray-50 transition-colors">
              উইথড্র
            </button>
          </div>
        </div>
        
        <div className="rounded border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-center">
           <p className="text-sm font-medium text-gray-500">পয়েন্টস</p>
           <h2 className="text-2xl font-bold text-amber-500 mt-1">450 <span className="text-sm font-normal text-gray-400">pts</span></h2>
           <p className="text-xs text-gray-400 mt-2">আরও পয়েন্ট পেতে বেচাকেনা করুন</p>
        </div>

        <div className="rounded border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-center">
           <p className="text-sm font-medium text-gray-500">লিঙ্কড কার্ড</p>
           <div className="flex items-center gap-3 mt-2">
             <CreditCard className="h-5 w-5 text-gray-400" />
             <span className="text-sm font-medium text-gray-700">**** **** **** 4242</span>
           </div>
        </div>
      </div>

      <div className="rounded border border-gray-200 bg-white p-6 shadow-sm mb-8">
         <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
           <Upload className="h-5 w-5 text-sky-500" /> পেমেন্ট রসিদ আপলোড (Upload Receipt)
         </h3>
         <p className="text-sm text-gray-500 mb-4">অ্যাড মানি বা উইথড্র এর ডকুমেন্ট প্রমাণস্বরূপ আপলোড করুন।</p>
         <input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
               const reader = new FileReader();
               reader.onloadend = () => setReceiptImg(reader.result as string);
               reader.readAsDataURL(file);
            }
         }} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-600 hover:file:bg-sky-100 cursor-pointer" />
         {receiptImg && <img src={receiptImg} alt="Receipt Preview" className="mt-4 h-32 w-auto object-contain rounded border border-gray-200" />}
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-4">সাম্প্রতিক লেনদেন</h3>
      <div className="rounded border border-gray-200 bg-white shadow-sm divide-y divide-gray-100 overflow-hidden">
         {[1, 2, 3, 4].map((i) => (
           <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
             <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${i % 2 === 0 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                  {i % 2 === 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{i % 2 === 0 ? 'পণ্য বিক্রয়' : 'অ্যাড মানি'}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Clock className="h-3 w-3" /> ১২ অক্টো, ২০২৩</p>
                </div>
             </div>
             <div className="text-right">
               <p className={`text-sm font-bold ${i % 2 === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                 {i % 2 === 0 ? '+' : ''}৳ {i * 1200}
               </p>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
}
