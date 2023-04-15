
// ----- Popup functions (START)  ----- >>

const loginBack = document.getElementById('loginBackground');
const loginPopTop = document.getElementById('loginPopupTop');
const loginPop = document.getElementById('loginPopup');

const signupBack = document.getElementById('signupBackground');
const signupPopTop = document.getElementById('signupPopupTop');
const signupPop = document.getElementById('signupPopup');

const recoveryBack = document.getElementById('recoveryBackground');
const recoveryPopT = document.getElementById('recoveryPopupTop');
const recoveryMenuPop = document.getElementById('recoveryMenuPopup');
const recoverPassPop = document.getElementById('recoverPasswordPopup');
const contactFormPop = document.getElementById('contactFormPopup');


loginBack.addEventListener('click', () => {
  removeLoginPopup();
  document.body.style.overflow = 'auto';
});

signupBack.addEventListener('click', () => {
  removeSignupPopup();
  loginPopup();
  document.body.style.overflow = 'auto';
});

recoveryBack.addEventListener('click', () => {
  removeRecoveryPopup();
  loginPopup();
  document.body.style.overflow = 'auto';
});


function removeLoginPopup() {
  loginBack.style.display = 'none';
  loginPopTop.style.display = 'none';
  loginPop.style.display = 'none';
}

function removeSignupPopup() {
  signupBack.style.display = 'none';
  signupPopTop.style.display = 'none';
  signupPop.style.display = 'none';
}

function removeRecoveryPopup() {
  recoveryBack.style.display = 'none';
  recoveryPopT.style.display = 'none';
  recoveryMenuPop.style.display = 'none';
  recoverPassPop.style.display = 'none';
  contactFormPop.style.display = 'none';
}


