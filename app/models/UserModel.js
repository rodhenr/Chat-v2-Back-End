const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  avatar: {
    type: String,
    default:
      "https://icons-for-free.com/download-icon-avatar+human+people+profile+user+icon-1320168139431219590_512.png",
  },
  connections: [String],
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  userId: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);
