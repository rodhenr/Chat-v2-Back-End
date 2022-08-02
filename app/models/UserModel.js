const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  avatar: { type: String, default: "" },
  connections: [String],
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  userId: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);
