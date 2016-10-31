with (Sgfd.Base) {
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
        }
    }
}