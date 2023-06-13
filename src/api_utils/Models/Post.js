const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    image: [
      [
        [
          {
            type: Number,
          },
        ],
      ],
    ],
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    privacy: {
      type: String,
      default: "public",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Post || mongoose.model("Post", postSchema);
