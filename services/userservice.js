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
                new User(info).save(
                    (u) => {
                        callback(u)
                    }
                )
                dump(dataPool.export('json'))
            }
        }
    }
}