function chatTest(){
	redirectPage('menuPage');
}
function shoutTest(){
	var msg=$("#chatmsg").val();
	$("#othersWord").html(msg);
	$("#othersWord").addClass("popWord");
	setTimeout(function(){
			$("#othersWord").html("");
			$("#othersWord").removeClass("popWord")},3000);
}
function testLobby(){
	redirectPage('lobbyPage');
	curRoom=new clientRoom("phillis",3,"df",true);
	addRoom(curRoom);
}

function bindKeys(){
	$(document).keydown(function(e){
		console.log(e.keyCode)
		if(e.keyCode==81){
			console.log("left");
			touchInstrument('drum_bass')
		}
		if(e.keyCode==87){
			console.log("left");
			touchInstrument('drum_snare')
		}
		if(e.keyCode==69){
			console.log("left");
			touchInstrument('drum_lowTom')
		}
		if(e.keyCode==82){
			console.log("left");
			touchInstrument('drum_highTom')
		}
		if(e.keyCode==68){
			console.log("left");
			touchInstrument('drum_highhat')
		}
		if(e.keyCode==70){
			console.log("left");
			touchInstrument('drum_crash')
		}
	})
}