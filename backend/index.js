const express = require('express');
const cors = require('cors'); // cross browser

const server = express();
const port = 8080;

server.get('/', (req, res) => {
  res.send('Welcome to LiveHammer!')
})
server.use(cors()); // cross browser
server.use(express.json()); // reading json

server.listen(port, () => {
  console.log(`iNoteBook App listening on port ${port}`)
})