const User = require("../models/user");
const { clearImage } = require("../utils/file/clearImage");
const linkValidation = require("../utils/validators/others/linkValidation");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Notification = require("../models/notification");
const Scream = require("../models/scream");
const Comment = require("../models/comment");

exports.updateProfilePhoto = async (req, res, next) => {
  if (!req.file) {
    return res.status(422).json({
      message: "No image provided or the image format is not supported.",
    });
  }

  let user,
    isLink = false;

  try {
    if (!req.body.oldPath) {
      const error = new Error("Something went wrong.");
      error.statusCode = 404;
      throw error;
    }

    user = await User.findById({ _id: req.user.userId });
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    if (user.provider === "google") {
      isLink = linkValidation(user.credentials.imageUrl);
    }

    if (
      req.body.oldPath &&
      !isLink &&
      req.body.oldPath !== "assets/profileImages/no-img.png" &&
      req.body.oldPath.split("/")[2] !== "no-img.png"
    ) {
      const res = await clearImage(req.body.oldPath);
    }

    user.credentials.imageUrl = req.file.path.replaceAll("\\", "/");
    await user.save();

    await Notification.updateMany(
      {
        sender: req.user.userId,
      },
      { userImageUrl: req.file.path.replaceAll("\\", "/") }
    );

    await Comment.updateMany(
      {
        userHandle: req.user.userId,
      },
      { userImageUrl: req.file.path.replaceAll("\\", "/") }
    );

    await Scream.updateMany(
      {
        userHandle: req.user.userId,
      },
      { userImageUrl: req.file.path.replaceAll("\\", "/") }
    );

    res.status(200).json({
      message: "Photo uploaded successfully.",
    });
  } catch (error) {
    if (!isLink) {
      await clearImage(req.file.path.replaceAll("\\", "/"));
    }

    if (!error.message) {
      error.message = "Something went wrong!";
    }

    if (!error.statusCode) {
      error.statusCode = 500;
    }

    return next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  const username = req.body.username;
  const name = req.body.name;
  const age = req.body.age || undefined;
  const bio = req.body.bio || undefined;
  const address = req.body.address || undefined;
  const website = req.body.website || undefined;

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

    user.credentials.username = username;
    user.credentials.name = name;
    user.credentials.age = age;
    user.credentials.address = address;
    user.credentials.bio = bio;
    user.credentials.website = website;

    await user.save();

    await Notification.updateMany(
      {
        sender: req.user.userId,
      },
      { senderUsername: username }
    );

    res.status(200).json({ message: "Profile updated!" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.getNotifications = async (req, res, next) => {
  var date = new Date();
  var daysToDeletion = 14;
  var deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion));

  try {
    const user = await User.findById({
      _id: req.user.userId,
    });

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    await Notification.deleteMany({ createdAt: { $lt: deletionDate } });

    const notifications = await Notification.find({
      recipient: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({ notifications: notifications });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.showNotifications = async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.user.userId });

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    const notifications = await Notification.updateMany(
      {
        recipient: req.user.userId,
        read: false,
      },
      { read: true }
    );

    res.status(200).json({});
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
