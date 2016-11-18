pages.User = (params) => {
    hideOthers('user')

    with (UserController) {
        validate(_session.currentUser)

        document.getElementById('logout-click').onclick = () => {
            // Function from UserController
            signOut()
        }
    }
}