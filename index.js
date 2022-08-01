const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const Message = require("./app/models/MessagesModel");
const User = require("./app/models/UserModel");
const authRoutes = require("./app/routes/auth.routes.js");
const chatRoutes = require("./app/routes/chat.routes.js");
const port = 8080;
const url = "mongodb://localhost:27017/chatdb";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  },
});

app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);
app.use(chatRoutes);

mongoose.connect(url);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro na conexão com o MongoDB"));

io.on("connection", async (socket) => {
  const userId = socket.handshake.auth.id;
  socket.join(userId); // cria uma room com o ID do usuário

  const user = await User.findOne({ userId });
  user.status = "online";
  await user.save();

  const messages = await Message.find({ receiver: userId }); // checar se existe alguma mensagem para ser enviada para o user
  if (messages) socket.emit("off_message", messages); // cria um evento off_message para enviar as mensagens
  //Message.deleteMany({receiver: userId}) // apaga as mensagens da database

  socket.on("private message", async ({ message, to }) => {
    // verifica se o usuário está online através do to(userId)
    // se sim - envia a mensagem diretamente para ele
    // se não - salva na db e quando o usuario conectar ele a recebe
    const contact = await User.findOne({ userId: to });

    if (contact.status === "offline") {
      // se estiver offline, só retorna
      Message.create({ message, sender: userId, receiver: to });
    } else {
      // io.to("some room").emit("some event");
      socket.to(to).emit("private message", {
        message,
        sender: userId,
        receiver: to,
        createdAt: new Date(),
      });
    }
  });

  socket.on("disconnect", async () => {
    user.status = "offline";
    await user.save();
  });
});

server.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});

module.export = app;
