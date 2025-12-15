import React, { createContext, useContext, useState, ReactNode } from 'react';
import { type Contract } from '@shared/schema';

export type CourseLevel = 'A0-A1' | 'A1-A2' | 'A2-B1' | 'B1-B2' | 'CEFR-PRO';

interface ContractContextType {
  contractTemplate: string;
  updateContractTemplate: (text: string) => void;
}

const defaultTemplate = `
ONLAYN O'QUV SHARTNOMA № {number}

Sana: {date}

O'rtasida:
"Zamonaviy Ta'lim" MCHJ (bundan keyin "Markaz" deb yuritiladi)
va
{name} (bundan keyin "O'quvchi" deb yuritiladi)

1. SHARTNOMA MAQSADI
Ushbu shartnoma Markaz tomonidan tashkil etilgan "{course}" dasturi doirasida o'quvchining mas'uliyatini, to'lov tartibini va Markaz kafolatlarini belgilashga qaratilgan.

2. KURS TASHKILOTI
Darslar yopiq Telegram guruhlari orqali olib boriladi.
Har bir bosqich o'rtacha 2 oy davom etadi.
Darslar Bosqichli Arab Tili, Miftah, va CEFR standartlariga asoslangan materiallar asosida tashkil qilinadi.

3. O'QUVCHINING MAJBURIYATLARI
O'quvchi darslarni muntazam kuzatib borishi va faol ishtirok etishi shart.
O'quvchi 1 hafta davomida hech qanday vazifa yubormasa, sababsiz holda guruhdan chetlatiladi.
O'quvchi bosqichni muvaffaqiyatli yakunlamasa, keyingi bosqichga imtihon asosida o'ta oladi yoki shu bosqichni qayta o'qiydi.
O'quvchi kurs davomida barcha ichki tartib-qoidalarga rioya qilishi shart.
O'quvchi to'lovni belgilangan muddatda amalga oshirishi kerak.

4. MARKAZNING MAJBURIYATLARI
Markaz har bir bosqich uchun sifatli video darslar va materiallar bilan ta'minlaydi.
Markaz o'quvchining natijasi uchun kafolat beradi, agar o'quvchi topshiriqlarni to'liq bajargan bo'lsa.
Markaz haftasiga 2 marta jonli darsni amalga oshiradi va bitta video manba/video darslik.
Markaz o'quvchi murojaatlariga o'z vaqtida javob beradi.
Belgilangan darslarni o'z vaqtida o'tish.

5. TO'LOV TARTIBI VA QAYTARISH SHARTLARI
Kursning oylik to'lovi 400.000 so'm miqdorida belgilanadi.
To'lov kurs uchun oldindan amalga oshiriladi.
O'quvchi kurs sifatidan norozi bo'lsagina, 30% soliq xizmat haqi ushlab qolingan holda to'lov qaytarilishi mumkin.
Boshqa hollarda to'lov qaytarilmaydi.
Qaytariladigan to'lov (agar mavjud bo'lsa) 1 oy ichida amalga oshiriladi.

6. KAFOLATLAR VA MA'SULIYAT
Markaz o'quvchi kursni to'liq o'tagan va topshiriqlarni bajargan taqdirda darajasining oshishini kafolatlaydi.
O'quvchi tomonidan intizom buzilishi, topshiriqlarning muntazam yuborilmasligi yoki muloqotdagi qo'pol xatti-harakatlar uchun Markaz chetlatish huquqiga ega.
Shartnomadagi barcha shartlarni buzgan tomon ma'suliyatni o'z zimmasiga oladi.

7. SHARTNOMA MUDDATI
Ushbu shartnoma o'quvchi kursga ro'yxatdan o'tgan paytdan boshlab kuchga kiradi va quyidagi hollarda avtomatik bekor bo'ladi:
1. Bir haftadan ko'p darslarga kirmasa
2. To'lovni o'z vaqtida amalga oshirmasa
3. O'quv jarayoni muddati tugasa

8. TOMONLARNING ROZILIGI
Quyidagi "Tasdiqlayman" tugmasini bosish orqali O'quvchi shartlar bilan tanishganini va rozi ekanini bildiradi.

O'quv markazi ma'lumotlari:
Manzil: Namangan viloyati, Uychi tumani, Bog' MFY, Savdogar ko'chasi, 41-uy.
INN: 312 316 714
BANK: Agrobank MFO: 00244
Hisob raqam: 20208000007282925001

O'quvchining ma'lumotlari:
F.I.SH: {name}
Yoshi: {age}
Kurs: {course}
Format: {format}
`;

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export function ContractProvider({ children }: { children: ReactNode }) {
  const [contractTemplate, setContractTemplate] = useState(defaultTemplate);

  const updateContractTemplate = (text: string) => {
    setContractTemplate(text);
  };

  return (
    <ContractContext.Provider value={{ contractTemplate, updateContractTemplate }}>
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
