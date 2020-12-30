const socket = io("https://massager-demo.herokuapp.com")

socket.on("sever-send-regis-fail", () => {
    $(".alert-danger").html("Name already exists!")
    $(".alert-danger").fadeIn(1000)
    setTimeout(() => {
        $(".alert-danger").fadeOut()
    }, 2000)
})

socket.on("server-send-regis-success", data => {
    $("#name-user").html(data)
    $(".login-box").hide(500)
    $(".chat-box").show(1000)
})

socket.on("server-send-list-user", data => {
    $(".user").html("")
    data.forEach((i) => {
        $(".user").append("<div class='user-online'>" + i + "</div>")
    })
})

socket.on("server-send-message-you", data => {
    $(".body-chat").append("<div class='body-chat-you'><span class='data-chat-you'>" + data.un + ":" + data.nd + "</span></div>")
})

socket.on("server-send-message-friend", data => {
    $(".body-chat").append("<div class='body-chat-friend'><span class='data-chat-friend'>" + data.un + ":" + data.nd + "</span></div>")
})

$(document).ready(() => {

    $(".login-box").show()
    $(".chat-box").hide()
    $(".alert-danger").hide()

    $("#btn-registation").click(() => {
        if ($("#user-name").val() == "") {
            $(".alert-danger").html("Please enter your name!")
            $(".alert-danger").fadeIn(1000)
            setTimeout(() => {
                $(".alert-danger").fadeOut()
            }, 2000)
        } else {
            socket.emit("Client-send-username", $("#user-name").val())
            $("#user-name").val("")
        }
    })

    $("#btn-send").click(() => {
        if ($("#message").val() === "") {

        }
        else {
            socket.emit("client-send-message", $("#message").val())
            $("#message").val("")
        }
    })

    $("#btn-logout").click(() => {
        socket.emit("client-logout")
        $(".login-box").show(1000)
        $(".chat-box").hide(500)
    })

})


