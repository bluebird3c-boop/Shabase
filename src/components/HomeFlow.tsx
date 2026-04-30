import { ArrowRight, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';
import { useStore } from '../Store';
import { BuyerFlow } from './BuyerFlow';

export function HomeFlow() {
  const { setTab } = useStore();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-sky-500 text-white pb-16 pt-14 sm:pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              আপনার বিশ্বস্ত অনলাইন মার্কেটপ্লেস
            </h1>
            <p className="text-lg leading-8 text-sky-100 mb-10">
              Shathe তে আপনি খুব সহজেই নতুন এবং ব্যবহৃত পণ্য কিনতে ও বিক্রি করতে পারবেন। আজই শুরু করুন!
            </p>
            <div className="flex items-center justify-center gap-x-6">
              <button
                onClick={() => setTab('buy')}
                className="rounded bg-white px-5 py-3 text-sm font-bold text-sky-600 shadow-sm hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors"
              >
                কেনাকাটা করুন
              </button>
              <button
                onClick={() => setTab('sell')}
                className="text-sm font-bold leading-6 text-white hover:text-sky-100 flex items-center gap-1"
              >
                বিজ্ঞাপন দিন <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 sm:py-24 bg-gray-50 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-12 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100">
                <ShoppingBag className="h-8 w-8 text-sky-600" />
              </div>
              <dt className="text-lg font-bold text-gray-900">সহজ বেচাকেনা</dt>
              <dd className="mt-2 text-base text-gray-600">খুব সহজে কয়েক ক্লিকেই আপনার পণ্যটি বিক্রির জন্য বিজ্ঞাপন দিন অথবা পছন্দের পণ্য কিনুন।</dd>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <ShieldCheck className="h-8 w-8 text-amber-600" />
              </div>
              <dt className="text-lg font-bold text-gray-900">সুরক্ষিত লেনদেন</dt>
              <dd className="mt-2 text-base text-gray-600">আমাদের প্ল্যাটফর্মে আপনি ১০০% নিরাপদ পরিবেশে লেনদেন করতে পারবেন।</dd>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <dt className="text-lg font-bold text-gray-900">দ্রুত বিক্রি</dt>
              <dd className="mt-2 text-base text-gray-600">সঠিক ক্রেতার কাছে পৌঁছে যান দ্রুত এবং বিক্রি করুন আপনার পণ্য।</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Embedded BuyerFlow for latest products */}
      <div className="py-10">
        <BuyerFlow />
      </div>
    </div>
  );
}
