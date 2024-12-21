const { Server } = require('socket.io');

module.exports = (server) => {
  // Initialize Socket.IO
  const io = new Server(server);

  // Handle Socket.IO connections
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for custom events
    socket.on('message', (data) => {
      console.log('Message received:', data);

      // Emit a response
      socket.emit('messageResponse', `Server received: ${data}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
