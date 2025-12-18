import React from 'react';
import { useContract } from '@/lib/contract-context';
import logo from '@assets/zamonaviy_talim_logo.png';
import { cn } from '@/lib/utils';
import { Download, MapPin, Building, CreditCard } from 'lucide-react';
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
  forPdf?: boolean;
}

export function ContractPaper({ data, className, onDownload, forPdf = false }: ContractPaperProps) {
  const { contractTemplate } = useContract();

  const formattedDate = data.date || new Date().toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const contractNumber = data.number || 'DRAFT';

  const filledContent = contractTemplate
    .replaceAll('{name}', data.name || '_______________')
    .replaceAll('{age}', data.age || '___')
    .replaceAll('{course}', data.course || '_______________')
    .replaceAll('{format}', data.format || 'Online')
    .replaceAll('{date}', formattedDate)
    .replaceAll('{number}', contractNumber);

  const formatContent = (text: string, isPdf: boolean) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      if (/^\d+\.\s+[A-ZА-ЯЎҚҒҲ\s']+$/.test(trimmedLine)) {
        const match = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
        if (match) {
          if (isPdf) {
            return (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px', marginBottom: '12px' }}>
                <span style={{ 
                  flexShrink: 0, 
                  width: '28px', 
                  height: '28px', 
                  backgroundColor: '#2563eb', 
                  color: 'white', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '14px', 
                  fontWeight: 'bold' 
                }}>
                  {match[1]}
                </span>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{match[2]}</h3>
              </div>
            );
          }
          return (
            <div key={index} className="flex items-center gap-2 md:gap-3 mt-4 md:mt-6 mb-2 md:mb-3">
              <span className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold shadow-sm">
                {match[1]}
              </span>
              <h3 className="text-xs md:text-sm font-bold text-gray-800 uppercase tracking-wide">{match[2]}</h3>
            </div>
          );
        }
      }
      
      if (trimmedLine.startsWith('ONLAYN O\'QUV SHARTNOMA')) return null;
      if (trimmedLine.startsWith('Sana:')) return null;
      if (trimmedLine.startsWith('O\'rtasida:')) return null;
      if (trimmedLine.includes('bundan keyin "Markaz"')) return null;
      if (trimmedLine.includes('bundan keyin "O\'quvchi"')) return null;
      if (trimmedLine.startsWith('O\'quv markazi ma\'lumotlari')) return null;
      if (trimmedLine.startsWith('Manzil:') || trimmedLine.startsWith('INN:') || 
          trimmedLine.startsWith('BANK:') || trimmedLine.startsWith('Hisob raqam:')) return null;
      if (trimmedLine.startsWith('O\'quvchining ma\'lumotlari')) return null;
      if (trimmedLine.startsWith('F.I.SH:') || trimmedLine.startsWith('Yoshi:') || 
          trimmedLine.startsWith('Kurs:') || trimmedLine.startsWith('Format:')) return null;
      
      if (!trimmedLine) {
        return isPdf ? <div key={index} style={{ height: '8px' }}></div> : <div key={index} className="h-1 md:h-2"></div>;
      }
      
      if (isPdf) {
        return (
          <p key={index} style={{ fontSize: '13px', color: '#374151', lineHeight: '1.6', marginLeft: '40px' }}>
            {trimmedLine}
          </p>
        );
      }
      return (
        <p key={index} className="text-xs md:text-sm text-gray-700 leading-relaxed ml-8 md:ml-10">
          {trimmedLine}
        </p>
      );
    });
  };

  if (forPdf) {
    return (
      <div style={{ 
        backgroundColor: '#ffffff', 
        color: '#1f2937', 
        width: '794px',
        fontFamily: 'Inter, sans-serif',
        padding: '0'
      }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: '#1e3a8a', 
          color: 'white', 
          padding: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '50%', 
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img src={logo} alt="Logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '0.05em', margin: 0 }}>ZAMONAVIY TA'LIM</h1>
              <p style={{ color: '#93c5fd', fontSize: '14px', marginTop: '4px' }}>Arab - Ingliz - Rus Tillari</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#93c5fd', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Shartnoma</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace' }}>№ {contractNumber}</p>
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', padding: '24px 32px', backgroundColor: '#ffffff' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
            ONLAYN O'QUV SHARTNOMASI
          </h2>
          <p style={{ color: '#6b7280', marginTop: '8px', marginBottom: 0 }}>{formattedDate}</p>
        </div>

        {/* Info Table */}
        <table style={{ width: 'calc(100% - 64px)', margin: '0 32px 24px', borderCollapse: 'collapse', backgroundColor: '#ffffff' }}>
          <tbody>
            <tr>
              <td style={{ padding: '12px', border: '1px solid #1e3a8a', width: '50%' }}>
                <span style={{ fontSize: '11px', color: '#1e3a8a', textTransform: 'uppercase', fontWeight: '600' }}>Markaz:</span>
                <br />
                <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>"Zamonaviy Ta'lim" MCHJ</span>
              </td>
              <td style={{ padding: '12px', border: '1px solid #1e3a8a', width: '50%' }}>
                <span style={{ fontSize: '11px', color: '#1e3a8a', textTransform: 'uppercase', fontWeight: '600' }}>O'quvchi:</span>
                <br />
                <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>{data.name || '_______________'}</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '12px', border: '1px solid #1e3a8a' }} colSpan={2}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '33%' }}>
                        <span style={{ fontSize: '11px', color: '#6b7280' }}>Kurs:</span>
                        <br />
                        <span style={{ fontWeight: '500', color: '#1f2937' }}>{data.course || '___'}</span>
                      </td>
                      <td style={{ width: '33%' }}>
                        <span style={{ fontSize: '11px', color: '#6b7280' }}>Format:</span>
                        <br />
                        <span style={{ fontWeight: '500', color: '#1f2937' }}>{data.format || 'Online'}</span>
                      </td>
                      <td style={{ width: '33%' }}>
                        <span style={{ fontSize: '11px', color: '#6b7280' }}>Yosh:</span>
                        <br />
                        <span style={{ fontWeight: '500', color: '#1f2937' }}>{data.age || '___'}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Contract Content */}
        <div style={{ padding: '0 32px 24px', backgroundColor: '#ffffff' }}>
          {formatContent(filledContent, true)}
        </div>

        {/* Footer */}
        <div style={{ margin: '0 32px 32px', paddingTop: '24px', borderTop: '2px solid #1e3a8a', backgroundColor: '#ffffff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ width: '50%', padding: '16px', border: '1px solid #1e3a8a', verticalAlign: 'top' }}>
                  <p style={{ fontWeight: 'bold', color: '#1e3a8a', fontSize: '14px', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
                    O'quv Markazi
                  </p>
                  <p style={{ fontSize: '12px', color: '#4b5563', margin: '0 0 4px 0' }}>
                    <strong style={{ color: '#1f2937' }}>MCHJ "Zamonaviy Ta'lim"</strong>
                  </p>
                  <p style={{ fontSize: '12px', color: '#4b5563', margin: '0 0 4px 0' }}>
                    Namangan vil., Uychi tum., Bog' MFY, Savdogar ko'chasi, 41-uy
                  </p>
                  <p style={{ fontSize: '12px', color: '#4b5563', margin: '0 0 16px 0' }}>
                    INN: 312 316 714
                  </p>
                  <p style={{ fontSize: '10px', color: '#9ca3af', margin: '16px 0 0 0', borderTop: '1px solid #d1d5db', paddingTop: '12px' }}>Imzo va muhr:</p>
                </td>
                <td style={{ width: '50%', padding: '16px', border: '1px solid #1e3a8a', verticalAlign: 'top' }}>
                  <p style={{ fontWeight: 'bold', color: '#1e3a8a', fontSize: '14px', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
                    O'quvchi
                  </p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0' }}>F.I.SH:</p>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>{data.name || '_______________'}</p>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '50%' }}>
                          <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0' }}>Yosh:</p>
                          <p style={{ fontSize: '12px', fontWeight: '500', color: '#1f2937', margin: '0' }}>{data.age || '___'}</p>
                        </td>
                        <td style={{ width: '50%' }}>
                          <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0' }}>Kurs:</p>
                          <p style={{ fontSize: '12px', fontWeight: '500', color: '#1f2937', margin: '0' }}>{data.course || '___'}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p style={{ fontSize: '10px', color: '#9ca3af', margin: '16px 0 0 0', borderTop: '1px solid #d1d5db', paddingTop: '12px' }}>Imzo:</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center gap-4 md:gap-6", className)}>
      <div className="bg-white text-gray-800 w-full shadow-xl md:shadow-2xl relative mx-auto overflow-hidden rounded-lg md:rounded-none max-w-full" style={{ fontFamily: "'Inter', sans-serif" }}>
        
        {/* Modern Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-4 md:p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 md:w-48 h-24 md:h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>
          
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3 md:gap-5">
              <div className="bg-white rounded-full p-1 md:p-2 shadow-lg">
                <img src={logo} alt="Zamonaviy Ta'lim" className="h-12 w-12 md:h-20 md:w-20 object-contain" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold tracking-wide">ZAMONAVIY TA'LIM</h1>
                <p className="text-blue-200 text-xs md:text-sm mt-1">Arab - Ingliz - Rus Tillari</p>
              </div>
            </div>
            <div className="text-left md:text-right">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 md:px-4 md:py-3">
                <p className="text-blue-200 text-[10px] md:text-xs uppercase tracking-wider">Shartnoma</p>
                <p className="text-lg md:text-2xl font-bold font-mono">№ {contractNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Document Title */}
        <div className="text-center py-4 md:py-6 border-b border-gray-200">
          <h2 className="text-base md:text-xl font-bold text-gray-800 uppercase tracking-wider md:tracking-widest">ONLAYN O'QUV SHARTNOMASI</h2>
          <p className="text-gray-500 mt-1 md:mt-2 text-sm">{formattedDate}</p>
        </div>

        {/* Parties Info Card */}
        <div className="mx-3 md:mx-8 my-4 md:my-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 md:p-5 border border-blue-100">
          <div className="grid grid-cols-2 gap-3 md:gap-6">
            <div>
              <p className="text-[10px] md:text-xs text-blue-600 uppercase font-semibold mb-1">Markaz</p>
              <p className="font-semibold text-gray-800 text-xs md:text-base">"Zamonaviy Ta'lim" MCHJ</p>
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-blue-600 uppercase font-semibold mb-1">O'quvchi</p>
              <p className="font-semibold text-gray-800 text-xs md:text-base break-words">{data.name || '_______________'}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 md:gap-4 mt-3 md:mt-4 pt-3 md:pt-4 border-t border-blue-200">
            <div>
              <p className="text-[10px] md:text-xs text-gray-500">Kurs</p>
              <p className="font-medium text-gray-800 text-xs md:text-base">{data.course || '___'}</p>
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-gray-500">Format</p>
              <p className="font-medium text-gray-800 text-xs md:text-base">{data.format || 'Online'}</p>
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-gray-500">Yosh</p>
              <p className="font-medium text-gray-800 text-xs md:text-base">{data.age || '___'}</p>
            </div>
          </div>
        </div>

        {/* Contract Content */}
        <div className="px-3 md:px-8 pb-4 md:pb-6">
          {formatContent(filledContent, false)}
        </div>

        {/* Footer - Modern Grid Layout */}
        <div className="mx-3 md:mx-8 mb-4 md:mb-8 mt-auto">
          <div className="border-t-2 border-blue-900 pt-4 md:pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {/* Markaz Section */}
              <div className="bg-gray-50 rounded-xl p-3 md:p-5 relative">
                <h3 className="font-bold text-blue-900 text-xs md:text-sm uppercase tracking-wide mb-2 md:mb-4 flex items-center gap-2">
                  <Building className="w-3 h-3 md:w-4 md:h-4" />
                  O'quv Markazi
                </h3>
                <div className="text-[10px] md:text-xs text-gray-600 space-y-1 md:space-y-2">
                  <p className="font-semibold text-gray-800 text-xs md:text-sm">MCHJ "Zamonaviy Ta'lim"</p>
                  <div className="flex items-start gap-1 md:gap-2">
                    <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3 mt-0.5 text-blue-600 flex-shrink-0" />
                    <p className="text-[10px] md:text-xs">Namangan vil., Uychi tum., Bog' MFY, Savdogar ko'chasi, 41-uy</p>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <CreditCard className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-600 flex-shrink-0" />
                    <p>INN: 312 316 714</p>
                  </div>
                </div>
                
                {/* Seal */}
                <div className="absolute top-2 right-2 md:top-4 md:right-4 w-14 h-14 md:w-20 md:h-20 border-2 border-blue-700 rounded-full flex items-center justify-center opacity-70 rotate-[-8deg]">
                  <div className="text-center">
                    <p className="text-[5px] md:text-[7px] font-bold text-blue-700 uppercase">Tasdiqlandi</p>
                    <div className="w-6 md:w-8 h-[1px] bg-blue-700 mx-auto my-0.5"></div>
                    <p className="text-[4px] md:text-[5px] text-blue-700">2025</p>
                  </div>
                </div>
              </div>

              {/* O'quvchi Section */}
              <div className="bg-gray-50 rounded-xl p-3 md:p-5 relative">
                <h3 className="font-bold text-blue-900 text-xs md:text-sm uppercase tracking-wide mb-2 md:mb-4">O'quvchi</h3>
                <div className="text-[10px] md:text-xs text-gray-600 space-y-1 md:space-y-2">
                  <div>
                    <p className="text-gray-400">F.I.SH:</p>
                    <p className="font-semibold text-gray-800 text-xs md:text-sm break-words">{data.name || '_______________'}</p>
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
                
                {/* Student Seal */}
                <div className="absolute top-2 right-2 md:top-4 md:right-4 w-14 h-14 md:w-20 md:h-20 border-2 border-green-600 rounded-full flex items-center justify-center opacity-70 rotate-[8deg]">
                  <div className="text-center">
                    <p className="text-[5px] md:text-[7px] font-bold text-green-600 uppercase">Tasdiqlandi</p>
                    <div className="w-6 md:w-8 h-[1px] bg-green-600 mx-auto my-0.5"></div>
                    <p className="text-[4px] md:text-[5px] text-green-600">2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
          <img src={logo} alt="Watermark" className="w-40 h-40 md:w-80 md:h-80" />
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
