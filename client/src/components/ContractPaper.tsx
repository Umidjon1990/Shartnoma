import React from 'react';
import { useContract } from '@/lib/contract-context';
import logo from '@assets/zamonaviy_talim_logo.png';
import { cn } from '@/lib/utils';
import { Download, MapPin, Phone, Building, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContractPaperProps {
  data: {
    name: string;
    age: string;
    course: string;
    format: string;
    date?: string;
    number?: string;
  };
  className?: string;
  onDownload?: () => void;
}

export function ContractPaper({ data, className, onDownload }: ContractPaperProps) {
  const { contractTemplate } = useContract();

  const formattedDate = data.date || new Date().toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const contractNumber = data.number || 'DRAFT';

  const sections = contractTemplate.split(/\n(?=\d+\.\s)/);

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div className="bg-white text-gray-800 w-full max-w-[210mm] min-h-[297mm] shadow-2xl relative mx-auto overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
        
        {/* Modern Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>
          
          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-5">
              <div className="bg-white rounded-full p-2 shadow-lg">
                <img src={logo} alt="Zamonaviy Ta'lim" className="h-20 w-20 object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-wide">ZAMONAVIY TA'LIM</h1>
                <p className="text-blue-200 text-sm mt-1">Arab • Ingliz • Rus Tillari</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3">
                <p className="text-blue-200 text-xs uppercase tracking-wider">Shartnoma</p>
                <p className="text-2xl font-bold font-mono">№ {contractNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Document Title */}
        <div className="text-center py-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 uppercase tracking-widest">ONLAYN O'QUV SHARTNOMASI</h2>
          <p className="text-gray-500 mt-2">{formattedDate}</p>
        </div>

        {/* Parties Info Card */}
        <div className="mx-8 my-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-blue-600 uppercase font-semibold mb-1">Markaz</p>
              <p className="font-semibold text-gray-800">"Zamonaviy Ta'lim" MCHJ</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 uppercase font-semibold mb-1">O'quvchi</p>
              <p className="font-semibold text-gray-800">{data.name || '_______________'}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-blue-200">
            <div>
              <p className="text-xs text-gray-500">Kurs</p>
              <p className="font-medium text-gray-800">{data.course || '___'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Format</p>
              <p className="font-medium text-gray-800">{data.format || 'Online'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Yosh</p>
              <p className="font-medium text-gray-800">{data.age || '___'}</p>
            </div>
          </div>
        </div>

        {/* Contract Content */}
        <div className="px-8 pb-6 space-y-4">
          {sections.map((section, index) => {
            if (!section.trim()) return null;
            const titleMatch = section.match(/^(\d+)\.\s*([A-ZА-ЯЎҚҒҲ\s']+)/);
            
            if (titleMatch) {
              const [, num, title] = titleMatch;
              const content = section.replace(/^\d+\.\s*[A-ZА-ЯЎҚҒҲ\s']+\n?/, '');
              
              return (
                <div key={index} className="group">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                      {num}
                    </span>
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{title.trim()}</h3>
                  </div>
                  <div className="ml-10 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {content.trim()
                      .replaceAll('{name}', data.name || '_______________')
                      .replaceAll('{age}', data.age || '___')
                      .replaceAll('{course}', data.course || '_______________')
                      .replaceAll('{format}', data.format || 'Online')
                      .replaceAll('{date}', formattedDate)
                      .replaceAll('{number}', contractNumber)}
                  </div>
                </div>
              );
            }
            
            return (
              <div key={index} className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {section.trim()
                  .replaceAll('{name}', data.name || '_______________')
                  .replaceAll('{age}', data.age || '___')
                  .replaceAll('{course}', data.course || '_______________')
                  .replaceAll('{format}', data.format || 'Online')
                  .replaceAll('{date}', formattedDate)
                  .replaceAll('{number}', contractNumber)}
              </div>
            );
          })}
        </div>

        {/* Footer/Signatures - Modern Grid Layout */}
        <div className="mx-8 mb-8 mt-auto">
          <div className="border-t-2 border-blue-900 pt-6">
            <div className="grid grid-cols-2 gap-8">
              {/* Markaz Section */}
              <div className="bg-gray-50 rounded-xl p-5 relative">
                <h3 className="font-bold text-blue-900 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  O'quv Markazi
                </h3>
                <div className="text-xs text-gray-600 space-y-2">
                  <p className="font-semibold text-gray-800">MCHJ "Zamonaviy Ta'lim"</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3 h-3 mt-0.5 text-blue-600" />
                    <p>Namangan vil., Uychi tum., Bog' MFY, Savdogar ko'chasi, 41-uy</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3 h-3 text-blue-600" />
                    <p>INN: 312 316 714</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="border-b-2 border-gray-400 w-36 mb-1"></div>
                  <p className="text-[10px] text-gray-400">Imzo va muhr</p>
                </div>
                
                {/* Seal */}
                <div className="absolute top-4 right-4 w-20 h-20 border-3 border-blue-700 rounded-full flex items-center justify-center opacity-70 rotate-[-8deg]">
                  <div className="text-center">
                    <p className="text-[7px] font-bold text-blue-700 uppercase">Tasdiqlandi</p>
                    <div className="w-8 h-[1px] bg-blue-700 mx-auto my-0.5"></div>
                    <p className="text-[5px] text-blue-700">2024</p>
                  </div>
                </div>
              </div>

              {/* O'quvchi Section */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-blue-900 text-sm uppercase tracking-wide mb-4">O'quvchi</h3>
                <div className="text-xs text-gray-600 space-y-2">
                  <div>
                    <p className="text-gray-400">F.I.SH:</p>
                    <p className="font-semibold text-gray-800">{data.name || '_______________'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-gray-400">Yosh:</p>
                      <p className="font-medium">{data.age || '___'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Kurs:</p>
                      <p className="font-medium">{data.course || '___'}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <div className="border-b-2 border-gray-400 w-36 mb-1"></div>
                  <p className="text-[10px] text-gray-400">Imzo</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
          <img src={logo} alt="Watermark" className="w-80 h-80" />
        </div>
      </div>

      {onDownload && (
        <Button onClick={onDownload} className="mt-4 gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
          <Download className="w-4 h-4" />
          PDF Yuklab olish
        </Button>
      )}
    </div>
  );
}
