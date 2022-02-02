const { body } = require("express-validator");

const signupValidationArray = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username should be of at least 3 characters.")
    .matches(/^[A-Za-z0-9.]+$/)
    .withMessage(
      "Sorry, only letters (a-z/A-Z), numbers (0-9), and periods (.) are allowed."
    ),

  body("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Are you sure you entered your name correctly?"),

  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail(),

  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password too short.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Please enter a password with at least 8 characters and should contain at least one uppercase(A), one lowercase(e), one number(5) & one special character(@)."
    ),
];

module.exports = signupValidationArray;
