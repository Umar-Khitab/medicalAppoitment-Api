
const socketIo = require('socket.io');
const Message = require("../models/messageModel");

function configureSockets(server) {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle events like recieved messages, user connections, etc.

    socket.on('ChatRecievedMessage', async (data) => {

      try {
        // Store the message in the database
        let message = {};

        if (data.chatType == 'global chat' || !data.reciever) {
          // console.log(data);

          message = new Message({
            sender_id: data.sender.id,
            message: data.message,
            status: 0,
            chat_type: data.chatType
          });
        } else {
          message = new Message({
            sender_id: data.sender.id,
            reciever_id: data.reciever.id,
            message: data.message,
            status: 0,
            chat_type: data.chatType
          });
        }

        await message.save();

        // Broadcast the message to all connected clients

      } catch (error) {
        console.error('Error storing message:', error);
      }
      io.emit('ChatRecievedMessage', data); // Broadcast the message to all connected clients
    });


    socket.on('individualChatRecievedMessage', async (data) => {

      try {
        // Store the message in the database
        const message = new Message({
          sender_id: data.sender.id,
          reciever_id: data.reciever.id,
          message: data.message,
          status: 0,
          chat_type: data.chatType
        });
        await message.save();

        // Broadcast the message to all connected clients

      } catch (error) {
        console.error('Error storing message:', error);
      }
      io.emit('individualChatRecievedMessage', data); // Broadcast the message to all connected clients
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
}

module.exports = configureSockets;
