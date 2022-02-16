const { body } = require("express-validator");

const profileValidationArray = [
  body("age").custom((value, { req }) => {
    if (value && (NaN(value) || value < 12 || value > 120)) {
      return Promise.reject("Please enter your valid age!.");
    }

    return true;
  }),

  body("website").custom((value, { req }) => {
    if (value) {
      let siteReg =
        /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

      if (!siteReg.test(value)) {
        return Promise.reject("Please enter a valid website.");
      }
    }

    return true;
  }),

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
];

module.exports = profileValidationArray;
