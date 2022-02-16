module.exports = function (socket) {
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

        io.to(receiver.socketId).emit("getNotification", {
          message: "Liked your scream.",
          notification: notification,
        });
      } catch (error) {
        console.log(error);
      }
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

        io.to(receiver.socketId).emit("getNotification", {
          notifications: userNotifications,
        });
      } catch (error) {
        console.log(error);
      }
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

        io.to(receiver.socketId).emit("getNotification", {
          message: "Commented on your scream.",
          notification: notification,
        });
      } catch (error) {
        console.log(error);
      }
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

        io.to(receiver.socketId).emit("getNotification", {
          notifications: userNotifications,
        });
      } catch (error) {
        console.log(error);
      }
    }
  );
};
