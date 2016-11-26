with (
    Sgfd.Base.autoMerge(UserService)
) {
    var LoginController = new Sgfd.Controller({
        metaName: 'LoginController',
        /**
         * Sign or create an user
         * @param email: user email
         * @param password: user password
         */
        signIn: (email, password) => {
            with (LoginController) {
                var info = { email: email, password: password }
                var logU = findUser(info)

                // create a new user
                if (logU === null) {
                    createUser(info, (u) => {
                        logUser(
                            u,
                            showSuccess('Welcome! Now is time to add some info about you.')
                        )
                    })
                }
                // log existent user
                else {
                    if (email === logU.email) {
                        if (password === logU.password) {
                            logUser(
                                logU,
                                showSuccess('Welcome back, ' + logU.firstName + '!')
                            )
                        } else {
                            showError('Incorrect information!')
                        }
                    } else if (email === logU.username) {
                        if (password === logU.password) {
                            logUser(
                                logU,
                                showSuccess('Welcome back, ' + logU.firstName + '!')
                            )
                        } else {
                            showError('Incorrect information!')
                        }
                    }
                }
            }
        },
        /**
         * Remove user from session and gets out of system
         */
        signOut: () => {
            _session = new Object({ currentUser: null })
            cleanSession()

            pages.Home()
        },
        /**
         * Log user to session scope
         * @param user: the user to add to session
         */
        logUser: (user, runnable) => {
            _session.currentUser = user
            saveSession()
            document.getElementById('my_avatar').title = user.firstName

            pages.User()
            if (runnable) runnable
            if (user.type === 'admin') {
                showItem('admin-click')
            } else {
                hideItem('admin-click')
            }
        }
    })
}