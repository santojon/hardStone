with (Sgfd.Base) {
    var PhpbridgeService = {
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
                Php_bridge.bridgeTo('save'),
                true
            )

            xhr.send(data)
        },
        /**
         * Saves entire database to file
         */
        dump: (text) => {
            console.log(text)
            // create form to do post
            var data = new FormData()

            // append text
            data.append('text' , text)

            // create, build and send request
            var xhr = new XMLHttpRequest()

            xhr.open(
                'post',
                Php_bridge.bridgeTo('dump'),
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
                Php_bridge.bridgeTo('getDb'),
                true
            )

            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    dataPool.import(xhr.responseText, 'json')
                }
            }

            xhr.send(null)
        }
    }
}