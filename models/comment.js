const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    userImageUrl: {
      type: String,
    },

    userHandle: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    screamId: {
      type: Schema.Types.ObjectId,
      ref: "Schema",
    },

    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
