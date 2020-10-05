//create server
const express = require("express");
const app = express();
app.use(express.static("./public")); // file user truy cap
app.set("view engine", "ejs"); // set view cho home page
app.set("views", "./views");


const server = require("http").Server(app);
//cau hinh socket io
const io = require("socket.io")(server);
server.listen(8080);

let arrUser = [];
// check user connection (use io.on)
io.on("connection", (socket) => {
    console.log("connected :" + socket.id);

    //check disconnect
    socket.on("disconnect", () => {
        console.log("disconnected :" + socket.id);
        if (socket.name != undefined) {
            arrUser.splice(
                arrUser.indexOf(socket.name), 1
            )
            socket.broadcast.emit("server-send-list-user", arrUser);
        }
    });
    //server on data cua client
    socket.on("Client-send-username", (data) => {
        // receive and check user name
        if (arrUser.indexOf(data) >= 0) {
            socket.emit("sever-send-regis-fail");
        }
        else {
            socket.name = data;
            arrUser.push(data);//add user in arrUser
            socket.emit("server-send-regis-success", data);
            io.sockets.emit("server-send-list-user", arrUser);
        }
    });

    //receive message
    socket.on("client-send-message", (data) => {
        socket.emit("server-send-message-you", { un: socket.name, nd: data });
        socket.broadcast.emit("server-send-message-friend", { un: socket.name, nd: data });
    });

    //logout
    socket.on("client-logout", () => {
        arrUser.splice(
            arrUser.indexOf(socket.name), 1
        )
        socket.broadcast.emit("server-send-list-user", arrUser);
    });
});



app.get("/", (req, res) => {
    res.render("homepage");
});