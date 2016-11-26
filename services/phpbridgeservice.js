with (
    Sgfd.Base.autoMerge(PhpBridge)
) {
    var PhpbridgeService = new Sgfd.Service({
        metaName: 'PhpbridgeService',
        /**
         * Saves text to file in server
         */
        saveFile: (text, usr, type, bt) => {
            // create form to do post
            var data = new FormData()

            // append text and user
            data.append('text' , text)
            data.append('user' , usr)
            data.append('type' , type)

            // create, build and send request
            var xhr = new XMLHttpRequest()

            xhr.onreadystatechange = () => {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    if (bt) {
                        bt.title = 'Saved!'
                        bt.disabled = true
                    }
                }
            }

            xhr.open(
                'post',
                bridgeTo('save'),
                true
            )

            xhr.send(data)
        },
        /**
         * Saves entire database to file
         */
        dump: (text) => {
            // create form to do post
            var data = new FormData()

            // append text
            data.append('text' , text)

            // create, build and send request
            var xhr = new XMLHttpRequest()

            xhr.open(
                'post',
                bridgeTo('dump'),
                true
            )

            xhr.send(data)
        },
        /**
         * Restore database
        */
        getDb: () => {
            // create, build and send request
            var xhr = new XMLHttpRequest()
            xhr.open(
                'get',
                bridgeTo('getDb'),
                true
            )

            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    dataPool.import(xhr.responseText, 'json')
                }
            }

            xhr.send(null)
        }
    })
}