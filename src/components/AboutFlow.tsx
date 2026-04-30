import { Shield, Users, Mail, MapPin } from 'lucide-react';

export function AboutFlow() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Shathe সম্পর্কে</h1>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
          বাংলাদেশের সবচেয়ে দ্রুত বর্ধনশীল অনলাইন মার্কেটপ্লেস, যেখানে আপনি নিরাপদে বেচাকেনা করতে পারবেন।
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 mb-16">
        <div className="rounded border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">সহজ বেচাকেনা</h3>
          <p className="text-gray-600">
            খুব সহজে কয়েক ক্লিকেই আপনার পণ্যটি বিক্রির জন্য বিজ্ঞাপন দিন অথবা পছন্দের পণ্য কিনুন।
          </p>
        </div>
        <div className="rounded border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">সুরক্ষিত লেনদেন</h3>
          <p className="text-gray-600">
            আমাদের প্ল্যাটফর্মে আপনি ১০০% নিরাপদ পরিবেশে লেনদেন করতে পারবেন।
          </p>
        </div>
        <div className="rounded border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">দ্রুত বিক্রি</h3>
          <p className="text-gray-600">
            সঠিক ক্রেতার কাছে পৌঁছে যান দ্রুত এবং বিক্রি করুন আপনার পণ্য।
          </p>
        </div>
      </div>

      <div className="rounded border border-gray-200 bg-white p-8 shadow-sm text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-6">যোগাযোগ করুন</h3>
        <div className="flex flex-col md:flex-row justify-center gap-8 text-sm">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Mail className="h-5 w-5 text-sky-500" />
            <span>support@shathe.com.bd</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <MapPin className="h-5 w-5 text-sky-500" />
            <span>বনানী, ঢাকা, বাংলাদেশ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
