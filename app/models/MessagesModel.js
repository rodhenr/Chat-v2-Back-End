const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessagesSchema = Schema(
  {
    sender: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    receiver: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    message: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model("Message", MessagesSchema);
