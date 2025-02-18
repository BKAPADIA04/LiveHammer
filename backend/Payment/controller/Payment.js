const express = require('express');
const { validationResult } = require("express-validator");
require("dotenv").config();

exports.sendStripeCredentials = async(req,res) => {
    const errors = validationResult(req);
    const arr = errors.array();
    let success = true;
    if (!errors.isEmpty()) {
      success = false;
      return res.status(400).json({ success:success,error: arr });
    }

    const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    return res.status(200).json({ success:success, stripePublishableKey: stripePublishableKey, stripeSecretKey: stripeSecretKey });
}

