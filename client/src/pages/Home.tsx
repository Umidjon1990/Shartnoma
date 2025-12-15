import React from 'react';
import { BotWizard } from '@/components/BotWizard';
import { Link } from 'wouter';
import { ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-900">
            <span className="bg-blue-600 text-white p-1 rounded">ZT</span>
            <span>Zamonaviy Ta'lim</span>
          </div>
          <nav className="flex gap-4 text-sm font-medium">
             <Link href="/admin" className="text-gray-500 hover:text-blue-600 flex items-center gap-1">
               <ShieldCheck className="w-4 h-4" />
               Admin Panel
             </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8">
        <BotWizard />
      </main>
    </div>
  );
}
