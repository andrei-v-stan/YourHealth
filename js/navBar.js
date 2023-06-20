
function getCookie(name) {
  const allCookies = document.cookie.split(';');
  for (let i = 0; i < allCookies.length; i++) {
    const selCookie = allCookies[i].trim();
    if (selCookie.startsWith(name + '=')) {
      return selCookie.substring(name.length + 1);
    }
  }
  return null;
}


function checkAccount() {
  if (getCookie("accountID")) {
    const profileButton = document.getElementById("profileButtonSection");
    profileButton.innerHTML = `<button id="profileButton" class="profileButtonIn" onclick="profileDropdown(this)"></button>`;
    profileButton.style.backgroundImage =  "/Resources/navbar/profileQuestion.png";
    const dropdownLog = document.getElementById("dropdownLoginOut");
    dropdownLog.setAttribute("onclick", "logoutProfile()");
    dropdownLog.innerHTML = `<img src="/Resources/navbar/logoutButton.png" alt="Logout button"></img> <p>Logout</p>`;
    const userDropdownSel = document.getElementById("userDropdownSel");
    userDropdownSel.href += getCookie("accountID");
  }
  else {
    window.location.href = "/missingLogin";
    /*
    const profileButton = document.getElementById("profileButtonSection");
    profileButton.innerHTML = `<button id="profileButton" class="profileButtonOut" onclick="profileDropdown(this)"></button>`;
    const dropdownLog = document.getElementById("dropdownLoginOut");
    dropdownLog.setAttribute("onclick", "loginPopup()");
    dropdownLog.innerHTML = `<img src="/Resources/navbar/loginButton.png" alt="Login button"></img> <p>Login</p>`;

    const newSignup = document.createElement("a");
    newSignup.href = "#";
    newSignup.setAttribute("onclick", "signupPopup()");
    newSignup.innerHTML = `<img src="/Resources/navbar/signupButton.png" alt="Signup button"></img> <p>Signup</p>`;
    dropdownLog.parentNode.insertBefore(newSignup, dropdownLog.nextSibling);
    */
  }
}



async function preciseLocation(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const apiKey = 'AIzaSyAiwCtIK0N-dXk1-gVsRtpKlRy2cmGG63k';
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const locationData = await response.json();

    if (locationData.status == 'OK') {
      return { success: true, location: locationData.results[1].geometry.location, data: locationData };
    } 
    else {
      return { success: false, location: { latitude, longitude }, data: '' };
    }
  } 
  catch (error) {
    console.log("[Error]: " + error);
    return { success: false, location: { latitude, longitude }, data: '' };
  }
}


async function setLocation(position) {
  try {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    let acc = position.coords.accuracy;

    const { success, location, data } = await preciseLocation(position);

    if (success) {
      lat = location.lat;
      lng = location.lng;
      acc = 1.000;
    }

    const accID = getCookie("accountID");
    if (accID) {
      let request = new XMLHttpRequest();
      request.open('POST', 'http://localhost:3000/updateLocation');
      request.setRequestHeader('Content-Type', 'application/json');
      request.send(JSON.stringify({ lat, lng, acc, accID }));
    }

  } catch (error) {
    console.log(error);
  }
}


function checkLocation() {
  const popup = document.getElementById("hideBody");
  popup.style.display = "flex";
  popup.classList.add('active');

  if (navigator.geolocation) {
    popup.classList.remove('active');
    popup.classList.add('inactive');
    setTimeout(() => {
      popup.classList.remove('active');
      popup.style.display = 'none';
    }, 250);

    navigator.geolocation.getCurrentPosition(setLocation);
  } 
  else {
    alert("Location tracking must be enabled to use this website");
    window.location.href = "/";
  }
}





function toggleSearchPost() {
  const searchTopNav = document.getElementById("searchTopNavbar");
  if (!searchTopNav.classList.contains('active')) {
    searchTopNav.style.display = "flex";
    searchTopNav.classList.add('active');
      if (searchTopNav.classList.contains('inactive')) {
        searchTopNav.classList.remove('inactive');
      }
      setTimeout(() => {
        document.addEventListener('click', handleToggleSearchPost);
      }, 100);
  }
} 

function handleToggleSearchPost() {
  const searchTopNav = document.getElementById("searchTopNavbar");
  if (!event.target.closest('#searchTopNavbar') && !event.target.closest('.tagBox')) {    
      document.getElementById('dropdownTags').style.display = "none";
      searchTopNav.classList.add('inactive');
      searchTopNav.addEventListener('animationend', function() {
        searchTopNav.removeEventListener('animationend', arguments.callee);
        searchTopNav.style.display = "none";
        searchTopNav.classList.remove('active');
      });
      document.removeEventListener('click', handleToggleSearchPost);
  }
} 

function toggleCreatePost() {
  const createTopNav = document.getElementById("createTopNavbar");
  if (!createTopNav.classList.contains('active')) {
    createTopNav.style.display = "flex";
    createTopNav.classList.add('active');
      if (createTopNav.classList.contains('inactive')) {
        createTopNav.classList.remove('inactive');
      }
      setTimeout(() => {
        document.addEventListener('click', handleToggleCreatePost);
      }, 100);
  }
} 

