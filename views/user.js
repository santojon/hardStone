pages.User = (params) => {
    hideOthers('user')

    with (UserController) {
        validate(_session.currentUser)
    }
}