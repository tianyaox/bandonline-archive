var rooms = new Object();
var clientRooms=new Object();
var curRecord = [];
var io = require('socket.io').listen(3000);
exports.io=io;
var db=require('./database.js')

function serverRoom(clientsList,password){
	// clientsList is an array of ids of the clients in this room
	this.clients = clientsList;
	this.password = password;
}

function clientRoom(roomName,members,memberName,memberID,hasPsw){
	this.roomName=roomName;
	this.members=members;
	this.hasPsw=hasPsw;
	this.memberName=memberName;
	this.memberID = memberID;
}
// Listen for client connection event
// io.sockets.* is the global, *all clients* socket
// For every client that is connected, a separate callback is called
io.sockets.on('connection', function(socket){
	// Listen for this client's "send" event
	// remember, socket.* is for this particular client

	var curRoomNames = Object.keys(rooms);
	var clientList={};
	// curRoomNames.forEach(function(name){
	// 	var serverRoom=rooms[name];
	// 	var newRoom=new clientRoom(name,serverRoom['clients'].length,\
	// 			(serverRoom['password']!==''));
	// 	clientList[name]=newRoom;
	// });
	socket.emit('reconnection',{'reconnection':true});
	console.log(clientRooms)
	socket.emit('getClientRooms',{'clientRooms':clientRooms});
	socket.on('createMaster', function(msg){
		var thisRoom = msg.roomName;
		var thisPsw = msg.password;
		var masterID = socket.id;
		var roomIDList = [masterID];
		rooms[thisRoom] = {'clients':roomIDList,'password':thisPsw};
		console.log("createMaster",rooms);
		//console.log('message',msg);
		var clientThisRoom=new clientRoom(thisRoom,1,[msg.myName],[masterID],(thisPsw!==''));
		clientRooms[thisRoom]=clientThisRoom;
		io.sockets.emit('masterCreated',{'thisRoom':clientThisRoom});
		//socket.emit('getCurRoomList',{'curRoomList':curRoomList});
	});

	//if one socket disconnect,kick it out of the room
	socket.on('disconnect',function(){
		var playerId=socket.id;
		var curRoomList=Object.keys(rooms);
		for (room in rooms){
			var index=rooms[room]['clients'].indexOf(playerId);
			if (index!=-1){
				exitRoom(room,playerId);
				return
			}
		}
	})

	socket.on('joinMaster', function(msg) {
		rooms[msg.roomNumber]['clients'].push(socket.id);
		var thisRoom=clientRooms[msg.roomNumber];
		thisRoom['members']+=1;
		thisRoom['memberName'].push(msg.myName);
		thisRoom['memberID'].push(socket.id);
		io.sockets.emit('masterJoined',{'thisRoom':thisRoom});
		console.log("joinMaster",rooms);
	});

	socket.on('checkPsw',function(msg) {
		console.log('checking devices');
		console.log(msg.password);
		if (rooms[msg.room].password===msg.password) {
			socket.emit('pswChecked',true);
			console.log('checking true');
		} 
		else {
			console.log('checking false');
			socket.emit('pswChecked',false);
		}
	})

	socket.on('exitMaster', function(msg) {
		console.log(msg);
		console.log(msg.roomNumber);
		exitRoom(msg.roomNumber,socket.id);
	});

	function exitRoom(roomNumber,userID){
		var index=rooms[roomNumber]['clients'].indexOf(socket.id);
		var isHolder=false;
		if (index==0){
			isHolder=true;
		}
		rooms[roomNumber]['clients'].splice(index,1);
		clientRooms[roomNumber]['members']-=1;
		var index= clientRooms[roomNumber]['memberID'].indexOf(socket.id);
		clientRooms[roomNumber]['memberName'].splice(index,1);
		clientRooms[roomNumber]['memberID'].splice(index,1);
		console.log('someone left',rooms);
		console.log(rooms[roomNumber]['clients'].length===0);
		if (rooms[roomNumber]['clients'].length===0) {
			console.log('im here!');
			delete rooms[roomNumber];
			delete clientRooms[roomNumber];
			console.log('one room disappear!',rooms);
			io.sockets.emit('getClientRooms',{'clientRooms':clientRooms});
		}
		else{
			if (isHolder){
				var id=rooms[roomNumber]['clients'][0];
				io.sockets.socket(id).emit('newHolder',{'thisRoom':clientRooms[roomNumber]});
			}
			io.sockets.emit('masterJoined',{'thisRoom':clientRooms[roomNumber]});
		}
	}

	socket.on('send', function(msg) {
		var curRoom = msg.roomNumber.roomName;
		console.log(curRoom);
		console.log(rooms);
		console.log(rooms[curRoom]);

		var clientRoomList = rooms[curRoom].clients;
		clientRoomList.forEach(function(socketId){
			if (socketId!==socket.id) {
				console.log('serverSending',socketId,msg);
				io.sockets.socket(socketId).emit('receive',msg);
			}
		});
		// Broadcast a "receive" event with the data received from "send"
	});



//===============================
// 			for chatting
//===============================
	socket.on('shout', function(msg) {
		curRoom = msg.room.roomName;
		var clientList = rooms[curRoom].clients;
		clientList.forEach(function(socketId){
			console.log('serverSending',socketId,msg);
			io.sockets.socket(socketId).emit('hear',msg);

		});

	})


//===============================
// 			for registering
//==============================
	socket.on('registerTry',function(msg){
		//get cur userNameList from the database
		db.openDb(findDoc,'userList',{},{'status':'registerCheck','userName':msg.userName,'psw':msg.psw,'id':socket.id});
	});
	
//===============================
//			login
//===============================

	socket.on('loginTry',function(msg){
		//get cur userNameList from the database
		db.openDb(findDoc,'userList',{},{'status':'loginCheck','userName':msg.userName,'psw':msg.psw,'id':socket.id});
	});
	


//===============================
// 			for record
//==============================

	socket.on('recordTrack',function(msg){
		curRecord = curRecord.concat(msg.docList);
		console.log('on recordTrack',curRecord);
	});

	socket.on('confirmRecord',function(msg){
		db.openDb(db.insertDocuments,'tempSongPool',curRecord,{});
		console.log('on confirmRecord');
		curRecord = [];
	});

	socket.on('deleteRecord',function(msg){
		curRecord = [];
		console.log('temp record deleted');
	});

//===============================
// 			for mongoDb
//==============================


	socket.on('listenInsert', function(msg) {
		console.log('on server listenInsert');
		//console.log('my collection'+msg.collection);
		console.log('my docs',msg.arg);
		db.openDb(db.insertDocuments,msg.collection,msg.arg,{});
	});

	socket.on('listenRemove', function(msg) {
		db.openDb(db.removeDoc,msg.collection,msg.arg,{});
	});

	socket.on('listenFind', function(msg) {
		console.log('on server listenFind');

		db.openDb(findDoc,msg.collection,msg.arg,{'roomName':msg.roomName});
		// console.log("trackResult",result);
/*		var clientList = rooms[msg.collection].clients;
		clientList.forEach(function(socketId){
			io.sockets.socket(socketId).emit('listenTrack',result);
		});*/
	});


//===============================
// 			for profile
//==============================
	socket.on('getSongs',function(msg){
		db.openDb(findDoc,'tempSongPool',{'members':{$all:[msg.usrName]}},{"id":socket.id,"status":'getProfile'});
	})

	
});

