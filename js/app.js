const loginForm = document.getElementById("login-form");
const loginInput = loginForm.querySelector("input");
const loginButton = loginForm.querySelector("button");

function onLoginClick(){
    const username = loginInput.value;
}
loginButton.addEventListener("click", onLoginClick);