
let npbtData;

function toggleNewPostAnimations() {
    
    var npb = document.getElementById("newPostButton");
    var npbt = document.getElementById('newPostButtonText');
    var nfc = document.getElementById("hiddenFormContainer");

    if (npb.classList.contains("newPostButtonClicked")) {
        npb.classList.remove("newPostButtonClicked");
        npbt.innerHTML = npbtData;
    } else {
        npb.classList.add("newPostButtonClicked");
        npbtData = npbt.textContent;
        npbt.innerHTML = 'Close form';
    }

    if (nfc.classList.contains("hidden")) {
        nfc.classList.remove("hidden");
    } else {
        nfc.classList.add("hidden");
    }  

}

