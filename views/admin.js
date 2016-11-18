pages.Admin = (params) => {
    hideOthers('admin')

    with (
        Sgfd.Base.merge(UserController, SubscriptionController)
    ) {
        // show subscription on screen
        document.getElementById('admin-tb-body').innerHTML = getSubscriptions()

        // when click in save button
        document.getElementById('admin-save-btn').onclick = () => {
            var subs = []
            var inputs = document.getElementsByTagName("input")

            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].type === "checkbox") {
                    subs.push({ id: parseInt(inputs[i].id), status: inputs[i].checked ? true : false })
                }
            }
            // From SubscriptionController
            saveAllSubscriptions(subs)
        }

        // Logout button
        document.getElementById('logout-click-admin').onclick = () => {
            // Function from UserController
            signOut()
        }

        // Manage account admin button
        document.getElementById('account-click').onclick = () => {
            pages.User()
        }
    }
}