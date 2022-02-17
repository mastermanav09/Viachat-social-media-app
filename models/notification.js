const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    userImageUrl: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    message: {
      type: String,
    },

    screamId: {
      type: Schema.Types.ObjectId,
      ref: "Scream",
      required: true,
    },

    read: {
      type: Boolean,
      required: true,
    },

    senderUsername: {
      type: String,
      required: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
