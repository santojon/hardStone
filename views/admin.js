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
            $(":checkbox").each(() => {
                subs.push({ id: Number(this.id), status: Boolean(this.checked) })
            })
            saveAllSubscriptions(subs)
        }
    }
}