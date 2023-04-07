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

  function createAndSet() {
	var tagId = 0;
    const newTagField = document.createElement("input");
    tagId = tagId + 1;
    newTagField.setAttribute("id", "tag-" + tagId);
    newTagField.setAttribute("type", "text");
    newTagField.setAttribute("name", "newTag");
    newTagField.setAttribute("value", '');
    
    const postForm = document.getElementById("postForm");
    const submitButton = postForm.querySelector("input[type='submit']");
    postForm.insertBefore(newTagField, submitButton);

    var buttonSpace = document.createElement("br");
    postForm.insertBefore(buttonSpace, submitButton);

    const disableField = document.getElementById("tag-" + (tagId-1));
    if (tagId > 1) {
      disableField.setAttribute("readonly", "readonly");
    }
  }



const searchTagField = document.getElementById('searchTag');
searchTagField.addEventListener('keyup', () => {

  const searchTagText = searchTagField.value.toLowerCase();
  const tagBoxes = document.querySelectorAll('#tagBoxes input[type="checkbox"]');

  tagBoxes.forEach((checkbox) => {
    if (checkbox.parentNode.textContent.toLowerCase().includes(searchTagText)) {
      checkbox.parentNode.style.display = 'block';
    } else {
      checkbox.parentNode.style.display = 'none';
    }
  });
});

