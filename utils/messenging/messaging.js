const { getCurrentUser } = require("../users/connectedUsers");

module.exports = function (socket) {
  let io = require("../../config/socket").getIO();
  socket.on("sendMessage", ({ receiverId, text, _id }) => {
    const receiver = getCurrentUser(receiverId);

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
    ({ receiverId, text, senderId, conversationId }) => {
      const receiver = getCurrentUser(receiverId);
      const sender = getCurrentUser(senderId);

      if (receiver && receiver.socketId) {
        io.to(receiver.socketId).emit("getRecentMessage", {
          text,
          conversationId,
        });
      }

      if (sender && sender.socketId) {
        io.to(sender.socketId).emit("getRecentMessage", {
          text,
          conversationId,
        });
      }
    }
  );

  socket.on("addNewConversation", ({ receiverId, conversation }) => {
    const receiver = getCurrentUser(receiverId);
    console.log(receiverId, conversation);
    if (receiver && receiver.socketId) {
      io.to(receiver.socketId).emit("getConversation", {
        conversation,
      });
    }
  });
};
