
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create and cache a Nodemailer transporter
let transporter;
function getTransporter() {
  try {
    if (transporter) return transporter;
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = !!(process.env.SMTP_SECURE === 'true');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    // If SMTP not configured, skip creating transporter
    if (!host || !user || !pass) {
      console.log('SMTP not configured. Skipping email sending.');
      return null;
    }

    // Safe debug for SMTP config (no passwords)
    try {
      const maskedUser = user ? `${user.slice(0, 2)}***@${(user.split('@')[1] || '')}` : 'N/A';
      console.log(`SMTP config -> host: ${host || 'N/A'}, port: ${port}, secure: ${secure}, user: ${maskedUser}`);
    } catch (_) {}

    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    // Non-blocking verify to surface config issues early
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
    // Log but don't block main flow
    console.error('Email send failed:', e.message);
  }
}

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    // Create token
    const token = jwt.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    // Fire-and-forget email
    sendEmail(
      newUser.email,
      'MP Online Shop - Registration Successful',
      `<div style="font-family:Arial,sans-serif">
        <h2>Welcome to MP Online Shop, ${newUser.name}!</h2>
        <p>Your account has been created successfully.</p>
        <p><strong>Email:</strong> ${newUser.email}</p>
        <p>Thank you for registering.</p>
      </div>`
    );

    res.status(201).json({ 
      message: 'User created successfully', 
      user: { name: newUser.name, email: newUser.email, role: newUser.role },
      token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Simple forgot password: update password by email
exports.forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    // Fire-and-forget email
    sendEmail(
      user.email,
      'MP Online Shop - Password Reset Successful',
      `<div style="font-family:Arial,sans-serif">
        <h2>Hello ${user.name || ''},</h2>
        <p>Your password has been reset successfully.</p>
        <p>If this wasn't you, please contact support immediately.</p>
      </div>`
    );

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Create token
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    // Fire-and-forget email
    sendEmail(
      user.email,
      'MP Online Shop - Login Successful',
      `<div style="font-family:Arial,sans-serif">
        <h2>Hello ${user.name},</h2>
        <p>You have successfully logged in to MP Online Shop.</p>
        <p>If this wasn't you, please secure your account immediately.</p>
      </div>`
    );

    res.status(200).json({ 
      message: 'Login successful', 
      user: { name: user.name, email: user.email, role: user.role },
      token 
    });

  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};
