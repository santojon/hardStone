with (
    Sgfd.Base.autoMerge(MyjsonbridgeService, SubscriptionService)
) {
    var UserService = {
        /**
         * Find by any user info
         * @param info: user info to find user
         */
        findUser: (info) => {
            return User.find(info)
        },
        /**
         * Create a new user by info
         * @param info: user info
         * @param callback: a callback to run after it saves
         */
        createUser: (info, callback) => {
            if (info.email && info.password) {
                if (validEmail(info.email) && (User.find({email: info.email}) === null)) {
                    info.type = 'user'
                    info.subscribed = false
                    new User(info).save(
                        (u) => {
                            callback(u)
                        }
                    )
                    dump(dataPool.export('json'))
                } else {
                    showError('Incorrect information!')
                }
            }
        },
        /**
         * Update user info
         */
        updateUser: (user, clbk) => {
            // Get user from db
            var info = { email: user.email, password: user.password }
            var dbUser = UserService.findUser(info)

            if (dbUser) {
                // Update it
                dbUser.update(user, clbk)

                if (user.subscribed) {
                    // Subiscribe it if not yet
                    var subsc = findSubscription(user.username)
                    if (!subsc) {
                        subscribeUser(user)
                    }
                }
                dump(dataPool.export('json'))
            }
        }
    }
}