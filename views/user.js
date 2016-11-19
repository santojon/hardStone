pages.User = (params) => {
    hideOthers('user')

    with (UserController) {
        validateCurrentUser()
        getCurrentUserInfo()

        document.getElementById('logout-click').onclick = () => {
            // Function from UserController
            signOut()
        }

        document.getElementById('user-save-btn').onclick = () => {
            // Function from UserController
            updateCurrentUser(
                document.getElementById('userFirstName').value,
                document.getElementById('userLastName').value,
                document.getElementById('userUsername').value,
                document.getElementById('userGender').value,
                document.getElementById('userPassword').value,
                document.getElementById('userEmail').value,
                document.getElementById('userImage').value
            )
        }
    }
}