with (
    Sgfd.Base.autoMerge(MyjsonBridge)
) {
    var MyjsonbridgeService = new Sgfd.Service({
        metaName: 'MyjsonbridgeService',
        /**
         * Saves entire database to external file
         */
        dump: (text) => {          
            try {
                // create, build and send request
                var xhr = new XMLHttpRequest()
                xhr.open(
                    'put',
                    bridgeTo('all'),
                    true
                )

                xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
                xhr.send(text)
            } catch (ex) {
                console.log(ex)
            }
        },
        /**
         * Restore database
        */
        getDb: () => {
            try {
                // create, build and send request
                var xhr = new XMLHttpRequest()
                xhr.open(
                    'get',
                    bridgeTo('all'),
                    true
                )

                xhr.onreadystatechange = () => {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        dataPool.import(xhr.responseText, 'json')
                    }
                }

                xhr.send(null)
            } catch (ex) {
                console.log(ex)
            }
        }
    })
}