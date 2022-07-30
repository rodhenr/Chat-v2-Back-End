const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessagesSchema = Schema(
  {
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model("Message", MessagesSchema);