function findDoc(collection,query,extraMsg, done){
	if (extraMsg.status==='registerCheck'){
		collection.find(query).toArray(function(error,result){
			if (error) {
				throw error;
			}
			var nameList = result[0].nameList;
			console.log('nameList',nameList);
			console.log('userName',extraMsg.userName);
			//existed
			if (nameList.indexOf(extraMsg.userName)!==-1){
				io.sockets.socket(extraMsg.id).emit('registerCheck',false);
				done();
			}
			//not existed
			else {
				var temp = [];
				temp = temp.concat(nameList);
				temp.push(extraMsg.userName);
				console.log('temp',temp);
				console.log('nameList',nameList);
				collection.update({'nameList':nameList},{$set:{'nameList':temp}},{'multi':true},function(err){
					if (err)
						throw err;
					console.log('namelist update success');
				});
				done();				
				io.sockets.socket(extraMsg.id).emit('registerCheck',true);
				db.openDb(db.insertDocuments,'userProfile',[{'name':extraMsg.userName,'psw':extraMsg.psw}],{});
			}
		});
	}

	else if (extraMsg.status==='loginCheck'){
		console.log('in loginCheck')
		collection.find(query).toArray(function(error,result){
			if (error) {
				throw error;
			}
			console.log('have result',result);
			var nameList = result[0].nameList;
			//existed
			if (nameList.indexOf(extraMsg.userName)!==-1){		
				console.log('checking user exist')
				done();
				db.openDb(findDoc,'userProfile',{'name':extraMsg.userName},{'status':'loginPswCheck','userName':extraMsg.userName,'psw':extraMsg.psw,'id':extraMsg.id});
			}
			else {
				console.log('checking user not exist')

				io.sockets.socket(extraMsg.id).emit('loginCheck',{'status':false,'msg':'no such user'});
				done();
			}

		});
	}

	else if (extraMsg.status==='loginPswCheck'){
		console.log('in pswCheck')

		collection.find(query).toArray(function(error,result){
			if (error) {
				throw error;
			}
			console.log('login,result',result);
			var psw = result[0].psw;
			if (extraMsg.psw===psw){
				console.log('success');
				io.sockets.socket(extraMsg.id).emit('loginCheck',{'status':true,'msg':'login success'});
			}
			else {
				io.sockets.socket(extraMsg.id).emit('loginCheck',{'status':false,'msg':'wrong password'});

			}
			done();
		});		
	}

	else if (extraMsg.status==='getProfile'){
		console.log('in getProfile');
		collection.find(query).toArray(function(error,result){
			if (error) {
				throw error;
			}
			console.log(result);
			console.log('id',extraMsg.id);
			io.sockets.socket(extraMsg.id).emit('songs',{'songs':result});
			
			done();
		});		
	}

	else {
		collection.find(query).toArray(function(error,result){
			if (error) {
				throw error;
			}
			console.log('result',result);
			done();
			var clientList = rooms[extraMsg.roomName].clients;
			clientList.forEach(function(socketId){				
				io.sockets.socket(socketId).emit('listenTrack',result);
			});
		});
	}
}
