const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    userImageUrl: {
      type: String,
    },

    type: {
      type: String,
    },

    screamId: {
      type: Schema.Types.ObjectId,
      ref: "Schema",
    },

    read: {
      type: Boolean,
    },

    sender: {
      type: String,
    },

    recipient: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
