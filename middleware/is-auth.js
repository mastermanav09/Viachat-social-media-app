const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/jwt.config");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    const error = new Error("Unauthorized!");
    error.statusCode = 403;
    throw error;
  }

  const token = authHeader.split(" ")[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, jwtSecret.secret);

    if (!decodedToken) {
      const error = new Error("Unauthorized!");
      error.statusCode = 403;
      throw error;
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    if (error.message === "jwt expired") {
      error.message = "Session Expired! Please login again.";
      error.statusCode = 403;
    }

    next(error);
  }

  req.user = decodedToken;
  next();
};
