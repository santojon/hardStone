/**
 * Default admin
 */
new User({
    firstName: 'Admin',
    lastName: 'Admin',
    username: 'admin',
    type: 'admin',
    password: 'admin',
    email: 'admin@admin.com',
    subscribed: false,
}).save((u) => {
    console.log(u)
})

/**
 * Test users
 */
new User({
    firstName: 'Jonathan',
    lastName: 'Santos',
    username: 'santojon',
    type: 'user',
    password: 'test',
    email: 'santojon5@gmail.com',
    gender: 'Male',
    subscribed: true,
}).save((u) => {
    console.log(u)
    new Subscription({
        user: u,
        status: false,
        created: new Date()
    }).save((s) => {
        console.log(s)
    })
})