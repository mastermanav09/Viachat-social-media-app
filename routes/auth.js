const router = require("express").Router();
const authControllers = require("../controllers/auth");
const passport = require("passport");
const User = require("../models/user");
const jwtSecret = require("../config/jwt.config");
const jwt = require("jsonwebtoken");
const loginValidationArray = require("../utils/validators/auth/loginValidation");
const signupValidationArray = require("../utils/validators/auth/signupValidation");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google"),
  async function (req, res, next) {
    let user = {
      credentials: {
        imageUrl: req.user.photo || "/assets/profileImages/no-img.png",
        username: req.user.email.split("@")[0],
        name: req.user.name,
        email: req.user.email,
        password: "null",
        age: undefined,
        bio: undefined,
        address: undefined,
        website: undefined,
      },
      provider: req.user.provider,
      likes: [],
    };

    try {
      let result;

      if (!req.user.isVerified) {
        const error = new Error("Invalid authentication!");
        error.statusCode = 401;
        throw error;
      }

      const existingUser = await User.findOne({
        "credentials.email": user.email,
      });

      if (!existingUser) {
        const newUser = new User({
          ...user,
        });

        result = await newUser.save();
      } else {
        result = existingUser;
      }

      const token = jwt.sign(
        {
          username: result.credentials.username,
          userId: result._id.toString(),
          email: result.credentials.email,
          imageUrl: result.credentials.imageUrl,
        },
        jwtSecret.secret,
        { expiresIn: "3h" }
      );

      res.cookie("upid", token);
      res.cookie("_id", result._id.toString());
      res.redirect("http://localhost:3000/");
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
        error.message = "Something went wrong!";
      }

      next(error);
    }
  }
);

router.post("/signup", signupValidationArray, authControllers.signup);
router.post("/login", loginValidationArray, authControllers.login);
router.get("/login/failed", authControllers.loginFailed);

module.exports = router;
