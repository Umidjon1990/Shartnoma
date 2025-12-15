import React from 'react';
import { WebWizard } from '@/components/WebWizard';
import { Link } from 'wouter';
import { ShieldCheck, GraduationCap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 py-4 px-4 md:px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3 font-bold text-lg md:text-xl text-blue-900">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span>Zamonaviy Ta'lim</span>
          </div>
          <nav className="flex gap-4 text-sm font-medium">
             <Link href="/admin" className="text-gray-500 hover:text-blue-600 flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors">
               <ShieldCheck className="w-4 h-4" />
               <span className="hidden md:inline">Admin Panel</span>
             </Link>
          </nav>
        </div>
      </header>

      {/* Hero / Main Content */}
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Online Shartnoma
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Uydan chiqmasdan turib o'quv markazimiz bilan rasmiy shartnoma tuzing va ta'lim olishni boshlang.
          </p>
        </div>

        <WebWizard />
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
         <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
           <p>&copy; {new Date().getFullYear()} "Zamonaviy Ta'lim" MCHJ. Barcha huquqlar himoyalangan.</p>
         </div>
      </footer>
    </div>
  );
}
