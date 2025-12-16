import puppeteer, { Browser, Page } from 'puppeteer';

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browser || !browser.isConnected()) {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--font-render-hinting=none'
      ]
    });
  }
  return browser;
}

export interface ContractData {
  name: string;
  age: string;
  course: string;
  format: string;
  number: string;
  date: string;
}

export async function generateContractPdf(
  contractData: ContractData,
  baseUrl: string
): Promise<Buffer> {
  const browserInstance = await getBrowser();
  let page: Page | null = null;
  
  try {
    page = await browserInstance.newPage();
    
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 2
    });

    const params = new URLSearchParams({
      name: contractData.name,
      age: contractData.age,
      course: contractData.course,
      format: contractData.format,
      number: contractData.number,
      date: contractData.date
    });

    const url = `${baseUrl}/print/contract?${params.toString()}`;
    
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    await page.waitForFunction(() => {
      return document.getElementById('ready-marker') !== null;
    }, { timeout: 10000 });

    await new Promise(resolve => setTimeout(resolve, 1000));

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm'
      },
      preferCSSPageSize: false
    });

    return Buffer.from(pdf);
  } finally {
    if (page) {
      await page.close().catch(() => {});
    }
  }
}

export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
  }
}
