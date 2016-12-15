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
                var info = { email: email }
                var logU = findUser(info)

                // create a new user
                var uu = findUser({ username: email })
                if (logU === null) {
                    if (uu !== null) {
                        if (password === uu.password) {
                            sName = ''
                            if (uu.firstName) sName = ', ' + uu.firstName
                            logUser(
                                uu,
                                showSuccess(__('Welcome back') + sName + '!')
                            )
                        } else {
                            showError(__('Incorrect information!'))
                        }
                    } else {
                        createUser({ email: email, password: password }, (u) => {
                            logUser(
                                u,
                                showSuccess(__('Welcome! Now is time to add some info about you.'))
                            )
                        })
                    }
                }
                // log existent user
                else {
                    if (email === logU.email) {
                        if (password === logU.password) {
                            sName = ''
                            if (logU.firstName) sName = ', ' + logU.firstName
                            logUser(
                                logU,
                                showSuccess(__('Welcome back') + sName + '!')
                            )
                        } else {
                            showError(__('Incorrect information!'))
                        }
                    } else if (email === logU.username) {
                        if (password === logU.password) {
                            sName = ''
                            if (logU.firstName) sName = ', ' + logU.firstName
                            logUser(
                                logU,
                                showSuccess(__('Welcome back') + sName + '!')
                            )
                        } else {
                            showError(__('Incorrect information!'))
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
            document.getElementById('my_avatar').title = user.firstName || ''
            if ((typeof user.image) === 'string') {
                if (user.image !== '') {
                    document.getElementById('my_avatar').innerHTML =
                        '<img class="navbar-brand-logo nav-photo"\
                                src="' + user.image + '">'
                }
            } else {
                document.getElementById('my_avatar').innerHTML =
                    '<img class="navbar-brand-logo nav-photo"\
                            src="assets/images/neutral.png">'
            }

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