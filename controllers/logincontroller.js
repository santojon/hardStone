with (
    Sgfd.Base.autoMerge(UserService)
) {
    var LoginController = {
        /**
         * Sign or create an user
         * @param email: user email
         * @param password: user password
         */
        sigIn: (email, password) => {
            with (LoginController) {
                var info = { email: email, password: password }
                var logU = findUser(info)

                // create a new user
                if (logU === null) {
                    createUser(info, (u) => {
                        logUser(u)
                    })
                }
                // log existent user
                else {
                    if (email === logU.email) {
                        if (password === logU.password) logUser(logU)
                    }
                }
            }
        },
        /**
         * Log user to session scope
         * @param user: the user to add to session
         */
        logUser: (user) => {
            _session.currentUser = user
            document.getElementById('my_avatar').title = user.firstName

            pages.User()
            console.log(user)
            if (user.type === 'admin') {
                showItem('admin_info')
            } else {
                hideItem('admin_info')
            }
        }
    }
}