const Conversation = require("../models/conversation");
const Message = require("../models/message");

exports.addMessage = async (req, res, next) => {
  const conversationId = req.body.conversationId;
  const sender = req.body.sender;
  const text = req.body.text;

  try {
    const newMessage = new Message({
      conversationId,
      sender,
      text,
    });

    const savedMessage = await newMessage.save();

    await Conversation.findByIdAndUpdate(conversationId, {
      recentMessage: text,
    });

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
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) {
      const error = new Error("Conversation not found!");
      error.statusCode = 404;
      throw error;
    }

    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).select("-conversationId -updatedAt -__v");

    const responseObj = {
      conversationId: req.params.conversationId,
      messages,
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
