function Validate() {
    if ((document.frm.email.value!="") && ((document.frm.email.value.indexOf('@') == -1) ||
        (document.frm.email.value.indexOf('.') == -1)))  {
        alert("Please enter valid email address!");
        return false;
    }
    
    if ((document.frm.usr.value=="") || (document.frm.pwd.value=="") || (document.frm.pwd2.value=="")) {
        alert("You must fill in username and both passwords!");
        return false;
    }
    else if ((document.frm.pwd.value) != (document.frm.pwd2.value)) {
        alert("Your passwords must match!");
        return false;
    }
    else {
        return true;
    }
}