import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, CheckCircle, ArrowRight, User, Phone, ChevronRight, ChevronLeft, Download, Sparkles, Loader2 } from 'lucide-react';
import { useContract, CourseLevel } from '@/lib/contract-context';
import { useMutation } from '@tanstack/react-query';
import { createContract } from '@/lib/api';
import { ContractPaper } from '@/components/ContractPaper';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import domtoimage from 'dom-to-image-more';
import jsPDF from 'jspdf';
import type { Contract } from '@shared/schema';

type Step = 1 | 2 | 3 | 4;

export function WebWizard() {
  const [step, setStep] = useState<Step>(1);
  const [createdContract, setCreatedContract] = useState<Contract | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { contractTemplate } = useContract();
  const { toast } = useToast();
  const contractRef = useRef<HTMLDivElement>(null);
  
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
    if (!contractRef.current) return;
    
    setIsDownloading(true);
    try {
      const element = contractRef.current;
      const parentElement = element.parentElement;
      
      if (parentElement) {
        parentElement.style.position = 'fixed';
        parentElement.style.left = '0';
        parentElement.style.top = '0';
        parentElement.style.zIndex = '-1';
        parentElement.style.opacity = '1';
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const width = element.offsetWidth || 794;
      const height = element.offsetHeight || 1123;
      
      const imgData = await domtoimage.toPng(element, {
        width: width,
        height: height,
        bgcolor: '#ffffff',
        style: {
          backgroundColor: '#ffffff'
        }
      });
      
      if (parentElement) {
        parentElement.style.position = 'absolute';
        parentElement.style.left = '-9999px';
        parentElement.style.top = '-9999px';
        parentElement.style.zIndex = '';
        parentElement.style.opacity = '';
      }
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgRatio = height / width;
      const pdfImgWidth = pdfWidth - 10;
      const pdfImgHeight = pdfImgWidth * imgRatio;
      const imgX = 5;
      const imgY = 5;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, pdfImgWidth, Math.min(pdfImgHeight, pdfHeight - 10));
      
      const fileName = createdContract 
        ? `Shartnoma_${createdContract.contractNumber}.pdf`
        : `Shartnoma_${formData.name.replace(/\s+/g, '_')}.pdf`;
      
      pdf.save(fileName);
      
      toast({
        title: "Muvaffaqiyatli!",
        description: "Shartnoma PDF formatida yuklandi.",
        className: "bg-green-50 border-green-200"
      });
    } catch (error: any) {
      console.error('PDF download error:', error);
      const errorMessage = error?.message || error?.toString() || "PDF yuklab olishda xatolik yuz berdi";
      toast({
        title: "Xatolik",
        description: errorMessage,
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
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-blue-600 p-6 text-white">
                <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                  <FileText className="w-8 h-8" />
                  Ommaviy Oferta
                </CardTitle>
                <CardDescription className="text-blue-100 mt-2 text-base">
                  Iltimos, shartnoma shartlari bilan diqqat bilan tanishib chiqing.
                </CardDescription>
              </div>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] md:h-[500px] w-full p-6 bg-slate-50">
                  <div className="prose prose-sm md:prose-base max-w-none text-gray-700 font-serif leading-relaxed whitespace-pre-wrap">
                    {contractTemplate}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex flex-col md:flex-row gap-4 p-6 border-t bg-white items-center justify-between">
                <div className="flex items-center space-x-3 w-full md:w-auto p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setFormData({...formData, agreed: !formData.agreed})}>
                  <Checkbox 
                    id="terms" 
                    checked={formData.agreed}
                    onCheckedChange={(checked) => setFormData({...formData, agreed: checked as boolean})}
                    className="w-6 h-6 border-2 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label 
                    htmlFor="terms" 
                    className="text-sm md:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Shartnoma shartlariga roziman
                  </Label>
                </div>
                <Button 
                  onClick={handleNext} 
                  disabled={!formData.agreed}
                  size="lg"
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all hover:scale-[1.02]"
                >
                  Davom etish
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardFooter>
            </Card>
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

            <div className="flex justify-center bg-gray-200/50 p-4 rounded-xl border border-gray-200 overflow-hidden">
               <div className="scale-[0.5] md:scale-[0.7] origin-top transform-gpu shadow-xl">
                 <ContractPaper 
                   data={{
                     name: formData.name,
                     age: formData.age,
                     course: formData.course,
                     format: 'Online',
                     number: 'DRAFT'
                   }}
                 />
               </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between pt-4">
              <Button variant="outline" onClick={handleBack} size="lg" className="w-full md:w-auto">
                <ChevronLeft className="w-5 h-5 mr-2" />
                Tahrirlash
              </Button>
              <Button 
                onClick={handleSubmit} 
                size="lg" 
                className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white shadow-lg text-lg h-14"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Yuklanmoqda...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6 mr-2" />
                    Tasdiqlash va Imzolash
                  </>
                )}
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

            {/* Hidden Full-Size Contract for PDF Export */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
              <div ref={contractRef} style={{ backgroundColor: '#ffffff', color: '#1f2937' }}>
                <ContractPaper 
                  data={{
                    name: formData.name,
                    age: formData.age,
                    course: formData.course,
                    format: 'Online',
                    number: createdContract?.contractNumber || 'SIGNED',
                    date: createdContract?.createdAt ? new Date(createdContract.createdAt).toLocaleDateString('uz-UZ') : undefined
                  }}
                />
              </div>
            </div>

            {/* Contract Preview (Visible, Scaled) */}
            <div className="flex justify-center bg-gray-100 p-4 rounded-xl border overflow-auto">
              <div className="scale-[0.5] md:scale-[0.6] origin-top transform-gpu">
                <ContractPaper 
                  data={{
                    name: formData.name,
                    age: formData.age,
                    course: formData.course,
                    format: 'Online',
                    number: createdContract?.contractNumber || 'SIGNED',
                    date: createdContract?.createdAt ? new Date(createdContract.createdAt).toLocaleDateString('uz-UZ') : undefined
                  }}
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-8 text-lg shadow-xl"
                onClick={handleDownloadPDF}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Yuklanmoqda...
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6 mr-2" />
                    Shartnomani Yuklab Olish
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 px-8 text-lg"
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
