var EmailController = {
    addEvent: function (obj, type, fn) {
        "use strict";

        if (obj.attachEvent) {
            obj['e' + type + fn] = fn;
            obj[type + fn] = function () { obj['e' + type + fn](window.event); };
            obj.attachEvent('on' + type, obj[type + fn]);
        } else {
            obj.addEventListener(type, fn, false);
        }
    },

    //this is an inbox object (there is only one in our mail system, contains a collection of emails)
    theInbox: null,

    //this is a drafts object (contains a collection of emails)
    theDrafts: null,

    //this is a sent object (contains a collection of sent emails)
    theSent: null,

    //this is a flagged object (contains a collection of flagged emails)
    theFlagged: null,

    numFlagged: 0,
    numUnreadFlagged: 0,
    numUnread: 0,
    numInbox: 0,
    numDrafts: 0,
    numSent: 0,
	emailAddress: null,

    //constants for the sort state
    ALL: 10,
    READ: 11,
    UNREAD: 12,
    FLAGGED: 13,
    UNFLAGGED: 14,

    //constants for the navbar state
    INBOX: 20,
    FLAGGED: 21,
    SENTMAIL: 22,
    DRAFTS: 23,

    //constants for display state
    COMPOSE: 30,
    VIEWMESSAGE: 31,

    pageNumber: 1,
    emailsOnPage: 50,
    selectedItem: 20,
    selectedFilter: 10,

    // this is the Email object constructor (will be used to create the object stored in theEmail)
    Email: function (ID, subject, senderEmail, senderName, receiverName, content, time, read, flagged, checked, isInbox) {
        "use strict";

        this.ID = (ID || null);
        this.subject = (subject || "");
        this.senderEmail = (senderEmail || "");
        this.senderName = (senderName || "");
		this.receiverName = (receiverName || "");
        this.content = (content || "");
        this.time = (time || "");
        this.read = (read || false);
        this.flagged = (flagged || false);
        this.checked = (checked || false);
        this.isInbox = (isInbox || false);
    },

    // this constructor will be used for soring a container of emails
    EmailList: function (emails) {
        "use strict";

        this.emails = (emails || null);
    }




};

