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
        const userMessages = await Message.find({
          $or: [{ sender: id }, { receiver: id }],
        });

        console.log(userMessages);
        //populate avatar, fullName, status, criar virtualMethod
        messages.push(userMessages);
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
