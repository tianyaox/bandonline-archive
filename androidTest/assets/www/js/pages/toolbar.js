/*
Functionalities in the toolbar page

playButton()
	function for replay

recordButton()
	Button for start and end recording.
	It's only provided to the holder of the room

shout()
	function for sending message to other members

listenChat()
	funciton for listening message from other members

chatButton()
	When the dialog box is hidden, pressing on chatbutton will 
	pop the dialog box out.
	When the dialog box is shown, pressing on chatbutton will
	call shout() to send message to others.

popChat()
hideChat()
popToolbar()
hideToolbar()
popRecord()
hideRecord()
	functions for poping and hiding dialog box,toolbar, record button.
*/

function playButton(){
    showReplay();
}

function recordButton(){
	if (!isHolder){
		return
	}
	
	if (recordOn===false) {
		showRecord()
	}
	
	else {
		recordOn = false;
		$("#recordStart").css('background-color','red')
		var d = new Date();
		endTime = d.getTime();
		showRecordConfirm();
	}
}


function shout() {
	if (serverOn) {
		var msg=$("#chatmsg").val();
		socket.emit('shout',{'room':curRoom,'shoutMsg':msg,'name':curName});
	}
}

function listenChat() {
	socket.on('hear',function(msg){
		var content = (msg.name).concat(': ',msg.shoutMsg);
		$("#othersWord").html(content);
		$("#othersWord").addClass("popWord");
		setTimeout(function(){
			$("#othersWord").html("");
			$("#othersWord").removeClass("popWord")},3000);
		console.log(msg.shoutMsg);
	});
}

function chatButton(){
	if ($("#chatmsg").hasClass('popChat'))
	{
		shout()
		$("#chatmsg").val("");
		hideChat();
	}
	else{
		popChat();
	}
}

function popToolbar(){
	$("#toolBar").css('display','block');
	if (isHolder){
		popRecord();		
	}
}
function hideToolbar(){
	$("#toolBar").css('display','none');
	if(isHolder){
		hideRecord();
		isHolder=false;
		console.log('holder left the room at mainPage');
	}
}

function popRecord(){
	$("#recordStart").css("display","block");
	$("#replay").css("display","block");
}

function hideRecord(){
	$("#recordStart").css("display","block");
	$("#replay").css("display",'none');
}

function popChat(){
	$("#chatmsg").addClass('popChat');
}


function hideChat(){
	$("#chatmsg").removeClass('popChat');
}
