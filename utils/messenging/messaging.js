const { getCurrentUser, users } = require("../users/connectedUsers");

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

      if (sender && sender.socketId) {
        io.to(sender.socketId).emit("getRecentMessage", {
          text,
          conversationId,
        });
      }

      if (receiver && receiver.socketId) {
        console.log("receiver ghuuss", receiver.socketId);
        console.log(users);
        io.to(receiver.socketId).emit("getRecentMessage", {
          text,
          conversationId,
        });
      }
    }
  );

  socket.on(
    "addNewConversation",
    ({ receiverId, friendConversation: conversation }) => {
      const receiver = getCurrentUser(receiverId);

      if (receiver && receiver.socketId) {
        io.to(receiver.socketId).emit("getConversation", {
          conversation,
        });
      }
    }
  );
};
