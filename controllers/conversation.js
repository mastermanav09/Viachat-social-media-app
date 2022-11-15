const Conversation = require("../models/conversation");
const User = require("../models/user");

exports.getConversations = async (req, res, next) => {
  const userId = req.user.userId;

  try {
    const conversations = await Conversation.find({
      "members.userId": userId,
    }).sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    console.log(error);
  }
};

exports.addNewConversation = async (req, res, next) => {
  const userId = req.user.userId;
  const receiverUserId = req.body.receiverId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found!");
      error.statusCode = 404;
      throw error;
    }

    const receiverUser = await User.findById(receiverUserId);

    if (!receiverUser) {
      const error = new Error("User not found!");
      error.statusCode = 404;
      throw error;
    }

    const existingConversation = await Conversation.find({
      "members.userId": {
        $all: [userId, receiverUserId],
      },
    });

    if (existingConversation.length) {
      return res
        .status(200)
        .json({ conversation: existingConversation[0], exists: true });
    }

    const newConversation = new Conversation({
      members: [
        {
          userId: userId,
          userImageUrl: user.credentials.imageUrl,
          userName: user.credentials.username,
        },

        {
          userId: receiverUserId,
          userImageUrl: receiverUser.credentials.imageUrl,
          userName: receiverUser.credentials.username,
        },
      ],

      recentMessage: "",
    });

    const savedConversation = await newConversation.save();
    res.status(201).json({ conversation: savedConversation, exists: false });
  } catch (error) {
    console.log(error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
