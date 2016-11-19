with (
    Sgfd.Base.autoMerge(PhpbridgeService)
) {
    var SubscriptionService = {
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
                console.log(sub)
                if(sub.id) {
                    var s = SubscriptionService.getSubscription(sub.id)
                    s.status = sub.status
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
        }
    }
}