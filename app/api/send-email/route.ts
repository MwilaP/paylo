import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const formData = await req.json()

    const { email, name, period, pdfData } = formData
    console.log(email)

    // Aserv Email Configuration
    /*
    const transporter = nodemailer.createTransport({
      host: 'ankole.aserv.email',
      port: 587,
      secure: false,
      auth: {
        user: 'mwenyao@wilamotors.com',
        pass: 'Mwen@ya@@24'
      },
      tls: {
        rejectUnauthorized: true
      }
    });
    */

    // Email Configuration using environment variables
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error('Email configuration is missing. Please check your environment variables.');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Setup email data
    const mailOptions = {
      from: 'wilamotorsfinance@gmail.com', // Your Gmail address
      to: email,
      subject: `Zambian Wila Motors | Payslip for ${period}`,
      text: `Dear ${name},\n\nPlease find attached your payslip for ${period}.\n\nRegards,\nZambian Wila Motors`,
      html: `
        <p>Dear ${name},</p>
        <p>Please find attached your payslip for ${period}.</p>
        <p>Regards,<br/>Wila Motors</p>
      `,
      attachments: [
        {
          filename: `${name.replace(/\s+/g, '_')}_Payslip_${period}.pdf`,
          content: Buffer.from(pdfData, 'base64'),
          contentType: 'application/pdf'
        }
      ]
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Email sent');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(JSON.stringify({ message: 'Error sending email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}