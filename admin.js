function deleteEmail(address) {
    var deleteEmail = confirm("Are you sure you want to delete this account?\n"+address);
    if (deleteEmail == true) {
		$.ajax({
		type: "GET",
		url: "delete_account.php",
		data: {e: address},
		success: function(msg) {
			reloadAddresses();
		}
	})
        //alert("Email address: " + address + " deleted!");
        //location.reload();//reload the page to show the update
    }
}

function reloadAddresses(){
	$(".account-list").empty();
	$.ajax({
		type: "GET",
		url: "fetch_email_admin.php",
		success: function(msg) {
			var addresses = JSON.parse(msg);
			
			(function () {
				var i;
				for(i = 0; i < addresses.length; i++) {
					$(".account-list").append('<div class="email-list-item" id=\'' + addresses[i]["UserName"] + '\'></a><a type="button" class="btn alert-danger" onclick="deleteEmail(\'' + addresses[i]["UserName"] + '\')">delete ' + addresses[i]["UserName"] + '</a></div>');
				}
			})();
			
		}
	});
}

function goBack() {
	location.replace("tempMailLogin.html");
}

function setUser() {
	$.ajax({
		type: "GET",
		url: "return_account.php",
		success: function(msg) {
			document.getElementById("title").innerHTML = "TempMail / " + msg;
			document.getElementById("account").innerHTML = msg + "'s Account";
		}
	}).done(function(){
		reloadAddresses();
	});
	
	
	
	/*$.ajax({
		type: "GET",
		url: "return_account.php",
		success: function(msg) {
			document.getElementById("account").innerHTML = msg + "'s Account";
		}
	})*/
}
