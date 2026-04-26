import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.error('Email credentials missing');
    return { success: false };
  }

  const mailOptions = {
    from: `"Aerocool Admin" <${user}>`,
    to: to,
    subject: subject,
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };
  } catch (error) {
    console.error('Nodemailer Error:', error);
    throw error;
  }
};

export const sendAdminEmail = async (subject, html) => {
  return sendEmail(process.env.ADMIN_EMAIL || process.env.EMAIL_USER, subject, html);
};

