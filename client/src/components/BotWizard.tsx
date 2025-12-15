import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, FileText, CheckCircle, ArrowRight, User, Phone, BookOpen, Bot } from 'lucide-react';
import { useContract, CourseLevel } from '@/lib/contract-context';
import { ContractPaper } from '@/components/ContractPaper';
import { useToast } from '@/hooks/use-toast';
import logo from '@assets/generated_images/modern_education_logo.png';

type Step = 'welcome' | 'read_contract' | 'fill_details' | 'confirm' | 'completed';

export function BotWizard() {
  const [step, setStep] = useState<Step>('welcome');
  const [messages, setMessages] = useState<{ id: number; type: 'bot' | 'user'; content: React.ReactNode }[]>([
    { 
      id: 1, 
      type: 'bot', 
      content: 'Assalomu alaykum! "Zamonaviy Ta\'lim" o\'quv markazining rasmiy botiga xush kelibsiz. Men sizga shartnoma tuzishda yordam beraman.' 
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { addContract, contractTemplate } = useContract();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    course: '' as CourseLevel
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, step]);

  const addMessage = (type: 'bot' | 'user', content: React.ReactNode) => {
    setMessages(prev => [...prev, { id: Date.now(), type, content }]);
  };

  const handleStart = () => {
    addMessage('user', '/start');
    setTimeout(() => {
      setStep('read_contract');
      addMessage('bot', (
        <div className="space-y-4">
          <p>Davom etishdan oldin, iltimos, ommaviy oferta (shartnoma) matni bilan tanishib chiqing.</p>
          <div className="bg-white/50 p-4 rounded-lg border border-blue-100 text-xs md:text-sm max-h-40 overflow-y-auto text-gray-600">
            {contractTemplate.slice(0, 300)}...
          </div>
          <Button 
            onClick={() => handleAcceptContract()} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            Shartnoma bilan tanishdim
          </Button>
        </div>
      ));
    }, 600);
  };

  const handleAcceptContract = () => {
    addMessage('user', 'Shartnoma bilan tanishdim');
    setTimeout(() => {
      setStep('fill_details');
      addMessage('bot', 'Ajoyib! Endi shartnoma tuzish uchun ma\'lumotlaringizni kiriting.');
    }, 600);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.age || !formData.course) {
      toast({ title: "Xatolik", description: "Iltimos, barcha maydonlarni to'ldiring", variant: "destructive" });
      return;
    }

    addMessage('user', (
      <div className="space-y-1 text-sm">
        <p><strong>Ism:</strong> {formData.name}</p>
        <p><strong>Tel:</strong> {formData.phone}</p>
        <p><strong>Yosh:</strong> {formData.age}</p>
        <p><strong>Kurs:</strong> {formData.course}</p>
      </div>
    ));

    setTimeout(() => {
      setStep('confirm');
      addMessage('bot', (
        <div>
           <p className="mb-4">Ma'lumotlar qabul qilindi. Shartnoma loyihasi tayyorlandi. Iltimos, tekshirib tasdiqlang.</p>
           <Button onClick={handleConfirm} className="w-full bg-green-600 hover:bg-green-700 text-white">
             <CheckCircle className="w-4 h-4 mr-2" />
             Tasdiqlash va Imzolash
           </Button>
        </div>
      ));
    }, 800);
  };

  const handleConfirm = () => {
    addMessage('user', 'Tasdiqlayman');
    
    // Simulate processing
    setTimeout(() => {
      addContract({
        studentName: formData.name,
        age: formData.age,
        phone: formData.phone,
        course: formData.course,
        format: 'Online'
      });
      
      setStep('completed');
      addMessage('bot', 'Tabriklaymiz! Shartnoma muvaffaqiyatli tuzildi. Quyida PDF variantini yuklab olishingiz mumkin.');
      
      toast({
        title: "Muvaffaqiyatli!",
        description: "Shartnoma tuzildi va bazaga kiritildi.",
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-2rem)] lg:h-[800px] gap-4 max-w-7xl mx-auto p-2 lg:p-4">
      {/* Chat Interface */}
      <Card className="flex-1 flex flex-col shadow-xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
        <div className="p-4 bg-blue-600 text-white flex items-center gap-3 shadow-md z-10">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold">Zamonaviy Bot</h2>
            <p className="text-xs text-blue-100 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Online
            </p>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4 bg-slate-50">
          <div className="space-y-4 pb-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] lg:max-w-[70%] p-4 rounded-2xl shadow-sm ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 bg-white border-t border-gray-100">
          <AnimatePresence mode="wait">
            {step === 'welcome' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Button onClick={handleStart} size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12">
                  Boshlash / Start
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {step === 'fill_details' && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleFormSubmit}
                className="space-y-4 bg-white p-1 rounded-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">F.I.SH (Familiya Ism)</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input 
                        id="name" 
                        placeholder="Masalan: Azizov Aziz" 
                        className="pl-9" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon raqam</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input 
                        id="phone" 
                        placeholder="+998 90 123 45 67" 
                        className="pl-9" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Yosh</Label>
                    <Input 
                      id="age" 
                      type="number" 
                      placeholder="18" 
                      value={formData.age}
                      onChange={e => setFormData({...formData, age: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="course">Kursni tanlang</Label>
                    <Select 
                      value={formData.course} 
                      onValueChange={(val: CourseLevel) => setFormData({...formData, course: val})}
                    >
                      <SelectTrigger>
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
                
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Ma'lumotlarni yuborish
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Live Preview Panel (Only visible after start) */}
      {(step === 'confirm' || step === 'completed') && (
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 hidden lg:block h-full"
        >
          <ScrollArea className="h-full rounded-xl border border-gray-200 bg-gray-50/50 p-4 shadow-inner">
             <div className="flex justify-center pb-8">
               <div className="scale-[0.8] origin-top">
                 <ContractPaper 
                   data={{
                     name: formData.name,
                     age: formData.age,
                     course: formData.course,
                     format: 'Online',
                     number: step === 'completed' ? `CN-2025-${Math.floor(Math.random() * 1000)}` : undefined
                   }}
                   onDownload={step === 'completed' ? () => toast({title: "Yuklanmoqda...", description: "PDF fayl yuklanmoqda"}) : undefined}
                 />
               </div>
             </div>
          </ScrollArea>
        </motion.div>
      )}
    </div>
  );
}
