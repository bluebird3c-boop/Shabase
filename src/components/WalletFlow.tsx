import { useState } from 'react';
import { Wallet, CreditCard, ArrowUpRight, ArrowDownRight, Clock, Upload, CheckCircle, XCircle } from 'lucide-react';
import { useStore } from '../Store';

export function WalletFlow() {
  const { user, transactions, orders, addMoney, releasePaymentBuyer, refundOrderSeller } = useStore();
  const [receiptImg, setReceiptImg] = useState<string>('');

  const deposit = () => {
    const amount = prompt("কত টাকা অ্যাড করতে চান? (Enter amount)");
    if (amount && !isNaN(Number(amount))) {
      addMoney(Number(amount));
      alert("টাকা অ্যাড হয়েছে! (Money added)");
    }
  };

  const myPurchases = orders.filter(o => o.buyerId === user?.id);
  const mySales = orders.filter(o => o.sellerId === user?.id);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
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
              <h2 className="text-2xl font-bold text-gray-900">৳ {user?.walletBalance?.toLocaleString('en-IN') || 0}</h2>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={deposit} className="flex-1 bg-sky-500 text-white font-bold py-2 rounded text-sm hover:bg-sky-600 transition-colors">
              অ্যাড মানি
            </button>
            <button onClick={() => alert('উইথড্র ফাংশনালটি এখনো কাজ করছে! (Coming soon)')} className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-2 rounded text-sm hover:bg-gray-50 transition-colors">
              উইথড্র
            </button>
          </div>
        </div>
        
        <div className="rounded border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-center">
           <p className="text-sm font-medium text-gray-500">পয়েন্টস</p>
           <h2 className="text-2xl font-bold text-amber-500 mt-1">{Math.floor((user?.walletBalance || 0) / 100)} <span className="text-sm font-normal text-gray-400">pts</span></h2>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
           <h3 className="text-lg font-bold text-gray-900 mb-4">আমার কেনাকাটা (My Purchases)</h3>
           <div className="rounded border border-gray-200 bg-white shadow-sm divide-y divide-gray-100 overflow-hidden">
             {myPurchases.length === 0 && <p className="p-4 text-sm text-gray-500">কোনো অর্ডার নেই।</p>}
             {myPurchases.map((o) => (
               <div key={o.id} className="p-4 hover:bg-gray-50">
                 <div className="flex justify-between mb-2">
                   <p className="font-bold text-gray-900">{o.productTitle}</p>
                   <p className="font-bold text-sky-600">৳ {o.amount}</p>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className={`text-xs px-2 py-1 rounded font-medium ${o.status === 'pending' ? 'bg-amber-100 text-amber-800' : o.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>Status: {o.status}</span>
                   {o.status === 'pending' && (
                     <button onClick={() => releasePaymentBuyer(o)} className="text-sm bg-green-500 text-white px-3 py-1.5 rounded font-bold hover:bg-green-600 flex items-center gap-1">
                       <CheckCircle className="h-4 w-4" /> পেমেন্ট রিলিজ (Release)
                     </button>
                   )}
                 </div>
               </div>
             ))}
           </div>
        </div>

        <div>
           <h3 className="text-lg font-bold text-gray-900 mb-4">আমার বিক্রি (My Sales)</h3>
           <div className="rounded border border-gray-200 bg-white shadow-sm divide-y divide-gray-100 overflow-hidden">
             {mySales.length === 0 && <p className="p-4 text-sm text-gray-500">কোনো বিক্রি নেই।</p>}
             {mySales.map((o) => (
               <div key={o.id} className="p-4 hover:bg-gray-50">
                 <div className="flex justify-between mb-2">
                   <p className="font-bold text-gray-900">{o.productTitle}</p>
                   <p className="font-bold text-sky-600">৳ {o.amount}</p>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className={`text-xs px-2 py-1 rounded font-medium ${o.status === 'pending' ? 'bg-amber-100 text-amber-800' : o.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>Status: {o.status}</span>
                   {o.status === 'pending' && (
                     <button onClick={() => refundOrderSeller(o)} className="text-sm bg-red-500 text-white px-3 py-1.5 rounded font-bold hover:bg-red-600 flex items-center gap-1">
                       <XCircle className="h-4 w-4" /> বাতিল ও রিফান্ড
                     </button>
                   )}
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-4">সাম্প্রতিক লেনদেন (Transactions)</h3>
      <div className="rounded border border-gray-200 bg-white shadow-sm divide-y divide-gray-100 overflow-hidden">
         {transactions.length === 0 && <p className="p-4 text-sm text-gray-500">কোনো লেনদেন নেই।</p>}
         {transactions.map((tx) => {
           const isPositive = tx.amount > 0;
           return (
             <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
               <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{tx.description}</p>
                    {tx.createdAt && <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Clock className="h-3 w-3" /> {new Date(tx.createdAt.toMillis()).toLocaleString()}</p>}
                  </div>
               </div>
               <div className="text-right">
                 <p className={`text-sm font-bold ${isPositive ? 'text-green-600' : 'text-gray-900'}`}>
                   {isPositive ? '+' : ''}৳ {Math.abs(tx.amount).toLocaleString('en-IN')}
                 </p>
               </div>
             </div>
           );
         })}
      </div>
    </div>
  );
}
