/*
functionalities for connecting the server based on the url given by user.
Since Heroku doesn't support socket.io, we didn't hang an online server,
so everytime the server is started by our laptop, users should type 
the url by themselves.
getServer()
	Get the server by url typed by users. The url will be saved locally,
	if the user restart our app, the url given last time will be shown
*/

var io;
$("#submitUrl").click(function(){
	console.log("clicked");
	getServer();
});

function getServer(){
	if (io!==undefined){
		console.log('already connected')
		return
	}
	var url=$("#socketUrl").val();
	localStorage['url']=url;
	//alert(url);
	$.getScript(url+"socket.io/socket.io.js",function(data, textStatus, jqxhr){
		//alert(textStatus);
			//alert("serverOn:"+serverOn)
			serverOn = true;
			//alert('serverOn:'+serverOn);
			//alert('io:'+io);
			//alert('url:'+url)
			initiateServer(url);
			alert('socket connected!');			

	});
}
