const User = require("../models/UserModel");
const Message = require("../models/MessagesModel");

const getUserInfo = async (req, res) => {
  const { userEmail } = req;

  try {
    const user = await User.findOne({ email: userEmail });

    if (!user)
      return res.status(400).json({ error: "Usuário não encontrado!" });

    user.status = "online";
    await user.save();

    const messages = [];

    if (user.connections.length > 0) {
      for (const id of user.connections) {
        const userMessage = await Message.find({
          $or: [{ sender: id }, { receiver: id }],
        })
          .sort("-createdAt")
          .limit(1)
          .populate({
            path: "sender",
            match: { _id: id },
            select: "avatar status firstName lastName -_id",
          })
          .populate({
            path: "receiver",
            match: { _id: id },
            select: "avatar status firstName lastName -_id",
          });

        messages.push(...userMessage);

        //populate avatar, fullName, status, criar virtualMethod
      }
    }

    const data = {
      avatar: user.avatar,
      messages: messages,
      fullName: `${user.firstName} ${user.lastName}`,
      status: user.status,
    };

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Ops... Algo de errado aconteceu!" });
  }
};

module.exports = { getUserInfo };

/*
    await Message.create({
      sender: "62e2d873cbc6ce453d2a1050",
      receiver: user._id,
      message: "Uma Mensagem de Teste",
    });
*/
