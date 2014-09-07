//Functions for rooms' manipulation in lobbyPage
/*
createRoomList()
	Initialize the roomList DOM elements and navigation bar based on the 
	roomList get from the server

addNav() 
	Using jquery to add navigation bar aside from the roomList

navToRoom()
	Navigate the roomList to the letter being pressed in the navigation bar

findNearest()
	Find the roomName according to the letter being pressed in the 
	navigation bar,if no room matches, find the nearest one.

sortedInsert()
	Insert a child element to a parent element at the right place based 
	on the id comparison.

selectRoom()
	set curRoom to the element being touched	
*/




function createRoomList(){
    var roomDOMArray = $("#room-array");
    var li = $("<li>");
//    var newInput = $("<input>");
//    newInput.type="radio";
//    newInput.name="input";

    var roomRefreshDOM = function(){
        for (i= 0; i< roomList.length;i++){
            roomDOMArray.append("<li>"+ roomList[i] + "</li>" );
        }
    };
    roomRefreshDOM();
    addNav();

}

function addNav(){
	var tags=["a","b","c","d","e","f","g","h","i","j","k","l","m","n",
	"o","p","q","r","s","t","u","v","w","x","y","z"];
	tags.forEach(function(tag){
		var tagli=$("<li>").html(tag.toUpperCase()).attr('onclick',
			'navToRoom(event)');
		$("#room-nav").append(tagli);
	});
}

function navToRoom(event){
	var id=$(event.target).html().toLowerCase();
	console.log(id);
	if (($("#room-array "+"#"+id).length)){
		var topVal=$("#"+id).position().top-$("#room-array").position().top;
		console.log(topVal);
		$("#room-list").animate({
			scrollTop:topVal
		});
	}
	else {
		target=findNearest(id);
		if (target!==false){
			$("#room-list").animate({
				scrollTop:target.position().top-$("#room-array").position().top
			});
		}
	}
}

function findNearest(id){
	var find=false;
	var target=false;
	$("#room-array").children().each(function(){
		if ($(this).attr('id')>id && !find){
			console.log($(this));
			find=true;
			target=$(this);
		}
	});
	
	return target;
}
function updateRoom(room){
	var roomNum=room.roomName;
	var members=room.members;
	var memberName=room.memberName;
	var memberID = room.memberID;
	console.log("updateRoom:",room);
}

function addRoom(room){
	var roomNum=room.roomName;
	var members=room.members;
	var memberName=room.memberName;
	var memberID = room.memberID;
	//find the right place to insert the room name in the list
    // roomList.push(roomNum);
    var newRoom=$("<li>").attr("id",roomNum).html(roomNum).attr('ontouchstart', 
    	"selectRoom(event)");
	var last=true;
	var previous=false;
	var letter=roomNum[0].toLowerCase();
	if (!$('#room-array '+'#'+letter).length){
		var letterli=$("<li>").attr('id',
			letter).html(letter.toUpperCase()).addClass("roomSelection");
		sortedInsert($("#room-array"),letterli);
	}
	sortedInsert($("#"+letter),newRoom);	
	roomUI(roomNum,members,room.hasPsw);
}
function roomUI(roomID,members,hasPsw){
    if (members === 1)
    $("#"+roomID).css('background','url("images/person.png") right center no-repeat');
    if (members === 2)
        $("#"+roomID).css('background','url("images/person2.png") right center no-repeat');
    if (members === 3)
        $("#"+roomID).css('background','url("images/person3.png") right center no-repeat');
    if (members === 4)
        $("#"+roomID).css('background','url("images/person4.png") right center no-repeat');
    var personNum = $("#"+roomID).attr('background');
    if (hasPsw === true)
        $("#"+roomID).css('background',personNum + ', url("images/lock.png") left center no-repeat');

}
function sortedInsert(main,child){
	//insert a new element into 'main' sorted by id
	var last=true;
	main.children().each(function(){
		if ($(this).attr('id')>child.attr('id')){
			$(this).before(child);
			last=false;
			return false;
		}
	});
	if(last){
		main.append(child);
	}
}

function selectRoom(event){
    console.log(event.target.id);
    var ID=event.target.id;
    $("#"+curRoom.roomName).removeClass("liChecked")
    curRoom.roomName=event.target.id;
    $("#"+ID).addClass("liChecked")
}


//$(".roomSelection").click(function(){
//    $("#room-array li > li").removeClass("liChecked")
//    $(this).toggleClass("liChecked");
//    console.log("hello");
//});