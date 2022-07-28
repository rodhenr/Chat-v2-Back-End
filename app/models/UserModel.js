const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  avatar: { type: String, default: "" },
  connections: [{type: mongoose.Types.ObjectId, ref: 'User'}],
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: String, default: "offline" },
});

module.exports = mongoose.model("User", UserSchema);
