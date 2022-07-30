const Message = require("../models/MessagesModel");

const receiveMessage = async (req, res) => {
  const { message, receiver, sender } = req.body;

  const data = { message, receiver, sender };

  try {
    await Message.create(data);

    res.status(200).json({ message: "Nova mensagem criada" });
  } catch (err) {
    res.status(500).json({ error: "Ocorreu um problema no servidor..." });
  }
};

module.exports = { receiveMessage };
