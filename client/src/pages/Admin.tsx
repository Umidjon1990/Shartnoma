import React, { useState } from 'react';
import { useContract, ContractData } from '@/lib/contract-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, FileEdit, Users, Calendar, Download, Send, Globe, MessageSquare } from 'lucide-react';
import { Link } from 'wouter';

export default function Admin() {
  const { contracts, contractTemplate, updateContractTemplate } = useContract();
  const [searchTerm, setSearchTerm] = useState('');
  const [templateText, setTemplateText] = useState(contractTemplate);

  const filteredContracts = contracts.filter(c => 
    c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTemplateSave = () => {
    updateContractTemplate(templateText);
    alert("Shartnoma matni yangilandi!");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-500">Shartnomalar va o'quvchilar nazorati</p>
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
                <div className="flex items-center justify-between">
                  <CardTitle>Barcha Shartnomalar</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Qidirish..." 
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>O'quvchi</TableHead>
                      <TableHead>Kurs</TableHead>
                      <TableHead>Sana</TableHead>
                      <TableHead>Manba</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amallar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-mono text-xs">{contract.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{contract.studentName}</div>
                          <div className="text-xs text-gray-500">{contract.phone}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{contract.course}</Badge>
                        </TableCell>
                        <TableCell>{contract.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                             <MessageSquare className="w-3 h-3 text-blue-500" />
                             Telegram Bot
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 shadow-none border-0">Imzolangan</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredContracts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          Hech narsa topilmadi
                        </TableCell>
                      </TableRow>
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
                     Telegram Bot
                   </CardTitle>
                   <CardDescription>
                     Telegram botingizni ulash va sozlash
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-900">Faol Ulangan</p>
                        <p className="text-xs text-green-700">@ZamonaviyTalimBot</p>
                      </div>
                      <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    
                    <div className="space-y-2">
                       <p className="text-sm font-medium">Webhook URL</p>
                       <Input value="https://api.zamonaviy.uz/webhook/telegram" readOnly className="bg-gray-50 font-mono text-xs" />
                    </div>

                    <Button variant="outline" className="w-full">
                      Bot Sozlamalarini Yangilash
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
