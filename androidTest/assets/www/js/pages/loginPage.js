var curName = '';
var curPsw = '';



function register() {
	var name = $('#usernameInput').val();
	var psw = $('#passwordInput').val();
	$('#usernameInput').val('');
	$('#passwordInput').val('');
	if (name==='' || psw==='') {
		console.log('name/psw cannot be empty');
        $("#loginValidation").html("Opps! Name/Psw cannot be empty!");
		return
	}
	
	if (serverOn) {
		socket.emit('registerTry',{'userName':name,'psw':psw});
		socket.on('registerCheck',function(status){
			console.log('registercheck returned status',status);
			if (status===true){
				redirectPage('lobbyPage');
				//logged in
				console.log('registered and logged in');
				curName = name;
				curPsw = psw;
			}
			else {
				console.log('existed name');
                $("#loginValidation").html("Existed Username :P");
			}
		});
	}
}

function login() {
	var name = $('#usernameInput').val();
	var psw = $('#passwordInput').val();
	$('#usernameInput').val('');
	$('#passwordInput').val('');
	
	if (serverOn) {
		socket.emit('loginTry',{'userName':name,'psw':psw});
		socket.on('loginCheck',function(msg){
			if (msg.status===true){
				redirectPage('lobbyPage');
				//logged in
				console.log(msg.msg);
				curName = name;
				curPsw = psw;
			}
			else {
				console.log(msg.msg);
                $("#loginValidation").html(msg.msg);
			}	
		});
	}
}
