const express = require('express');
const cors = require('cors');

const server = express();
const port = 8080;

server.get('/', (req, res) => {
  res.send('Welcome to LiveHammer!')
})
server.use(cors()); // CORS allows clients from different origins to make requests to your server, which is useful if your frontend and backend are hosted on different servers or ports.
server.use(express.json()); // express.json() ensures that any JSON data sent by the client (e.g., through POST requests) will be automatically parsed into an object you can work with in your route handlers.

server.listen(port, () => {
    console.log(`LiveHammer listening on port ${port}`)
  })