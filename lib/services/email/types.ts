export interface PayslipEmailOptions {
  recipient: string;
  employeeName: string;
  payslipId: string;
  period: string;
  isAuthenticated: boolean;
  senderEmail?: string;
  token?: string; // Required when isAuthenticated=true
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailServiceConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}