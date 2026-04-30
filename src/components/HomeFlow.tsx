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

      {/* Embedded BuyerFlow for latest products */}
      <div className="py-10">
        <BuyerFlow />
      </div>
    </div>
  );
}
