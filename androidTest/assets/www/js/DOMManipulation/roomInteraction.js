/*
    functionalities for swiching between different pages.
*/
function showCreate(){
    $("#createInfo").css("display","block");
    $("#sameName").css('display','none');
    $("#background").css("display","block");
}

function hideCreate(){
    $("#createInfo").css("display","none");
    $("#background").css("display","none");
}

function showJoin(){
    $("#joinInfo").css("display","block");
    $("#pswError").css("display",'none');
    $("#background").css("display","block");
}


function hideJoin(){
    $("#joinInfo").css("display","none");
    $("#background").css("display","none");
}

function showReplay(){
    $("#replyPage").css("display","block");
}

function hideReplay(){
    $("#replyPage").css("display","none");
}
