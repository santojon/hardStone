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
                                '" type="checkbox" checked="true" disabled></td>'

                var unchecked = '<td class="col-md-1 col-sm-1 col-lg-1"><input id="' + sub.id() +
                                '" type="checkbox"></td>'

                var set = sub.status ? checked : unchecked
                var date = sub.created instanceof Date ?
                                sub.created.toDateString() :
                                    new Date(sub.created).toDateString()

                var dateCol = '<td class="col-md-2 col-sm-2 col-lg-2"></td>'
                if (!isNaN(sub.responded.getTime())) {
                    var resDate = sub.responded instanceof Date ?
                                sub.responded.toDateString() :
                                    new Date(sub.responded).toDateString()
                    dateCol = '<td class="col-md-2 col-sm-2 col-lg-2">' + resDate + '</td>'
                }

                console.log(sub)
                results.push(
                    '<tr>\
                        <td class="col-md-2 col-sm-2 col-lg-2">' + sub.user.firstName + ' ' + sub.user.lastName + '</td>\
                        <td class="col-md-2 col-sm-2 col-lg-2">' + sub.user.username + '</td>\
                        <td class="col-md-2 col-sm-2 col-lg-2">' + sub.user.email + '</td>\
                        <td class="col-md-2 col-sm-2 col-lg-2">' + date + '</td>\
                        ' + dateCol +
                        '<td class="col-md-2 col-sm-2 col-lg-2">' + sub.responsible.firstName +
                        ' ' + sub.responsible.lastName +  '</td>\
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