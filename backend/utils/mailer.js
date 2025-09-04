const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter;
function getTransporter() {
  try {
    if (transporter) return transporter;
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = !!(process.env.SMTP_SECURE === 'true');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      console.log('SMTP not configured. Skipping email sending.');
      return null;
    }

    try {
      const maskedUser = user ? `${user.slice(0, 2)}***@${(user.split('@')[1] || '')}` : 'N/A';
      console.log(`SMTP config -> host: ${host || 'N/A'}, port: ${port}, secure: ${secure}, user: ${maskedUser}`);
    } catch (_) {}

    transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });

    transporter.verify().then(() => {
      console.log('SMTP transporter verified ✅');
    }).catch((e) => {
      console.error('SMTP verify failed:', e.message);
    });
    return transporter;
  } catch (e) {
    console.error('Failed to init SMTP transporter:', e.message);
    return null;
  }
}

async function sendEmail(to, subject, html) {
  try {
    const tx = getTransporter();
    if (!tx) return; // Email disabled
    await tx.sendMail({
      from: `${process.env.FROM_NAME || 'MP Online Shop'} <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  } catch (e) {
    console.error('Email send failed:', e.message);
  }
}

module.exports = { sendEmail };
