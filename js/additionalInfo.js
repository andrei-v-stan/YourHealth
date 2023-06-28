function copyToClipboard(option) {
    let text = "";
    const popupBox = document.getElementById("popupBox");
    popupBox.innerHTML = "There has been an error copying the user details";

    if (option) {
        text = "yourmindfii@gmail.com";
        popupBox.innerHTML = "Copied the username";
    }
    else {
        text = "Y0urMindF!!";
        popupBox.innerHTML = "Copied the password";
    }

    const elem = document.createElement('textarea');
    elem.value = text;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand('copy');
    document.body.removeChild(elem);


    const redirPopup = document.getElementById("redirectPopup");
    redirPopup.style.backgroundColor = "#8afc92"; 
    redirPopup.style.display = "block";
    setTimeout(function() {
        popupBox.innerHTML = "";
        redirPopup.style.display = "none"; 
        removePopup('reportPostPopup');
    }, 2000);
  }