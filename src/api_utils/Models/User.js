const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "first name is required"],
    trim: true, //// lesson: trim removes whitespaces
    text: true,
  },
  lastName: {
    type: String,
    required: [true, "last name is required"],
    trim: true,
    text: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
  username: {
    type: String,
    required: [true, "username is required"],
    trim: true,
    text: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  friends: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  picture: {
    type: String,
    default:
      "https://res.cloudinary.com/drshlvgnx/image/upload/v1686134198/Hotpot_gvvvfn.png",
  },
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
