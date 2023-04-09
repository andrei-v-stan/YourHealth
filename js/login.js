const loginButton = document.getElementById('loginButton');
const loginBackground = document.getElementById('loginBackground');
const loginPopupTop = document.getElementById('loginPopupTop');
const loginPopup = document.getElementById('loginPopup');
const loginPopupBottom = document.getElementById('loginPopupBottom');

loginButton.addEventListener('click', () => {
    loginBackground.style.display = 'block';
    loginPopupTop.style.display = 'block';
    loginPopup.style.display = 'block';
    loginPopupBottom.style.display = 'block';
	document.body.style.overflow = 'hidden';
});

loginBackground.addEventListener('click', () => {
    loginBackground.style.display = 'none';
    loginPopupTop.style.display = 'none';
	loginPopup.style.display = 'none';
    loginPopupBottom.style.display = 'none';
	document.body.style.overflow = 'auto';
});