function handleToggleCreatePost() {
  const createTopNav = document.getElementById("createTopNavbar");
  if (!event.target.closest('#createTopNavbar') && !event.target.closest('#createPostTags') && !event.target.closest('.createTagButton')) {    
      document.getElementById('dropdownTags').style.display = "none";
      createTopNav.classList.add('inactive');
      createTopNav.addEventListener('animationend', function() {
        createTopNav.removeEventListener('animationend', arguments.callee);
        createTopNav.style.display = "none";
        createTopNav.classList.remove('active');
      });
      document.removeEventListener('click', handleToggleCreatePost);
  }
} 






function getFilters() {
  jQuery.ajax({
      type: 'GET',
      url: `/getFilters`,
      success: function(response) {
          if (response.code == 200) {
              tags = response.tags;
              if (typeof tags !== 'undefined') {

                  let container = document.getElementById('tagsContainer');
                  container.innerHTML = '';

                  let containerCreate = document.getElementById('createTagsContainer');
                  containerCreate.innerHTML = '';
                  containerCreate.innerHTML += '<input type="text" id="searchCreateTag" placeholder="Search a tag..." oninput="filterCreateTags()">\n';

                  tags.forEach((tag) => {
                      containerCreate.innerHTML += `<button onclick="setTagInput(this)" >${tag.title}</button>\n`

                      let tagElement = document.createElement('label');
                      tagElement.id = `dropdownTag-${tag.id}`;
                      tagElement.innerHTML = `<input id="ddElem_${tag.title}" type="checkbox" name="filters" value="${tag.title}" onclick="checkLabel('dropdownTag-${tag.id}')" >${tag.title}`;
                      container.appendChild(tagElement);
                  });


              }
          }
          else if (response.code == 500) {
            console.log(response.errorText);
            alert("[Error]: " + response.errorText);
          }
          else {
            console.log("[Error]: There has been an error receiving the response from /getFilters")
            alert("[Error]: Internal server error");
          }
      },
      error: function() {
          console.log("[Error]: There has been an error parsing and receiving data from /getFilters")
          alert("[Error]: Internal server error");
      }
  });
}











function showPass(button,fieldID) {
  const field = document.getElementById(fieldID);
  if (field.type == "password") {
    field.type = "showPassword";
    button.style.backgroundImage = "url('../Resources/account/eyeClose.png')";
  } else {
    field.type = "password";
    button.style.backgroundImage = "url('../Resources/account/eye.png')";
  }
}


function signupRuleBox(input,usage) {
  const errorBubble = document.getElementById(`${input.id}Error`);
  if (usage == 0) {
    if (errorBubble.innerHTML != "") {
      errorBubble.style.display = "block";
    }
    else if (errorBubble.innerHTML == "") {
      errorBubble.style.display = "none";
    }
  }
  else if (usage == 1) {
    errorBubble.style.display = "none";
  }
}



// ----- Popup functions (START)  ----- >>

const accForms = document.getElementById('accountForms');
const accFormsNav = document.getElementById('accountFormsNavbar');

function accPopup() {
  accForms.style.display = "flex";
  accForms.classList.add('active');
  accFormsNav.classList.add('active');
}

function removePopup(popupName) {
  const popup = document.getElementById(popupName);
  accForms.classList.remove('active');
  accForms.classList.add('inactive');

  setTimeout(() => {
    accFormsNav.classList.remove('active');
    popup.classList.remove('active');
    accForms.classList.remove('inactive');
    popup.style.display = 'none';
    accForms.style.display = 'none';
  }, 250);
}

const loginPop = document.getElementById('loginPopup');
function loginPopup() {
  if (accForms.style.display != "flex") {
    accPopup();
  }

  if (localStorage.getItem("loginUser")) {
    document.getElementById("loginUsername").value = localStorage.getItem("loginUser");
    document.getElementById('loginRememberMe').checked = true;
  }

  accForms.style.backgroundColor = "#acbfe5";
  accFormsNav.style.backgroundColor = "#5a82d1";
  accFormsNav.querySelector("button").style.backgroundColor = "#2c57ae";

  loginPop.style.display = "flex";
  loginPop.classList.add('active');
}

const signupPop = document.getElementById('signupPopup');
function signupPopup() {  
  if (accForms.style.display != "flex") {
    accPopup();
  }
  accForms.style.backgroundColor = "#acd3e5";
  accFormsNav.style.backgroundColor = "#5aa7d1";
  accFormsNav.querySelector("button").style.backgroundColor = "#2c83ae";

  signupPop.style.display = "flex";
  signupPop.classList.add('active');
}

function toSignup() {
  loginPop.classList.remove('active');
  loginPop.classList.add('inactive');
  setTimeout(() => {
    loginPop.style.display = "none";
    loginPop.classList.remove('inactive');
  }, 750);
  signupPopup();
}

function signupBackLogin() {
  signupPop.classList.remove('active');
  signupPop.classList.add('inactive');
  setTimeout(() => {
    signupPop.style.display = "none";
    signupPop.classList.remove('inactive');
  }, 750);
  loginPopup();
}

const reportPop = document.getElementById('reportPostPopup');
function reportPopup(postID) {
  if (accForms.style.display != "flex") {
    accPopup();
  }
  accForms.style.backgroundColor = "#acafe5";
  accFormsNav.style.backgroundColor = "#5a62d1";
  accFormsNav.querySelector("button").style.backgroundColor = "#2c2eae";

  reportPop.style.display = "flex";
  reportPop.classList.add('active');

  subReport = document.getElementById("submitReport");
  subReport.setAttribute("onclick", `event.preventDefault(); submitReport(${postID});`);
}


