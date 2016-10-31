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
         * Save a given subscriptions
         * @param sub: the subscription to save
         */
        saveSubscription: (sub) => {
            sub.save()
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