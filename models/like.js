const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeSchema = new Schema(
  {
    userHandle: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    screamId: {
      type: Schema.Types.ObjectId,
      ref: "Scream",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Like", likeSchema);
