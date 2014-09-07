/*
	functionalities for listening general events from the server
checkServer()
	Repeatedly check the activity of server, if server is down, change 
	the serverOn to be false

messages being listened:
	reconnection
		When the server is down,then we restart the server, all clients 
		should be redirected  to loginPage.
	getClientRooms
		get a list of all clientRooms
	masterCreated
		add a clientRoom in client side when a new room is created
	masterJoined
		Update a clientRoom in client side when one user join a room
	receive
		play music in all users of a room, if the user is the holder and 
		he/she starts to record, record this event.
	newHolder
		change the holder in the client side when the former holder exits
		the room.
	songs
		receive a list of songs of current user
*/
var serverOn=false;
var socket;
var isHolder = false;

window.setInterval(checkServer,1000);
function checkServer(){
	if (io!==undefined){
		if (!socket.socket.connected){
			serverOn=false;
			console.log('server is down');
            $('#serverIndicator').css('background-color','#ec7063');
        }
		else{
			serverOn=true;
            $('#serverIndicator').css('background-color','#55d98d');
		}
	}
}
function initiateServer(url){
	// console.log("IO: ",io);
	// console.log("socket:",socket);
	// Make a connection to the socket.io server
	// This also fires the "connection" event, but it doesn't matter
	// When getting a "receive" event from the server
	socket=io.connect(url);
	socket.on('reconnection', function(msg) {
		if (msg.reconnection) {
			//redirectPage('lobbyPage');
			redirectPage('loginPage');
		}
	});
	socket.on('getClientRooms', function(msg){
		roomList=msg.clientRooms;
		console.log(roomList)
        $("#room-array").html('');
		for (room in roomList){
			console.log(roomList[room]);
			addRoom(roomList[room]);
		};
	})
	socket.on('masterCreated', function(msg){
		console.log(msg);
		console.log(msg.thisRoom);
		roomList[msg.thisRoom.roomName]=msg.thisRoom;
		addRoom(msg.thisRoom);
	})
	socket.on('masterJoined', function(msg){
		console.log(msg);
		console.log(msg.thisRoom);
		roomList[msg.thisRoom.roomName]=msg.thisRoom;
		updateRoom(msg.thisRoom);
	})
	socket.on('songs',function(msg){
		console.log(msg.songs);
		createSongList(msg.songs);
	});
	
	socket.on('receive', function(data) {
	// update the DOM with received data
	//document.getElementById('replace').innerHTML = data.secretstuff;
	 	console.log(data.guitarChord);
		console.log("serverMsg");
		if (data.guitarChord!==undefined)
	  	{
	  		changeGuitarChord(data.guitarChord);
	  	}	  		
	  	if(recordOn && isHolder){
	  		recordTrack(curRoom.roomName,data.secretstuff);		  		
	  	}
	  	playMusic(data.secretstuff);

	});
	socket.on('newHolder',function(msg){
		console.log('newHolder message');
		isHolder=true;
		popRecord();
	})
	// for chat room
	listenChat();
	// for play back 
	listenTrack();
}


