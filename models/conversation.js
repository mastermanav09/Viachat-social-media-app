const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conversationSchema = new Schema(
  {
    members: [
      {
        userId: { type: Schema.Types.ObjectId },
        userImageUrl: { type: String },
        userName: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
