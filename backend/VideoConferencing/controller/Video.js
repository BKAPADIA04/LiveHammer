const { Server } = require('socket.io');

module.exports = (server) => {
  // Initialize Socket.IO
  const io = new Server(server,{
    cors:{
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  const emailToSocketId = new Map();
  const socketIdToEmail = new Map();

  // Handle Socket.IO connections
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for custom events
    socket.on('room:join', (data) => {
      console.log('Message received:', data);
      const {email,room} = data;
      emailToSocketId.set(email,socket.id);
      socketIdToEmail.set(socket.id,email);

      // Emit a response
      // socket.emit('room:join', `Server received: ${data}`);
      // or
      io.to(room).emit('user:joined', {'email': email, 'room': room, 'socketId': socket.id});
      socket.join(room);
      io.to(socket.id).emit('room:join', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
