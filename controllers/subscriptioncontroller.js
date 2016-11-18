with (
    Sgfd.Base.autoMerge(SubscriptionService)
) {
    var SubscriptionController = {
        /**
         * Return all subscriptions to screen
         */
        getSubscriptions: () => {
            var results = []

            getSubscriptions().forEach((sub) => {
                var checked = '<td><input id="' + sub.id() +
                                '" type="checkbox" checked="true"></td>'

                var unchecked = '<td><input id="' + sub.id() +
                                '" type="checkbox"></td>'

                var set = sub.status ? checked : unchecked

                results.push(
                    '<tr>\
                        <td>' + sub.user.username + '</td>\
                        <td>' + sub.user.email + '</td>\
                        <td>' + sub.created.toDateString() + '</td>\
                    ' + set + '</tr>'
                )
            })

            return results.join('')
        },
        /**
         * Save all subscriptions
         */
        saveAllSubscriptions: (subs) => {
            subs.forEach((sub) => {
                var s = getSubscription(sub.id)
                s.status = sub.status
                saveSubscription(s)
            })
        }
    }
}