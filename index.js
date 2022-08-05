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

  try {
    // desconecta se tentar conectar com a mesma conta simultâneo
    if (io.sockets.adapter.rooms.get(userId) !== undefined) {
      socket.to(userId).emit("double_connection");
      io.in(userId).disconnectSockets(true);
    }

    const user = await User.findOne({ userId });
    socket.join(userId);

    const users = [];
    user.connections.map((i) => {
      if (io.sockets.adapter.rooms.get(i) !== undefined) return users.push(i); // avisa que está online/ mudar essa parte
    });
    socket.emit("users_online", users);

    user.connections.map((i) => {
      socket.to(i).emit("user_online", userId);
    });

    socket.on("private message", async ({ newMessage }) => {
      if (io.sockets.adapter.rooms.get(newMessage.receiver) !== undefined) {
        socket.to(newMessage.receiver).emit("private message", {
          ...newMessage,
        });
      }

      await Message.create(newMessage);
    });

    socket.on("read_message", async (cId) => {
      // alterar mensagens pelo id da lista e pelo sender = contactId | receiver = userId
      await Message.updateMany(
        { sender: cId, receiver: userId, read: false },
        { read: true }
      );
    });

    socket.on("disconnect", () => {
      user.connections.map((i) => {
        socket.to(i).emit("user_offline", userId);
      });
      socket.leave(userId);
    });
  } catch (err) {
    if (userId === undefined || userId === null || !userId)
      socket.emit("no_id");
    socket.disconnect();
  }
});

server.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});

module.export = app;

// io.sockets.adapter.rooms.get(newMessage.receiver)
// io.to("some room").emit("some event");
