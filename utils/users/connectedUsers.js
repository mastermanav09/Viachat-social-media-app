const User = require("../../models/user");
const users = [];

function userJoin(userId, socketId) {
  const user = { userId, socketId };
  users.push(user);
  return user;
}

async function getCurrentUser(userId, redisClient) {
  const socketId = await redisClient.get(userId);

  return {
    userId,
    socketId,
  };
}

function userLeave(socketId) {
  const index = users.findIndex((user) => user.socketId === socketId);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

async function getConversationUsers(socket, senderId, redisClient) {
  try {
    const conversationsDoc = await User.findById(senderId).select(
      "conversations -_id"
    );

    const { conversations } = conversationsDoc;
    let conversationUsersSocketIds = [];

    for (let conversation of conversations) {
      const convoUserId = conversation.members[0].userId.toString();
      const userSocketId = await redisClient.get(convoUserId);

      if (userSocketId) {
        conversationUsersSocketIds.push(userSocketId);
      }
    }

    return conversationUsersSocketIds;
  } catch (error) {
    console.log(error);
  }
}

async function getOnlineUsers(socket, senderId, redisClient) {
  try {
    const conversationsDoc = await User.findById(senderId).select(
      "conversations -_id"
    );

    const { conversations } = conversationsDoc;

    let onlineUsers = [];
    for (let conversation of conversations) {
      const convoUserId = conversation.members[0].userId.toString();
      const userSocketId = await redisClient.get(convoUserId);

      if (userSocketId) {
        onlineUsers.push(convoUserId);
      }
    }

    return onlineUsers;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getOnlineUsers,
  getConversationUsers,
  users,
};
