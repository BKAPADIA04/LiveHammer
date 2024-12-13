const express = require('express');

const otpStore = new Map();

// Generate a 6-digit OTP
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Random 6-digit OTP
  }

exports.requestOTP = async (req,res) => {
    const { email , phone } = req.body;
    if (!email || !phone) {
        return res.status(400).json({ error: 'Email ID and Phone Number are required' });
      }
    const otp = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
    otpStore.set(email, { otp, expiresAt });
    // console.log(`Generated OTP for ${name}: ${otp}`);
    res.status(200).json({ message: 'OTP generated successfully', otp: otp });
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