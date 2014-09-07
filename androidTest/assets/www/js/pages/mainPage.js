var curPage="loginPage";

function redirectPage(className){
	console.log("redirect");
	if(className==='menuPage'){
		popToolbar()
	}
	if(className==='lobbyPage' || className==='loginPage'){
		hideToolbar()
	}
	if (className==="mySongsPage"){
		getSongs()
	}
	$("."+curPage).css("display","none");
	$("."+className).css("display","block");
	curPage=className;
}

$("#toPiano").click(function(){
	console.log("clicked");
	redirectPage("pianoPage");
});

function showExit(){
	$('#exitConfirmPage').css('display','block');

}
	
function hideExit(){
	$("#exitConfirmPage").css('display','none');
}



function exitRoom() {
	$("#exitConfirmPage").css('display','none');
	if (serverOn) {
		socket.emit('exitMaster',{'roomNumber': curRoom.roomName,
			'myName':curName});
	}
	redirectPage('lobbyPage');
	alert('Exit!');	
}

function showRecordConfirm(){
	$('#recordConfirmPage').css('display','block');

}
	
function hideRecordConfirm(){
	$("#recordConfirmPage").css('display','none');
}

function showRecord(){
	$('#recordNamePage').css('display','block');
}
	
function hideRecord(){
	$('#recordNamePage').css('display','none')
}