const recoveryPop = document.getElementById('recoveryPopup');
function recoveryPopup() {  
  if (accForms.style.display != "flex") {
    accPopup();
  }
  accForms.style.backgroundColor = "#acafe5";
  accFormsNav.style.backgroundColor = "#5a62d1";
  accFormsNav.querySelector("button").style.backgroundColor = "#2c2eae";

  recoveryPop.style.display = "flex";
  recoveryPop.classList.add('active');
}

function toRecovery() {
  loginPop.classList.remove('active');
  loginPop.classList.add('inactive');
  setTimeout(() => {
    loginPop.style.display = "none";
    loginPop.classList.remove('inactive');
  }, 750);
  recoveryPopup();
}

function recoveryBackLogin() {
  recoveryPop.classList.remove('active');
  recoveryPop.classList.add('inactive');
  setTimeout(() => {
    recoveryPop.style.display = "none";
    recoveryPop.classList.remove('inactive');
  }, 750);
  loginPopup();
}

const passSection = document.getElementById("passwordSectionPopup");
function passwordSectionPopup() {  
  recoveryPop.classList.remove('active');
  recoveryPop.classList.add('inactive');
  setTimeout(() => {
    recoveryPop.style.display = "none";
    recoveryPop.classList.remove('inactive');
  }, 750);
  passSection.style.display = "flex";
  passSection.classList.add('active');
}

function passToRecovery() {
  passSection.classList.remove('active');
  passSection.classList.add('inactive');
  setTimeout(() => {
    passSection.style.display = "none";
    passSection.classList.remove('inactive');
  }, 750);
  recoveryPop.style.display = "flex";
  recoveryPop.classList.add('active');
}

const contSection = document.getElementById("contactSectionPopup");
function contactSectionPopup() {
  if (accForms.style.display != "flex") {
    accPopup();
  }  
  accForms.style.backgroundColor = "#acafe5";
  accFormsNav.style.backgroundColor = "#5a62d1";
  accFormsNav.querySelector("button").style.backgroundColor = "#2c2eae";

  recoveryPop.classList.remove('active');
  recoveryPop.classList.add('inactive');
  setTimeout(() => {
    recoveryPop.style.display = "none";
    recoveryPop.classList.remove('inactive');
  }, 750);
  contSection.style.display = "flex";
  contSection.classList.add('active');
}
function contactToRecovery() {
  contSection.classList.remove('active');
  contSection.classList.add('inactive');
  setTimeout(() => {
    contSection.style.display = "none";
    contSection.classList.remove('inactive');
  }, 750);
  recoveryPop.style.display = "flex";
  recoveryPop.classList.add('active');
}


function showPasswordForm() {
  const passSection = document.getElementById("passwordSectionPopup");
  const contSection = document.getElementById("contactSectionPopup");
  if (contSection.style.display == "flex") {
    contSection.style.display = "none";
  }
  passSection.style.display = "flex";
}

function showContactForm() {
  const contSection = document.getElementById("contactSectionPopup");
  const passSection = document.getElementById("passwordSectionPopup");
  if (passSection.style.display == "flex") {
    passSection.style.display = "none";
  }
  contSection.style.display = "flex";
}



// ----- Popup functions (END) -----



// ----- Auto input checks (START) -----

function checkSignupUser() {
  if (signupUsernameCheckAuto(1) == 1) {
    signupUsernameCheck();
  }
}

function checkSignups(field,confirm) {
  const input = document.getElementById(field);
  const inputConfirm = document.getElementById(confirm);
  const errorBubble = document.getElementById(`${confirm}Error`);

  if (input.value != inputConfirm.value) {
    inputConfirm.style.backgroundColor = "#ed9595";
    if (confirm == "signupPasswordConfirm" || confirm == "changePasswordConfirm") {
      errorBubble.innerHTML = `The passwords do not match<br>`;
    }
    else if (confirm == "signupEmailConfirm") {
      errorBubble.innerHTML = `The email addresses do not match<br>`;
    }
  }
  else if (input.value == inputConfirm.value) {
    inputConfirm.style.backgroundColor = "#ecffff";
    errorBubble.innerHTML = "";
  }
}


function ctOnes(vector) {
  let count = 0;
  for (i = 0; i < vector.length; i++) {
    if (vector[i] == 1) {
      count++;
    }
  }
  return count;
}

function signupUsernameCheckAuto(usage) {
  let valid = 1;
  const usernameInput = document.getElementById("signupUsername");
  const errorBubble = document.getElementById("signupUsernameError");

  const errors = signupUsernameRules(usernameInput.value);
  errorBubble.innerHTML = "";

  if (ctOnes(errors) == 0) {
    usernameInput.style.backgroundColor = "#ecffff";
    errorBubble.innerHTML = "";
    document.getElementById 
  }
  else {
    usernameInput.style.backgroundColor = "#ed9595";
    if (errors[0] == 1) {
      errorBubble.innerHTML = `Your username must have between 6 and 128 characters<br>`;
    }
    if (errors[1] == 1) {
      errorBubble.innerHTML = errorBubble.innerHTML + `Your username cannot contain characters outside of alphanumeric characters and "- . _"<br>`;
    }
    if (errors[2] == 1) {
      errorBubble.inner
      errorBubble.innerHTML = errorBubble.innerHTML + `Your username cannot start/end with non-alphanumeric characters<br>`;
    }
    if (errors[3] == 1) {
      errorBubble.innerHTML = errorBubble.innerHTML + `Your username must contain at least 2 alphanumeric characters<br>`;
    }
    valid = 0;
  }
  if (usage == 1) {
    return valid;
  }
}

