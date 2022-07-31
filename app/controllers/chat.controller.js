const Message = require("../models/MessagesModel");
const User = require("../models/UserModel");

const mainChatInfo = async (req, res) => {
  const { userEmail } = req;

  try {
    const user = await User.findOne({ email: userEmail });

    if (!user)
      return res.status(400).json({ error: "Usuário não encontrado!" });

    // usuário fica online
    user.status = "online";
    await user.save();

    // busca a primeira mensagem recebida de cada usuário
    const messages = [];
    if (user.connections.length > 0) {
      for (const id of user.connections) {
        const userMessage = await Message.findOne({
          $or: [
            { sender: id, receiver: user.userId },
            { sender: user.userId, receiver: id },
          ],
        })
          .sort("-createdAt")
          .limit(1);

        const contact = await User.findOne({ userId: id });

        const messageInfo = {
          avatar: contact.avatar,
          contactId: contact.userId,
          createdAt: "",
          fullName: `${contact.firstName} ${contact.lastName}`,
          message: "",
          sender: null,
          status: contact.status,
        };

        //se não possuir mensagem, deixar em branco
        if (!userMessage) {
          messages.push(messageInfo);
        } else {
          messageInfo.createdAt = userMessage.createdAt;
          messageInfo.message = userMessage.message;
          messageInfo.sender = userMessage.sender;
          messages.push(messageInfo);
        }
      }
    }

    // cria array de dados
    const data = {
      avatar: user.avatar,
      connections: user.connections,
      fullName: `${user.firstName} ${user.lastName}`,
      messages: messages,
      status: user.status,
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

    // filtra as mensagens da conversa entre os dois usuários
    let messages = await Message.find({
      $or: [
        { sender: contactId, receiver: user.userId },
        { sender: user.userId, receiver: contactId },
      ],
    }).select("-__v");

    // se não houverem mensagens, retorna uma array vazio
    if (!messages) messages = [];

    // busca informações do usuário alvo

    res.status(200).json({contactInfo: {
          avatar: contact.avatar,
          contactId: contact.userId,
          fullName: `${contact.firstName} ${contact.lastName}`,
          status: contact.status,
        },
        messageInfo: [...messages],
        userInfo: { userId: user.userId },
    });
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
