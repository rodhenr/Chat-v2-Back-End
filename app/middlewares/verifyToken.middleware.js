const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.authorization;

  if (!authHeader?.startsWith("Bearer"))
    return res.status(401).json({ error: "Token não encontrado!" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token inválido!" });

    req.userEmail = decoded.userEmail;

    next();
  });
};

module.exports = verifyToken;
