function Validate() {
    if ((document.frm.usr.value=="") || (document.frm.pwd.value=="")) {
        alert("You must fill in both username and password!");
        return false;
    }
    else {
        return true;
    }
}