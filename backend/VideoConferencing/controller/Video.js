const { Server } = require('socket.io');
const {getUserInMeet,getUserModel} = require('../../models.js')

const UserInMeet = getUserInMeet();
const User = getUserModel();
const express = require('express');
const mongoose = require('mongoose');

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

  const findUserByEmail =  (email) => {
      return User.findOne({ email }).exec();
  };



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
    
    socket.on('user:call',(data) => {
      const {to,offer} = data;
      io.to(to).emit('incoming:call',{from:socket.id, offer : offer});
    });

    socket.on('call:accepted',(data) => {
      const {to,answer} = data;
      io.to(to).emit('call:accepted',{from:socket.id, answer:answer})
    });

    // Agora Chat
    socket.on('agora:join', async(data) => {
      console.log(data);
      const {email,channel} = data;
        try {
          // Query the database to retrieve user by email
          const user = await findUserByEmail(email);

          if (user) {
              console.log(`User with email ${email} found, user details: ${user.name}`);
              socket.join(channel); // User is joining the channel
              // Send a welcome message to the channel
              io.to(channel).emit('agora:joined', { message: "Welcome to the Auction Room!" });
          } else {
              console.log(`User with email ${email} not found.`);
              // Optionally, you can send an error response to the user
              socket.emit('agora:error', { message: 'User not found in the system' });
          }
      } catch (error) {
          console.error('Error fetching user for Agora join:', error);
          socket.emit('agora:error', { message: 'Error while fetching user details' });
      }
    });

    socket.on('agora:message', (data) => {
      console.log(data);
      const {channel,from, message} = data;
      io.to(channel).emit('agora:messageReceive', {from:from,message:message});
    });


    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
