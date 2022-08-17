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
};