function loginPopup() {
  if (localStorage.getItem("loginUser")) {
    document.getElementById("loginUsername").value = localStorage.getItem("loginUser");
    document.getElementById('loginRememberMe').checked = true;
  }
  removeRecoveryPopup();
  removeSignupPopup();
  loginBack.style.display = 'block';
  loginPopTop.style.display = 'block';
  loginPop.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function signupPopup() {
  removeLoginPopup();
  signupBack.style.display = 'block';
  signupPopTop.style.display = 'block';
  signupPop.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function recoveryMenuPopup() {
  recoverPassPop.style.display = 'none';
  contactFormPop.style.display = 'none';
  removeLoginPopup();
  recoveryBack.style.display = 'block';
  recoveryPopT.style.display = 'block';
  recoveryMenuPop.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function recoverPasswordPopup() {
  recoveryMenuPop.style.display = 'none';
  recoverPassPop.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function contactFormPopup() {
  recoveryMenuPop.style.display = 'none';
  contactFormPop.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// ----- Popup functions (END) -----



// ----- Auto input checks (START) -----

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
    usernameInput.style.backgroundColor = "#fff";
    errorBubble.innerHTML = "";
    errorBubble.style.display = "none";
  }
  else {
    usernameInput.style.backgroundColor = "#dc6e6e";
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
    errorBubble.style.display = "block";
    valid = 0;
  }
  if (usage == 1) {
    return valid;
  }
}

function signupPasswordCheckAuto(usage) {
  let valid = 1;
  const passwordInput = document.getElementById("signupPassword");
  const errorBubble = document.getElementById("signupPasswordError");

  const errors = signupPasswordRules(passwordInput.value);
  errorBubble.innerHTML = "";
  
  if (ctOnes(errors) == 0) {
    passwordInput.style.backgroundColor = "#fff";
    errorBubble.innerHTML = "";
    errorBubble.style.display = "none";
  }
  else {
    passwordInput.style.backgroundColor = "#dc6e6e";
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
    errorBubble.style.display = "block";
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
    emailInput.style.backgroundColor = "#fff";
    errorBubble.innerHTML = "";
    errorBubble.style.display = "none";
  }
  else {
    emailInput.style.backgroundColor = "#dc6e6e";
    if (errors[0] == 1) {
      errorBubble.innerHTML = `Please enter a valid email address<br>`;
    }
    errorBubble.style.display = "block";
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
      error[0] = 1;
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
        type: "POST",
        url: "/signupUsernameCheck",
        data: {
          username: usernameInput.value,
        },
        success: function (response) {
          if (response.code == 200) {
            usernameInput.style.backgroundColor = "#5ca25a";
            errorBubble.innerHTML = "";
            errorBubble.style.display = "none";            
          } 
          else if (response.code == 401) {
            usernameInput.style.backgroundColor = "#dce376";
            errorBubble.innerHTML = `The username is currently taken<br>`;
            errorBubble.style.display = "block";  
            valid = 0;
          } 
          else {
            reject("[Error]: There was an internal error in (/signupUsernameCheck)");
          }

          if (usage == 1) {
            resolve(valid);
          }
        },
        error: function () {
          console.log("[Error]: There was an error receiving the response from /signupUsernameCheck");
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
            emailInput.style.backgroundColor = "#5ca25a";
            errorBubble.innerHTML = "";
            errorBubble.style.display = "none";            
          } 
          else if (response.code == 401) {
            emailInput.style.backgroundColor = "#dce376";
            errorBubble.innerHTML = `The email is currently in use<br>`;
            errorBubble.style.display = "block";  
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

  function jsonCreation(accID) {
    jQuery.ajax({
      type: 'GET',
      url: `/json/${accID}`,
      data: {},
      success: function(response) {
          if (response.code == 200) {
            console.log("Account created");
          } 
          else if (response.code == 500) {
            console.log("Internal error");
          }
          else {
            console.log("[Error]: There was an internal error in (/json/:accountID)");
          } 
        },
      error: function() {
        console.log("[Error]: There was an error receiving the response from /json/:accountID")
      }
    });
  }


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
    console.log(signupUsernameCheckAuto(1) == 1 && signupPasswordCheckAuto(1) == 1 && signupEmailCheckAuto(1) == 1);

    if (formData.get("password") != formData.get("passwordConfirm")) {
      passwordErrorBubble.innerHTML = `The passwords do not match<br>`;
      passwordErrorBubble.style.display = "block";  
    }
    else if (formData.get("email") != formData.get("emailConfirm")) {
      emailErrorBubble.innerHTML = `The email addresses do not match<br>`;
      emailErrorBubble.style.display = "block";  
    }
    else if (signupUsernameCheckAuto(1) == 1 && signupPasswordCheckAuto(1) == 1 && signupEmailCheckAuto(1) == 1) {
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
                          redirPopup.style.display = "block";  
                          jsonCreation(response.accID);
                          document.cookie = "accountID=" + response.accID + ";path=/";
                          setTimeout(function() {
                            window.location.href = "/posts";
                          }, 3000);
                        } 
                        else {
                          redirPopup.innerHTML = `There has been an error while creating your account...<br>`;
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

  if (formData.get("loginRememberMe") == "on") {
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
        if (response.code == 200) {
          redirPopup.innerHTML = `Logged in successfully!<br>Redirecting...`;
          redirPopup.style.display = "block";  
          document.cookie = "accountID=" + response.accID + ";path=/";
          setTimeout(function() {
            window.location.href = "/posts";
          }, 3000);
        } 
        else if (response.code == 401) {
          redirPopup.innerHTML = `Invalid username or password<br>`;
          redirPopup.style.display = "block"; 
          setTimeout(function() {
            redirPopup.innerHTML = ``;
          redirPopup.style.display = "none"; 
          }, 2000); 
        } 
        else {
          redirPopup.innerHTML = `There has been an error while logging in to your account...<br>`;
          redirPopup.style.display = "block";  
        }
      },
    error: function() {
      console.log("[Error]: There was an error receiving the response from /login")
      alert('[Error]: Internal server error');
    }
  });
}



function recoverPasswordForm() {
  event.preventDefault();
  const formData = new FormData(document.getElementById("recoverPasswordForm"));
  const formVar = {
      "email": formData.get("email")
  };

  jQuery.ajax({
    type: 'POST',
    url: '/recoverPass',
    data: formVar,
    success: function(response) {
      const redirPopup = document.getElementById("redirectPopup");
        if (response.code == 200) {
          redirPopup.innerHTML = `Email sent successfully!<br>Redirecting...`;
          setTimeout(function() {
            window.location.href = "/posts";
          }, 3000);
        } 
        else if (response.code == 401) {
          redirPopup.innerHTML = `There is no account registered with this email address<br>`;
          redirPopup.style.display = "block"; 
          setTimeout(function() {
            redirPopup.innerHTML = ``;
          redirPopup.style.display = "none"; 
          }, 4000); 
        }
        else if (response.code == 402) {
          redirPopup.innerHTML = `There has been an issue while sending the email<br>`;
          redirPopup.style.display = "block"; 
          setTimeout(function() {
            redirPopup.innerHTML = ``;
          redirPopup.style.display = "none"; 
          }, 4000); 
        }  
        else {
          redirPopup.innerHTML = `There has been an error while sending the email request...<br>`;
          redirPopup.style.display = "block";  
        }
      },
    error: function() {
      console.log("[Error]: There was an error receiving the response from /recoverPass")
      alert('[Error]: Internal server error');
    }
  });
}





