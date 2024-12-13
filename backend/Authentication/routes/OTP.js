const express = require('express');
const otpRouter = express.Router();
const OTP = require('../controller/OTP.js');
const { body } = require('express-validator');

otpRouter.get('/',(req,res) =>
{
    res.send("Onto the Authentication Page!");
});

otpRouter.post('/requestOTP',OTP.requestOTP);

otpRouter.post('/verifyOTP',OTP.verifyOTP);



exports.otpRoute = otpRouter;