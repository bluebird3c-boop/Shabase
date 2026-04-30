import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ShieldCheck, Zap, Globe, HeartHandshake, Rocket, ArrowRight } from 'lucide-react';

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: "Shathe তে স্বাগতম",
      desc: "আপনার চারপাশের সেরা মার্কেটপ্লেসে যুক্ত হোন। কেনাকাটা ও বিক্রি এখন আরও সহজ।",
      icon: <ShoppingBag className="h-16 w-16 text-sky-600" />
    },
    {
      title: "সহজ বেচাকেনা",
      desc: "খুব সহজে কয়েক ক্লিকেই আপনার পণ্যটি বিক্রির জন্য বিজ্ঞাপন দিন অথবা পছন্দের পণ্য কিনুন।",
      icon: <Globe className="h-16 w-16 text-sky-600" />
    },
    {
      title: "সুরক্ষিত লেনদেন",
      desc: "আমাদের প্ল্যাটফর্মে আপনি ১০০% নিরাপদ পরিবেশে লেনদেন করতে পারবেন।",
      icon: <ShieldCheck className="h-16 w-16 text-sky-600" />
    },
    {
      title: "দ্রুত বিক্রি",
      desc: "সঠিক ক্রেতার কাছে পৌঁছে যান দ্রুত এবং বিক্রি করুন আপনার পণ্য।",
      icon: <Zap className="h-16 w-16 text-sky-600" />
    },
    {
      title: "নির্ভরযোগ্য পার্টনার",
      desc: "বিশ্বস্ত বিক্রেতাদের থেকে পণ্য কিনুন এবং আপনার কেনাকাটার অভিজ্ঞতা উন্নত করুন।",
      icon: <HeartHandshake className="h-16 w-16 text-sky-600" />
    },
    {
      title: "চলুন শুরু করি",
      desc: "এখনই এক্সপ্লোর করুন আপনার প্রয়োজনীয় সব পণ্য, আর যুক্ত হোন আমাদের সাথে।",
      icon: <Rocket className="h-16 w-16 text-sky-600" />
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-sky-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[500px]">
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="mb-8 p-6 bg-sky-50 rounded-full">
                {slides[step].icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{slides[step].title}</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{slides[step].desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-8 bg-white border-t border-gray-100 flex flex-col items-center">
          <div className="flex gap-2 mb-8">
            {slides.map((_, i) => (
              <div key={i} className={`h-2 w-2 rounded-full transition-colors ${i === step ? 'bg-sky-500 w-6' : 'bg-sky-200'}`} />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-sky-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-sky-600 transition-colors flex items-center justify-center gap-2 text-lg"
          >
            {step === slides.length - 1 ? 'অ্যাপে প্রবেশ করুন' : 'পরবর্তী'} 
            {step < slides.length - 1 && <ArrowRight className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
