with (Sgfd.Base) {
    var SubscriptionControler = {
        subscribeTest: (callback) => {
            var s = new Subscription({
                user: User.findBy({ username: 'santojon' }),
                responsible: User.findBy({ username: 'admin' }),
                status: false,
                created: new Date()
            })

            s.save()
            s.save(callback)

            // to save json at least php is needed
        },
        loadSubscriptions: (callback) => {
            var url = document.URL, 
                    shortUrl = url.substring(0, url.lastIndexOf('/'))
            var xhr = new XMLHttpRequest()

            xhr.open('get', shortUrl + '/data/dump.json', true)
            xhr.send()

            xhr.onreadystatechange = () =>
            {
                if (xhr.readyState == 4 && xhr.status == 200)
                {
                    if (dataPool.import(xhr.responseText, 'json')) callback()
                }
            }
        }
    }
}