function signupPasswordCheckAuto(usage,idSet) {
  let valid = 1;
  let passwordInput;
  let errorBubble;

  if (idSet == 0) {
    passwordInput = document.getElementById("signupPassword");
    errorBubble = document.getElementById("signupPasswordError");
  }
  else if (idSet == 1) {
    passwordInput = document.getElementById("changePassword");
    errorBubble = document.getElementById("changePasswordError");
  }


  const errors = signupPasswordRules(passwordInput.value);
  errorBubble.innerHTML = "";
  
  if (ctOnes(errors) == 0) {
    passwordInput.style.backgroundColor = "#ecffff";
    errorBubble.innerHTML = "";
  }
  else {
    passwordInput.style.backgroundColor = "#ed9595";
    if (errors[0] == 1) {
      errorBubble.innerHTML = `Your password must have between 8 and 128 characters<br>`;
    }
    if (errors[1] == 1) {
      errorBubble.innerHTML = errorBubble.innerHTML + `Your password cannot contain characters outside the EN-US keyboard or spaces<br>`;
    }
    if (errors[2] == 1) {
      errorBubble.inner
      errorBubble.innerHTML = errorBubble.innerHTML + `Your password must contain at least 1 uppercase letter<br>`;
    }
    if (errors[3] == 1) {
      errorBubble.innerHTML = errorBubble.innerHTML + `Your password must contain at least 1 lowercase letter<br>`;
    }
    if (errors[4] == 1) {
      errorBubble.innerHTML = errorBubble.innerHTML + `Your password must contain at least 1 number<br>`;
    }
    valid = 0;
  }
  if (usage == 1) {
    return valid;
  }
}

function signupEmailCheckAuto(usage) {
  let valid = 1;
  const emailInput = document.getElementById("signupEmail");
  const errorBubble = document.getElementById("signupEmailError");

  const errors = signupEmailRules(emailInput.value);
  errorBubble.innerHTML = "";
  
  if (ctOnes(errors) == 0) {
    emailInput.style.backgroundColor = "#ecffff";
    errorBubble.innerHTML = "";
  }
  else {
    emailInput.style.backgroundColor = "#ed9595";
    if (errors[0] == 1) {
      errorBubble.innerHTML = `Please enter a valid email address<br>`;
    }
    valid = 0;
  }
  if (usage == 1) {
    return valid;
  }
}

// ----- Auto input checks (END) -----



// ----- Input rules (START) -----

function signupUsernameRules(username) {
  const regex = new RegExp("^(?=[a-zA-Z0-9])[a-zA-Z0-9._-]{4,126}(?<=[a-zA-Z0-9])$");
  
  let errors = [0,0,0,0];
  if (username.length < 6 || username.length > 128) {
      errors[0] = 1;
  }

  var regexp;
  if (regex.test(username) == false) {
      regexp = /[^a-zA-Z0-9._-]/;
      if (regexp.test(username) == true) {
          errors[1] = 1;
      }
      regexp = /^[a-zA-Z0-9].*[a-zA-Z0-9]$/;
      if (regexp.test(username) == false) {
          errors[2] = 1;
      }
      regexp = /^(?=.*[a-zA-Z0-9].*[a-zA-Z0-9]).+$/;
      if (regexp.test(username) == false) {
          errors[3] = 1;
      }
  }

  return errors;
}

function signupPasswordRules(password) {
  const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[\x21-\x7E]{8,128}$/;
  
  let errors = [0,0,0,0,0]
  if (regex.test(password) == false) {
      var regexp;
      if (password.length < 8 || password.length > 128) {
        errors[0] = 1;
      }
      regexp = /[^\x21-\x7E]/;
      if (regexp.test(password) == true) {
        errors[1] = 1;
      }
      regexp = /[A-Z]/;
      if (regexp.test(password) == false) {
        errors[2] = 1;
      }
      regexp = /[a-z]/;
      if (regexp.test(password) == false) {
        errors[3] = 1;
      }
      regexp = /[0-9]/;
      if (regexp.test(password) == false) {
        errors[4] = 1;
      }
  }
  return errors;
}

function signupEmailRules(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,250}$/;
  
  errors = [0];
  if (regex.test(email) == false) {
    errors[0] = 1;
  }
  return errors;
}

// ----- Input rules (END) -----



// ----- Username & Email check using DB (START) -----

function signupUsernameCheck(usage) {
  event.preventDefault();
  let valid = 1;
  const usernameInput = document.getElementById("signupUsername");
  const errorBubble = document.getElementById("signupUsernameError");

    return new Promise((resolve, reject) => {
      jQuery.ajax({
        type: "GET",
        url: "/signupUsernameCheck",
        data: {
          username: usernameInput.value,
        },
        success: function (response) {
          if (response.code == 200) {
            usernameInput.style.backgroundColor = "#7ad177";
            errorBubble.innerHTML = "";          
          } 
          else if (response.code == 100) {
            usernameInput.style.backgroundColor = "#f0f78d";
            errorBubble.innerHTML = `The username is currently taken<br>`;
            valid = 0;
          } 
          else if (response.code == 500) {
            console.log(response.errorText);
            alert("[Error]: " + response.errorText);
            reject("[Error]: " + response.errorText);
          }
          else {
            console.log("[Error]: There has been an error receiving the response from /signupUsernameCheck")
            alert("[Error]: Internal server error");
            reject("[Error]: Internal server error");
          }

          if (usage == 1) {
            resolve(valid);
          }
        },
        error: function () {
          console.log("[Error]: There has been an error parsing and receiving data from /signupUsernameCheck")
          alert("[Error]: Internal server error");
          reject("[Error]: Internal server error");
        },
      });
    });
}
  
