const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRoutes = require("./app/routes/auth.routes.js");
const userRoutes = require("./app/routes/user.routes.js");
const port = 8080;
const url = "mongodb://localhost:27017/chatdb";

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authRoutes);
app.use(userRoutes);

mongoose.connect(url);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro na conexão com o MongoDB"));

io.on("connection", (socket) => {
  console.log("Novo usuário conectado!");
});

server.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});

module.export = app;
