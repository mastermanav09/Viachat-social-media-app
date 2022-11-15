const Notification = require("../../models/notification");
const { getCurrentUser } = require("../users/connectedUsers");
const User = require("../../models/user");
const Comment = require("../../models/comment");
const Scream = require("../../models/scream");
const Like = require("../../models/like");
const mongoose = require("mongoose");

module.exports = function (socket) {
  let io = require("../../config/socket").getIO();

  socket.on("sendLikeNotification", async ({ receiverId, screamId }) => {
    const receiver = getCurrentUser(receiverId);
    const sender = getCurrentUser(socket.decodedToken.userId);
    try {
      if (!sender) {
        const error = new Error("Something went wrong!");
        error.statusCode = 404;
        throw error;
      }

      const user = await User.findOne({
        _id: socket.decodedToken.userId,
      });

      if (!user) {
        const error = new Error("User not found!");
        error.statusCode = 404;
        throw error;
      }

      const scream = await Scream.findById(screamId);

      if (!scream) {
        const error = new Error("Scream not found!");
        error.statusCode = 404;
        throw error;
      }

      if (scream.userHandle.toString() !== receiverId.toString()) {
        const error = new Error("Not authorized!");
        error.statusCode = 401;
        throw error;
      }

      const isLiked = await Like.findOne({
        screamId: screamId,
        userHandle: socket.decodedToken.userId,
      });

      if (!isLiked) {
        const error = new Error("The scream is not liked!");
        error.statusCode = 409;
        throw error;
      }

      if (socket.decodedToken.userId !== receiverId.toString()) {
        const notification = await Notification.findOne({
          type: "Like",
          screamId: screamId,
          sender: socket.decodedToken.userId,
        });

        if (!notification) {
          const notification = new Notification({
            userImageUrl: user.credentials.imageUrl,
            type: "Like",
            screamId: screamId,
            read: false,
            senderUsername: user.credentials.username,
            sender: socket.decodedToken.userId,
            recipient: receiverId,
          });

          const newNotification = await notification.save();

          io.to(receiver.socketId).emit("getNewNotification", {
            notification: newNotification,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("sendRemoveLikeNotification", async ({ screamId, receiverId }) => {
    const receiver = getCurrentUser(receiverId);
    const sender = getCurrentUser(socket.decodedToken.userId);

    try {
      if (!sender) {
        const error = new Error("Something went wrong!");
        error.statusCode = 404;
        throw error;
      }

      const like = await Like.findOne({
        screamId: screamId,
        userHandle: socket.decodedToken.userId,
      });

      if (like) {
        const error = new Error("The like still exists!");
        error.statusCode = 409;
        throw error;
      }

      if (socket.decodedToken.userId !== receiverId.toString()) {
        const notification = await Notification.findOneAndDelete({
          screamId: screamId,
          sender: socket.decodedToken.userId,
          type: "Like",
          recipient: receiverId,
        });

        if (!notification) {
          const error = new Error("Something went wrong!");
          error.statusCode = 404;
          throw error;
        }

        const userNotifications = await Notification.find({
          recipient: receiverId,
        });

        io.to(receiver.socketId).emit("getNotifications", {
          notifications: userNotifications,
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on(
    "sendCommentNotification",
    async ({ commentId, receiverId, message, screamId }) => {
      const receiver = getCurrentUser(receiverId);
      const sender = getCurrentUser(socket.decodedToken.userId);

      try {
        if (!sender) {
          const error = new Error("Something went wrong!");
          error.statusCode = 404;
          throw error;
        }

        const user = await User.findOne({
          _id: mongoose.Types.ObjectId(socket.decodedToken.userId),
        });

        if (!user) {
          const error = new Error("User not found!");
          error.statusCode = 404;
          throw error;
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
          const error = new Error("Comment not found!");
          error.statusCode = 404;
          throw error;
        }

        if (message !== comment.body) {
          const error = new Error("Comment contains different body!");
          error.statusCode = 422;
          throw error;
        }

        const scream = await Scream.findById(screamId);

        if (!scream) {
          const error = new Error("Scream not found!");
          error.statusCode = 404;
          throw error;
        }

        if (scream.userHandle.toString() !== receiverId.toString()) {
          const error = new Error("Not authorized!");
          error.statusCode = 401;
          throw error;
        }

        const sameComment = await Notification.findOne({
          commentId: mongoose.Types.ObjectId(commentId),
        });

        if (sameComment) {
          const error = new Error("Comment already exists!");
          error.statusCode = 422;
          throw error;
        }

        if (socket.decodedToken.userId !== receiverId.toString()) {
          const notification = new Notification({
            userImageUrl: user.credentials.imageUrl,
            type: "Comment",
            message: message,
            screamId: screamId,
            commentId: commentId,
            read: false,
            senderUsername: user.credentials.username,
            sender: socket.decodedToken.userId,
            recipient: receiverId,
          });

          await notification.save();

          io.to(receiver.socketId).emit("getNewNotification", {
            message: "Commented on your scream.",
            notification: notification,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  );

  socket.on(
    "sendRemoveCommentNotification",
    async ({ commentId, screamId, receiverId }) => {
      const receiver = getCurrentUser(receiverId);
      const sender = getCurrentUser(socket.decodedToken.userId);

      try {
        if (!sender) {
          const error = new Error("Something went wrong!");
          error.statusCode = 404;
          throw error;
        }

        const user = await User.findById(socket.decodedToken.userId);

        if (!user) {
          const error = new Error("User not found!");
          error.statusCode = 404;
          throw error;
        }

        const comment = await Comment.findById(commentId);
        if (comment) {
          const error = new Error("Comment still exists!");
          error.statusCode = 409;
          throw error;
        }

        if (socket.decodedToken.userId.toString() !== receiverId.toString()) {
          const notification = await Notification.findOneAndDelete({
            screamId: screamId,
            sender: socket.decodedToken.userId,
            type: "Comment",
            commentId: commentId,
            recipient: receiverId,
          });

          if (!notification) {
            const error = new Error("Something went wrong!");
            error.statusCode = 404;
            throw error;
          }

          const userNotifications = await Notification.find({
            recipient: receiverId,
          });

          io.to(receiver.socketId).emit("getNotifications", {
            notifications: userNotifications,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  );

  socket.on("sendDeleteScreamNotification", async ({ screamId }) => {
    const receiver = getCurrentUser(socket.decodedToken.userId);

    try {
      const scream = await Scream.findById(screamId);
      if (scream) {
        const error = new Error("Scream still exists!");
        error.statusCode = 404;
        throw error;
      }

      await Notification.deleteMany({
        recipient: socket.decodedToken.userId,
        screamId: screamId,
      });

      const notifications = await Notification.find({
        recipient: socket.decodedToken.userId,
      });

      io.to(receiver.socketId).emit("getNotifications", {
        notifications: notifications,
      });
    } catch (error) {
      console.log(error);
    }
  });
};
