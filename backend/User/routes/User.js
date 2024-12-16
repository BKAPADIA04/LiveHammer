const express = require('express');
const userRouter = express.Router();
const User = require('../controller/User.js');
const { body } = require('express-validator');

userRouter.get('/',(req,res) =>
{
    res.send("Onto the User Details Page!");
});

userRouter.post('/user/signup',User.createUser);

userRouter.post('/user/login',User.loginUser);

exports.userRoute = userRouter;