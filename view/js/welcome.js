$(document).ready(function () {
    $.get("http://localhost:3000/user/details", function (data, status) {
        //console.log(data);
        $("#user-nav").html(data.fName + " " + data.lName);
    });
});