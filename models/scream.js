const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const screamSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },

    userImageUrl: {
      type: String,
    },

    userHandle: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    body: {
      type: String,
      required: true,
    },

    likeCount: {
      type: Number,
      required: true,
    },

    commentCount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scream", screamSchema);
