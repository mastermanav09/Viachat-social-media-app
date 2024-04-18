const { getCurrentUser } = require("../users/connectedUsers");

module.exports = function (socket, redisClient) {
  let io = require("../../config/socket").getIO();

  socket.on("sendMessage", async ({ receiverId, text, _id }) => {
    const receiver = await getCurrentUser(receiverId, redisClient);

    if (receiver && receiver.socketId) {
      io.to(receiver.socketId).emit("getMessage", {
        senderId: socket.decodedToken.userId,
        text,
        _id,
      });
    }
  });

  socket.on(
    "receiveRecentMessage",
    async ({ receiverId, text, senderId, conversationId }) => {
      const receiver = await getCurrentUser(receiverId, redisClient);
      const sender = await getCurrentUser(senderId, redisClient);

      if (sender && sender.socketId) {
        io.to(sender.socketId).emit("getRecentMessage", {
          text,
          conversationId,
        });
      }

      if (receiver && receiver.socketId) {
        io.to(receiver.socketId).emit("getRecentMessage", {
          text,
          conversationId,
        });
      }
    }
  );

  socket.on(
    "addNewConversation",
    async ({ receiverId, friendConversation: conversation }) => {
      const receiver = await getCurrentUser(receiverId, redisClient);

      if (receiver && receiver.socketId) {
        io.to(receiver.socketId).emit("getConversation", {
          conversation,
        });
      }
    }
  );
};
