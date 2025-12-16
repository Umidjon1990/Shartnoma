import React, { useState, useEffect } from 'react';
import { useContract } from '@/lib/contract-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Search, Users, Calendar, Download, Send, Globe, Loader2, Eye, Trash2, Lock } from 'lucide-react';
import { ContractPaper } from '@/components/ContractPaper';

function LoginPage({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        onLogin(data.token);
      } else {
        setError(data.error || 'Login xatosi');
      }
    } catch (err) {
      setError('Server bilan bog\'lanishda xato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle>Admin Panel</CardTitle>
          <CardDescription>Tizimga kirish uchun login va parolni kiriting</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Login</label>
              <Input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                data-testid="input-username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Parol</label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                data-testid="input-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Kirish
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState<string | null>(null);
  const { contractTemplate, updateContractTemplate } = useContract();
  const [searchTerm, setSearchTerm] = useState('');
  const [templateText, setTemplateText] = useState(contractTemplate);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [deleteContract, setDeleteContract] = useState<Contract | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const { data: contracts = [], isLoading } = useQuery({
    queryKey: ['contracts'],
    queryFn: fetchContracts,
    enabled: !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/contracts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('O\'chirishda xato');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      setDeleteContract(null);
    }
  });

  const filteredContracts = contracts.filter(c => 
    c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contractNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTemplateSave = () => {
    updateContractTemplate(templateText);
    alert("Shartnoma matni yangilandi!");
  };

  const handleDownloadPDF = async (contract: Contract) => {
    setDownloadingId(contract.id);
    try {
      const response = await fetch(`/api/contracts/${contract.id}/pdf`);
      if (!response.ok) throw new Error('PDF yaratishda xato');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Shartnoma_${contract.contractNumber}_${contract.studentName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF yuklab olishda xato:', error);
      alert('PDF yuklab olishda xato yuz berdi');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  if (!token) {
    return <LoginPage onLogin={setToken} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 text-sm md:text-base">Shartnomalar va o'quvchilar nazorati</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>Chiqish</Button>
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
                      <TableHead className="text-right">Amallar</TableHead>
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
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => setSelectedContract(contract)}
                                data-testid={`button-view-${contract.id}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="gap-1"
                                onClick={() => handleDownloadPDF(contract)}
                                disabled={downloadingId === contract.id}
                                data-testid={`button-download-${contract.id}`}
                              >
                                {downloadingId === contract.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => setDeleteContract(contract)}
                                data-testid={`button-delete-${contract.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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
                     Railway Variables orqali sozlang
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                      <p className="font-medium mb-2">Railway Variables-da sozlang:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li><code>TELEGRAM_BOT_TOKEN</code> - Bot token</li>
                        <li><code>TELEGRAM_CHAT_ID</code> - Chat/Group ID</li>
                      </ul>
                    </div>
                 </CardContent>
               </Card>

               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <Globe className="w-6 h-6 text-gray-500" />
                     Admin Sozlamalari
                   </CardTitle>
                   <CardDescription>
                     Railway Variables orqali sozlang
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                      <p className="font-medium mb-2">Railway Variables-da sozlang:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li><code>ADMIN_USERNAME</code> - Admin login (default: admin)</li>
                        <li><code>ADMIN_PASSWORD</code> - Admin parol (default: demo123)</li>
                      </ul>
                    </div>
                 </CardContent>
               </Card>
             </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Contract Preview Dialog */}
      <Dialog open={!!selectedContract} onOpenChange={() => setSelectedContract(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Shartnoma: {selectedContract?.contractNumber}</DialogTitle>
          </DialogHeader>
          
          {selectedContract && (
            <div className="space-y-4">
              <div className="overflow-x-auto bg-gray-100 rounded-xl border p-2 md:p-4 max-h-[500px] overflow-y-auto">
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
                  onClick={() => handleDownloadPDF(selectedContract)}
                  disabled={downloadingId === selectedContract.id}
                  className="bg-blue-600 hover:bg-blue-700 gap-2"
                  data-testid="button-download-pdf"
                >
                  {downloadingId === selectedContract.id ? (
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteContract} onOpenChange={() => setDeleteContract(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Shartnomani o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteContract?.studentName} ning shartnomasi ({deleteContract?.contractNumber}) o'chiriladi. Bu amalni qaytarib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteContract && deleteMutation.mutate(deleteContract.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
