require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const passport = require("passport");
const mongoose = require("mongoose");
const passportSetup = require("./config/passport");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const screamRoutes = require("./routes/screams");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

const {
  userJoin,
  getCurrentUser,
  userLeave,
  // getRoomUsers,
} = require("./utils/users/connectedUsers");
const Notification = require("./models/notification");
const User = require("./models/user");
const Comment = require("./models/comment");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "origin, Content-Type, Authorization, Accept"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(passport.initialize());

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
    cb(null, "assets/profileImages");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + uuidv4() + "." + file.mimetype.split("/")[1]);
  },
});

app.use("assets", express.static(path.join(__dirname, "assets")));

app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).single("image")
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/scream", screamRoutes);

app.use((error, req, res, next) => {
  console.log(error);
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
    const server = app.listen(process.env.PORT || 8080);
    const io = require("./config/socket").init(server);

    io.on("connection", (socket) => {
      socket.on("newUser", (userId) => {
        userJoin(userId.toString(), socket.id);
      });

      socket.on(
        "sendLikeNotification",
        async ({ senderId, receiverId, screamId }) => {
          const receiver = getCurrentUser(receiverId);
          let notification;

          try {
            if (!receiver) {
              const error = new Error("Something went wrong!");
              error.statusCode = 500;
              throw error;
            }

            const user = await User.findOne({
              _id: mongoose.Types.ObjectId(senderId),
            });

            if (!user) {
              const error = new Error("Something went wrong!");
              error.statusCode = 500;
              throw error;
            }

            notification = new Notification({
              userImageUrl: user.credentials.imageUrl,
              type: "Like",
              screamId: screamId,
              read: false,
              senderUsername: user.credentials.username,
              senderId: senderId,
              recipientId: receiverId,
            });

            await notification.save();
          } catch (error) {
            console.log(error);
          }

          io.to(receiver.socketId).emit("getNotification", {
            message: "Liked your scream.",
            notification: notification,
          });
        }
      );

      socket.on(
        "sendRemoveLikeNotification",
        async ({ screamId, senderId, receiverId }) => {
          const receiver = getCurrentUser(receiverId);
          const sender = getCurrentUser(senderId);

          let userNotifications;
          try {
            if (!receiver || !sender) {
              const error = new Error("Something went wrong!");
              error.statusCode = 500;
              throw error;
            }

            const notifications = await Notification.find();

            const notificationIndex = notifications.findIndex(
              (notification) =>
                notification.screamId === screamId &&
                notification.sender === senderId &&
                notification.type === "Like" &&
                notification.recipient === receiverId
            );

            if (notificationIndex === -1) {
              const error = new Error("Something went wrong!");
              error.statusCode = 500;
              throw error;
            }

            notifications.splice(notificationIndex, 1);
            await notifications.save();

            userNotifications = notifications.filter(
              (notification) => notification.recipient === receiverId
            );
          } catch (error) {
            console.log(error);
          }

          io.to(receiver.socketId).emit("getNotification", {
            notifications: userNotifications,
          });
        }
      );

      socket.on(
        "sendCommentNotification",
        async ({ commentId, senderId, receiverId, message, screamId }) => {
          const receiver = getCurrentUser(receiverId);
          let notification;

          try {
            if (!receiver) {
              const error = new Error("Something went wrong!");
              error.statusCode = 500;
              throw error;
            }

            const user = await User.findOne({
              _id: mongoose.Types.ObjectId(senderId),
            });

            if (!user) {
              const error = new Error("Something went wrong!");
              error.statusCode = 500;
              throw error;
            }

            const comment = await Comment.findById({ _id: commentId });
            if (!comment) {
              const error = new Error("Something went wrong!");
              error.statusCode = 500;
              throw error;
            }

            notification = new Notification({
              userImageUrl: user.credentials.imageUrl,
              type: "Comment",
              message: message,
              screamId: screamId,
              commentId: commentId,
              read: false,
              senderUsername: user.credentials.username,
              senderId: senderId,
              recipientId: receiverId,
            });

            await notification.save();
          } catch (error) {
            console.log(error);
          }

          io.to(receiver.socketId).emit("getNotification", {
            message: "Commented on your scream.",
            notification: notification,
          });
        }
      );

      socket.on(
        "sendRemoveCommentNotification",
        async ({ commentId, screamId, senderId, receiverId }) => {
          const receiver = getCurrentUser(receiverId);
          const sender = getCurrentUser(senderId);

          let userNotifications;
          try {
            if (!receiver || !sender) {
              const error = new Error("Something went wrong!");
              error.statusCode = 500;
              throw error;
            }

            const notifications = await Notification.find();

            const notificationIndex = notifications.findIndex(
              (notification) =>
                notification.screamId === screamId &&
                notification.sender === senderId &&
                notification.type === "Comment" &&
                notification.recipient === receiverId &&
                notification.commentId === commentId
            );

            if (notificationIndex === -1) {
              const error = new Error("Something went wrong!");
              error.statusCode = 500;
              throw error;
            }

            notifications.splice(notificationIndex, 1);
            await notifications.save();

            userNotifications = notifications.filter(
              (notification) => notification.recipient === receiverId
            );
          } catch (error) {
            console.log(error);
          }

          io.to(receiver.socketId).emit("getNotification", {
            notifications: userNotifications,
          });
        }
      );

      socket.on("disconnect", () => {
        userLeave(socket.id);
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
