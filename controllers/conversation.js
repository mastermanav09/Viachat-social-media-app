const User = require("../models/user");
const mongoose = require("mongoose");

exports.getConversations = async (req, res, next) => {
  const userId = req.user.userId;

  try {
    const conversationsDoc = await User.findById(userId).select(
      "conversations -_id"
    );

    const { conversations } = conversationsDoc;
    conversations.sort((a, b) => b.updatedAt - a.updatedAt);

    res.status(200).json(conversations);
  } catch (error) {
    console.log(error);
  }
};

exports.addNewConversation = async (req, res, next) => {
  const userId = req.user.userId;
  const receiverUserId = req.body.receiverId;

  try {
    if (userId === receiverUserId) {
      const error = new Error("Invalid user id.");
      error.statusCode = 422;
      throw error;
    }

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

    const existingConversation = user.conversations.find(
      (conversation) =>
        conversation.members[0].userId.toString() === receiverUserId
    );

    if (existingConversation) {
      return res
        .status(200)
        .json({ myConversation: existingConversation, exists: true });
    }

    const conversationId = new mongoose.Types.ObjectId();

    const newConversation = {
      _id: conversationId,
      recentMessage: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userDoc1 = await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          conversations: {
            ...newConversation,
            members: [
              {
                userId: receiverUserId,
                userImageUrl: receiverUser.credentials.imageUrl,
                userName: receiverUser.credentials.username,
              },
            ],
          },
        },
      },
      {
        new: true,
      }
    );

    const userDoc2 = await User.findOneAndUpdate(
      { _id: receiverUserId },
      {
        $push: {
          conversations: {
            ...newConversation,
            members: [
              {
                userId: userId,
                userImageUrl: user.credentials.imageUrl,
                userName: user.credentials.username,
              },
            ],
          },
        },
      },
      {
        new: true,
      }
    );

    res.status(201).json({
      myConversation: userDoc1.conversations[0],
      friendConversation: userDoc2.conversations[0],
      exists: false,
    });
  } catch (error) {
    console.log(error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
