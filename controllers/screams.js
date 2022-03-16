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

    const user = await User.findById({ _id: req.user.userId });
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    const scream = new Scream({
      username: user.credentials.username,
      userImageUrl: user.credentials.imageUrl,
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

    const user = await User.findById({ _id: req.user.userId });
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    const comment = new Comment({
      username: user.credentials.username,
      userImageUrl: user.credentials.imageUrl,
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
      const error = new Error("Scream already liked!");
      error.statusCode = 421;
      throw error;
    }

    const newLike = new Like({
      userHandle: req.user.userId,
      screamId: mongoose.Types.ObjectId(screamId),
    });

    scream.likeCount += 1;

    await scream.save();
    await newLike.save();

    res.status(200).json({ message: "Scream liked!", like: newLike });
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

    res.status(200).json({ message: "Scream unliked!", like: isAlreadyLiked });
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
    const scream = await Scream.findOneAndDelete({
      userHandle: req.user.userId,
      _id: mongoose.Types.ObjectId(screamId),
    });

    if (!scream) {
      const error = new Error("Unauthorized!");
      error.statusCode = 403;
      throw error;
    }

    await Like.deleteMany({ screamId: screamId });
    await Comment.deleteMany({ screamId: screamId });

    res.status(200).json({ message: "Scream deleted successfully!" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
