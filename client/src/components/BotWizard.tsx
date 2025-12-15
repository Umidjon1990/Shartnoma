import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, FileText, CheckCircle, ArrowRight, User, Phone, Bot, Paperclip } from 'lucide-react';
import { useContract, CourseLevel } from '@/lib/contract-context';
import { ContractPaper } from '@/components/ContractPaper';
import { useToast } from '@/hooks/use-toast';

type Step = 'welcome' | 'read_contract' | 'fill_details' | 'confirm' | 'completed';

export function BotWizard() {
  const [step, setStep] = useState<Step>('welcome');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<{ id: number; type: 'bot' | 'user'; content: React.ReactNode; time: string }[]>([
    { 
      id: 1, 
      type: 'bot', 
      content: 'Assalomu alaykum! "Zamonaviy Ta\'lim" o\'quv markazining rasmiy botiga xush kelibsiz. Men sizga shartnoma tuzishda yordam beraman.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
  }, [messages, isTyping, step]);

  const addMessage = (type: 'bot' | 'user', content: React.ReactNode) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now(), type, content, time }]);
  };

  const simulateBotTyping = (callback: () => void, duration = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, duration);
  };

  const handleStart = () => {
    addMessage('user', '/start');
    simulateBotTyping(() => {
      setStep('read_contract');
      addMessage('bot', (
        <div className="space-y-4">
          <p>Davom etishdan oldin, iltimos, ommaviy oferta (shartnoma) matni bilan tanishib chiqing.</p>
          <div className="bg-white/50 p-4 rounded-lg border border-blue-100 text-xs md:text-sm max-h-40 overflow-y-auto text-gray-600">
            {contractTemplate.slice(0, 300)}...
          </div>
          <Button 
            onClick={() => handleAcceptContract()} 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            Shartnoma bilan tanishdim
          </Button>
        </div>
      ));
    }, 800);
  };

  const handleAcceptContract = () => {
    addMessage('user', 'Shartnoma bilan tanishdim');
    simulateBotTyping(() => {
      setStep('fill_details');
      addMessage('bot', 'Ajoyib! Endi shartnoma tuzish uchun ma\'lumotlaringizni kiriting.');
    });
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

    simulateBotTyping(() => {
      setStep('confirm');
      addMessage('bot', (
        <div>
           <p className="mb-4">Ma'lumotlar qabul qilindi. Shartnoma loyihasi tayyorlandi. Iltimos, tekshirib tasdiqlang.</p>
           <Button onClick={handleConfirm} className="w-full bg-green-500 hover:bg-green-600 text-white">
             <CheckCircle className="w-4 h-4 mr-2" />
             Tasdiqlash va Imzolash
           </Button>
        </div>
      ));
    }, 1500);
  };

  const handleConfirm = () => {
    addMessage('user', 'Tasdiqlayman');
    
    simulateBotTyping(() => {
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
    }, 1200);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-2rem)] lg:h-[800px] gap-4 max-w-7xl mx-auto p-2 lg:p-4">
      {/* Chat Interface - Telegram Style */}
      <Card className="flex-1 flex flex-col shadow-xl border-0 overflow-hidden bg-[#8eace0] backdrop-blur-sm relative">
        {/* Chat Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        {/* Header */}
        <div className="p-3 bg-white flex items-center gap-3 shadow-sm z-10 border-b border-gray-100">
          <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center text-white">
            <Bot className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-gray-800">Zamonaviy Bot</h2>
            <p className="text-xs text-blue-500 font-medium">bot</p>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 pb-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] lg:max-w-[70%] p-3 rounded-2xl shadow-sm relative ${
                    msg.type === 'user'
                      ? 'bg-[#effdde] text-gray-800 rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm'
                  }`}
                >
                  <div className="text-sm md:text-base">{msg.content}</div>
                  <div className={`text-[10px] text-gray-400 mt-1 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.time}
                    {msg.type === 'user' && <span className="ml-1 text-blue-500">✓✓</span>}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area / Controls */}
        <div className="p-2 bg-white border-t border-gray-100">
          <AnimatePresence mode="wait">
            {step === 'welcome' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-2"
              >
                <Button onClick={handleStart} size="lg" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold h-12 uppercase tracking-wide">
                  Boshlash / Start
                </Button>
              </motion.div>
            )}

            {step === 'fill_details' && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleFormSubmit}
                className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-200"
              >
                <div className="flex gap-2">
                  <div className="flex-1 space-y-3">
                    <Input 
                      placeholder="F.I.SH (Familiya Ism)" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="bg-white border-none shadow-sm"
                    />
                    <Input 
                      placeholder="Telefon (+998...)" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                       className="bg-white border-none shadow-sm"
                    />
                    <div className="flex gap-2">
                      <Input 
                        type="number"
                        placeholder="Yosh" 
                        value={formData.age}
                        onChange={e => setFormData({...formData, age: e.target.value})}
                        className="w-20 bg-white border-none shadow-sm"
                      />
                      <Select 
                        value={formData.course} 
                        onValueChange={(val: CourseLevel) => setFormData({...formData, course: val})}
                      >
                        <SelectTrigger className="bg-white border-none shadow-sm flex-1">
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
                </div>
                
                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                  <Send className="w-4 h-4 mr-2" />
                  Yuborish
                </Button>
              </motion.form>
            )}

            {step === 'completed' && (
              <div className="p-2 text-center text-gray-500 text-sm">
                Bot o'z ishini yakunladi. Yangi shartnoma uchun sahifani yangilang.
              </div>
            )}
          </AnimatePresence>
          
          {/* Default Input Bar (Disabled look when bot is controlling flow) */}
          {!['welcome', 'fill_details'].includes(step) && step !== 'completed' && (
             <div className="flex items-center gap-2 px-2 pb-2 opacity-50 pointer-events-none">
               <Paperclip className="w-5 h-5 text-gray-400" />
               <Input placeholder="Xabar yozish..." className="bg-gray-100 border-none" disabled />
               <div className="bg-blue-500 p-2 rounded-full text-white">
                 <Send className="w-4 h-4" />
               </div>
             </div>
          )}
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
