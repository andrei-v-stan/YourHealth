window.addEventListener("load", () => {
    const countdown = document.getElementById("countdown");
    countdown.addEventListener("load", startCountdown());
  });

function startCountdown() {
    const countdown = document.getElementById("countdown");
    var countdownVal = parseInt(countdown.innerHTML);
  
    var countdownInterval = setInterval(() => {
      countdownVal--;
      countdown.innerHTML = countdownVal.toString();
  
      if (countdownVal === 0) {
        clearInterval(countdownInterval);
        window.location.href = "/";
      }
    }, 1000);
  }


function updateCookies(voteVal) {

  let cookiesArr = document.cookie.split(";");
  const accountIDVal = cookiesArr[0].split("=")[1];

  jQuery.ajax({
    type: 'GET',
    url: '/voteJson',
    data: {
      "accountID": accountIDVal,
      "vote": voteVal
    },
    success: function(response) {
        if (response.code == 200) {
          console.log('yay');
        } 
      },
    error: function() {
      console.log("[Error]: There was an error receiving the response from /voteJson in updateCookies()")
      alert('[Error]: Internal server error');
    }
  });
}



function voteFunction(postIDVal,voteVal) {
  jQuery.ajax({
    type: 'POST',
    url: '/votePost',
    data: {
      "postID": postIDVal,
      "vote": voteVal
    },
    success: function(response) {
        if (response.code == 200) {
          updateCookies(voteVal);
        } 
        else if (response.code == 401) {
          alert('You need to be signed in to like a post');
        } 
      },
    error: function() {
      console.log("[Error]: There was an error receiving the response from /votePost in voteFunction()")
      alert('[Error]: Internal server error');
    }
  });
}