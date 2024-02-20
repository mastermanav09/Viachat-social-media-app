const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const membersSubSchema = mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId },
    userImageUrl: { type: String },
    userName: { type: String },
  },
  { _id: false }
);

const conversationSubSchema = mongoose.Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    members: [membersSubSchema],

    recentMessage: {
      type: String,
    },

    createdAt: {
      type: Date,
    },

    updatedAt: {
      type: Date,
    },
  },
  { _id: false }
);

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

    conversations: [conversationSubSchema],

    provider: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
