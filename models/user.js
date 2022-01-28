const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    imageUrl: {
      type: String,
    },

    username: {
      type: String,
      required: true,
      min: 3,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
      min: 8,
    },

    bio: {
      type: String,
    },

    location: {
      type: String,
    },

    website: {
      type: String,
    },

    //   handle:{

    //   }

    provider: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
