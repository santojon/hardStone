/**
 * Default admin
 */
new User({
    firstName: 'Admin',
    lastName: 'Admin',
    username: 'admin',
    type: 'admin',
    password: 'admin',
    email: 'admin@admin.com'
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
    email: 'santojon5@gmail.com'
}).save((u) => {
    console.log(u)
})