with (
    Sgfd.Base.autoMerge(LoginController, UserService)
) {
    var UserController = {
        /**
         * Validate user to open its info page
         */
        validateCurrentUser: () => {
            if (_session.currentUser !== null) {
                hideItem('login-click')
                showItem('my-things-click')
                selectItem('my-things-click')
            } else {
                pages.Login()
            }
        },
        /**
         * Get info from current user to screen
         */
        getCurrentUserInfo: () => {
            var curr = _session.currentUser
            document.getElementById('userFirstName').value = curr.firstName
            document.getElementById('userLastName').value = curr.lastName
            document.getElementById('userUsername').value = curr.username
            document.getElementById('userGender').value = curr.gender
            document.getElementById('userPassword').value = curr.password
            document.getElementById('userEmail').value = curr.email
            document.getElementById('userImage').value = curr.image
        },
        /**
         * Go away
         */
        signOut: () => {
            unselectItem('my-things-click')
            showItem('login-click')
            hideItem('my-things-click')

            // Function from LoginController
            signOut()
        },
        /**
         * Update method for user in session
         */
        updateCurrentUser: (firstName, lastName, username, gender, password, email, image) => {
            UserController.updateUser(
                new User({
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    gender: gender,
                    password: password,
                    email: email,
                    image: image,
                    type: _session.currentUser.type
                }),
                (usr) => {
                    console.log(usr)
                    _session.currentUser = usr || _session.currentUser
                    showSuccess('User info updated successfully!')
                }
            )
        },
        /**
         * Update method for user
         */
        updateUser: (user, clbk) => {
            // From UserService
            updateUser(user, clbk)
        }
    }
}