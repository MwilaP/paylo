import nodemailer from 'nodemailer';
import { EmailServiceConfig, PayslipEmailOptions } from './types';
import { getPayslipTemplate, getUnauthenticatedSenderTemplate } from './templates';
// TODO: Implement PDF generation service
// import { generatePayslipPdf } from '../pdf/payslip-pdf.service';
import { Logger } from '../../utils/logger';
import { validateEmail } from '../../utils/email-validator';
import { verifyJwt } from '../../utils/auth-verifier';

export class PayslipEmailService {
  private transporter: nodemailer.Transporter;

  constructor(config: EmailServiceConfig) {
    if (!process.env.NEXTAUTH_URL) {
      throw new Error('NEXTAUTH_URL environment variable is required');
    }
    if (!process.env.EMAIL_FROM) {
      throw new Error('EMAIL_FROM environment variable is required');
    }
    
    this.transporter = nodemailer.createTransport(config);
  }

  async sendPayslip(options: PayslipEmailOptions): Promise<void> {
    try {
      // Validate emails and authentication
      validateEmail(options.recipient);
      
      if (options.isAuthenticated) {
        // Verify JWT token from options
        if (!options.token) {
          throw new Error('Authentication token required');
        }
        const payload = verifyJwt(options.token);
        Logger.debug('Authenticated payslip request', { userId: payload.userId });
      } else if (options.senderEmail) {
        validateEmail(options.senderEmail);
      }
      
      // TODO: Implement proper PDF generation
      const pdfBuffer = Buffer.from('PDF placeholder - implement generation');
      
      // Get appropriate template
      const downloadUrl = `${process.env.NEXTAUTH_URL}/payslip/${options.payslipId}`;
      const template = options.isAuthenticated
        ? getPayslipTemplate({
            employeeName: options.employeeName,
            downloadUrl,
            period: options.period
          })
        : getUnauthenticatedSenderTemplate({
            employeeName: options.employeeName,
            downloadUrl,
            period: options.period,
            senderEmail: options.senderEmail!
          });

      // Send email
      await this.transporter.sendMail({
        from: options.isAuthenticated ? process.env.EMAIL_FROM : options.senderEmail,
        to: options.recipient,
        subject: template.subject,
        html: template.html,
        text: template.text,
        attachments: [{
          filename: `payslip-${options.period}.pdf`,
          content: pdfBuffer
        }]
      });

      // Log success with context
      Logger.info('Payslip email sent successfully', {
        recipient: options.recipient,
        payslipId: options.payslipId,
        isAuthenticated: options.isAuthenticated
      });
    } catch (error) {
      Logger.error('Failed to send payslip email', {
        error: error instanceof Error ? error.message : String(error),
        recipient: options.recipient,
        payslipId: options.payslipId
      });
      throw new Error('Failed to send payslip email');
    }
  }
}