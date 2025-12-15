import React from 'react';
import { useContract } from '@/lib/contract-context';
import logo from '@assets/generated_images/modern_education_logo.png';
import { cn } from '@/lib/utils';
import { Check, Download } from 'lucide-react';
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

  const formattedDate = data.date || new Date().toISOString().split('T')[0];
  const contractNumber = data.number || 'DRAFT';

  // Replace placeholders (use replaceAll for multiple occurrences)
  const filledContent = contractTemplate
    .replaceAll('{name}', data.name || '___________')
    .replaceAll('{age}', data.age || '___')
    .replaceAll('{course}', data.course || '___________')
    .replaceAll('{format}', data.format || 'Online')
    .replaceAll('{date}', formattedDate)
    .replaceAll('{number}', contractNumber);

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      {/* Visual representation of an A4 paper */}
      <div className="bg-white text-black w-full max-w-[210mm] min-h-[297mm] p-12 md:p-16 shadow-2xl relative paper-shadow mx-auto transition-transform duration-500 ease-in-out">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-blue-900 pb-6 mb-8">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900 uppercase tracking-wide">Zamonaviy Ta'lim</h1>
              <p className="text-sm text-gray-500">Innovatsion o'quv markazi</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-sm text-gray-500">Shartnoma №</p>
            <p className="font-mono text-xl font-bold text-blue-900">{contractNumber}</p>
          </div>
        </div>

        {/* Content */}
        <div className="contract-text text-sm md:text-base whitespace-pre-wrap text-justify">
          {filledContent}
        </div>

        {/* Footer/Signatures */}
        <div className="mt-16 grid grid-cols-2 gap-12 pt-8 border-t border-gray-200">
          <div>
            <h3 className="font-bold text-blue-900 mb-4">O'QUV MARKAZI</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p>MCHJ "Zamonaviy Ta'lim"</p>
              <p>Namangan vil., Uychi tum., Bog' MFY</p>
              <p>INN: 312 316 714</p>
              <div className="mt-6">
                <div className="relative inline-block">
                  <div className="border-b border-black w-32 mb-1"></div>
                  <p className="text-[10px] text-gray-400">Imzo va muhr</p>
                  
                  {/* Digital Stamp/Signature Simulation */}
                  <div className="absolute -top-4 -left-2 w-24 h-24 border-2 border-blue-600 rounded-full flex items-center justify-center opacity-80 rotate-[-12deg] pointer-events-none">
                    <div className="text-center">
                      <p className="text-[8px] font-bold text-blue-600 uppercase">Tasdiqlandi</p>
                      <p className="text-[6px] text-blue-600">Zamonaviy Ta'lim</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-blue-900 mb-4">O'QUVCHI</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p className="font-semibold">{data.name || 'F.I.SH'}</p>
              <p>Yosh: {data.age || '___'}</p>
              <div className="mt-10">
                 <div className="border-b border-black w-32 mb-1"></div>
                 <p className="text-[10px] text-gray-400">Imzo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <img src={logo} alt="Watermark" className="w-96 h-96 grayscale" />
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
