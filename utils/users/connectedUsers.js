const User = require("../../models/user");
const users = [];

function userJoin(userId, socketId) {
  const user = { userId, socketId };
  users.push(user);
  return user;
}

function getCurrentUser(userId) {
  return users.find((user) => user.userId === userId);
}

function userLeave(socketId) {
  const index = users.findIndex((user) => user.socketId === socketId);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

async function getConversationUsers(socket, senderId) {
  try {
    const conversationsDoc = await User.findById(senderId).select(
      "conversations -_id"
    );

    const { conversations } = conversationsDoc;
    let conversationUsersSocketIds = [];

    for (let conversation of conversations) {
      const convoUser = conversation.members[0].userId;
      const user = users.find((user) => user.userId === convoUser.toString());
      conversationUsersSocketIds.push(user?.socketId);
    }

    return conversationUsersSocketIds;
  } catch (error) {
    console.log(error);
  }
}

async function getOnlineUsers(socket, senderId) {
  try {
    const conversationsDoc = await User.findById(senderId).select(
      "conversations -_id"
    );

    const { conversations } = conversationsDoc;

    let onlineUsers = [];
    for (let conversation of conversations) {
      const convoUser = conversation.members[0].userId;

      if (users.find((user) => user.userId === convoUser.toString())) {
        onlineUsers.push(convoUser.toString());
      }
    }

    return onlineUsers;
  } catch (error) {
    console.log(error);
  }
}

// function getRoomUsers(room) {
//   return users.filter((user) => user.room === room);
// }

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getOnlineUsers,
  getConversationUsers,
  users,
  //   getRoomUsers,
};