function signupEmailCheck(usage) {
  let valid = 1;
  const emailInput = document.getElementById("signupEmail");
  const errorBubble = document.getElementById("signupEmailError");

  return new Promise((resolve, reject) => {
    jQuery.ajax({
      type: "POST",
      url: "/signupEmailCheck",
      data: {
        email: emailInput.value,
      },
      success: function (response) {
        if (response.code == 200) {
          emailInput.style.backgroundColor = "#7ad177";
          errorBubble.innerHTML = "";      
        } 
        else if (response.code == 100) {
          emailInput.style.backgroundColor = "#f0f78d";
          errorBubble.innerHTML = `The email is currently in use<br>`;
          valid = 0;
        }
        else if (response.code == 500) {
          console.log(response.errorText);
          alert("[Error]: " + response.errorText);
          reject("[Error]: " + response.errorText);
        }
        else {
          console.log("[Error]: There has been an error receiving the response from /signupEmailCheck")
          alert("[Error]: Internal server error");
          reject("[Error]: Internal server error");
        }

        if (usage == 1) {
          resolve(valid);
        }
      },
      error: function () {
        console.log("[Error]: There has been an error parsing and receiving data from /signupEmailCheck");
        alert("[Error]: Internal server error");
        reject("[Error]: Internal server error");
      },
    });
  });
}

// ----- Username & Email check using DB (END) -----



// ----- Signup data entry (START) -----

function signupForm() {
    event.preventDefault();
    const formData = new FormData(document.getElementById("signupForm"));
    const formVar = {
        "username": formData.get("username"),
        "password": formData.get("password"),
        "passwordConfirm": formData.get("passwordConfirm"),
        "email": formData.get("email"),
        "emailConfirm": formData.get("emailConfirm")
    };

    const passwordErrorBubble = document.getElementById("signupPasswordError");
    const emailErrorBubble = document.getElementById("signupEmailError");
    const passwordCon = document.getElementById("signupPasswordConfirm");
    const emailCon = document.getElementById("signupEmailConfirm");
    const passwordConErrorBubble = document.getElementById("signupPasswordConfirmError");
    const emailConErrorBubble = document.getElementById("signupEmailConfirmError");

    if (formData.get("password") != formData.get("passwordConfirm")) {
      passwordCon.style.backgroundColor = "#ed9595";
      passwordConErrorBubble.innerHTML = `The passwords do not match<br>`;
    }
    else if (formData.get("email") != formData.get("emailConfirm")) {
      emailCon.style.backgroundColor = "#ed9595";
      emailConErrorBubble.innerHTML = `The email addresses do not match<br>`;
    }
    else if (signupUsernameCheckAuto(1) == 1 && signupPasswordCheckAuto(1,0) == 1 && signupEmailCheckAuto(1) == 1) {
      Promise.all([signupUsernameCheck(1), signupEmailCheck(1)]).then(function(results) {
        if (results[0] === 1 && results[1] === 1) {
          jQuery.ajax({
            type: 'POST',
            url: '/signup',
            data: formVar,
            success: function(response) {
              const redirPopup = document.getElementById("redirectPopup");
              const popupBox = document.getElementById("popupBox");
              if (response.code == 200) {
                popupBox.innerHTML = `Account created successfully!<br>Redirecting...`;
                redirPopup.style.backgroundColor = "#8afc92"; 
                redirPopup.style.display = "block";
                document.cookie = "accountID=" + response.accID + ";path=/";
                setTimeout(function() {
                  popupBox.innerHTML = "";
                  redirPopup.style.display = "none"; 
                  window.location.href = "/";
                }, 3000);
              } 
              else if (response.code == 500) {
                popupBox.innerHTML = `There has been an error while creating your account...<br>`;
                redirPopup.style.backgroundColor = "#fc8a8a"; 
                redirPopup.style.display = "block"; 
              }
              else {
                console.log("[Error]: There has been an error receiving the response from /signup")
                alert("[Error]: Internal server error");
              }
            },
            error: function() {
              console.log("[Error]: There has been an error parsing and receiving data from /signup");
              alert("[Error]: Internal server error");
            }
          });
        }       
      });
    }
}

// ----- Signup data entry (END) -----



