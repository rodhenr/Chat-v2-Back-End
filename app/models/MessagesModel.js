const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessagesSchema = Schema({
  sender: { type: mongoose.Types.ObjectId, required: true },
  receiver: { type: mongoose.Types.ObjectId, required: true },
  message: { type: String, required: true },
});

module.exports = mongoose.model("Message", MessagesSchema);
