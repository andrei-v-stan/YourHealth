
function getAuthor() {
  const url = window.location.href;
  const userID = url.substring(url.lastIndexOf("/") + 1);

  return new Promise(function(resolve, reject) {
    jQuery.ajax({
      type: 'GET',
      url: "/getUser",
      data: {
        "inputDetails": userID
      },
      success: function(response) {
        if (response.code == 200) {
          resolve(response.user);
        } 
        else if (response.code == 500) {
          reject(new Error(response.errorText));
          alert("Internal server error");
        } 
        else {
          reject(new Error("[Error]: There has been an error receiving the response from /searchUser"));
          alert("Internal server error");
        }
      },
      error: function() {
        reject(new Error("[Error]: There has been an error parsing and receiving data from /searchUser"));
        alert("[Error]: Internal server error");
      }
    });
  });
}

function userData() {
  getAuthor()
  .then(function(user) {
    const disName = document.getElementById("displayName");
    const userName = document.getElementById("username");

    if (!user[0].displayName) {
      disName.innerHTML = "-----";
    }
    else {
      disName.innerHTML = user[0].displayName;
    }

    userName.innerHTML = user[0].username;
  })
  .catch(function(error) {
    console.error(error);
  });
}


function updateDetail(inputElement) {
  const url = window.location.href;
  const userID = url.substring(url.lastIndexOf("/") + 1);
  const updateDetail = inputElement.name;
  const updateText = inputElement.value;

  const redirPopup = document.getElementById("redirectPopup");
  const popupBox = document.getElementById("popupBox");

  jQuery.ajax({
    type: 'POST',
    url: '/updateUserDetail',
    data: {
      "userID": userID,
      "updateText": updateText,
      "updateDetail": updateDetail
    },
    success: function(response) {
        if (response.code == 200) {
          popupBox.innerHTML = `Name changed successfully!`;
          redirPopup.style.backgroundColor = "#8afc92"; 
          redirPopup.style.display = "block"; 
          setTimeout(function() {
            popupBox.innerHTML = "";
            redirPopup.style.display = "none"; 
            window.location.href = "/editingUser";
          }, 3000);
        } 
        else if (response.code == 500) {
          popupBox.innerHTML = `There has been an issue while changing your name`;
          redirPopup.style.backgroundColor = "#fc8a8a"; 
          redirPopup.style.display = "block"; 
          setTimeout(function() {
            popupBox.innerHTML = "";
            redirPopup.style.display = "none"; 
          }, 4000); 
          console.log(errorText);
        }  
        else {
          popupBox.innerHTML = `There has been an error while changing your name...<br>`;
          redirPopup.style.backgroundColor = "#fc8a8a"; 
          redirPopup.style.display = "block";
          console.log("[Error]: There has been an error receiving the response from /updateUserDetail");
          alert("[Error]: Internal server error"); 
        }
      },
    error: function() {
      console.log("[Error]: There has been an error parsing and receiving data from /updateUserDetail");
      alert("[Error]: Internal server error");
    }
  });
}




window.addEventListener('load', function handleWindowLoad() {
  userData();

  setTimeout(() => {
    window.removeEventListener('load', handleWindowLoad);
  }, 100);
});

