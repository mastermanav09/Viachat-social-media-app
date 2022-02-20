const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwtSecret = require("../config/jwt.config");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);

  const username = req.body.username;
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    if (password !== confirmPassword) {
      const error = new Error("Passwords does not match.");
      error.statusCode = 422;
      throw error;
    }

    const user = await User.findOne({ "credentials.email": email });

    if (user) {
      const error = new Error("User already exists.");
      error.statusCode = 422;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      credentials: {
        imageUrl: "assets/profileImages/no-img.png",
        username: username,
        name: name,
        email: email,
        password: hashedPassword,
        age: undefined,
        bio: undefined,
        address: undefined,
        website: undefined,
      },
      likes: [],
    });

    const result = await newUser.save();

    const token = jwt.sign(
      {
        username: result.credentials.username,
        email: result.credentials.email,
        userId: result._id.toString(),
      },
      jwtSecret.secret,
      {
        expiresIn: "3h",
      }
    );

    res.status(201).json({
      message: "Signed up successfully!",
      token: token,
      id: result._id.toString(),
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.login = async (req, res, next) => {
  // if (CheckUser(req.body)) {
  //   let token = jwt.sign(
  //     {
  //       data: req.body,
  //     },
  //     "secret",
  //     { expiresIn: "1h" }
  //   ); // expiry in seconds or duration strings
  //   res.cookie("jwt", token);
  //   res.send(`Log in success ${req.body.email}`);
  // } else {
  //   res.send("Invalid login credentials");
  // }

  const errors = validationResult(req);

  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Incorrect credentials! Please enter again.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const user = await User.findOne({ "credentials.email": email });
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 422;
      throw error;
    }

    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.credentials.password);
    if (!isEqual) {
      const error = new Error("Password is incorrect.");
      error.statusCode = 422;
      throw error;
    }

    const token = jwt.sign(
      {
        username: loadedUser.credentials.username,
        email: loadedUser.credentials.email,
        userId: loadedUser._id.toString(),
      },
      jwtSecret.secret,
      {
        expiresIn: "3h",
      }
    );

    res.status(200).json({
      message: "Logged in successfully!",
      token: token,
      id: loadedUser._id.toString(),
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.loginSucceed = (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      user: req.user,
    });
  }
};

exports.loginFailed = (req, res) => {
  res.status(500).json({ success: false, message: "Authentication failed!" });
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect("/");
};
