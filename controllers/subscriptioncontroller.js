with (
    Sgfd.Base.autoMerge(SubscriptionService)
) {
    var SubscriptionController = new Sgfd.Controller({
        metaName: 'SubscriptionController',
        /**
         * Return all subscriptions to screen
         */
        getSubscriptions: () => {
            var results = []

            getSubscriptions().forEach((sub) => {
                var checked = '<td class="col-md-1 col-sm-1 col-lg-1"><input id="' + sub.id() +
                                '" type="checkbox" checked="true"></td>'

                var unchecked = '<td class="col-md-1 col-sm-1 col-lg-1"><input id="' + sub.id() +
                                '" type="checkbox"></td>'

                var set = sub.status ? checked : unchecked
                var date = sub.created instanceof Date ?
                                sub.created.toDateString() :
                                    new Date(sub.created).toDateString()

                results.push(
                    '<tr>\
                        <td class="col-md-3 col-sm-3 col-lg-3">' + sub.user.username + '</td>\
                        <td class="col-md-5 col-sm-5 col-lg-5">' + sub.user.email + '</td>\
                        <td class="col-md-4 col-sm-4 col-lg-4">' + date + '</td>\
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
    })
}