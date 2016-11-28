// create (or get) session
var _session = getSession()

if ((_session === null) || (_session === undefined)) {
    _session = new Object({ currentUser: null })
    saveSession()
} else if (_session['currentUser'] !== null) {
    // If user is present, signIn
    LoginController.signIn(
        _session.currentUser.email,
        _session.currentUser.password
    )
}

// set navbar clicks
document.getElementById('home-click').onclick = () => {
    unselectItem('login-click')
    unselectItem('my-things-click')
    unselectItem('tournament-click')
    pages.Home()
}

document.getElementById('login-click').onclick = () => {
    unselectItem('tournament-click')
    unselectItem('my-things-click')
    selectItem('login-click')
    pages.Login()
}

document.getElementById('tournament-click').onclick = () => {
    unselectItem('login-click')
    unselectItem('my-things-click')
    selectItem('tournament-click')
    pages.Tournament()
}

document.getElementById('my-things-click').onclick = () => {
    unselectItem('login-click')
    unselectItem('tournament-click')
    selectItem('my-things-click')
    pages.User()
}

document.getElementById('admin-click').onclick = () => {
    unselectItem('login-click')
    unselectItem('tournament-click')
    selectItem('my-things-click')
    pages.Admin()
}

// open home
pages.Tournament()