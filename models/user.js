const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    credentials: {
      imageUrl: {
        type: String,
      },

      username: {
        type: String,
        required: true,
        min: 3,
      },

      name: {
        type: String,
        required: true,
        min: 3,
      },

      handle: {
        type: String,
        default: "user",
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

      age: {
        type: Number,
        min: 12,
      },

      bio: {
        type: String,
      },

      address: {
        type: String,
      },

      website: {
        type: String,
      },
    },

    // likes: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Scream",
    //   },
    // ],

    // notifications: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Notification",
    //   },
    // ],

    provider: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
