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
    $("#name-user").html(data);
    setInterval(() => {
        $(".container").hide(1000);
        $(".chat-box").show(500);
    },1500);
});

socket.on("server-send-list-user", (data) => {
    $(".user").html("");
    data.forEach((i) => {
        $(".user").append("<div class='user-online'>" + i + "</div>");
    });
});

//client receive message

socket.on("server-send-message",(data)=>{
    $(".box-chat").append("<div>"+data.un+":"+data.nd+"</div>");
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

    $("#btn-send").click( () => {
        if($("#message").val() === ""){

        }
        else{
            socket.emit("client-send-message",$("#message").val());
            $("#message").val("");
        }
    });

});