function loginForm() {
  event.preventDefault();
  const formData = new FormData(document.getElementById("loginForm"));
  const formVar = {
      "username": formData.get("username"),
      "password": formData.get("password")
  };

  const rememberMe = document.getElementById("loginRememberMe");
  if (rememberMe.checked == true) {
    localStorage.setItem("loginUser", formVar.username);
  }
  else {
    localStorage.removeItem("loginUser");
  }

  jQuery.ajax({
    type: 'POST',
    url: '/login',
    data: formVar,
    success: function(response) {
      const redirPopup = document.getElementById("redirectPopup");
      const popupBox = document.getElementById("popupBox");
      if (response.code == 200) {
        popupBox.innerHTML = `Logged in successfully!<br>Redirecting...`;
        redirPopup.style.backgroundColor = "#8afc92"; 
        redirPopup.style.display = "block";
        document.cookie = "accountID=" + response.accID + ";path=/";
        setTimeout(function() {
          popupBox.innerHTML = "";
          redirPopup.style.display = "none"; 
          window.location.href = "/";
        }, 3000);
      } 
      else if (response.code == 406) {
        popupBox.innerHTML = `Invalid username or password<br>`;
        redirPopup.style.backgroundColor = "#fc8a8a"; 
        redirPopup.style.display = "block"; 
        setTimeout(function() {
          popupBox.innerHTML = "";
          redirPopup.style.display = "none"; 
        }, 2000); 
      } 
      else {
        popupBox.innerHTML = `There has been an error while logging in to your account...<br>`;
        redirPopup.style.backgroundColor = "#fc8a8a"; 
        redirPopup.style.display = "block";
        setTimeout(function() {
          popupBox.innerHTML = "";
          redirPopup.style.display = "none"; 
        }, 2000); 
        console.log("[Error]: There has been an error receiving the response from /login")
        alert("[Error]: Internal server error");
      }
    },
    error: function() {
      console.log("[Error]: There has been an error parsing and receiving data from /login");
      alert("[Error]: Internal server error");
    }
  });
}



function checkEmail(usage,input) {
  let valid = 1;
  let recEmail;

  if (input == 0) {
    recEmail = document.getElementById("recoveryEmail");
  }
  else if (input == 1) {
    recEmail = document.getElementById("contactEmail");
  }

  const checkEmail = signupEmailRules(recEmail.value)[0];
  if (checkEmail == 0) {
    recEmail.style.backgroundColor = "#f2ecff"
  }
  else if (checkEmail == 1) {
    recEmail.style.backgroundColor = "#ed9595"
    valid = 0;
  }

 if (usage == 1) {
    return valid;
  }
}





function recoverPasswordForm() {
  event.preventDefault();
  const formData = new FormData(document.getElementById("recoverPasswordForm"));
  const formVar = {
      "email": formData.get("email")
  };

  if (checkEmail(1,0) == 1) {
    const emailProvider = formVar.email.substring(formVar.email.lastIndexOf('@') + 1);
    jQuery.ajax({
      type: 'POST',
      url: '/recoverPass',
      data: formVar,
      success: function(response) {
        const redirPopup = document.getElementById("redirectPopup");
        const popupBox = document.getElementById("popupBox");
        if (response.code == 200) {
          popupBox.innerHTML = "Email sent successfully!<br>Redirecting...";
          redirPopup.style.backgroundColor = "#8afc92"; 
          redirPopup.style.display = "block";
          setTimeout(function() {
            window.open(
              `https://www.google.com/search?q=${encodeURIComponent(emailProvider)}`,  
              '_blank'
            );
            popupBox.innerHTML = "";
            redirPopup.style.display = "none"; 
            window.location.href = "/";
          }, 3000);
        } 
        else if (response.code == 404) {
          popupBox.innerHTML = `There is no account registered with this email address<br>`;
          redirPopup.style.backgroundColor = "#fc8a8a"; 
          redirPopup.style.display = "block"; 
          setTimeout(function() {
            popupBox.innerHTML = "";
            redirPopup.style.display = "none"; 
          }, 4000); 
        }
        else if (response.code == 412) {
          popupBox.innerHTML = `There has been an issue while sending the email<br>`;
          redirPopup.style.backgroundColor = "#fc8a8a"; 
          redirPopup.style.display = "block"; 
          setTimeout(function() {
            popupBox.innerHTML = "";
            redirPopup.style.display = "none"; 
          }, 4000); 
        }  
        else {
          popupBox.innerHTML = `There has been an error while sending the email request...<br>`;
          redirPopup.style.backgroundColor = "#fc8a8a"; 
          redirPopup.style.display = "block"; 
        }
      },
      error: function() {
        console.log("[Error]: There has been an error receiving the response from /recoverPass")
        alert('[Error]: Internal server error');
      }
    });
  }
}



function mailContactForm() {
  event.preventDefault();
  const formData = new FormData(document.getElementById("contactForm"));
  
  let mailTopic = parseInt(formData.get("topic"));
  switch (mailTopic) {
    case 1:
      mailTopic = "Account recovery";
      break;
    case 2:
      mailTopic = "Bug report";
      break;
    case 3:
      mailTopic = "Other";
      break;
    default:
      mailTopic = "Topic not selected";
      break;
  }
  
  const formVar = {
      "contactName": formData.get("fullname"),
      "emailAddr": formData.get("email"),
      "contactTopic": mailTopic,
      "emailMessage": formData.get("message")
  };

  if (checkEmail(1,1) == 1) {
    jQuery.ajax({
      type: 'POST',
      url: '/mailContactForm',
      data: formVar,
      success: function(response) {
        const redirPopup = document.getElementById("redirectPopup");
        const popupBox = document.getElementById("popupBox");
        if (response.code == 200) {
          popupBox.innerHTML = `Email sent successfully!<br>Redirecting...`;
          redirPopup.style.backgroundColor = "#8afc92"; 
          redirPopup.style.display = "block";
          setTimeout(function() {
            popupBox.innerHTML = "";
            redirPopup.style.display = "none"; 
            window.location.href = "/";
          }, 3000);
        } 
        else if (response.code == 412) {
          popupBox.innerHTML = `There has been an issue while sending the email<br>`;
          redirPopup.style.backgroundColor = "#fc8a8a"; 
          redirPopup.style.display = "block"; 
          setTimeout(function() {
            popupBox.innerHTML = "";
            redirPopup.style.display = "none"; 
          }, 4000); 
          console.log(response.errorText);
        }  
        else {
          popupBox.innerHTML = `There has been an error while sending the email request...<br>`;
          redirPopup.style.backgroundColor = "#fc8a8a"; 
          redirPopup.style.display = "block";
          console.log("[Error]: There has been an error receiving the response from /mailContactForm");
          alert("[Error]: Internal server error");
        }
      },
      error: function() {
        console.log("[Error]: There has been an error parsing and receiving data from /mailContactForm");
        alert("[Error]: Internal server error");
      }
    });
  }
}



