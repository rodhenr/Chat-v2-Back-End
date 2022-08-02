const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessagesSchema = Schema({
  createdAt: { type: String, required: true },
  message: { type: String, required: true },
  receiver: { type: String, required: true },
  sender: { type: String, required: true },
});

module.exports = mongoose.model("Message", MessagesSchema);
