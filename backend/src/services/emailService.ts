import nodemailer from 'nodemailer';
import { Lead } from '../models/lead.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const emailService = {
  async sendNewLeadNotification(lead: Lead) {
    try {
      const htmlContent = `
        <h2>New Lead Submission</h2>
        <p><strong>Name:</strong> ${lead.name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Phone:</strong> ${lead.phone || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${(lead.message || '').replace(/\n/g, '<br>')}</p>
        <p><strong>Submitted at:</strong> ${new Date(lead.created_at).toLocaleString()}</p>
        <hr>
        <p><a href="${process.env.FRONTEND_URL}/admin/dashboard">View in Dashboard</a></p>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: `New Lead: ${lead.name}`,
        html: htmlContent,
      });

      console.log(`Email sent for lead ${lead.id}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },

  async sendLeadNotification(email: string, subject: string, html: string) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject,
        html,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },
};
