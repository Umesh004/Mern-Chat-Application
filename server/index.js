const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");

const app = express();
const socket = require("socket.io");
require("dotenv").config();

// app.use(cors());
app.use(
  cors({
    origin: [""], // add this if there is a problem
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

// DB connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

const server = app.listen(process.env.PORT, () => {
  console.log("Server started on ", process.env.PORT);
});

const io = socket(server, {
  // intergrate with the server
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map(); // to store all online users inside Map

io.on("connection", (socket) => {
  global.chatSocket = socket; // if there is conn then store  chat-socket into global-chatsocket
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    // send data as parameter
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message); // mesg-recieve is event
    }
  });
});
