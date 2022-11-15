const User = require("../../models/user");
const Conversation = require("../../models/conversation");

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

async function getOnlineUsers(socket, senderId) {
  try {
    const conversations = await Conversation.find({
      "members.userId": senderId,
    });

    let onlineUsers = [];
    for (let conversation of conversations) {
      const user1 = conversation.members[0].userId;
      const user2 = conversation.members[1].userId;

      if (
        user1.toString() !== senderId &&
        users.find((user) => user.userId === user1.toString())
      ) {
        onlineUsers.push(user1.toString());
      } else if (
        user2.toString() !== senderId &&
        users.find((user) => user.userId === user2.toString())
      ) {
        onlineUsers.push(user2.toString());
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
  //   getRoomUsers,
};
