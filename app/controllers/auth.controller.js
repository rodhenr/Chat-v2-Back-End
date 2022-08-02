const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var { customAlphabet } = require("nanoid");
require("dotenv").config();

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "E-Mail e/ou senha incorreto(s)" });

    // compara o password do banco de dados com o password digitado
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword)
      return res.status(401).json({ error: "E-Mail e/ou senha incorreto(s)" });

    const userEmail = user.email;
    const userId = user.userId;
    const accessToken = jwt.sign({ userEmail }, process.env.SECRET_KEY, {
      expiresIn: "100m",
    });
    const refreshToken = jwt.sign(
      { userEmail },
      process.env.SECRET_REFRESH_KEY,
      {
        expiresIn: "150m",
      }
    );

    // salva o refreshToken em um cookie httpOnly
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // envia o accessToken para o client
    res.json({ accessToken, userId });
  } catch (err) {
    res.status(500).json({ error: "Ocorreu um problema no servidor" });
  }
};

const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;


  try {
    const user = await User.findOne({ email });

    if (user) return res.status(409).json({ error: "Usuário já cadastrado!" });

    const nanoid = customAlphabet("1234567890abcdef", 6);

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userId: nanoid(),
    };
    await User.create(userData);

    res.status(200).json({ message: "Usuário cadastrado com sucesso" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Ocorreu um problema no servidor" });
  }
};

module.exports = { login, register };
