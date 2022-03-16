const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
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

    screamId: {
      type: Schema.Types.ObjectId,
      ref: "Scream",
    },

    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
