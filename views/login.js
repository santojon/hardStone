pages.Login = (params) => {
    hideOthers('login')

    // Logs into system
    with (LoginController) {
        document.getElementById('signin').onclick = () => {
            signIn(
                document.getElementById('inputEmail').value,
                document.getElementById('inputPassword').value
            )
        }
    }
}