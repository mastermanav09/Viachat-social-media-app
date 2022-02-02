const { body } = require("express-validator");

const loginValidationArray = [
  body("email", "Please enter your email.").notEmpty().isEmail(),

  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password too short. Please enter the correct password!"),
];

module.exports = loginValidationArray;
