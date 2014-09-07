/*
Functionalities for music play. Using PGlowLatency plugin.
guitarChord:
	Current chord chose by user

preloadAudios():
	preload audios and bind it to its id.

touchInstrument():
	call playMusic() and send message to server.
	If the user is the room holder and he/she is recording the track, it 
	will call the record function.

playMusic():
	play media using plugin.

replayMusic():
	replay the music based on the timestamp

changeGuitarChord():
	change the guitarChord value and the css effects

ontouchend():
	Remove the 'touch' class
*/

var guitarChord='Am';
    

function preloadAudios(instrumentIDs){
	instrumentIDs.forEach(function(id){
		var path=id.replace("_","/");
		console.log('path:'+"music/"+path+".ogg");
		PGLowLatencyAudio.preloadFX(id,"music/"+path+".ogg");
	});
	console.log("loaded all audios");
}

function touchInstrument(id){
	$("#"+id).addClass(id+"-touch");
	if (id.indexOf('guitar_')==0){
		//currently the node name is also called 'id'
		id=id.replace('_','_'+guitarChord);
	}
	console.log('touched node:'+id);
	if (serverOn){
		socket.emit('send',{'roomNumber':curRoom,'secretstuff':id});
		if(recordOn && isHolder){
		recordTrack(curRoom.roomName,id);}
	}
	playMusic(id);

}

function playMusic(id){
	console.log("playMusic:"+id);
	PGLowLatencyAudio.play(id);
}

function replayMusic(list){
	newList=list.slice(0);
	list=list;
	while(newList.length!==0){
		var doc=newList.pop();
		console.log(doc['time']);
		setTimeout(playMusic,doc['time'],doc['sound']);
	}
}

/*
Demo for webpage test
*/
function playDemo(id){
	console.log('playDemo',id);
}

function changeGuitarChord(chord){
	if (chord!==guitarChord){
		$("#guitar_"+chord).addClass('guitarButton-touch');
		$("#guitar_"+guitarChord).removeClass('guitarButton-touch');
		guitarChord=chord;
		if (serverOn){socket.emit('send',{'curRoom':curRoom,'guitarChord':guitarChord});}
		console.log("#guitar_"+guitarChord+": "+$("#guitar_"+guitarChord).attr('class'));
	};
}

function touchend( event ) {
    console.log(event);
    var id=event.target;
    console.log(id.id);
    $(id).removeClass(id.id+"-touch");
}



