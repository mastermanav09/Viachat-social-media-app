const Scream = require("../models/scream");
const { validationResult } = require("express-validator");
const Comment = require("../models/comment");
const User = require("../models/user");
const mongoose = require("mongoose");
const Like = require("../models/like");
const { Socket } = require("socket.io");
const io = require("../config/socket");

exports.getAllScreams = async (req, res, next) => {
  try {
    const screams = await Scream.find()
      .select(["-__v", "-updatedAt"])
      .sort({ createdAt: -1 });

    console.log(screams);
    res.status(200).json({
      screams: screams,
    });
  } catch (error) {
    console.log(error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.createScream = async (req, res, next) => {
  const body = req.body.body;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const scream = new Scream({
      userImageUrl: req.user.imageUrl,
      userHandle: req.user.userId,
      body: body,
      likeCount: 0,
      commentCount: 0,
    });

    await scream.save();

    res.status(201).json({
      message: "Scream created successfully!",
      scream: scream,
    });
  } catch (error) {
    console.log(error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.getScream = async (req, res, next) => {
  const screamId = req.params.screamId;

  try {
    const scream = await Scream.findById({ _id: screamId });

    if (!scream) {
      const error = new Error("Scream not found!");
      error.statusCode = 404;
      throw error;
    }

    const comments = await Comment.find({
      screamId: screamId,
    })
      .select("-__v -updatedAt -screamId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      data: scream,
      comments: comments,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.addComment = async (req, res, next) => {
  const body = req.body.body;
  const screamId = req.params.screamId;

  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const scream = await Scream.findById({ _id: screamId });
    if (!scream) {
      const error = new Error("Scream not found!");
      error.statusCode = 404;
      throw error;
    }

    const comment = new Comment({
      userImageUrl: req.user.imageUrl,
      userHandle: req.user.userId,
      body: body,
      screamId: mongoose.Types.ObjectId(screamId),
    });

    await comment.save();
    scream.commentCount += 1;
    await scream.save();

    res.status(201).json({ message: "Comment added successfully." });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  const screamId = req.params.screamId;
  const commentId = req.params.commentId;

  try {
    const scream = await Scream.findById({ _id: screamId });
    if (!scream) {
      const error = new Error("Scream not found!");
      error.statusCode = 404;
      throw error;
    }

    const result = await Comment.findOneAndDelete({
      _id: mongoose.Types.ObjectId(commentId),
      screamId: mongoose.Types.ObjectId(screamId),
      userHandle: req.user.userId,
    });

    if (!result) {
      const error = new Error("Something went wrong!");
      error.statusCode = 400;
      throw error;
    }

    scream.commentCount -= 1;
    await scream.save();

    res.status(201).json({ message: "Comment deleted successfully." });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.likeScream = async (req, res, next) => {
  const screamId = req.params.screamId;
  const recipientId = req.params.recipientId;

  try {
    const scream = await Scream.findById({ _id: screamId });

    if (!scream) {
      const error = new Error("Scream not found!");
      error.statusCode = 404;
      throw error;
    }

    const isAlreadyLiked = await Like.findOne({
      userHandle: req.user.userId,
      screamId: mongoose.Types.ObjectId(screamId),
    });

    if (isAlreadyLiked) {
      return res.status(421).json({ message: "Scream already liked!" });
    }

    scream.likeCount += 1;

    const newLike = new Like({
      userHandle: req.user.userId,
      screamId: mongoose.Types.ObjectId(screamId),
    });

    await scream.save();
    await newLike.save();

    res.status(200).json({ message: "Scream liked!" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.unlikeScream = async (req, res, next) => {
  const screamId = req.params.screamId;

  try {
    const scream = await Scream.findById({ _id: screamId });

    if (!scream) {
      const error = new Error("Scream not found!");
      error.statusCode = 404;
      throw error;
    }

    const isAlreadyLiked = await Like.findOneAndDelete({
      userHandle: req.user.userId,
      screamId: mongoose.Types.ObjectId(screamId),
    });

    if (!isAlreadyLiked) {
      const error = new Error("Invalid request");
      error.statusCode = 400;
      throw error;
    }

    scream.likeCount -= 1;
    await scream.save();

    res.status(200).json({ message: "Scream unliked!" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.deleteScream = async (req, res, next) => {
  const screamId = req.params.screamId;

  try {
    const scream = await Scream.findByIdAndDelete({
      userHandle: req.user.userId,
      _id: mongoose.Types.ObjectId(screamId),
    });

    if (!scream) {
      const error = new Error("Something went wrong!");
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json({ message: "Scream deleted successfully!" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
