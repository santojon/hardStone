with (Sgfd.Base) {
    var UserController = {
        /**
         * 
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