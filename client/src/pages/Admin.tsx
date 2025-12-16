import React, { useState, useRef } from 'react';
import { useContract } from '@/lib/contract-context';
import { useQuery } from '@tanstack/react-query';
import { fetchContracts } from '@/lib/api';
import type { Contract } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, FileEdit, Users, Calendar, Download, Send, Globe, MessageSquare, Loader2, X } from 'lucide-react';
import { Link } from 'wouter';
import { ContractPaper } from '@/components/ContractPaper';
import domtoimage from 'dom-to-image-more';
import { jsPDF } from 'jspdf';

export default function Admin() {
  const { contractTemplate, updateContractTemplate } = useContract();
  const [searchTerm, setSearchTerm] = useState('');
  const [templateText, setTemplateText] = useState(contractTemplate);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const contractRef = useRef<HTMLDivElement>(null);
  
  const { data: contracts = [], isLoading } = useQuery({
    queryKey: ['contracts'],
    queryFn: fetchContracts,
  });

  const filteredContracts = contracts.filter(c => 
    c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contractNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTemplateSave = () => {
    updateContractTemplate(templateText);
    alert("Shartnoma matni yangilandi!");
  };

  const handleDownloadPDF = async () => {
    if (!contractRef.current || !selectedContract) return;
    
    setIsDownloading(true);
    try {
      const element = contractRef.current;
      const scale = 3;
      
      const dataUrl = await domtoimage.toPng(element, {
        quality: 1.0,
        bgcolor: '#ffffff',
        width: element.offsetWidth * scale,
        height: element.offsetHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: element.offsetWidth + 'px',
          height: element.offsetHeight + 'px',
        }
      });

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => { img.onload = resolve; });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const contentWidth = pageWidth - (margin * 2);

      const imgAspectRatio = img.width / img.height;
      const imgHeightInMM = contentWidth / imgAspectRatio;

      let yOffset = 0;
      let pageNumber = 1;
      const availableHeight = pageHeight - (margin * 2);

      while (yOffset < imgHeightInMM) {
        if (pageNumber > 1) {
          pdf.addPage();
        }

        const sourceY = (yOffset / imgHeightInMM) * img.height;
        const sourceHeight = Math.min((availableHeight / imgHeightInMM) * img.height, img.height - sourceY);

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = sourceHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, sourceY, img.width, sourceHeight, 0, 0, img.width, sourceHeight);
        }

        const pageDataUrl = canvas.toDataURL('image/png', 1.0);
        const sliceHeightInMM = (sourceHeight / img.height) * imgHeightInMM;
        pdf.addImage(pageDataUrl, 'PNG', margin, margin, contentWidth, sliceHeightInMM);

        yOffset += availableHeight;
        pageNumber++;
      }

      pdf.save(`Shartnoma_${selectedContract.contractNumber}_${selectedContract.studentName.replace(/\s+/g, '_')}.pdf`);
      setSelectedContract(null);
    } catch (error) {
      console.error('PDF yaratishda xato:', error);
      alert('PDF yaratishda xato yuz berdi');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 text-sm md:text-base">Shartnomalar va o'quvchilar nazorati</p>
          </div>
          <Link href="/">
            <Button variant="outline">Saytga qaytish</Button>
          </Link>
        </div>

        <Tabs defaultValue="contracts" className="w-full">
          <TabsList className="grid w-full md:w-[600px] grid-cols-3">
            <TabsTrigger value="contracts">Shartnomalar</TabsTrigger>
            <TabsTrigger value="settings">Sozlamalar</TabsTrigger>
            <TabsTrigger value="integrations">Integratsiyalar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contracts" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Jami Shartnomalar</CardTitle>
                  <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{contracts.length}</div>
                  <p className="text-xs text-muted-foreground">+2 bugun</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Online O'quvchilar</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{contracts.filter(c => c.format === 'Online').length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Oxirgi Sana</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{new Date().toLocaleDateString()}</div>
                </CardContent>
              </Card>
            </div>

            <Card className="col-span-4">
              <CardHeader>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <CardTitle>Barcha Shartnomalar</CardTitle>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Ism yoki raqam bo'yicha qidirish..." 
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      data-testid="input-search"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shartnoma №</TableHead>
                      <TableHead>O'quvchi ismi</TableHead>
                      <TableHead>Telefon</TableHead>
                      <TableHead>Kurs</TableHead>
                      <TableHead>Sana</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Yuklab olish</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          Yuklanmoqda...
                        </TableCell>
                      </TableRow>
                    ) : filteredContracts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          Hech narsa topilmadi
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredContracts.map((contract) => (
                        <TableRow key={contract.id} data-testid={`row-contract-${contract.id}`}>
                          <TableCell className="font-mono text-xs">{contract.contractNumber}</TableCell>
                          <TableCell>
                            <div className="font-medium text-gray-900" data-testid={`text-student-name-${contract.id}`}>
                              {contract.studentName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600">{contract.phone}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{contract.course}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">{new Date(contract.createdAt).toLocaleDateString('uz-UZ')}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 shadow-none border-0">Imzolangan</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="gap-1"
                              onClick={() => setSelectedContract(contract)}
                              data-testid={`button-download-${contract.id}`}
                            >
                              <Download className="h-4 w-4" />
                              <span className="hidden md:inline">PDF</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Shartnoma Matnini Tahrirlash</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-200">
                  <strong>Eslatma:</strong> Matn ichidagi <code>{`{name}`}</code>, <code>{`{course}`}</code> kabi o'zgaruvchilarni o'zgartirmang. Ular avtomatik to'ldiriladi.
                </div>
                <Textarea 
                  className="min-h-[400px] font-mono text-sm"
                  value={templateText}
                  onChange={(e) => setTemplateText(e.target.value)}
                />
                <div className="flex justify-end">
                   <Button onClick={handleTemplateSave} className="bg-blue-600">Saqlash</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <Send className="w-6 h-6 text-blue-500" />
                     Telegram Bot Integratsiyasi
                   </CardTitle>
                   <CardDescription>
                     Yangi shartnomalar haqida xabarnoma olish uchun sozlangan
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="space-y-2">
                       <p className="text-sm font-medium">Bot Token</p>
                       <Input type="password" placeholder="123456789:ABCdefGHIjklMNOpqrs..." className="bg-white" />
                       <p className="text-[10px] text-gray-500">BotFather dan olingan token</p>
                    </div>

                    <div className="space-y-2">
                       <p className="text-sm font-medium">Chat ID (Admin)</p>
                       <Input placeholder="-100123456789" className="bg-white" />
                       <p className="text-[10px] text-gray-500">Xabarlar boradigan guruh yoki user ID</p>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between mt-4">
                      <div>
                        <p className="font-medium text-green-900">Holat: Faol</p>
                        <p className="text-xs text-green-700">Xabarlar yuborilmoqda</p>
                      </div>
                      <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Sozlamalarni Saqlash
                    </Button>
                 </CardContent>
               </Card>

               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <Globe className="w-6 h-6 text-gray-500" />
                     Web Integratsiya
                   </CardTitle>
                   <CardDescription>
                     Saytingizga vidjet o'rnatish
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="space-y-2">
                       <p className="text-sm font-medium">Embed Code</p>
                       <Textarea 
                         readOnly 
                         className="bg-gray-50 font-mono text-xs min-h-[100px]" 
                         value={`<script src="https://zamonaviy.uz/widget.js"></script>\n<div id="contract-bot"></div>`}
                       />
                    </div>
                    <Button className="w-full">
                      Nusxa Olish
                    </Button>
                 </CardContent>
               </Card>
             </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* PDF Download Dialog */}
      <Dialog open={!!selectedContract} onOpenChange={() => setSelectedContract(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Shartnoma: {selectedContract?.contractNumber}</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedContract && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">O'quvchi:</span>
                    <span className="font-medium ml-2">{selectedContract.studentName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Telefon:</span>
                    <span className="font-medium ml-2">{selectedContract.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Kurs:</span>
                    <span className="font-medium ml-2">{selectedContract.course}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Sana:</span>
                    <span className="font-medium ml-2">{new Date(selectedContract.createdAt).toLocaleDateString('uz-UZ')}</span>
                  </div>
                </div>
              </div>

              {/* Hidden Full-Size Contract for PDF Export */}
              <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                <div ref={contractRef} style={{ backgroundColor: '#ffffff', color: '#1f2937', width: '794px' }}>
                  <ContractPaper 
                    data={{
                      name: selectedContract.studentName,
                      age: selectedContract.age,
                      course: selectedContract.course,
                      format: selectedContract.format,
                      number: selectedContract.contractNumber,
                      date: new Date(selectedContract.createdAt).toLocaleDateString('uz-UZ')
                    }}
                    forPdf={true}
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="overflow-x-auto bg-gray-100 rounded-xl border p-2 md:p-4 max-h-[400px] overflow-y-auto">
                <ContractPaper 
                  data={{
                    name: selectedContract.studentName,
                    age: selectedContract.age,
                    course: selectedContract.course,
                    format: selectedContract.format,
                    number: selectedContract.contractNumber,
                    date: new Date(selectedContract.createdAt).toLocaleDateString('uz-UZ')
                  }}
                  className="mx-auto max-w-full"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedContract(null)}>
                  Yopish
                </Button>
                <Button 
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="bg-blue-600 hover:bg-blue-700 gap-2"
                  data-testid="button-download-pdf"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Yuklanmoqda...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      PDF Yuklab Olish
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FileTextIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  )
}
