import nodemailer from 'nodemailer';

export async function sendBookingConfirmation(userEmail: string, payload: { name: string }) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SYSTEM_MAIL,
        pass: process.env.NODEMAILER_SECRET
      }
    });
    const info = await transporter.sendMail({
      from: `"Pitch Booking System" <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject: 'Test email',
      html: `
      <p>Hello ${payload.name},</p>
      `
    });

    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error};
  }
}