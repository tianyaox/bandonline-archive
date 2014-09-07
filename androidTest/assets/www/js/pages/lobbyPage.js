/*
Functionalities in lobbyPage
curRoom:
	object for storing all information for current room
roomList:
	list for storing all clientRoom object

clientRoom:
	class for clientRoom object

createMaster:
	Create a new room if the name doesn't exists yet. Send message to server.

requestJoin:
	Called when pressing the 'join' button, check if a room is selected,
	and if it's full

joinMaster:
	Join a room if it is not full and it match the password.
	Send message to server.
*/
var curRoom = {};
var roomList = {};

function clientRoom(roomName,members,memberName,hasPsw){
	this.roomName=roomName;
	this.members=members;
	this.hasPsw=hasPsw;
	this.memberName=memberName; 
}

function createMaster() {
	//get the roomName from html
	$('#sameName').css('display','none');
	var roomName = $('#roomName').val();
	var psw = $('#password').val();
	$("#roomName").val("");
	$("#password").val("");
	if (roomList.hasOwnProperty(roomName)==true)
	{
		$('#sameName').css('display','block');
		var roomName = $('#roomName').val();
		var psw = $('#password').val();
		return
	}
	hideCreate();
	if (serverOn) {
		socket.emit('createMaster',{'roomName':roomName,'password':psw,
			'myName':curName});
	}
	curRoom = new clientRoom(roomName,1,[curName]);
	isHolder=true;
	redirectPage('menuPage');	
}

function requestJoin(){
	$("#roomList-comment").html("");
	if (Object.keys(curRoom).length===0){
		console.log('Please select a room');
		$("#roomList-comment").html("Please select a room");
		return
	}
	if (roomList[curRoom.roomName].members<4){
		if (roomList[curRoom.roomName].hasPsw){
			showJoin();
		}
		else{
			joinMaster();
		}
	}
	else{
		$("#roomList-comment").html("room is full");
		console.log('room is full');
	}
}
function joinMaster() {
	isHolder = false;
	$("#pswError").css("display",'none');
	var pswEntered = $('#join-password').val();
	$("#join-password").val("");
	if (serverOn) {
		socket.emit('checkPsw',{'room':curRoom.roomName,'password':pswEntered});
		socket.on('pswChecked',function(status){
			if (status===true){
				hideJoin();
				socket.emit('joinMaster',{'roomNumber': curRoom.roomName,
					'myName':curName});
				redirectPage('menuPage');
			}
			else { 
				$("#pswError").css('display','block');
				$("#join-password").val("");
				console.log('joinFailed');	

			}
		})
	}
}

