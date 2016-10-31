pages.Login = (params) => {
    hideOthers('login')

    with (LoginController) {
        document.getElementById('signin').onclick = () => {
            sigIn(
                document.getElementById('inputEmail').value,
                document.getElementById('inputPassword').value
            )
        }
    }
}