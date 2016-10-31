/**
 * Default admin
 */
new User({
    firstName: 'Admin',
    lastName: 'Admin',
    username: 'admin',
    type: 'admin',
    password: 'admin',
    image: ''
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
    password: 'test'
}).save((u) => {
    console.log(u)
})