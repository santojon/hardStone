pages.Home = (params) => {
    with (HomeControler) {
        document.getElementById('login-click').onclick = () => {
            pages.Login()
        }
    }
}