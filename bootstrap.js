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
    image: 'https://avatars1.githubusercontent.com/u/4976482'
}).save((u) => {
    UserController.updateUser(u)
})

new User({
    firstName: 'Raphael',
    lastName: 'Tulyo',
    username: 'crazybird',
    type: 'user',
    password: 'test',
    email: 'rtsd@cin.ufpe.br',
    gender: 'Male',
    subscribed: true
}).save((u) => {
    UserController.updateUser(u)
})

new User({
    firstName: 'Vinícius',
    lastName: 'Emanuel',
    username: 'vems',
    type: 'user',
    password: 'test',
    email: 'vems@cin.ufpe.br',
    gender: 'Male',
    subscribed: true
}).save((u) => {
    UserController.updateUser(u)
})

/**
 * More test users
 */
for (i = 0; i < 5; i++) {
    new User({
        firstName: 'Test' + i,
        lastName: '' + i,
        username: 'testuser' + i,
        type: 'user',
        password: 'test',
        email: 'test' + i + '@test.br',
        gender: (i % 2 === 0) ? 'Male' : 'Female',
        subscribed: true
    }).save((u) => {
        UserController.updateUser(u)
    })
}

Subscription.findAll().forEach((s) => {
    s.status = true
    s.update(s)
})