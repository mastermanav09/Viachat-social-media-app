const { body } = require("express-validator");

const bodyValidationArray = [
  body("body", "Body must not be empty").trim().isLength({ min: 1 }).notEmpty(),
];

module.exports = bodyValidationArray;
