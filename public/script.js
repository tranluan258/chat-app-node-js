//call server
var socket = io("http://localhost:8080");


//ready
$(document).ready(() => {
    $(".container").show();
    $(".chat-box").hide();
});
//client nghe data tu server gui ve
socket.on("sever-send-regis-fail", () => {
    alert("Have user regis!");
});

socket.on("server-send-regis-success", (data) => {
    $("#name").html(data);
    setInterval(() => {
        $(".container").hide();
        $(".chat-box").show();
    },1500);
});

socket.on("server-send-list-user", (data) => {
    $(".user").html("");
    data.forEach((i) => {
        $(".user").append("<div class='user-online'>" + i + "</div>");
    });
});

$(document).ready(() => {
    $("#btn-registation").click(() => {
        if ($("#user-name").val() == "") {
            alert("Please enter user name");
        } else {
            socket.emit("Client-send-username", $("#user-name").val()); //khách hàng emit lên server chữ hello với name là Client-send-data
            $("#user-name").val("");
        }
    });
});