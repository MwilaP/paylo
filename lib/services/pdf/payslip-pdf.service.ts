import { Logger } from '../../utils/logger';
import puppeteer from 'puppeteer';
import type { Payslip } from '../../db/models/payslip.model';

export async function generatePayslipPdf(payslip: Payslip): Promise<Buffer> {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();

    // Generate HTML from the payslip data
    const htmlContent = generatePayslipHtml(payslip);
    
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    await browser.close();
    return pdfBuffer;
  } catch (error) {
    Logger.error('Failed to generate payslip PDF', {
      error: error instanceof Error ? error.message : String(error),
      payslipId: payslip.id
    });
    throw new Error('Failed to generate PDF');
  }
}

function generatePayslipHtml(payslip: Payslip): string {
  // Reuse the print template from page.tsx with actual data
  return `<!DOCTYPE html>
  <html>
  <head>
    <style>
      /* Copy styles from page.tsx print handler */
      @page { size: A4; margin: 1cm; }
      body { font-family: 'Inter', sans-serif; }
      /* Add all other print styles */
    </style>
  </head>
  <body>
    <div class="payslip">
      <!-- Copy payslip HTML structure from page.tsx -->
      <!-- Insert dynamic payslip data here -->
    </div>
  </body>
  </html>`;
}