function changePasswordForm(passCode,codeEmail) {
  event.preventDefault();
  const formData = new FormData(document.getElementById("changePasswordForm"));
  const formVar = {
      "password": formData.get("password"),
      "email": codeEmail,
      "genCode": passCode
  };
  const redirPopup = document.getElementById("changeRedirectPopup");
  const popupBox = document.getElementById("changePopupBox");

   if (signupPasswordCheckAuto(1,1) == 1 && formVar.password == formData.get("passwordConfirm")) {
      jQuery.ajax({
          type: 'POST',
          url: '/changePass',
          data: formVar,
          success: function(response) {
              if (response.code == 200) {
                popupBox.innerHTML = `Password changed successfully!<br>Redirecting...`;
                redirPopup.style.backgroundColor = "#8afc92"; 
                redirPopup.style.display = "block"; 
                setTimeout(function() {
                  popupBox.innerHTML = "";
                  redirPopup.style.display = "none"; 
                  window.location.href = "/";
                }, 3000);
              } 
              else if (response.code == 500) {
                popupBox.innerHTML = `There has been an issue while changing your password<br>`;
                redirPopup.style.backgroundColor = "#fc8a8a"; 
                redirPopup.style.display = "block"; 
                setTimeout(function() {
                  popupBox.innerHTML = "";
                  redirPopup.style.display = "none"; 
                }, 4000); 
                console.log(errorText);
              }  
              else {
                popupBox.innerHTML = `There has been an error while changing your password...<br>`;
                redirPopup.style.backgroundColor = "#fc8a8a"; 
                redirPopup.style.display = "block";
                console.log("[Error]: There has been an error receiving the response from /changePass");
                alert("[Error]: Internal server error"); 
              }
            },
          error: function() {
            console.log("[Error]: There has been an error parsing and receiving data from /changePass");
            alert("[Error]: Internal server error");
          }
        });
    }
}















function profileDropdown(profileButton) {
  const dropdownElem = document.getElementById("profileDropdown");
  if (dropdownElem.style.display == "none" || !profileButton.classList.contains("profileButtonActive")) {
    dropdownElem.style.display = "flex";
    if (!profileButton.classList.contains("profileButtonActive")) {
      profileButton.classList.add("profileButtonActive");
    }
    setTimeout(() => {
      document.addEventListener('click', handleProfileDropdown);
    }, 100);
  }
  else {
    dropdownElem.style.display = "none";
    if (profileButton.classList.contains("profileButtonActive")) {
      profileButton.classList.remove("profileButtonActive");
    }
    document.removeEventListener('click', handleProfileDropdown);
  }
}
function hideProfileDropdown() {
  const dropdownElem = document.getElementById("profileDropdown");
  const profileButton = document.getElementById("profileButton");
  dropdownElem.style.display = "none";
  profileButton.classList.remove("profileButtonActive");
}
function handleProfileDropdown(event) {
  const dropdownElem = document.getElementById("profileDropdown");
  const profileButton = document.getElementById("profileButton");
  if (!event.target.closest("#profileDropdown")) {
    dropdownElem.style.display = "none";
    profileButton.classList.remove("profileButtonActive");
  }
  document.removeEventListener('click', handleProfileDropdown);
}




