const express = require('express');
const userRouter = express.Router();
const User = require('../controller/User.js');
const { body } = require('express-validator');

userRouter.get('/',(req,res) =>
{
    res.send("Onto the Authentication Page!");
});

userRouter.post('/requestOTP',User.requestOTP);

userRouter.post('/verifyOTP',User.verifyOTP);



exports.userRoute = userRouter;