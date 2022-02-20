require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const passport = require("passport");
const mongoose = require("mongoose");
const passportSetup = require("./config/passport");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const screamRoutes = require("./routes/screams");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const initializeNotifications = require("./utils/notifications/notifications");
const jwt = require("jsonwebtoken");
const jwtSecret = require("./config/jwt.config");
const { authorize } = require("@thream/socketio-jwt");

const {
  userJoin,
  userLeave,
  // getRoomUsers,
} = require("./utils/users/connectedUsers");

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
app.use("/api/user", userRoutes);
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
    const server = app.listen(process.env.PORT || 8080);
    const io = require("./config/socket").init(server);

    io.use(
      authorize({
        secret: jwtSecret.secret,
      })
    );

    io.on("connection", async (socket) => {
      socket.on("newUser", () => {
        userJoin(socket.decodedToken.userId, socket.id);
      });

      console.log("kamal hsgsggsggsgsg", socket.decodedToken);
      initializeNotifications(socket);

      socket.on("disconnect", () => {
        userLeave(socket.id);
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
