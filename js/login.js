
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



function test(formX) {
    const form = document.getElementById(formX);
    const formData = new FormData(form);
    for (const value of formData.values()) {
        console.log(value);
  }
}