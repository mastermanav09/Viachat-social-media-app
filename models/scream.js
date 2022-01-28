const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const screamSchema = new Schema(
  {
    userHandle: {
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

    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scream", screamSchema);
