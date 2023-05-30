
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
          if (response.code == 01) {
            usernameInput.style.backgroundColor = "#7ad177";
            errorBubble.innerHTML = "";          
          } 
          else if (response.code == 02) {
            usernameInput.style.backgroundColor = "#f0f78d";
            errorBubble.innerHTML = `The username is currently taken<br>`;
            valid = 0;
          } 
          else {
            reject("[Error]: There was an internal error "+ (response.code) +"in (/signupUsernameCheck)");
          }

          if (usage == 1) {
            resolve(valid);
          }
        },
        error: function () {
          console.log("[Error]: There was an error receiving the response from /signupUsernameCheck");
          reject("[Error]: There was an error receiving the response from /signupUsernameCheck");
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
          else if (response.code == 401) {
            emailInput.style.backgroundColor = "#f0f78d";
            errorBubble.innerHTML = `The email is currently in use<br>`;
            valid = 0;
          }
          else {
            reject("[Error]: There was an internal error in (/signupEmailCheck)");
          }

          if (usage == 1) {
            resolve(valid);
          }
        },
        error: function () {
          console.log("[Error]: There was an error receiving the response from /signupEmailCheck");
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
                        if (response.code == 200) {
                          redirPopup.innerHTML = `Account created successfully!<br>Redirecting...`;
                          redirPopup.style.backgroundColor = "#8afc92"; 
                          redirPopup.style.display = "block";
                          document.cookie = "accountID=" + response.accID + ";path=/";
                          setTimeout(function() {
                            window.location.href = "/";
                            redirPopup.style.display = "none"; 
                          }, 3000);
                        } 
                        else {
                          redirPopup.innerHTML = `There has been an error while creating your account...<br>`;
                          redirPopup.style.backgroundColor = "#fc8a8a"; 
                          redirPopup.style.display = "block"; 
                        }
                      },
                    error: function() {
                      console.log("[Error]: There was an error receiving the response from /signup")
                      alert('[Error]: Internal server error');
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
            window.location.href = "/";
            redirPopup.style.display = "none"; 
          }, 3000);
        } 
        else if (response.code == 401) {
          popupBox.innerHTML = `Invalid username or password<br>`;
          redirPopup.style.backgroundColor = "#fc8a8a"; 
          redirPopup.style.display = "block"; 
          setTimeout(function() {
            popupBox.innerHTML = ``;
            redirPopup.style.display = "none"; 
          }, 2000); 
        } 
        else {
          popupBox.innerHTML = `There has been an error while logging in to your account...<br>`;
          redirPopup.style.backgroundColor = "#fc8a8a"; 
          redirPopup.style.display = "block";   
        }
      },
    error: function() {
      console.log("[Error]: There was an error receiving the response from /login")
      alert('[Error]: Internal server error');
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
              redirPopup.style.display = "none"; 
              window.location.href = "/";
            }, 3000);
          } 
          else if (response.code == 401) {
            popupBox.innerHTML = `There is no account registered with this email address<br>`;
            redirPopup.style.backgroundColor = "#fc8a8a"; 
            redirPopup.style.display = "block"; 
            setTimeout(function() {
              redirPopup.innerHTML = ``;
              redirPopup.style.display = "none"; 
            }, 4000); 
          }
          else if (response.code == 402) {
            popupBox.innerHTML = `There has been an issue while sending the email<br>`;
            redirPopup.style.backgroundColor = "#fc8a8a"; 
            redirPopup.style.display = "block"; 
            setTimeout(function() {
              popupBox.innerHTML = ``;
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
        console.log("[Error]: There was an error receiving the response from /recoverPass")
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
              window.location.href = "/";
              redirPopup.style.display = "none"; 
            }, 3000);
          } 
          else if (response.code == 500) {
            popupBox.innerHTML = `There has been an issue while sending the email<br>`;
            redirPopup.style.backgroundColor = "#fc8a8a"; 
            redirPopup.style.display = "block"; 
            setTimeout(function() {
              popupBox.innerHTML = ``;
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
        console.log("[Error]: There was an error receiving the response from /recoverPass")
        alert('[Error]: Internal server error');
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
                  window.location.href = "/";
                  redirPopup.style.display = "none"; 
                }, 3000);
              } 
              else if (response.code == 500) {
                popupBox.innerHTML = `There has been an issue while changing your password<br>`;
                redirPopup.style.backgroundColor = "#fc8a8a"; 
                redirPopup.style.display = "block"; 
                setTimeout(function() {
                  popupBox.innerHTML = ``;
                  redirPopup.style.display = "none"; 
                }, 4000); 
              }  
              else {
                popupBox.innerHTML = `There has been an error while changing your password...<br>`;
                redirPopup.style.backgroundColor = "#fc8a8a"; 
                redirPopup.style.display = "block"; 
              }
            },
          error: function() {
            console.log("[Error]: There was an error receiving the response from /changePass")
            alert('[Error]: Internal server error');
          }
        });
    }
}