Object.size = function (obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

EmailController.refreshInbox = function () {
    "use strict"
};

EmailController.navItemChanged = function () {
    "use strict"

    switch (EmailController.selectedItem) {
        case EmailController.INBOX:
            EmailController.displayEmailList(EmailController.theInbox, false, true); break;
        case EmailController.SENTMAIL:
            EmailController.displayEmailList(EmailController.theSent, true, false); break;
    }
};

EmailController.displayEmailList = function (emails, sent, isInbox2) {
    var emailList = document.getElementById("emailList");
    while (emailList.hasChildNodes()) {
        emailList.removeChild(emailList.lastChild);
    }


    (function () {
        var unreadcount = 0;
        var i;
        for (i = 0; i < Object.size(emails) ; i++) {
            var aTag = document.createElement('a');
            aTag.setAttribute('href', '#myModalEmail');
            if (emails[i].read == false && isInbox2 == true) {
                aTag.className = "list-group-item unread";
                unreadcount++;
            }
            else aTag.className = "list-group-item";

			aTag.setAttribute('id', emails[i].ID);
			aTag.setAttribute('data-toggle','modal');
			//aTag.setAttribute('id', emails[i].ID);
            /*var checkBox = document.createElement('div');
            checkBox.className = "checkbox";
            var label = document.createElement('label');
            var input = document.createElement('input');
            input.type = "checkbox";
            label.appendChild(input);
            checkBox.appendChild(label);
            aTag.appendChild(checkBox);*/

            var flag = document.createElement('span');
            flag.id = emails[i].ID;
            flag.className = "glyphicon glyphicon-flag";
            flag.setAttribute('onclick', 'markFlagged('+emails[i].ID+','+emails[i].flagged+');');
			//flag.style.display = "none";
            if (emails[i].flagged && isInbox2) //otherwise, flags would be messages all their own! :)
                flag.style.color = "red";
            aTag.appendChild(flag);
            //flag.style.visibility = "hidden";

            var name = document.createElement('span');
            name.className = "name";
            name.style.minWidth = "120px";
            name.style.display = "inline-block";
			if(!sent){
				name.innerHTML = emails[i].senderName;
			}
			else {
				name.innerHTML = emails[i].receiverName;
			}
            aTag.appendChild(name);

            var subject = document.createElement('span');
            subject.className = "";
            subject.innerHTML = emails[i].subject;
            if (emails[i].subject.length > 20) {
                subject.innerHTML = emails[i].subject.substr(0, 20) + "...";
            } else {
                subject.innerHTML = emails[i].subject;
            }
            aTag.appendChild(subject);

            var preview = document.createElement('span');
            preview.className = "text-muted";
            preview.style.fontSize = "11px";
            if (emails[i].content.length > 40) {
                preview.innerHTML = emails[i].content.substr(0, 40) + "...";
            } else {
                preview.innerHTML = emails[i].content;
            }
            aTag.appendChild(preview);

            var badge = document.createElement('span');
            badge.className = "pull-right";
            badge.innerHTML = emails[i].time;
            aTag.appendChild(badge);

            var read = document.createElement('span');
            read.className = "pull-right";

            var icon = document.createElement('span');
            icon.setAttribute('style', 'color: #337AB7;');
            if (!emails[i].read)
                read.appendChild(icon);
			if(sent) {
				read.style.visibility = "hidden";
			}
            aTag.appendChild(read);
			
			
			aTag.value = emails[i].ID;
			var identifier = "#" + emails[i].ID;
			aTag.onclick = function(){
				var ID = this.id;
				/*var receiver = document.getElementById("receiver").value;
				var subject = document.getElementById("subject").value;
				var message = document.getElementById("message").value;*/
				$.ajax({
					type: "GET",
					url: "getEmail.php",
					data: {i: ID, b: isInbox2},
					success: function(msg){
						var email = JSON.parse(msg);
						
						document.getElementById("myModalLabel2").innerHTML = email[0]["Sender"];
						document.getElementById("time").innerHTML = "Sent: " + email[0]["TimeSent"];
						document.getElementById("receiver2").innerHTML = "To: " + email[0]["Receiver"];
						document.getElementById("subject2").innerHTML = "Subject: " + email[0]["Subject"];
						document.getElementById("message2").innerHTML = email[0]["Content"];
						(function () {
							var i;
							for (i = 0; i < EmailController.numInbox; i++) {
								if(EmailController.theInbox[i].ID == ID)
								{
									EmailController.theInbox[i].read = true;
								}
							}
						})();
						EmailController.navItemChanged(EmailController.theInbox);
						
					},
					error: function(){
						alert("failure");
					}
				});
			};
			/*aTag.click(function(){
				var ID = emails[i].ID;
				/*var receiver = document.getElementById("receiver").value;
				var subject = document.getElementById("subject").value;
				var message = document.getElementById("message").value;
				$.ajax({
					type: "GET",
					url: "getEmail.php",
					data: {i: ID},
					success: function(msg){
						alert(msg[0]["Subject"]);
					},
					error: function(){
						alert("failure");
					}
				});
			});*/
			
			emailList.appendChild(aTag);

            if (isInbox2 == true)
                document.getElementById("inboxNum").innerHTML = unreadcount;

        }

    })();

    var links = document.getElementsByTagName("link");

    for (var x in links) {
        var link = links[x];

        if (link.getAttribute("type").indexOf("css") > -1) {
            link.href = link.href + "?id=" + new Date().getMilliseconds();
        }
    }
    
}

EmailController.clickCompose = function (evt) {
    "use strict"
    var x;
    x = 1;
};

EmailController.clickInbox = function (evt) {
    "use strict"
    var inbox = document.getElementById("inboxButton");
    var sentMail = document.getElementById("sentMailButton");

    inbox.className = "active";
    sentMail.className = "inactive";

    EmailController.refresh(evt);

    EmailController.selectedItem = EmailController.INBOX;
    EmailController.navItemChanged();
};

/*EmailController.clickFlagged = function (evt) {
    "use strict"
    var inbox = document.getElementById("inboxButton");
    var sentMail = document.getElementById("sentMailButton");
    var drafts = document.getElementById("draftsButton");
    var flagged = document.getElementById("flaggedButton");

    inbox.className = "inactive";
    sentMail.className = "inactive";
    drafts.className = "inactive";
    flagged.className = "active";

    EmailController.selectedItem = EmailController.FLAGGED;

    EmailController.theFlagged = new EmailController.Email();
    EmailController.numFlagged = 0;
    (function () {
        var i;
        for (i = 0; i < EmailController.numInbox; i++) {
            if (EmailController.theInbox[i].flagged) {
                EmailController.theFlagged[EmailController.numFlagged] = EmailController.theInbox[i];
                EmailController.numFlagged++;

            }
        }
    })();

    EmailController.navItemChanged();

};*/

EmailController.clickSentMail = function (evt) {
    "use strict"
    var inbox = document.getElementById("inboxButton");
    var sentMail = document.getElementById("sentMailButton");


    inbox.className = "inactive";
    sentMail.className = "active";

    EmailController.refresh(evt);

    EmailController.selectedItem = EmailController.SENTMAIL;
    EmailController.navItemChanged();
};

EmailController.refresh = function (evt) {
	var email = EmailController.emailAddress;
	
	$.ajax({
			type: "GET",
			url: "getInboxIds.php",
			data: {e: email},
			success: function(msg){
				var inbox = JSON.parse(msg);
				//$("#output").html(msg);
				//$("#myModal").modal('hide');
				
				EmailController.theInbox = new EmailController.Email();
				EmailController.numInbox = inbox.length;
				//Email: function (ID, subject, senderEmail, senderName, content, time, read, flagged, checked, isInbox) 
				(function () {
					var i;
					for(i = 0; i < inbox.length; i++) {
						var viewed, flagged;
						if(inbox[i]["Viewed"] == "0") {
							viewed = false;
						}
						else {
							viewed = true;
						}
						if(inbox[i]["Flagged"] == "0") {
							flagged = false;
						}
						else {
							flagged = true;
						}
						EmailController.theInbox[i] = new EmailController.Email(inbox[i]["ID"], inbox[i]["Subject"], inbox[i]["Sender"], inbox[i]["Sender"], inbox[i]["Receiver"], inbox[i]["Content"], inbox[i]["TimeRecieved"], viewed, flagged, false, true);
					}
				})();
				
				
				
			},
			error: function(){
				alert("failure");
			}
		}).done(function(){
			$.ajax({
				type: "GET",
				url: "getSentIds.php",
				data: {e: email},
				success: function(msg){
					var inbox = JSON.parse(msg);
					//$("#output").html(msg);
					//$("#myModal").modal('hide');
					
					EmailController.theSent = new EmailController.Email();
					EmailController.numSent = inbox.length;
					//Email: function (ID, subject, senderEmail, senderName, content, time, read, flagged, checked, isInbox) 
					(function () {
						var i;
						for(i = 0; i < inbox.length; i++) {
							var viewed, flagged;
							if(inbox[i]["Viewed"] == "0") {
								viewed = false;
							}
							else {
								viewed = true;
							}
							if(inbox[i]["Flagged"] == "0") {
								flagged = false;
							}
							else {
								flagged = true;
							}
							EmailController.theSent[i] = new EmailController.Email(inbox[i]["ID"], inbox[i]["Subject"], inbox[i]["Sender"], inbox[i]["Sender"], inbox[i]["Receiver"], inbox[i]["Content"], inbox[i]["TimeRecieved"], viewed, flagged, false, true);
						}
					})();
				
					EmailController.navItemChanged(EmailController.theInbox);
					
				},
				error: function(){
					alert("failure");
				}
			});	
		});
};

EmailController.clickDrafts = function (evt) {
    "use strict"
    var inbox = document.getElementById("inboxButton");
    var sentMail = document.getElementById("sentMailButton");
    var drafts = document.getElementById("draftsButton");
    var flagged = document.getElementById("flaggedButton");

    inbox.className = "inactive";
    sentMail.className = "inactive";
    drafts.className = "active";
    flagged.className = "inactive";

    EmailController.selectedItem = EmailController.DRAFTS;
    EmailController.navItemChanged();
};

/*EmailController.clickFlag = function (evt) {
    "use strict"

    if (evt.target.style.color == "red") {
        (function () {
            var i;
            for (i = 0; i < EmailController.numInbox; i++) {
                if (EmailController.theInbox[i].ID == evt.target.id) {
                    EmailController.theInbox[i].flagged = false;
                    if (!EmailController.theInbox[i].read)
                        EmailController.numUnreadFlagged--;
                    break;
                }
            }
            EmailController.numFlagged--;
            if (EmailController.numUnreadFlagged != 0)
                document.getElementById("flagNum").innerHTML = EmailController.numUnreadFlagged;
            else
                document.getElementById("flagNum").innerHTML = "";
        })();
        evt.target.style.color = "";
    }
    else {
        (function () {
            var i;
            for (i = 0; i < EmailController.numInbox; i++) {
                if (EmailController.theInbox[i].ID == evt.target.id) {
                    EmailController.theInbox[i].flagged = true;
                    if (!EmailController.theInbox[i].read)
                        EmailController.numUnreadFlagged++;
                    break;
                }
            }
            EmailController.numFlagged++;
            document.getElementById("flagNum").innerHTML = EmailController.numUnreadFlagged;
        })();
        evt.target.style.color = "red";
    }
};*/

window.onload = function () {
    EmailController.addEvent(document.getElementById('composeButton'), 'click', EmailController.clickCompose);
    EmailController.addEvent(document.getElementById("inboxButton"), 'click', EmailController.clickInbox);
    EmailController.addEvent(document.getElementById("sentMailButton"), 'click', EmailController.clickSentMail);
	EmailController.addEvent(document.getElementById("refreshButton"), 'click', EmailController.refresh);

    var flags = document.getElementsByClassName("glyphicon glyphicon-flag");
    (function () {
        var i;
        for (i = 0; i < flags.length; i++) {
            EmailController.addEvent(flags[i], 'click', EmailController.clickFlag);
        }
    })();
	
	$.ajax({
		type: "GET",
		url: "getEmailAddress.php",
		success: function(msg){
			EmailController.emailAddress = msg;
			document.getElementById("titleText").innerHTML = "TempMail / " + msg;
			document.getElementById("pagetitle").innerHTML = msg + " - TempMail";
			
		},
		error: function(){
			alert("failure");
		}
	}).done(function() {
	
	//EmailController.navItemChanged(EmailController.theInbox);
	var email = EmailController.emailAddress;
	
	$.ajax({
			type: "GET",
			url: "getInboxIds.php",
			data: {e: email},
			success: function(msg){
				var inbox = JSON.parse(msg);
				//$("#output").html(msg);
				//$("#myModal").modal('hide');
				
				EmailController.theInbox = new EmailController.Email();
				EmailController.numInbox = inbox.length;
				//Email: function (ID, subject, senderEmail, senderName, content, time, read, flagged, checked, isInbox) 
				(function () {
					var i;
					for(i = 0; i < inbox.length; i++) {
						var viewed, flagged;
						if(inbox[i]["Viewed"] == "0") {
							viewed = false;
						}
						else {
							viewed = true;
						}
						if(inbox[i]["Flagged"] == "0") {
							flagged = false;
						}
						else {
							flagged = true;
						}
						EmailController.theInbox[i] = new EmailController.Email(inbox[i]["ID"], inbox[i]["Subject"], inbox[i]["Sender"], inbox[i]["Sender"], inbox[i]["Receiver"], inbox[i]["Content"], inbox[i]["TimeRecieved"], viewed, flagged, false, true);
					}
				})();
				
				
				
			},
			error: function(){
				alert("failure");
			}
		}).done(function(){
			$.ajax({
				type: "GET",
				url: "getSentIds.php",
				data: {e: email},
				success: function(msg){
					var inbox = JSON.parse(msg);
					//$("#output").html(msg);
					//$("#myModal").modal('hide');
					
					EmailController.theSent = new EmailController.Email();
					EmailController.numSent = inbox.length;
					//Email: function (ID, subject, senderEmail, senderName, content, time, read, flagged, checked, isInbox) 
					(function () {
						var i;
						for(i = 0; i < inbox.length; i++) {
							var viewed, flagged;
							if(inbox[i]["Viewed"] == "0") {
								viewed = false;
							}
							else {
								viewed = true;
							}
							if(inbox[i]["Flagged"] == "0") {
								flagged = false;
							}
							else {
								flagged = true;
							}
							EmailController.theSent[i] = new EmailController.Email(inbox[i]["ID"], inbox[i]["Subject"], inbox[i]["Sender"], inbox[i]["Sender"], inbox[i]["Receiver"], inbox[i]["Content"], inbox[i]["TimeRecieved"], viewed, flagged, false, true);
						}
					})();
				
					EmailController.navItemChanged(EmailController.theInbox);
					
				},
				error: function(){
					alert("failure");
				}
			})	
			
			
		});
		});
		
	
	
	

    //this will use a database call to get the data for each email. For now it is simply hard coded in place
    /*EmailController.theInbox = new EmailController.Email();
    EmailController.theInbox[0] = new EmailController.Email("0", "Hello", "test@gcc.edu", "Hooper Colin", "Hi Jordan how are you?", "10:10 AM", false, true, false, true);
    EmailController.theInbox[1] = new EmailController.Email("1", "Hi!!!", "test@gcc.edu", "McFadden Barry", "Hi Jordan!!!!", "10:15 AM", false, false, false, true);
    EmailController.theInbox[2] = new EmailController.Email("2", "Subject Goes Here", "test@gcc.edu", "Kibler Sam", "So where is this deal happening?", "10:20 AM", true, false, false, true);
    EmailController.numInbox = 3;
    EmailController.numUnread = 2;
    EmailController.numUnreadFlagged = 1;*/

    //this will use a database call to get the data for each email draft. For now it is simply hard coded in place (will probably not fill this container on page load though and instead fill it when the Drafts nav item is clicked)
    /*EmailController.theDrafts = new EmailController.Email();
    EmailController.theDrafts[0] = new EmailController.Email("0", "My Draft", "test@gcc.edu", "Walsh Jordan", "Some day I should send this.", "12:07 PM", true, false, false, false);
    EmailController.theDrafts[1] = new EmailController.Email("1", "My Other Draft", "test@gcc.edu", "Walsh Jordan", "Some other day I should send this.", "11:11 AM", true, false, false,false);
    EmailController.numDrafts = 2;

    //this will use a database call to get the data for each sent email. For now it is simply hard coded in place (will probably not fill this container on page load though and instead fill it when the Sent Mail nav item is clicked)
    EmailController.theSent = new EmailController.Email();
    EmailController.theSent[0] = new EmailController.Email("0", "HI", "test@gcc.edu", "Walsh Jordan", "Hi Colin, I am well.", "10:30 AM", true, false, false, false);
    EmailController.numSent = 1;

    EmailController.theFlagged = new EmailController.Email();
    (function(){
        var i;
        var f = 0;
        for (i = 0; i < EmailController.numInbox; i++) {
            if (EmailController.theInbox[i].flagged) {
                EmailController.theFlagged[f] = EmailController.theInbox[i];
                f++;
                EmailController.numFlagged++;
            }
        }
    })();


    EmailController.navItemChanged(EmailController.theInbox);*/
    
};

function goBack() {
	location.replace("email_selector.html");
}

function setSender() {
	document.getElementById("sender").innerHTML = EmailController.emailAddress;
}

function markFlagged(ID, flagged) {
    if(EmailController.selectedItem == EmailController.INBOX) {
        $.ajax({
            type: "GET",
            url: "flagEmail.php",
            data: { i: ID, f: flagged },
            success: function (msg) {
                EmailController.refresh();
                //EmailController.navItemChanged();
            },
            error: function () {
                alert("failure");
            }
        });
    }
}

$(document).ready(function() {
	$("#submit").click(function(){
		var sender = document.getElementById("sender").innerHTML;
		var receiver = document.getElementById("receiver").value;
		var subject = document.getElementById("subject").value;
		var message = document.getElementById("message").value;
		$.ajax({
			type: "GET",
			url: "EmailPage.php",
			data: {s: sender, r: receiver, sub: subject, m: message},
			success: function(msg){
				$("#output").html(msg);
				$("#myModal").modal('hide');
			},
			error: function(){
				alert("failure");
			}
		});
		EmailController.refresh();
	});
});

