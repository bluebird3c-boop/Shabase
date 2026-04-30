import { useState } from 'react';
import { User as UserIcon, Save } from 'lucide-react';
import { useStore } from '../Store';

export function ProfileFlow() {
  const { user } = useStore();
  const [profileImg, setProfileImg] = useState<string>('');
  const [name, setName] = useState(user?.name || '');

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">আপনার প্রোফাইল</h1>
        <p className="text-gray-500 mt-1">প্রোফাইলের তথ্য পরিচালনা করুন (Manage your profile)</p>
      </div>

      <div className="rounded border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
          <div className="relative h-24 w-24 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            {profileImg ? (
              <img src={profileImg} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <UserIcon className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <label className="block text-sm font-medium text-gray-700 mb-2">প্রোফাইল ছবি পরিবর্তন করুন (Change Picture)</label>
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setProfileImg(reader.result as string);
                reader.readAsDataURL(file);
              }
            }} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-600 hover:file:bg-sky-100 mx-auto sm:mx-0 cursor-pointer" />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">আপনার নাম (Your Name)</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-2 block w-full rounded border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6" />
          </div>
          
          <button className="rounded bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-sky-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 flex items-center gap-2">
            <Save className="h-4 w-4" /> সেইভ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
