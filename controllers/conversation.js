const Conversation = require("../models/conversation");
const User = require("../models/user");

exports.getConversations = async (req, res, next) => {
  const userId = req.user.userId;

  try {
    const conversations = await Conversation.find({
      "members.userId": userId,
    });

    res.status(200).json(conversations);
  } catch (error) {
    console.log(error);
  }
};

exports.addConversation = async (req, res, next) => {
  const userId = req.user.userId;
  const receiverUserId = req.params.receiverId;

  try {
    const user = await User.find(userId);
    if (!user) {
      const error = new Error("User not found!");
      error.statusCode = 404;
      throw error;
    }

    const receiverUser = await User.find(receiverUserId);

    if (!receiverUser) {
      const error = new Error("User not found!");
      error.statusCode = 404;
      throw error;
    }

    const newConversation = new Conversation({
      members: [
        {
          userId: userId,
          userImageUrl: user.imageUrl,
          userName: user.username,
        },

        {
          userId: receiverUserId,
          userImageUrl: user.imageUrl,
          userName: user.username,
        },
      ],
    });

    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);
  } catch (error) {
    console.log(error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
