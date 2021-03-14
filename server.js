const express = require("express")
const app = express();
app.use(express.static("./public"))
app.set("view engine", "ejs")
app.set("views", "./views")

const server = require("http").Server(app)
const io = require("socket.io")(server)
const PORT = process.env.PORT || 8080;
server.listen(PORT)

let arrUser = new Map()

io.on("connection", socket => {
    socket.on("disconnect", () => {
        if (socket.name != undefined) {
            arrUser.delete(socket.name)
            socket.broadcast.emit("server-send-list-user", arrUser)
        }
    })

    socket.on("Client-send-username", data => {
        if (arrUser.get(data.username) >= 0) {
            socket.emit("sever-send-regis-fail")
        }
        else {
            socket.name = data
            arrUser.set(data,data)
            socket.emit("server-send-regis-success", data)
            io.sockets.emit("server-send-list-user", arrUser)
        }
    })

    socket.on("client-send-message", (data) => {
        socket.emit("server-send-message-you", { un: socket.name, nd: data })
        socket.broadcast.emit("server-send-message-friend", { un: socket.name, nd: data })
    })

    socket.on("client-logout", () => {
        arrUser.delete(socket.name)
        socket.broadcast.emit("server-send-list-user", arrUser)
    })
})

app.get("/", (req, res) => {
    res.render("homepage")
})