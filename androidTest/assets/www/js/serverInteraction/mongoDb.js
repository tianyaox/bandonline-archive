var recordOn = false;
var songName = '';

function insertDocs(collection,docList) {
	socket.emit('listenInsert',{'collection':collection,'arg':docList});
}

function removeDocs(collection,query) {
	socket.emit('listenRemove',{'collection':collection,'arg':query});	
}

function findDocs(collection,query) {
	socket.emit('listenFind',{'collection':collection,'arg':query,'roomName':curRoom.roomName});

}


// records will be stored in the collection called 
// 'tempSongPool'. A
// the docs in the collection will be {'songName':'','members':[],'time':'','sound':''}

function recordTrack(curRoom,curSound) {
	var index = curSound.indexOf("_");
	var instrument = curSound.substr(0,index);
	var d = new Date();
	var curTime = d.getTime()-startTime;
	var docList = [{'songName':songName,'recordTime':startTime,'members':roomList[curRoom].memberName,'time':curTime,'instrument':instrument,'sound':curSound}];
	socket.emit('recordTrack',{'docList':docList});
}


function getPlayBack(){
	var playList = [];
	if ($('#pianoCheck').is(':checked')) {
		playList.push('piano');
	}
	if ($('#drumCheck').is(':checked')) {
		playList.push('drum');
	}
	if ($('#bassCheck').is(':checked')) {
		playList.push('bass');
	}
	if ($('#guitarCheck').is(':checked')) {
		playList.push('guitar');
	}
	findDocs("tempSongPool",{'instrument':{$in:playList},'recordTime':startTime,'songName':songName});
}

function listenTrack(){
	socket.on('listenTrack',function(msg) {
		console.log(msg);
		replayMusic(msg);
	});
}


function startRecord(){
	//hide Record;
	$('#recordNamePage').css('display','none');
	songName = $('#songName').val();
	$('#songName').val('');
	recordOn = true;
	$("#recordStart").css('background-color','green');
	var d = new Date();
	startTime = d.getTime();
}


function deleteRecord(){
	socket.emit('deleteRecord',{});
	hideRecordConfirm();
}

function confirmRecord() {
	hideRecordConfirm()
	socket.emit('confirmRecord',{});
	console.log('record Saved');
}
