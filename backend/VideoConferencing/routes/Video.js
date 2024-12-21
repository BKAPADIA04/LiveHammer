const express = require('express');
const videoRouter = express.Router();

const { body } = require('express-validator');

videoRouter.get('/',(req,res) =>
{
    res.send("Onto the Video Conferencing Page!");
});

exports.videoRoute = videoRouter;