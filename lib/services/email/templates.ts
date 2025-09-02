import { EmailTemplate } from './types';

export const getPayslipTemplate = (options: {
  employeeName: string;
  downloadUrl: string;
  period: string;
}): EmailTemplate => ({
  subject: `Your Payslip for ${options.period}`,
  html: `
    <div>
      <h2>Hello ${options.employeeName},</h2>
      <p>Your payslip for ${options.period} is ready.</p>
      <p><a href="${options.downloadUrl}">Download Payslip</a></p>
      <p>Best regards,<br/>Payroll Team</p>
    </div>
  `,
  text: `
    Hello ${options.employeeName},
    Your payslip for ${options.period} is ready.
    Download: ${options.downloadUrl}
    Best regards,
    Payroll Team
  `
});

export const getUnauthenticatedSenderTemplate = (options: {
  employeeName: string;
  downloadUrl: string;
  period: string;
  senderEmail: string;
}): EmailTemplate => ({
  subject: `Payslip for ${options.employeeName} (${options.period})`,
  html: `
    <div>
      <p>This payslip was requested by ${options.senderEmail}</p>
      ${getPayslipTemplate(options).html}
    </div>
  `,
  text: `
    This payslip was requested by ${options.senderEmail}
    ${getPayslipTemplate(options).text}
  `
});