const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "Usuário e/ou senha inválido(s)" });

    // compara o password do banco de dados com o password digitado
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword)
      return res.status(401).json({ error: "Usuário e/ou senha inválido(s)" });

    const userEmail = user.email;
    const acessToken = jwt.sign({ userEmail }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    const refreshToken = jwt.sign(
      { userEmail },
      process.env.SECRET_REFRESH_KEY,
      {
        expiresIn: "15m",
      }
    );

    // salva o refreshToken em um cookie httpOnly
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // envia o acessToken para o client
    res.json({ acessToken });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Ocorreu um problema no servidor" });
  }
};

const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) return res.status(409).json({ error: "Usuário já cadastrado!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { firstName, lastName, email, password: hashedPassword };
    await User.create(userData);

    res.status(200).json({ message: "Usuário cadastrado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Ocorreu um problema no servidor" });
  }
};

module.exports = { login, register };
