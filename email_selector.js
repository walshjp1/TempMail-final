function deleteEmail(address) {
    var deleteEmail = confirm("Are you sure you want to delete this email address?\n"+address);
    if (deleteEmail == true) {
		$.ajax({
		type: "GET",
		url: "delete_email.php",
		data: {e: address},
		success: function(msg) {
			reloadAddresses();
		}
	})
        //alert("Email address: " + address + " deleted!");
        //location.reload();//reload the page to show the update
    }
}

function addNewEmail() {
    var newemail = prompt("what email address would you like to add?");
    if (newemail === null) {
        return null;
    }

    
    // URL that generated this code: -->
    // http://txt2re.com/index-javascript.php3?s=jisd@email.com&1 -->


    var re1 = '([\\w-+]+(?:\\.[\\w-+]+)*@(?:[\\w-]+\\.)+[a-zA-Z]{2,7})';	// Email Address 1

    var p = new RegExp(re1, ["i"]);
    var m = p.exec(newemail);
    if (m != null) {
        var email1 = m[1];
        email1.replace(/</, "&lt;") + ")" + "\n";
    }
    if (email1 === newemail) {
        //alert("Success! Created new email address: " + email1);
        //location.reload();//show the updated data
			$.ajax({
			type: "GET",
			url: "add_email.php",
			data: {e: newemail},
			success: function(msg) {
				reloadAddresses();
			}
		})
    }
    else {
        alert("Invalid email address. Please try again.");
    }
	
	

    return newemail;
}

function goToEmail(address){
	$.ajax({
		type: "GET",
		url: "goToEmail.php",
		data: {a: address},
		success: function(msg) {
			location.replace("EmailPage.html");
		}
	})
}

function reloadAddresses(){
	$(".email-list").empty();
	$.ajax({
		type: "GET",
		url: "fetch_email.php",
		success: function(msg) {
			var addresses = JSON.parse(msg);
			
			(function () {
				var i;
				for(i = 0; i < addresses.length; i++) {
					$(".email-list").append('<div class="email-list-item" id=\'' + addresses[i]["Address"] + '\'><a type="button" onclick="goToEmail(\'' + addresses[i]["Address"] + '\')" class="btn alert-success">' + addresses[i]["Address"] + '</a><a type="button" class="btn alert-danger" onclick="deleteEmail(\'' + addresses[i]["Address"] + '\')">delete email</a></div>');
				}
			})();
			
		}
	});
}

function goBack() {
	location.replace("tempMailLogin.html");
}


function toggleTheme() {
	var cssFile1 = "email_selector.css";
	var cssFile2 = "email_selectorDark.css";
	var cssFile;
	
	var current = document.getElementById("styleID").href;
	current = current.substr(current.lastIndexOf('/')+1);
	if(current == cssFile1)
		cssFile = cssFile2;
	else
		cssFile = cssFile1;
	
	var oldlink = document.getElementById("styleID");
 
	var newlink = document.createElement("link");
	newlink.setAttribute("rel", "stylesheet");
	newlink.setAttribute("type", "text/css");
	newlink.setAttribute("href", cssFile);
	newlink.setAttribute("id", "styleID");

	document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);

}

function setUser() {
	$.ajax({
		type: "GET",
		url: "return_account.php",
		success: function(msg) {
			document.getElementById("title").innerHTML = "TempMail / " + msg;
			document.getElementById("account").innerHTML = msg + "'s Account";
			document.getElementById("pagetitle").innerHTML = "Tempmail / " + msg;
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
