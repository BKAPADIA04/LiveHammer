require("dotenv").config();

const OTP = require("../model/OTP.js");
const Auth = OTP.Authentication;

const express = require('express');
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

// const otpStore = new Map();

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
    const errors = validationResult(req);
    const arr = errors.array();
    let success = true;
    if (!errors.isEmpty()) {
      success = false;
      return res.status(400).json({ success:success,error: arr });
    }

    const { email } = req.body;
    if (!email ) {
        return res.status(400).json({ error: 'Email ID is required' });
      }
    const otp = generateOtp();

    const salt = await bcrypt.genSalt(10);
    const bcryptOTP = await bcrypt.hash(otp, salt);
    // const expiresAt = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
    // otpStore.set(email, { otp, expiresAt });
    try {
      // Save the OTP and email to the database
      const authInfo = await Auth.findOneAndUpdate(
        { email: email }, // Query to find the document by email
        { otp: bcryptOTP, expiresAt: Date.now() + 5 * 60 * 1000 }, // Update OTP and expiration
        { new: true, upsert: true } // Options: return the updated doc and create if it doesn't exist
      );
      const doc = await authInfo.save();
    
      try {
        // Send OTP email
        await sendOtpEmail(email, otp);
    
        // Respond with success message
        res.status(200).json({ message: 'OTP generated and sent successfully' });
      } catch (emailError) {
        console.error('Error sending OTP email:', emailError);
        res.status(500).json({ error: 'Failed to send OTP email' });
      }
    } catch (dbError) {
      console.error('Error saving OTP email:', dbError);
      res.status(500).json({ error: 'Failed to save OTP email' });
    }
   // console.log(`Generated OTP for ${name}: ${otp}`);
    // res.status(200).json({ message: 'OTP generated successfully', otp: otp });
}

exports.verifyOTP = async(req,res) => {

  const errors = validationResult(req);
  const arr = errors.array();
  let success = true;
  if (!errors.isEmpty()) {
    success = false;
    return res.status(400).json({ success:success,error: arr });
  }

    const { email, otp } = req.body;

    if (!email  || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    // const storedOtpData = otpStore.get(email);
    let storedOtpData = await Auth.findOne({'email' : email});
    if (!storedOtpData) {
        return res.status(400).json({ error: 'OTP not found or expired' });
      }
    // const { otp: storedOtp, expiresAt } = storedOtpData;

    // Check if the OTP is expired
    // if (Date.now() > expiresAt) {
    //     otpStore.delete(email); // Remove expired OTP
    //     return res.status(400).json({ error: 'OTP expired' });
    // }

    // Verify the OTP
    const storedOtp = storedOtpData.otp;
    const otpCompare = await bcrypt.compare(otp,storedOtp);
    if (otpCompare) {
        // otpStore.delete(email); // Clear OTP after successful verification
        const result = await Auth.deleteOne({ 'email': email });
        return res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        return res.status(401).json({ error: 'Invalid OTP' });
    }
}