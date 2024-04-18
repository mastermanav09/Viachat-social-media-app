require("dotenv").config();
const passport = require("passport");
const passportSetup = require("./config/passport");
const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const { createClient } = require("redis");
const screamRoutes = require("./routes/screams");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const conversationRoutes = require("./routes/conversation");
const messageRoues = require("./routes/message");
const initializeMessenger = require("./utils/messenging/messaging");
const initializeNotifications = require("./utils/notifications/notifications");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const jwtSecret = require("./config/jwt.config");
const { authorize } = require("@thream/socketio-jwt");
const notificationDeletionJob = require("./utils/schedulers/notificationDelete");
const messageDeletionJob = require("./utils/schedulers/messageDelete");
const {
  userJoin,
  userLeave,
  getCurrentUser,
  getOnlineUsers,
  getConversationUsers,
} = require("./utils/users/connectedUsers");

const PORT = process.env.PORT || 8800;

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

(async () => {
  await redisClient.connect();
})();
redisClient.on("connect", function () {
  console.log("Connected redis");
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "origin, Content-Type, Authorization, Accept, Referrer-Policy"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(passport.initialize());
app.use(session({ secret: process.env.SESSION_SECRET }));

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("client", "public", "assets", "profileImages"));
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + uuidv4() + "." + file.mimetype.split("/")[1]);
  },
});

app.use(
  "*/assets/profileImages",
  express.static(path.join(__dirname, "client/public/assets/profileImages"))
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));
}

app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).single("image")
);

app.use("/", require("./routes/root"));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/scream", screamRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/message", messageRoues);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || "Something went wrong!";
  const errorData = error.data;

  res.status(status).json({
    message: message,
    errorData: errorData,
  });
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    const server = require("http").Server(app);
    const io = require("./config/socket").init(server);

    server.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    });

    notificationDeletionJob();
    messageDeletionJob();

    io.use(
      authorize({
        secret: jwtSecret.secret,
      })
    );

    io.on("connection", async (socket) => {
      socket.on("newUser", async () => {
        const userId = socket.decodedToken.userId;
        // userJoin(userId, socket.id);

        redisClient.set(userId, socket.id);
        redisClient.set(socket.id, userId);

        const sender = await getCurrentUser(userId, redisClient);

        if (sender && sender.socketId) {
          const conversationUsers = await getConversationUsers(
            socket,
            userId,
            redisClient
          );

          // this is for showing online status of newly joined user to its friends
          if (conversationUsers?.length > 0) {
            for (const userSocketId of conversationUsers) {
              io.to(userSocketId).emit("getOnlineUsers", {
                users: [userId],
                type: "add_user",
              });
            }
          }
        }
      });

      initializeMessenger(socket, redisClient);
      initializeNotifications(socket, redisClient);

      socket.on("getOnlineUsersEvent", async () => {
        const userId = socket.decodedToken.userId;
        const sender = await getCurrentUser(userId, redisClient);

        // this is for fetching already online users

        if (sender && sender.socketId) {
          const onlineUsers = await getOnlineUsers(socket, userId, redisClient);
          io.to(sender.socketId).emit("getOnlineUsers", {
            users: onlineUsers,
            type: "add_user",
          });
        }
      });

      socket.on("disconnect", async () => {
        const userId = socket.decodedToken.userId;
        const sender = await getCurrentUser(userId, redisClient);

        if (sender && sender.socketId) {
          const conversationUsers = await getConversationUsers(
            socket,
            userId,
            redisClient
          );

          if (conversationUsers?.length > 0) {
            for (const userSocketId of conversationUsers) {
              io.to(userSocketId).emit("getOnlineUsers", {
                users: [userId],
                type: "remove_user",
              });
            }
          }
        }

        redisClient.del(userId);
        redisClient.del(socket.id);
        // userLeave(socket.id);
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
