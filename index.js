require("dotenv").config();
const express = require("express");
const app = express();
const passport = require("passport");
const mongoose = require("mongoose");
const screamRoutes = require("./routes/screams");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const passportSetup = require("./config/passport");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "origin, Content-Type, Authorization, Accept"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(passport.initialize());

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/profileImages");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + uuidv4() + "." + file.mimetype.split("/")[1]);
  },
});

app.use("assets", express.static(path.join(__dirname, "assets")));

app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).single("image")
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/scream", screamRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message || "Something went wrong!";
  const errorData = error.data;
  res.status(status).json({
    message: message,
    errorData: errorData,
  });
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    app.listen(process.env.PORT || 8080, () => {
      console.log("Server is running!");
    });
  });
