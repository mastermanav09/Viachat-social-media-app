const Message = require("../models/message");
const User = require("../models/user");

const limit = 30;
exports.addMessage = async (req, res, next) => {
  const userId = req.user.userId;
  const conversationId = req.body.conversationId;
  const sender = req.body.sender;
  const receiver = req.body.receiver;
  const text = req.body.text;

  try {
    const userDoc = await User.findOne({
      _id: userId,
      "conversations._id": conversationId,
    });

    if (!userDoc) {
      const error = new Error("Conversation not found!");
      error.statusCode = 404;
      throw error;
    }

    if (typeof text !== "string" || text.trim().length === 0) {
      const error = new Error("Invaid message!");
      error.statusCode = 422;
      throw error;
    }

    await User.findOneAndUpdate(
      { _id: userId, "conversations._id": conversationId },
      {
        $set: { "conversations.$.recentMessage": text },
      }
    );

    await User.findOneAndUpdate(
      { _id: receiver, "conversations._id": conversationId },
      {
        $set: { "conversations.$.recentMessage": text },
      }
    );

    const newMessage = new Message({
      conversationId,
      sender,
      text,
    });

    const savedMessage = await newMessage.save();

    res.status(201).json({
      _id: savedMessage._id,
      sender: savedMessage.sender,
      createdAt: savedMessage.createdAt,
      text: savedMessage.text,
    });
  } catch (error) {
    console.log(error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    error.message = "Unable to send!";
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  const userId = req.user.userId;
  const conversationId = req.params.conversationId;
  const page = req.params.page;

  try {
    const userDoc = await User.findOne({
      _id: userId,
      "conversations._id": conversationId,
    });

    if (!userDoc) {
      const error = new Error("Conversation not found!");
      error.statusCode = 404;
      throw error;
    }

    const totalMessagesLength = await Message.countDocuments({
      conversationId,
    });

    const messages = await Message.find({
      conversationId,
    })
      .select("-conversationId -updatedAt -__v")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const responseObj = {
      conversationId,
      messages,
      totalMessagesLength,
    };

    res.status(200).json(responseObj);
  } catch (error) {
    console.log(error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    error.message = "Conversation not found!";
    next(error);
  }
};
