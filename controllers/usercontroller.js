with (
    Sgfd.Base.autoMerge(LoginController, UserService)
) {
    var UserController = new Sgfd.Controller({
        metaName: 'UserController',
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

            if (curr.subscribed) {
                document.getElementById('sub-place').innerHTML = 
                    '<input id="sb-tournament" type="checkbox" checked disabled>' +
                    __('Subscribe to tournament') +
                    '</label>'
            } else {
                document.getElementById('sub-place').innerHTML = 
                    '<input id="sb-tournament" type="checkbox">' +
                    __('Subscribe to tournament') +
                    '</label>'
            }

            // Get location info
            $.get('http://ipinfo.io', (_res) => {
                document.getElementById('loc-info').innerHTML = 
                    '<label for="locationInfo">' + __('Your Location / Network info (via ipinfo.io)') +
                    '</label><p></p><p>' + _res.city + ', ' + _res.region + ', ' + _res.country +
                    ' CEP: ' + _res.postal + '<br>' + __('Location') + ': (' + _res.loc + ')<br>IP: ' +  _res.ip +
                    '</p><p>' + __('Using') + ' ' + __(browserName()) + '</p>'
            }, 'jsonp')
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
        updateCurrentUser: (firstName, lastName, username, gender, password, email, image, sub) => {
            if (username === '') {
                showError(__('You should create a username!'))
            } else {
                UserController.updateUser(
                    new User({
                        firstName: firstName,
                        lastName: lastName,
                        username: username,
                        gender: gender,
                        password: password,
                        email: email,
                        image: image,
                        subscribed: sub,
                        type: _session.currentUser.type
                    }),
                    (usr) => {
                        _session.currentUser = usr || _session.currentUser
                        if (usr.username) {
                            showSuccess(__('User info updated successfully!'))
                        } else {
                            showError(__('Fill the fields with the necessary info!'))
                        }
                    }
                )
            }
        },
        /**
         * Update method for user
         */
        updateUser: (user, clbk) => {
            // From UserService
            updateUser(user, clbk)
        }
    })
}