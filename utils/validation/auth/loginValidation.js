const { body } = require("express-validator");

const loginValidationArray = [
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Please enter your valid email."),

  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password too short. Please enter the correct password!"),
];

module.exports = loginValidationArray;
