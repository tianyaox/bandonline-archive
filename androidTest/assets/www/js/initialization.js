/*
Initialization of our app

nodeL:
	touchList whose key is the touch id, value is pageX. So it can be 
	shared by different touch events
directionL:
	track the direction of the touches	
Event listened:
	touchstart:
		Record the x corordinate and set the direction to zero for 
		each touch.
	touchmove:
		This is for plucking the strings of guitar and bass.
		When a touchmove event happens, the music will be played if :
			1.The finger moves from one string to another string
			2.The finger stay in one string element, but is changing 
			the move direction
	ondeviceReady:
		1.preload all the audio files using PGlowLatency plugin.
		2.Set the url to the one in localStorage, if it is defined
		3.Create the roomList and navigation bar elements in lobbyPage 
		using jquery
*/
var nodeL={};
var directionL={};
function onBodyLoad()
{	
    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("touchstart", function (e) {
		e.preventDefault();
		var touchList=event.changedTouches;
		for (var i=0; i<touchList.length;i++){
			directionL[touchList[i].identifier]=[touchList[i].pageX,0];
			touchList[i]['direction']=0;
			console.log(touchList[i]['identifier']);
		};
	}, false);	
    window.addEventListener('touchmove',function(event){
		event.preventDefault();
		var touchList=event.changedTouches;
        for(var i=0;i<touchList.length;i++){
           	var x=touchList[i].pageX;
           	var y=touchList[i].pageY;
			var previousDir=directionL[touchList[i].identifier][1];
			if (x!=directionL[touchList[i].identifier][0]){
			directionL[touchList[i].identifier][1]=x-directionL[touchList[i].identifier][0];}
			directionL[touchList[i].identifier][0]=x;
			var elem=document.elementFromPoint(x,y);
			if (elem!==undefined && (elem.id!=nodeL[touchList[i].identifier] ||
			    previousDir*directionL[touchList[i].identifier][1]<0 ))
			{
				console.log("id:"+elem.id+"previousNode "+nodeL[touchList[i].identifier]);
				var id=elem.id;
				var key=touchList[i].identifier;
				nodeL[key]=id;
				console.log(nodeL[key]);
				touchInstrument(id);
			}
        };
    },false);
}

function onDeviceReady()
{
    if(localStorage['url']!==undefined){
		$("#socketUrl").attr('value',localStorage['url']);
	}
	$('form').keypress(function(event) { 
    return event.keyCode != 13;
	});
    //PGLowLatencyAudio.preloadFX('bassdrum', 'music/bassdrum.mp3');
	var instrumentIDs=['guitar_E1','guitar_E2','guitar_E3','guitar_E4',
	'guitar_E5','guitar_E6','guitar_G1','guitar_G2','guitar_G3','guitar_G4',
	'guitar_G5','guitar_G6','guitar_F1','guitar_F2','guitar_F3','guitar_F4',
	'guitar_F5','guitar_F6','guitar_Em1','guitar_Em2','guitar_Em3',
	'guitar_Em4','guitar_Em5','guitar_Em6','bass_2-1','bass_2-2','bass_2-3',
	'bass_2-4','bass_2-5','bass_1-4', 'bass_3-5', 'bass_3-1', 'bass_4-1',
	 'bass_4-3', 'bass_3-3', 'bass_4-0', 'bass_3-4', 'bass_1-2', 'bass_1-5', 
	 'bass_4-4', 'bass_1-3', 'bass_3-2', 'bass_1-0', 'bass_3-0', 'bass_4-2',
	  'bass_1-1', 'bass_4-5','guitar_C4', 'guitar_C3', 'guitar_C2', 
	  'guitar_Am3', 'guitar_Am2', 'guitar_Am6', 'guitar_C5', 'guitar_C1',
	   'guitar_Am4', 'guitar_Am1', 'guitar_Am5', 'guitar_Dm1','guitar_Dm2',
	   'guitar_Dm3','guitar_Dm4','guitar_Dm5','guitar_Dm6','guitar_C6',
	   'drum_highhat','drum_snare','drum_bass','drum_lowTom','drum_highTom',
	   'drum_crash','piano_d3', 'piano_g3', 'piano_f3', 'piano_g3m', 
	   'piano_e3', 'piano_d3m', 'piano_f3m', 'piano_b3', 'piano_a3m', 
	   'piano_c3', 'piano_a3', 'piano_c3m'];
	preloadAudios(instrumentIDs);
	createRoomList();

} 
