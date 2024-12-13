require("dotenv").config();
const express = require('express');
const nodemailer = require('nodemailer');

const otpStore = new Map();

// Generate a 6-digit OTP
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Random 6-digit OTP
  }

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service:'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.MY_MAIL, 
    pass: process.env.MY_PASSWORD,
  },
  secure: false,
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.MY_MAIL, 
    to: email, // Recipient's email address
    subject: 'Your OTP Code For LiveHammer',
    text: `Hi! Your OTP code for LiveHammer is: ${otp}`, // Plain text body
  };

  await transporter.sendMail(mailOptions);
};

exports.requestOTP = async (req,res) => {
    const { email , phone } = req.body;
    if (!email || !phone) {
        return res.status(400).json({ error: 'Email ID and Phone Number are required' });
      }
    const otp = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
    otpStore.set(email, { otp, expiresAt });
    try {
      // Send OTP email
      await sendOtpEmail(email, otp);
      res.status(200).json({ message: 'OTP generated and sent successfully' });
    } catch (error) {
      console.error('Error sending OTP email:', error);
      res.status(500).json({ error: 'Failed to send OTP email' });
    }
    // console.log(`Generated OTP for ${name}: ${otp}`);
    // res.status(200).json({ message: 'OTP generated successfully', otp: otp });
}

exports.verifyOTP = async(req,res) => {
    const { email, phone, otp } = req.body;

    if (!email || !phone || !otp) {
      return res.status(400).json({ error: 'Email, Phone Number and OTP are required' });
    }

    const storedOtpData = otpStore.get(email);
    if (!storedOtpData) {
        return res.status(400).json({ error: 'OTP not found or expired' });
      }
    const { otp: storedOtp, expiresAt } = storedOtpData;

    // Check if the OTP is expired
    if (Date.now() > expiresAt) {
        otpStore.delete(email); // Remove expired OTP
        return res.status(400).json({ error: 'OTP expired' });
    }

    // Verify the OTP
    if (storedOtp === otp) {
        otpStore.delete(email); // Clear OTP after successful verification
        return res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        return res.status(401).json({ error: 'Invalid OTP' });
    }
}