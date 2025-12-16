import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, CheckCircle, ArrowRight, User, Phone, ChevronRight, ChevronLeft, Download, Sparkles, Loader2 } from 'lucide-react';
import { useContract, CourseLevel } from '@/lib/contract-context';
import { useMutation } from '@tanstack/react-query';
import { createContract } from '@/lib/api';
import { ContractPaper } from '@/components/ContractPaper';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Contract } from '@shared/schema';

type Step = 1 | 2 | 3 | 4;

export function WebWizard() {
  const [step, setStep] = useState<Step>(1);
  const [createdContract, setCreatedContract] = useState<Contract | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { contractTemplate } = useContract();
  const { toast } = useToast();
  
  const createMutation = useMutation({
    mutationFn: createContract,
    onSuccess: (data) => {
      setCreatedContract(data);
      setStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast({
        title: "Muvaffaqiyatli!",
        description: "Shartnoma tuzildi va Telegram botga yuborildi.",
        className: "bg-green-50 border-green-200"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Xatolik",
        description: error.message || "Shartnoma tuzishda xatolik yuz berdi",
        variant: "destructive"
      });
    }
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    course: '' as CourseLevel,
    agreed: false
  });

  const handleNext = () => {
    if (step === 1 && !formData.agreed) {
      toast({ title: "Diqqat", description: "Davom etish uchun shartnoma shartlariga rozilik bildiring.", variant: "destructive" });
      return;
    }
    if (step === 2) {
      if (!formData.name || !formData.phone || !formData.age || !formData.course) {
        toast({ title: "Xatolik", description: "Barcha maydonlarni to'ldiring", variant: "destructive" });
        return;
      }
    }
    setStep(prev => (prev + 1) as Step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep(prev => (prev - 1) as Step);
  };

  const handleSubmit = () => {
    createMutation.mutate({
      studentName: formData.name,
      age: formData.age,
      phone: formData.phone,
      course: formData.course,
      format: 'Online',
      status: 'signed'
    });
  };

  const handleDownloadPDF = async () => {
    if (!createdContract) return;
    
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/contracts/${createdContract.id}/pdf`);
      
      if (!response.ok) {
        throw new Error('PDF yaratishda xato');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Shartnoma_${createdContract.contractNumber}_${formData.name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Muvaffaqiyatli!",
        description: "Shartnoma PDF formatida yuklandi.",
        className: "bg-green-50 border-green-200"
      });
    } catch (error: any) {
      console.error('PDF download error:', error);
      toast({
        title: "Xatolik",
        description: "PDF yuklab olishda xatolik yuz berdi",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const steps = [
    { number: 1, title: "Oferta" },
    { number: 2, title: "Ma'lumotlar" },
    { number: 3, title: "Tasdiqlash" },
    { number: 4, title: "Yuklab olish" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-20">
      {/* Progress Steps (Mobile Optimized) */}
      <div className="mb-8">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-500 rounded-full" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          
          {steps.map((s) => (
            <div key={s.number} className="flex flex-col items-center bg-slate-50 px-1 md:px-2">
              <div className={cn(
                "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-colors duration-300 border-2",
                step >= s.number ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-300 text-gray-400"
              )}>
                {step > s.number ? <CheckCircle className="w-5 h-5" /> : s.number}
              </div>
              <span className={cn(
                "text-[10px] md:text-xs font-medium mt-1 md:mt-2 transition-colors duration-300",
                step >= s.number ? "text-blue-700" : "text-gray-400"
              )}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="space-y-6">
              <div className="bg-blue-600 p-4 md:p-6 text-white rounded-xl shadow-lg">
                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3">
                  <FileText className="w-6 h-6 md:w-8 md:h-8" />
                  Ommaviy Oferta
                </h2>
                <p className="text-blue-100 mt-2 text-sm md:text-base">
                  Iltimos, shartnoma shartlari bilan diqqat bilan tanishib chiqing.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                <div className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {contractTemplate}
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                <div className="flex flex-col gap-4">
                  <div 
                    className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" 
                    onClick={() => setFormData({...formData, agreed: !formData.agreed})}
                  >
                    <Checkbox 
                      id="terms" 
                      checked={formData.agreed}
                      onCheckedChange={(checked) => setFormData({...formData, agreed: checked as boolean})}
                      className="w-6 h-6 border-2 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label 
                      htmlFor="terms" 
                      className="text-sm md:text-base font-medium leading-none cursor-pointer"
                    >
                      Shartnoma shartlariga roziman
                    </Label>
                  </div>
                  <Button 
                    onClick={handleNext} 
                    disabled={!formData.agreed}
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
                  >
                    Davom etish
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="border-0 shadow-lg">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white rounded-t-xl">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <User className="w-6 h-6" />
                  Shaxsiy Ma'lumotlar
                </CardTitle>
                <CardDescription className="text-blue-100 mt-1">
                  Shartnoma tuzish uchun ma'lumotlaringizni kiriting
                </CardDescription>
              </div>
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-base font-medium text-gray-700">F.I.SH (Familiya Ism)</Label>
                    <div className="relative group">
                      <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input 
                        id="name" 
                        placeholder="Azizov Aziz" 
                        className="pl-10 h-12 text-lg bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 transition-all"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-base font-medium text-gray-700">Telefon raqam</Label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input 
                        id="phone" 
                        placeholder="+998 90 123 45 67" 
                        className="pl-10 h-12 text-lg bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 transition-all"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="age" className="text-base font-medium text-gray-700">Yosh</Label>
                    <Input 
                      id="age" 
                      type="number" 
                      placeholder="18" 
                      className="h-12 text-lg bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 transition-all"
                      value={formData.age}
                      onChange={e => setFormData({...formData, age: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="course" className="text-base font-medium text-gray-700">Kursni tanlang</Label>
                    <Select 
                      value={formData.course} 
                      onValueChange={(val: CourseLevel) => setFormData({...formData, course: val})}
                    >
                      <SelectTrigger className="h-12 text-lg bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 transition-all">
                        <SelectValue placeholder="Kursni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A0-A1">Beginner (A0-A1)</SelectItem>
                        <SelectItem value="A1-A2">Elementary (A1-A2)</SelectItem>
                        <SelectItem value="A2-B1">Pre-Intermediate (A2-B1)</SelectItem>
                        <SelectItem value="B1-B2">Intermediate (B1-B2)</SelectItem>
                        <SelectItem value="CEFR-PRO">IELTS / CEFR PRO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-6 bg-gray-50 rounded-b-xl border-t">
                <Button variant="outline" onClick={handleBack} size="lg" className="border-gray-300 text-gray-600 hover:bg-white hover:text-gray-900">
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Ortga
                </Button>
                <Button onClick={handleNext} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                  Keyingisi
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-900">Deyarli tayyor!</h4>
                <p className="text-sm text-yellow-800 mt-1">
                  Quyida shartnoma loyihasi ko'rsatilgan. Ma'lumotlaringiz to'g'riligini tekshiring va tasdiqlash tugmasini bosing.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto bg-gray-100 rounded-xl border border-gray-200 p-2 md:p-4">
              <div className="min-w-[320px] md:min-w-0">
                <ContractPaper 
                  data={{
                    name: formData.name,
                    age: formData.age,
                    course: formData.course,
                    format: 'Online',
                    number: 'DRAFT'
                  }}
                  className="mx-auto max-w-full md:max-w-[600px]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button 
                onClick={handleSubmit} 
                size="lg" 
                className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg text-base md:text-lg h-12 md:h-14"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 md:w-6 md:h-6 mr-2 animate-spin" />
                    Yuklanmoqda...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                    Tasdiqlash va Imzolash
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleBack} size="lg" className="w-full h-12">
                <ChevronLeft className="w-5 h-5 mr-2" />
                Tahrirlash
              </Button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="text-center py-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tabriklaymiz!</h2>
              <p className="text-lg text-gray-600 max-w-lg mx-auto">
                Shartnoma muvaffaqiyatli rasmiylashtirildi. Siz rasman "Zamonaviy Ta'lim" o'quvchisisiz!
              </p>
              {createdContract && (
                <p className="text-blue-600 font-semibold mt-2">
                  Shartnoma raqami: {createdContract.contractNumber}
                </p>
              )}
            </div>

            {/* Contract Preview */}
            <div className="overflow-x-auto bg-gray-100 rounded-xl border p-2 md:p-4">
              <div className="min-w-[320px] md:min-w-0">
                <ContractPaper 
                  data={{
                    name: formData.name,
                    age: formData.age,
                    course: formData.course,
                    format: 'Online',
                    number: createdContract?.contractNumber || 'SIGNED',
                    date: createdContract?.createdAt ? new Date(createdContract.createdAt).toLocaleDateString('uz-UZ') : undefined
                  }}
                  className="mx-auto max-w-full md:max-w-[600px]"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button 
                size="lg" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 md:h-14 text-base md:text-lg shadow-xl"
                onClick={handleDownloadPDF}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-5 h-5 md:w-6 md:h-6 mr-2 animate-spin" />
                    Yuklanmoqda...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                    Shartnomani Yuklab Olish
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full h-12 text-base"
                onClick={() => {
                   setStep(1);
                   setCreatedContract(null);
                   setFormData({ name: '', phone: '', age: '', course: '' as CourseLevel, agreed: false });
                }}
              >
                Yangi shartnoma
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
