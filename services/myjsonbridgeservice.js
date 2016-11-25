with (Sgfd.Base) {
    var MyjsonbridgeService = {
        /**
         * Saves entire database to external file
         */
        dump: (text) => {          
            try {
                $.ajax({
                    url: Myjson_bridge.bridgeTo('all'),
                    type: 'PUT',
                    data: text,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json'
                })
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
                    Myjson_bridge.bridgeTo('all'),
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
    }
}