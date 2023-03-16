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


  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(gpsPos);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  
  function gpsPos(position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    const acc = position.coords.accuracy;
    setInterval(() => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:3000/location');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({ lat, long, acc }));
    }, 3000000);
  }