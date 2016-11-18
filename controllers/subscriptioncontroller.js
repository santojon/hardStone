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
                var checked = '<td class="col-md-1"><input id="' + sub.id() +
                                '" type="checkbox" checked="true"></td>'

                var unchecked = '<td class="col-md-1"><input id="' + sub.id() +
                                '" type="checkbox"></td>'

                var set = sub.status ? checked : unchecked

                results.push(
                    '<tr>\
                        <td class="col-md-3">' + sub.user.username + '</td>\
                        <td class="col-md-5">' + sub.user.email + '</td>\
                        <td class="col-md-4">' + sub.created.toDateString() + '</td>\
                    ' + set + '</tr>'
                )
            })

            return results.join('')
        },
        /**
         * Save all subscriptions
         */
        saveAllSubscriptions: (subs) => {
            // From SubscriptionService
            saveSubscriptions(subs)
        }
    }
}