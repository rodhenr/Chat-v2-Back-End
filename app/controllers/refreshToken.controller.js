const jwt = require("jsonwebtoken");
require("dotenv").config();

const refreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies.jwt)
    return res.status(401).json({ error: "Token não encontrado!" });

  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  jwt.verify(refreshToken, process.env.SECRET_REFRESH_KEY, (err, decoded) => {
    if (err) return res.status(406).json({ error: "Refresh Token expirado!" });

    const { userEmail } = decoded;
    const newAccessToken = jwt.sign({ userEmail }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    const newRefreshToken = jwt.sign({ userEmail }, process.env.SECRET_KEY, {
      expiresIn: "15m",
    });

    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ newAccessToken });
  });
};

module.exports = { refreshToken };
