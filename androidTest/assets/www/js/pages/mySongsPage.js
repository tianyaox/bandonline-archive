/*
page to show all songs of current user
getSongs()
    get all songs of current user from server
createSongList()
    creatList():
        create DOM element based on the list
selectSong():
    select a song
deleteSongs():
    delete a song from both client and database on server side
*/


var curSong;
function getSongs(){
	if(serverOn){
		socket.emit("getSongs",{"usrName":curName});
}
}

function createSongList(songList){
	songset={};
    sl=songList;
	songList.forEach(function(song){
		songset[song['songName']]=1;
	});
	createList(songset)
}

function createList(songset){
    var roomDOMArray = $("#song-array");
    var li = $("<li>");
//    var newInput = $("<input>");
//    newInput.type="radio";
//    newInput.name="input";
    roomDOMArray.html("");
    var roomRefreshDOM = function(){
        for (song in songset){
        	var newSong=$("<li>").attr("id","song-"+song).html(song).attr('ontouchstart', 
    	"selectSong(event)");
            roomDOMArray.append(newSong);
        }
    };
    roomRefreshDOM();
    addNav();

}

function selectSong(event){
    var ID=event.target.id;
    $("#"+curSong).removeClass("liChecked");
    curSong=event.target.id;
    $("#"+ID).addClass("liChecked");
    var height=$("#"+ID).position().top;
    return;
}

function deleteSong(){
    if (curSong===undefined){
        return
    }
    var songName=curSong.slice(curSong.indexOf('-')+1);
    if (serverOn){
        removeDocs("tempSongPool",{"songName":songName,"members":{$all:[curName]}})
    }
    $("#"+curSong).remove();

}

function replaySong(){
    var songName=curSong.slice(curSong.indexOf('-')+1);
    if (serverOn){
        findDocs("tempSongPool",{'songName':songName,"members":{$all:[curName]}});
    }   
}