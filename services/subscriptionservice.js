with (
    Sgfd.Base.autoMerge(MyjsonbridgeService)
) {
    var SubscriptionService = new Sgfd.Service({
        metaName: 'SubscriptionService',
        /**
         * Get all subscriptions
         */
        getSubscriptions: () => {
            return Subscription.findAll()
        },
        /**
         * Save given subscriptions
         * @param subs: the subscriptions to save
         */
        saveSubscriptions: (subs) => {
            subs.forEach((sub) => {
                if(sub.id) {
                    var s = SubscriptionService.getSubscription(sub.id)
                    s.status = sub.status
                    if (s.status) {
                        s.responsible = _session.currentUser
                        s.responded = new Date()
                    }
                }
            })

            showSuccess('All Subscriptions where saved!')
            dump(dataPool.export('json'))
        },
        /**
         * Get the subscription by id
         * @param id: the id of the subscription
         */
        getSubscription: (id) => {
            return Subscription.get(id)
        },
        /**
         * Find subscription by user username
         */
        findSubscription: (username) => {
            return Subscription.findWhere((sub) => {
                return sub.user.username === username
            })[0]
        },
        /**
         * Subscribe passed user
         */
        subscribeUser: (user) => {
            new Subscription({
                user: user,
                status: false,
                created: new Date()
            }).save((s) => {
                dump(dataPool.export('json'))
            })
        }
    })
}