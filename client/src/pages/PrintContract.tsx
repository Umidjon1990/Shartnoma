import { useEffect, useState } from 'react';
import { useSearch } from 'wouter';
import { ContractPaper } from '@/components/ContractPaper';
import { ContractProvider } from '@/lib/contract-context';

declare global {
  interface Window {
    __CONTRACT_READY__?: boolean;
  }
}

export default function PrintContract() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  
  const [ready, setReady] = useState(false);
  
  const contractData = {
    name: params.get('name') || '',
    age: params.get('age') || '',
    course: params.get('course') || '',
    format: params.get('format') || 'Online',
    number: params.get('number') || '',
    date: params.get('date') || new Date().toLocaleDateString('uz-UZ')
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
      window.__CONTRACT_READY__ = true;
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ContractProvider>
      <div 
        id="print-container"
        style={{ 
          width: '794px', 
          margin: '0 auto', 
          backgroundColor: '#ffffff',
          minHeight: '100vh'
        }}
      >
        <ContractPaper 
          data={contractData}
        />
        {ready && <div id="ready-marker" style={{ display: 'none' }}>READY</div>}
      </div>
    </ContractProvider>
  );
}
