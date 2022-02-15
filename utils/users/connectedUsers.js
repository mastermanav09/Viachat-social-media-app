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

// function getRoomUsers(room) {
//   return users.filter((user) => user.room === room);
// }

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  //   getRoomUsers,
};