function removeAllCookies() {
  const allCookies = document.cookie.split(';');
  for (let i = 0; i < allCookies.length; i++) {
    document.cookie = `${allCookies[i].split('=')[0].trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}
function logoutProfile() {
  removeAllCookies();
  resetSearch();
  const redirPopup = document.getElementById("redirectPopup");
  const popupBox = document.getElementById("popupBox");
  popupBox.innerHTML = `Logged out successfully!<br>Redirecting...`;
  redirPopup.style.backgroundColor = "#fbfc8b"; 
  redirPopup.style.display = "block";
  setTimeout(function() {
    popupBox.innerHTML = "";
    redirPopup.style.display = "none"; 
    window.location.href = "/";
  }, 3000);
}


function removePopup(popupName) {
  const popup = document.getElementById(popupName);
  accForms.classList.remove('active');
  accForms.classList.add('inactive');

  setTimeout(() => {
    accFormsNav.classList.remove('active');
    popup.classList.remove('active');
    accForms.classList.remove('inactive');
    popup.style.display = 'none';
    accForms.style.display = 'none';
  }, 250);
}





function buttonExists(tagVal, buttons) {
  for (i = 0; i < buttons.length; i++) {
    if (buttons[i].textContent.toLowerCase() == tagVal.toLowerCase()) {
      return true;
    }
  }
  return false;
}

function setCreateTag() {
  const tagName = document.getElementById("createPostTag");
  const tagsContainer = document.getElementById("createPostTags");
  const buttons = tagsContainer.getElementsByTagName("button");

  if (tagName.value && !buttonExists(tagName.value, buttons)) {
    if (tagsContainer.style.display == "none" || !tagsContainer.style.display) {
      tagsContainer.style.display = "flex";
    }
    tagsContainer.innerHTML += `\n<button class="createTagButton" onclick="removeCreateTag(this)">${tagName.value}</button>`;
    tagName.value = "";
  }
}


function removeCreateTag(button) {
  var parentElement = button.parentNode;
  parentElement.removeChild(button);

  const tagsContainer = document.getElementById("createPostTags");
  const buttons = tagsContainer.getElementsByTagName("button");

  if (buttons.length == 0) {
    tagsContainer.style.display = "none";
  }
}






function createPost() {
  const postTitle = document.getElementById("createPostTitle");
  const postContent = document.getElementById("createPostContent");
  
  if (!postTitle.value || !postContent.value) {
    if (!postTitle.value) {
      postTitle.style.backgroundColor = "#fc8a8a";
    }
    if (!postContent.value) {
      postContent.style.backgroundColor = "#fc8a8a";
    }
  }
  else {
    postTitle.style.backgroundColor = "#f3f3f3";
    postContent.style.backgroundColor = "#f3f3f3";
    const tagsContainer = document.getElementById("createPostTags");
    const buttonTags = tagsContainer.getElementsByTagName("button");
    let postTags = [];
  
    for (i = 0; i < buttonTags.length; i++) {
      postTags[i] = (buttonTags[i].textContent).toLowerCase();
    }

  
  
    jQuery.ajax({
        type: 'POST',
        url: "/createPost",
        data: {
          postTitle: postTitle.value,
          postContent: postContent.value,
          postTags: postTags
        },
        success: function(response) {
          const redirPopup = document.getElementById("redirectPopup");
          const popupBox = document.getElementById("popupBox");
          if (response.code == 200) {
            popupBox.innerHTML = `Post created successfully!<br>Redirecting...`;
            redirPopup.style.backgroundColor = "#8afc92"; 
            redirPopup.style.display = "block";
            setTimeout(function() {
              popupBox.innerHTML = "";
              redirPopup.style.display = "none"; 
              window.location.href = "/";
            }, 3000);
          } 
            else if (response.code == 500) {
              console.log(response.errorText);
              alert("[Error]: " + response.errorText);
            }
            else {
              console.log("[Error]: There has been an error receiving the response from /createPost")
              alert("[Error]: Internal server error");
            }
        },
        error: function() {
            console.log("[Error]: There has been an error parsing and receiving data from /createPost")
            alert("[Error]: Internal server error");
        }
    });
  }


}




function setTagInput(button) {
  const postTag = document.getElementById("createPostTag");
  postTag.value = button.innerHTML;
  hideCreateTags();
}
function showCreateTags() {
  const createContainer = document.getElementById("createTagsContainer");
  createContainer.style.display = "flex";
  setTimeout(() => {
    document.addEventListener('click', handleShowCreateTags);
  }, 100);
}
function hideCreateTags() {
  const createContainer = document.getElementById("createTagsContainer");
  createContainer.style.display = "none";
}



function handleShowCreateTags(event) {
  const postTag = document.getElementById("createPostTag");
  const createContainer = document.getElementById("createTagsContainer");
  if (!event.target.closest("#createPostTag") && !event.target.closest("#createTagsContainer")) {
    createContainer.style.display = "none";
  }
  document.removeEventListener('click', handleProfileDropdown);
}


function filterCreateTags() {
  const buttons = document.getElementById("createTagsContainer").getElementsByTagName("button");
  const filter = document.getElementById("searchCreateTag").value.toLowerCase();

  let button, i;
  for (i = 0; i < buttons.length; i++) {
      button = buttons[i];
      if (button.innerHTML.toLowerCase().indexOf(filter) > -1) {
      button.style.display = "";
      } else {
      button.style.display = "none";
      }
  }
}




function copyToClipboard(hyperlink) {
  const redirPopup = document.getElementById("redirectPopup");
  const popupBox = document.getElementById("popupBox");

  navigator.clipboard.writeText(hyperlink)
    .then(function() {
      popupBox.innerHTML = `Link copied to clipboard`;
      redirPopup.style.backgroundColor = "#8afc92"; 
      redirPopup.style.display = "block";
      setTimeout(function() {
        popupBox.innerHTML = "";
        redirPopup.style.display = "none"; 
      }, 2000);
    })
    .catch(function(error) {
      console.error("Failed to copy hyperlink to clipboard:", error);
    });
}




window.addEventListener('load', function handleWindowLoad() {
  if (window.location.href == "http://localhost:3000/missingLogin") {
    loginPopup();
  } 
  else if (!window.location.href.includes("http://localhost:3000/recoverPassword/")){
    checkAccount(); 
    setInterval(checkLocation(), 300000);
  }

  setTimeout(() => {
    window.removeEventListener('load', handleWindowLoad);
  }, 100);
});
