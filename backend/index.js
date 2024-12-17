const connectToMongo=require('./db.js');
const express = require('express');
const cors = require('cors'); // cross browser
connectToMongo(); 

const server = express();
const port = 8080;

server.get('/', (req, res) => {
  res.send('Welcome to LiveHammer!')
})
server.use(cors()); // cross browser
server.use(express.json()); // reading json

//Router Section
//Authentication
const otpRouter = require('./Authentication/routes/OTP.js');
server.use('/auth',otpRouter.otpRoute);

//User
const userRouter = require('./User/routes/User.js');
server.use('/user',userRouter.userRoute);


server.listen(port, () => {
  console.log(`LiveHammer App listening on port ${port}`)
})