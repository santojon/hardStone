with (
    Sgfd.Base.autoMerge(PhpbridgeService)
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
                info.type = 'user'
                new User(info).save(
                    (u) => {
                        callback(u)
                    }
                )
                dump(dataPool.export('json'))
            }
        },
        /**
         * Update user info
         */
        updateUser: (user, clbk) => {
            // Get user from db
            var info = { email: user.email, password: user.password }
            var dbUser = UserService.findUser(info)

            // Update it
            dbUser.update(user, clbk)
            dump(dataPool.export('json'))
        }
    }
}