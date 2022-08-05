const Message = require("../models/MessagesModel");
const User = require("../models/UserModel");

const mainChatInfo = async (req, res) => {
  const { userEmail } = req;

  try {
    const user = await User.findOne({ email: userEmail });

    if (!user)
      return res.status(400).json({ error: "Usuário não encontrado!" });

    const connections = [];
    // busca a primeira mensagem recebida de cada usuário
    if (user.connections.length > 0) {
      for (const id of user.connections) {
        const findInfo = await User.findOne({ userId: id }).select(
          "avatar firstName lastName userId"
        );
        const userMessage = await Message.findOne({
          $or: [
            { sender: id, receiver: user.userId },
            { sender: user.userId, receiver: id },
          ],
        })
          .sort("-createdAt")
          .limit(1)
          .select("-__v");

        const notRead = await Message.find({
          sender: id,
          receiver: user.userId,
          read: false,
        }).count();

        if (userMessage) {
          const userInfo = {
            avatar: findInfo.avatar,
            fullName: `${findInfo.firstName} ${findInfo.lastName}`,
            message: userMessage,
            notRead: notRead,
            userId: findInfo.userId,
          };
          connections.push(userInfo);
        } else {
          const userInfo = {
            avatar: findInfo.avatar,
            fullName: `${findInfo.firstName} ${findInfo.lastName}`,
            message: {},
            notRead: notRead,
            userId: findInfo.userId,
          };
          connections.push(userInfo);
        }
      }
    }

    // cria array de dados
    const data = {
      avatar: user.avatar,
      connections: connections,
      fullName: `${user.firstName} ${user.lastName}`,
      userId: user.userId,
    };

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Ops... Algo de errado aconteceu!" });
  }
};

const userChatInfo = async (req, res) => {
  const { userEmail } = req;
  const { contactId } = req.params;

  try {
    const user = await User.findOne({ email: userEmail }).select("userId");
    const contact = await User.findOne({ userId: contactId });

    if (!user || !contact)
      return res.status(400).json({ error: "Usuário não encontrado!" });

    let msgs = await Message.find({
      $or: [
        { receiver: user.userId, sender: contactId },
        { receiver: contactId, sender: user.userId },
      ],
    }).select("-__v");

    if (!msgs) msgs = [];

    const data = {
      contactInfo: {
        avatar: contact.avatar,
        contactId: contact.userId,
        fullName: `${contact.firstName} ${contact.lastName}`,
      },
      messages: [...msgs],
    };

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Aconteceu um erro no servidor..." });
  }
};

const addContact = async (req, res) => {
  const { userEmail } = req;
  const { contactId } = req.body;

  try {
    const user = await User.findOne({ email: userEmail });
    const contact = await User.findOne({ userId: contactId });

    if (!user || !contact)
      return res.status(400).json({ error: "Usuário não encontrado!" });

    if (user.email === contact.email)
      return res.status(400).json({ error: "Usuário inválido" });

    const hasConnection = user.connections.some((i) => i === contactId);
    if (hasConnection)
      return res.status(400).json({ error: "Usuário já é uma conexão!" });

    user.connections.push(contactId);
    contact.connections.push(user.userId);
    await user.save();
    await contact.save();

    res.status(200).json({ message: "Usuário cadastrado como contato!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Ocorreu um problema no servidor..." });
  }
};

const sendMessage = async (req, res) => {
  const { msg, receiver, sender } = req.body;

  try {
    if (!msg || !sender || !receiver)
      return res.status(400).json({ error: "Informações inválidas!" });

    const userOne = await User.findOne({ userId: receiver });
    const userTwo = await User.findOne({ userId: sender });

    if (!userOne || !userTwo)
      return res.status(400).json({ error: "Informações inválidas!" });

    await Message.create({ message: msg, receiver, sender });

    res.status(200).json({ message: "Nova mensagem criada" });
  } catch (err) {
    res.status(500).json({ error: "Ocorreu um problema no servidor..." });
  }
};

module.exports = { addContact, mainChatInfo, sendMessage, userChatInfo };
