let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: process.env.HOST,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      },
    });

    return io;
  },

  getIO: () => {
    if (!io) {
      console.log("Socket.io not initialized");
      throw new Error("Couldn't connect with the server.");
    }

    return io;
  },
};
