const connectToMongo_OTP = require('./Authentication/db.js');
const express = require('express');
const cors = require('cors'); // cross browser
connectToMongo_OTP();

const server = express();
const port = 8080;

server.get('/', (req, res) => {
  res.send('Welcome to LiveHammer!')
})
server.use(cors()); // cross browser
server.use(express.json()); // reading json

//Router Section
const otpRouter = require('./Authentication/routes/OTP.js');
server.use('/user_auth',otpRouter.otpRoute);

server.listen(port, () => {
  console.log(`LiveHammer App listening on port ${port}`)
})