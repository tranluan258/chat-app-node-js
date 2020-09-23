//call server
var socket = io("http://localhost:8080");


//ready
//client nghe data tu server gui ve
socket.on("sever-send-regis-fail", () => {
    alert("Have user regis!");
});

socket.on("server-send-regis-success", (data) => {
    $("#name-user").html(data);
    $(".login-box").hide(500);
    $(".chat-box").show(1000);
});

socket.on("server-send-list-user", (data) => {
    $(".user").html("");
    data.forEach((i) => {
        $(".user").append("<div class='user-online'>" + i + "</div>");
    });
});

//client receive message

socket.on("server-send-message", (data) => {
    $(".body-chat").append("<di class='data-chat'>" + data.un + ":" + data.nd + "</di  v>");
});

$(document).ready(() => {

    $(".login-box").show();
    $(".chat-box").hide();

    $("#btn-registation").click(() => {
        if ($("#user-name").val() == "") {
            alert("Please enter user name");
        } else {
            socket.emit("Client-send-username", $("#user-name").val()); //khách hàng emit name lên server  với name là Client-send-data
            $("#user-name").val("");
        }
    });

    $("#btn-send").click(() => {
        if ($("#message").val() === "") {

        }
        else {
            socket.emit("client-send-message", $("#message").val());
            $("#message").val("");
        }
    });

    $("#btn-logout").click(() => {
        socket.emit("client-logout");
        $(".login-box").show(1000);
        $(".chat-box").hide(500);
    });

});


