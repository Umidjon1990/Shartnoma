import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CourseLevel = 'A0-A1' | 'A1-A2' | 'A2-B1' | 'B1-B2' | 'CEFR-PRO';

export interface ContractData {
  id: string;
  studentName: string;
  age: string;
  phone: string;
  course: CourseLevel;
  format: 'Online' | 'Offline';
  date: string;
  status: 'draft' | 'signed';
}

interface ContractContextType {
  contractTemplate: string;
  updateContractTemplate: (text: string) => void;
  contracts: ContractData[];
  addContract: (data: Omit<ContractData, 'id' | 'date' | 'status'>) => void;
}

const defaultTemplate = `
SHARTNOMA № {number}

Toshkent sh.                                                              {date}

"Zamonaviy Ta'lim" MCHJ (keyingi o'rinlarda "O'quv Markazi" deb yuritiladi) bir tomondan va {name} (keyingi o'rinlarda "O'quvchi" deb yuritiladi) ikkinchi tomondan, ushbu shartnomani quyidagilar haqida tuzdilar:

1. SHARTNOMA PREDMETI
1.1. O'quv Markazi O'quvchini "{course}" kursi bo'yicha {format} formatda o'qitish majburiyatini oladi.
1.2. O'quvchi belgilangan tartibda darslarda qatnashish va to'lovlarni o'z vaqtida amalga oshirish majburiyatini oladi.

2. O'QUV JARAYONI VA SHARTLARI
2.1. O'quvchining yoshi: {age} yosh.
2.2. Darslar {format} tarzda, maxsus platforma orqali olib boriladi.
2.3. O'quvchi darslarda faol qatnashishi shart.
2.4. Dars yozuvlari va materiallari faqat shaxsiy foydalanish uchun beriladi. Ularni uchinchi shaxslarga tarqatish qat'iyan man etiladi.

3. TOMONLARNING HUQUQ VA MAJBURIYATLARI
3.1. O'quvchi darslarga o'z vaqtida qo'shilishi, uy vazifalarini bajarishi shart.
3.2. Qoidabuzarlik holatlari kuzatilganda, O'quvchiga ogohlantirish beriladi. Qoidabuzarlik davom etsa, O'quv Markazi shartnomani bekor qilish huquqiga ega.

4. TO'LOV TARTIBI
4.1. To'lov har oyning belgilangan sanasigacha amalga oshirilishi lozim.

5. YAKUNIY QOIDALAR
5.1. Ushbu shartnoma O'quvchi tomonidan tasdiqlangandan so'ng kuchga kiradi.
`;

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export function ContractProvider({ children }: { children: ReactNode }) {
  const [contractTemplate, setContractTemplate] = useState(defaultTemplate);
  const [contracts, setContracts] = useState<ContractData[]>([
    {
      id: 'CN-2024-001',
      studentName: 'Azizbek Tursunov',
      age: '22',
      phone: '+998901234567',
      course: 'B1-B2',
      format: 'Online',
      date: '2024-12-10',
      status: 'signed'
    },
    {
      id: 'CN-2024-002',
      studentName: 'Malika Karimova',
      age: '19',
      phone: '+998939876543',
      course: 'A2-B1',
      format: 'Online',
      date: '2024-12-14',
      status: 'signed'
    }
  ]);

  const updateContractTemplate = (text: string) => {
    setContractTemplate(text);
  };

  const addContract = (data: Omit<ContractData, 'id' | 'date' | 'status'>) => {
    const newContract: ContractData = {
      ...data,
      id: `CN-2025-${(contracts.length + 1).toString().padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'signed'
    };
    setContracts([newContract, ...contracts]);
  };

  return (
    <ContractContext.Provider value={{ contractTemplate, updateContractTemplate, contracts, addContract }}>
      {children}
    </ContractContext.Provider>
  );
}

export function useContract() {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
}
