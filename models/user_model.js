const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
		token: String,
    phone: String,
    avatar: String,
    status: String,
    acceptFriends: Array, // Danh sach nhung nguoi can chap nhan
    requestFriends: Array, // Danh sach nhung nguoi da gui yeu cau di
    FriendList: Array, // Danh sach nhung nguoi ban be
    statusOnline: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema, "users");
module.exports = User;