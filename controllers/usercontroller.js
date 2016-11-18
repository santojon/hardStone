with (
    Sgfd.Base.autoMerge(LoginController, UserService)
) {
    var UserController = {
        /**
         * Validate user to open its info page
         */
        validate: (user) => {
            if (user !== null) {
                hideItem('login-click')
                showItem('my-things-click')
                selectItem('my-things-click')
            } else {
                pages.Login()
            }
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
        }
    }
}