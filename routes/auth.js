const router = require("express").Router();
const authControllers = require("../controllers/auth");
const passport = require("passport");
const User = require("../models/user");
const jwtSecret = require("../config/jwt.config");
const jwt = require("jsonwebtoken");
const loginValidationArray = require("../utils/validation/auth/loginValidation");
const signupValidationArray = require("../utils/validation/auth/signupValidation");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google"),
  async function (req, res, next) {
    let user = {
      photo: req.user.photo || "/assets/profileImages/no-img.png",
      username: req.user.name,
      email: req.user.email,
      password: "null",
      provider: req.user.provider,
    };

    try {
      let result;

      if (!req.user.isVerified) {
        const error = new Error("Invalid authentication!");
        error.statusCode = 401;
        throw error;
      }

      const existingUser = await User.findOne({ email: user.email });

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
          userId: result._id.toString(),
          email: result.email,
        },
        jwtSecret.secret,
        { expiresIn: "1h" }
      );

      res.cookie("token", token);
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
