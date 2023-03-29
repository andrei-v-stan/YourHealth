window.addEventListener("load", () => {
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
  });