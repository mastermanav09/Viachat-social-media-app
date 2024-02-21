const User = require("../models/user");
const { clearImage } = require("../utils/file/clearImage");
const linkValidation = require("../utils/validators/others/linkValidation");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Notification = require("../models/notification");
const Scream = require("../models/scream");
const Comment = require("../models/comment");
const Like = require("../models/like");

exports.updateProfilePhoto = async (req, res, next) => {
  if (!req.file) {
    return res.status(422).json({
      message: "No image provided or the image format is not supported.",
    });
  }

  req.file.path = req.file.path.split("public")[1].replaceAll("\\", "/");

  try {
    if (req.user.userId !== req.body.currentUserId) {
      const error = new Error("Unauthorized!");
      error.statusCode = 403;
      throw error;
    }

    if (!req.body.oldPath) {
      const error = new Error("Can't find image old path.");
      error.statusCode = 404;
      throw error;
    }

    const user = await User.findById(req.user.userId);
    const clearOldPath =
      "client\\" + "public\\" + req.body.oldPath.replaceAll("/", "\\");

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    let isLink = false;
    if (user.provider === "google") {
      isLink = linkValidation(user.credentials.imageUrl);
    }

    if (
      !isLink &&
      req.body.oldPath &&
      req.body.oldPath !== "/assets/profileImages/no-img.png"
    ) {
      const oldPathSplitArr = req.body.oldPath.split("/");
      if (oldPathSplitArr[oldPathSplitArr.length - 1] !== "no-img.png") {
        await clearImage(clearOldPath);
      }
    }

    user.credentials.imageUrl = req.file.path;
    await user.save();

    await Notification.updateMany(
      {
        sender: req.user.userId,
      },
      { userImageUrl: req.file.path }
    );

    await Comment.updateMany(
      {
        userHandle: req.user.userId,
      },
      { userImageUrl: req.file.path }
    );

    await Scream.updateMany(
      {
        userHandle: req.user.userId,
      },
      { userImageUrl: req.file.path }
    );

    res.status(200).json({
      message: "Photo uploaded successfully.",
      imageUrl: user.credentials.imageUrl,
    });
  } catch (error) {
    if (!isLink) {
      await clearImage(clearOldPath);
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
  const age = req.body.age || undefined;
  const bio = req.body.bio || undefined;
  const address = req.body.address || undefined;
  const website = req.body.website || undefined;

  const errors = validationResult(req);

  try {
    if (req.user.userId !== req.body.userId) {
      const error = new Error("Unauthorized!");
      error.statusCode = 403;
      error.data = errors.array();
      throw error;
    }

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const user = await User.findByIdAndUpdate(req.user.userId, {
      "credentials.age": age,
      "credentials.address": address,
      "credentials.bio": bio,
      "credentials.website": website,
    });

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: "Profile updated!" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-credentials.password"
    );

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    const userNotifications = await Notification.find({
      recipient: req.user.userId,
    });

    const userLikes = await Like.find({ userHandle: req.user.userId });
    const userComments = await Comment.find({ userHandle: req.user.userId });
    const userScreams = await Scream.find({ userHandle: req.user.userId }).sort(
      { createdAt: -1 }
    );

    const fetchedUser = {
      user,
      notifications: userNotifications,
      likes: userLikes,
      comments: userComments,
      screams: userScreams,
    };

    res.status(200).json(fetchedUser);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.getUserData = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).select(
      "credentials.imageUrl credentials.username credentials.name _id"
    );

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    const userScreams = await Scream.find({ userHandle: userId });

    res.status(200).json({ ...user, screams: userScreams });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.getUserSearchResults = async (req, res, next) => {
  const limit = 10;
  const searchText = req.body.text;
  const page = req.body.page;

  if (!searchText || searchText.trim().length === 0) {
    return res.status(200).json({ results: [], totalResults: 0 });
  }

  const searchRegex = new RegExp(searchText, "gi");

  try {
    const totalResults = await User.countDocuments({
      "credentials.username": { $regex: searchRegex },
    });

    const results = await User.find({
      "credentials.username": { $regex: searchRegex },
    })
      .select("credentials.username credentials.imageUrl _id")
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ results, totalResults });
  } catch (error) {
    console.log(error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.getNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

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

exports.markNotificationRead = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    await Notification.updateMany(
      {
        recipient: mongoose.Types.ObjectId(req.user.userId),
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
