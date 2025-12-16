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

  const formatContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      if (/^\d+\.\s+[A-ZА-ЯЎҚҒҲ\s']+$/.test(trimmedLine)) {
        const match = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
        if (match) {
          return (
            <div key={index} className={cn("flex items-center gap-2 md:gap-3 mt-4 md:mt-6 mb-2 md:mb-3", forPdf && "mt-6 mb-3 gap-3")}>
              <span className={cn(
                "flex-shrink-0 w-6 h-6 md:w-7 md:h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold shadow-sm",
                forPdf && "w-7 h-7 text-sm"
              )}>
                {match[1]}
              </span>
              <h3 className={cn("text-xs md:text-sm font-bold text-gray-800 uppercase tracking-wide", forPdf && "text-sm")}>{match[2]}</h3>
            </div>
          );
        }
      }
      
      if (trimmedLine.startsWith('ONLAYN O\'QUV SHARTNOMA')) {
        return null;
      }
      if (trimmedLine.startsWith('Sana:')) {
        return null;
      }
      if (trimmedLine.startsWith('O\'rtasida:')) {
        return null;
      }
      if (trimmedLine.includes('bundan keyin "Markaz"')) {
        return null;
      }
      if (trimmedLine.includes('bundan keyin "O\'quvchi"')) {
        return null;
      }
      if (trimmedLine.startsWith('O\'quv markazi ma\'lumotlari')) {
        return null;
      }
      if (trimmedLine.startsWith('Manzil:') || trimmedLine.startsWith('INN:') || 
          trimmedLine.startsWith('BANK:') || trimmedLine.startsWith('Hisob raqam:')) {
        return null;
      }
      if (trimmedLine.startsWith('O\'quvchining ma\'lumotlari')) {
        return null;
      }
      if (trimmedLine.startsWith('F.I.SH:') || trimmedLine.startsWith('Yoshi:') || 
          trimmedLine.startsWith('Kurs:') || trimmedLine.startsWith('Format:')) {
        return null;
      }
      
      if (!trimmedLine) {
        return <div key={index} className="h-1 md:h-2"></div>;
      }
      
      return (
        <p key={index} className={cn("text-xs md:text-sm text-gray-700 leading-relaxed ml-8 md:ml-10", forPdf && "text-sm ml-10")}>
          {trimmedLine}
        </p>
      );
    });
  };

  return (
    <div className={cn("flex flex-col items-center gap-4 md:gap-6", className)}>
      <div className={cn(
        "bg-white text-gray-800 w-full relative mx-auto overflow-hidden",
        !forPdf && "shadow-xl md:shadow-2xl rounded-lg md:rounded-none",
        forPdf ? "max-w-[210mm] min-h-[297mm]" : "max-w-full"
      )} style={{ fontFamily: "'Inter', sans-serif" }}>
        
        {/* Modern Header with Gradient */}
        <div className={cn(
          "bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-4 md:p-8 relative overflow-hidden",
          forPdf && "p-8"
        )}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 md:w-48 h-24 md:h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>
          
          <div className={cn(
            "relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4",
            forPdf && "flex-row items-center"
          )}>
            <div className="flex items-center gap-3 md:gap-5">
              <div className={cn(
                "bg-white rounded-full p-1 md:p-2 shadow-lg",
                forPdf && "p-2"
              )}>
                <img src={logo} alt="Zamonaviy Ta'lim" className={cn(
                  "h-12 w-12 md:h-20 md:w-20 object-contain",
                  forPdf && "h-20 w-20"
                )} />
              </div>
              <div>
                <h1 className={cn(
                  "text-lg md:text-2xl font-bold tracking-wide",
                  forPdf && "text-2xl"
                )}>ZAMONAVIY TA'LIM</h1>
                <p className={cn(
                  "text-blue-200 text-xs md:text-sm mt-1",
                  forPdf && "text-sm"
                )}>Arab - Ingliz - Rus Tillari</p>
              </div>
            </div>
            <div className="text-left md:text-right">
              <div className={cn(
                "bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 md:px-4 md:py-3",
                forPdf && "px-4 py-3"
              )}>
                <p className={cn(
                  "text-blue-200 text-[10px] md:text-xs uppercase tracking-wider",
                  forPdf && "text-xs"
                )}>Shartnoma</p>
                <p className={cn(
                  "text-lg md:text-2xl font-bold font-mono",
                  forPdf && "text-2xl"
                )}>№ {contractNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Document Title */}
        <div className={cn(
          "text-center py-4 md:py-6",
          !forPdf && "border-b border-gray-200",
          forPdf && "py-6"
        )}>
          <h2 className={cn(
            "text-base md:text-xl font-bold text-gray-800 uppercase tracking-wider md:tracking-widest",
            forPdf && "text-xl tracking-widest"
          )}>ONLAYN O'QUV SHARTNOMASI</h2>
          <p className={cn(
            "text-gray-500 mt-1 md:mt-2 text-sm",
            forPdf && "mt-2"
          )}>{formattedDate}</p>
        </div>

        {/* Parties Info Card */}
        <div className={cn(
          "mx-3 md:mx-8 my-4 md:my-6 rounded-xl p-3 md:p-5",
          !forPdf && "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100",
          forPdf && "mx-8 my-6 p-5 bg-white"
        )}>
          <div className="grid grid-cols-2 gap-3 md:gap-6">
            <div>
              <p className={cn(
                "text-[10px] md:text-xs text-blue-600 uppercase font-semibold mb-1",
                forPdf && "text-xs"
              )}>Markaz</p>
              <p className={cn(
                "font-semibold text-gray-800 text-xs md:text-base",
                forPdf && "text-base"
              )}>"Zamonaviy Ta'lim" MCHJ</p>
            </div>
            <div>
              <p className={cn(
                "text-[10px] md:text-xs text-blue-600 uppercase font-semibold mb-1",
                forPdf && "text-xs"
              )}>O'quvchi</p>
              <p className={cn(
                "font-semibold text-gray-800 text-xs md:text-base break-words",
                forPdf && "text-base"
              )}>{data.name || '_______________'}</p>
            </div>
          </div>
          <div className={cn(
            "grid grid-cols-3 gap-2 md:gap-4 mt-3 md:mt-4 pt-3 md:pt-4",
            !forPdf && "border-t border-blue-200",
            forPdf && "gap-4 mt-4 pt-4"
          )}>
            <div>
              <p className={cn("text-[10px] md:text-xs text-gray-500", forPdf && "text-xs")}>Kurs</p>
              <p className={cn("font-medium text-gray-800 text-xs md:text-base", forPdf && "text-base")}>{data.course || '___'}</p>
            </div>
            <div>
              <p className={cn("text-[10px] md:text-xs text-gray-500", forPdf && "text-xs")}>Format</p>
              <p className={cn("font-medium text-gray-800 text-xs md:text-base", forPdf && "text-base")}>{data.format || 'Online'}</p>
            </div>
            <div>
              <p className={cn("text-[10px] md:text-xs text-gray-500", forPdf && "text-xs")}>Yosh</p>
              <p className={cn("font-medium text-gray-800 text-xs md:text-base", forPdf && "text-base")}>{data.age || '___'}</p>
            </div>
          </div>
        </div>

        {/* Contract Content */}
        <div className={cn(
          "px-3 md:px-8 pb-4 md:pb-6",
          forPdf && "px-8 pb-6"
        )}>
          {formatContent(filledContent)}
        </div>

        {/* Footer - Modern Grid Layout */}
        <div className={cn(
          "mx-3 md:mx-8 mb-4 md:mb-8 mt-auto",
          forPdf && "mx-8 mb-8"
        )}>
          <div className={cn(
            "pt-4 md:pt-6",
            !forPdf && "border-t-2 border-blue-900",
            forPdf && "pt-6"
          )}>
            <div className={cn(
              "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8",
              forPdf && "grid-cols-2 gap-8"
            )}>
              {/* Markaz Section */}
              <div className={cn(
                "p-3 md:p-5 relative",
                !forPdf && "bg-gray-50 rounded-xl",
                forPdf && "p-5 bg-white"
              )}>
                <h3 className={cn(
                  "font-bold text-blue-900 text-xs md:text-sm uppercase tracking-wide mb-2 md:mb-4 flex items-center gap-2",
                  forPdf && "text-sm mb-4"
                )}>
                  <Building className={cn("w-3 h-3 md:w-4 md:h-4", forPdf && "w-4 h-4")} />
                  O'quv Markazi
                </h3>
                <div className={cn(
                  "text-[10px] md:text-xs text-gray-600 space-y-1 md:space-y-2",
                  forPdf && "text-xs space-y-2"
                )}>
                  <p className={cn("font-semibold text-gray-800 text-xs md:text-sm", forPdf && "text-sm")}>MCHJ "Zamonaviy Ta'lim"</p>
                  <div className="flex items-start gap-1 md:gap-2">
                    <MapPin className={cn("w-2.5 h-2.5 md:w-3 md:h-3 mt-0.5 text-blue-600 flex-shrink-0", forPdf && "w-3 h-3")} />
                    <p className="text-[10px] md:text-xs">Namangan vil., Uychi tum., Bog' MFY, Savdogar ko'chasi, 41-uy</p>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <CreditCard className={cn("w-2.5 h-2.5 md:w-3 md:h-3 text-blue-600 flex-shrink-0", forPdf && "w-3 h-3")} />
                    <p>INN: 312 316 714</p>
                  </div>
                </div>
                
                {/* Seal */}
                <div className={cn(
                  "absolute top-2 right-2 md:top-4 md:right-4 w-14 h-14 md:w-20 md:h-20 border-2 border-blue-700 rounded-full flex items-center justify-center opacity-70 rotate-[-8deg]",
                  forPdf && "top-4 right-4 w-20 h-20"
                )}>
                  <div className="text-center">
                    <p className={cn("text-[5px] md:text-[7px] font-bold text-blue-700 uppercase", forPdf && "text-[7px]")}>Tasdiqlandi</p>
                    <div className={cn("w-6 md:w-8 h-[1px] bg-blue-700 mx-auto my-0.5", forPdf && "w-8")}></div>
                    <p className={cn("text-[4px] md:text-[5px] text-blue-700", forPdf && "text-[5px]")}>2024</p>
                  </div>
                </div>
              </div>

              {/* O'quvchi Section */}
              <div className={cn(
                "p-3 md:p-5 relative",
                !forPdf && "bg-gray-50 rounded-xl",
                forPdf && "p-5 bg-white"
              )}>
                <h3 className={cn(
                  "font-bold text-blue-900 text-xs md:text-sm uppercase tracking-wide mb-2 md:mb-4",
                  forPdf && "text-sm mb-4"
                )}>O'quvchi</h3>
                <div className={cn(
                  "text-[10px] md:text-xs text-gray-600 space-y-1 md:space-y-2",
                  forPdf && "text-xs space-y-2"
                )}>
                  <div>
                    <p className="text-gray-400">F.I.SH:</p>
                    <p className={cn("font-semibold text-gray-800 text-xs md:text-sm break-words", forPdf && "text-sm")}>{data.name || '_______________'}</p>
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
                <div className={cn(
                  "absolute top-2 right-2 md:top-4 md:right-4 w-14 h-14 md:w-20 md:h-20 border-2 border-green-600 rounded-full flex items-center justify-center opacity-70 rotate-[8deg]",
                  forPdf && "top-4 right-4 w-20 h-20"
                )}>
                  <div className="text-center">
                    <p className={cn("text-[5px] md:text-[7px] font-bold text-green-600 uppercase", forPdf && "text-[7px]")}>Tasdiqlandi</p>
                    <div className={cn("w-6 md:w-8 h-[1px] bg-green-600 mx-auto my-0.5", forPdf && "w-8")}></div>
                    <p className={cn("text-[4px] md:text-[5px] text-green-600", forPdf && "text-[5px]")}>2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
          <img src={logo} alt="Watermark" className={cn("w-40 h-40 md:w-80 md:h-80", forPdf && "w-80 h-80")} />
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
