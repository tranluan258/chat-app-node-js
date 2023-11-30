import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import * as socketio from "socket.io";

const app = express();

app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");

const server = http.createServer(app);
const io = new socketio.Server(server);

const PORT = 8080;
server.listen(PORT);

let arrUser = [];

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    if (socket.name != undefined) {
      arrUser.splice(arrUser.indexOf(socket.name), 1);
      socket.broadcast.emit("server-send-list-user", arrUser);
    }
  });
  socket.on("Client-send-username", (data) => {
    if (arrUser.indexOf(data) >= 0) {
      socket.emit("sever-send-regis-fail");
    } else {
      socket.name = data;
      arrUser.push(data);
      socket.emit("server-send-regis-success", data);
      socket.broadcast.emit("server-send-new-client", data);
      io.sockets.emit("server-send-list-user", arrUser);
    }
  });

  socket.on("client-send-message", (data) => {
    socket.emit("server-send-message-you", { un: socket.name, nd: data });
    socket.broadcast.emit("server-send-message-friend", {
      un: socket.name,
      nd: data,
    });
  });

  socket.on("client-logout", () => {
    arrUser.splice(arrUser.indexOf(socket.name), 1);
    socket.broadcast.emit("server-send-list-user", arrUser);
  });
});

app.get("/", (_req, res) => {
  res.render("homepage");
});

