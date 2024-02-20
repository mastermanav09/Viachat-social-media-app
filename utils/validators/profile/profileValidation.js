const { body } = require("express-validator");

const profileValidationArray = [
  body("age").custom((value, { req }) => {
    if (value && (isNaN(value) || value > 120)) {
      return Promise.reject("Please enter your age.");
    }

    return true;
  }),

  body("website").custom((value, { req }) => {
    if (value) {
      let siteReg =
        /^((https?|ftp|smtp):\/\/)(www.)[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

      if (!siteReg.test(value)) {
        return Promise.reject("Please enter a valid website.");
      }
    }

    return true;
  }),
];

module.exports = profileValidationArray;
