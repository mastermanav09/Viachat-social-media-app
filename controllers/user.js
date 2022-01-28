const User = require("../models/user");
const { clearImage } = require("../utils/file/clearImage");

exports.updateProfilePhoto = async (req, res, next) => {
  if (!req.file) {
    return res.status(422).json({
      message: "No image provided or the image format is not supported.",
    });
  }

  try {
    if (
      req.body.oldPath &&
      req.body.oldPath !== "assets/profileImages/no-img.png" &&
      req.body.oldPath.split("/")[2] !== "no-img.png"
    ) {
      const res = await clearImage(req.body.oldPath);
    }
  } catch (error) {
    await clearImage(req.file.path.replaceAll("\\", "/"));
    error.message = "Something went wrong! Can't find the image.";
    error.statusCode = 500;

    return next(error);
  }

  try {
    const user = await User.findById({ _id: req.user });
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    user.imageUrl = req.file.path.replaceAll("\\", "/");

    await user.save();

    res.status(200).json({
      message: "Photo uploaded successfully.",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
