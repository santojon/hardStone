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
    subscribed: true,
}).save((u) => {
    console.log(u)
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
    subscribed: true,
}).save((u) => {
    console.log(u)
    UserController.updateUser(u)
})