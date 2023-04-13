
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










async function signupUsernameCheckAuto(usage) {
    try {
      const result = await signupUsernameCheck(usage);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }




function signupUsernameCheck(usage) {
    return new Promise((resolve, reject) => {
      const inputData = document.getElementById("signupUsername");
      jQuery.ajax({
        type: "POST",
        url: "/signupUsernameCheck",
        data: {
          username: inputData.value,
        },
        success: function (response) {
          if (response.code == 200) {
            if (usage == 0) {
              alert("The username is free");
            } 
            else if (usage == 1) {
              resolve(1);
            }
          } else if (response.code == 401) {
            alert("The username is taken");
          } 
          else if (response.code == 402) {
            alert("The username cannot be empty");
          } 
          else {
            reject("[Error]: There was an internal error in (/signupUsernameCheck)");
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
    return new Promise((resolve, reject) => {
      const inputData = document.getElementById("signupEmail");
      jQuery.ajax({
        type: "POST",
        url: "/signupEmailCheck",
        data: {
          email: inputData.value,
        },
        success: function (response) {
          if (response.code == 200) {
            if (usage == 0) {
              alert("The email is free");
            } else if (usage == 1) {
              resolve(1);
            }
          } 
          else if (response.code == 401) {
            alert("The email is taken");
          } 
          else if (response.code == 402) {
            alert("The email cannot be empty");
          } 
          else {
            reject("[Error]: There was an internal error in (/signupEmailCheck)");
          }
        },
        error: function () {
          console.log("[Error]: There was an error receiving the response from /signupEmailCheck");
          reject("[Error]: Internal server error");
        },
      });
    });
  }


  function jsonCreation(accID) {
    jQuery.ajax({
      type: 'GET',
      url: `/json/${accID}`,
      data: {},
      success: function(response) {
          if (response.code == 200) {
            alert("Account created");
          } 
          else if (response.code == 500) {
            alert("Internal error");
          }
          else {
                alert("[Error]: There was an internal error in (/json/:accountID)");
          } 
        },
      error: function() {
        console.log("[Error]: There was an error receiving the response from /json/:accountID")
        alert('[Error]: Internal server error');
      }
    });
  }





function signupForm(formID, event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById(formID));
    const formVar = {
        "username": formData.get("username"),
        "password": formData.get("password"),
        "passwordConfirm": formData.get("passwordConfirm"),
        "email": formData.get("email"),
        "emailConfirm": formData.get("emailConfirm")
    };
    console.log(formVar);

    sUR = signupUsernameRules(formVar.username);
    sPR = signupPasswordRules(formVar.password, formVar.passwordConfirm);
    sER = signupEmailRules(formVar.email, formVar.emailConfirm);

    if (sUR === 1 && sPR === 1 && sER === 1) {
        sUC = signupUsernameCheck(1);
        sEC = signupEmailCheck(1);

        Promise.all([sUC, sEC]).then(function(results) {
            if (results[0] === 1 && results[1] === 1) {
                jQuery.ajax({
                    type: 'POST',
                    url: '/signup',
                    data: formVar,
                    success: function(response) {
                        if (response.code == 200) {
                            jsonCreation(response.accID);
                        } 
                        else if (response.code == 500) {
                            alert("Internal error");
                        }
                        else {
                            alert("[Error]: There was an internal error in (/signup)");
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










function signupUsernameRules(username) {
    const regex = new RegExp("^(?=[a-zA-Z0-9])[a-zA-Z0-9._-]{4,126}(?<=[a-zA-Z0-9])$");
    
    var valid = 1;
    if (username.length < 6 || username.length > 128) {
        console.log("Invalid username length");
        valid = 0;
    }

    var regexp;
    if (regex.test(username) == false) {
        regexp = /[^a-zA-Z0-9._-]/;
        if (regexp.test(username) == true) {
            console.log("Invalid characters in username");
        }
        regexp = /^[a-zA-Z0-9].*[a-zA-Z0-9]$/;
        if (regexp.test(username) == false) {
            console.log("The username cannot start/end with non-alphanumeric characters");
        }
        regexp = /^(?=.*[a-zA-Z0-9].*[a-zA-Z0-9]).+$/;
        if (regexp.test(username) == false) {
            console.log("The username must have at least 2 alphanumeric characters");
        }
        valid = 0;
    }
    
    return valid;
}

function signupPasswordRules(password, passwordCon) {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*?[0-9])[!@#$%^&*(){}\[\]`~\-_=+;:'"<>,.\/?\\|A-Za-z\d]{8,128}$/;
    
    var valid = 1;
    if (password != passwordCon) {
        console.log("The two passwords introduced do not match");
        valid = 0
    }
    else if (regex.test(password) == false) {
        var regexp;
        if (password.length < 8 || password.length > 128) {
            console.log("Invalid password length");
        }
        regexp = /[^!@#$%^&*(){}\[\]`~\-_=+;:'"<>,.\/?\\|A-Za-z\d]/;
        if (regexp.test(username) == true) {
            console.log("Invalid characters in password");
        }
        regexp = /[A-Z]/;
        if (regexp.test(password) == false) {
            console.log("Your password has to include at least one upper case letter");
        }
        regexp = /[a-z]/;
        if (regexp.test(password) == false) {
            console.log("Your password has to include at least one lower case letter");
        }
        regexp = /[0-9]/;
        if (regexp.test(password) == false) {
            console.log("Your password has to include at least one number");
        }
        valid = 0;
    }
    return valid;
}

function signupEmailRules(email, emailCon) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    var valid = 1;
    if (email != emailCon) {
        console.log("The two emails introduced do not match");
        valid = 0
    }
    else if (regex.test(email) == false) {
        console.log("PLease enter a valid email address");
        valid = 0;
    }
    return valid;
}
