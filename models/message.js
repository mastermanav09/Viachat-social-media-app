const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
    },

    sender: {
      type: Schema.Types.ObjectId,
    },

    text: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
