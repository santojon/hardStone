/**
 * Myjson API bridge
 * Database in [http://myjson.com/5953q]
 */
var MyjsonBridge = new Sgfd.Bridge({
    metaName: 'MyjsonBridge',
    type: 'json',
    base: 'https://api.myjson.com/bins',
    paths: {
        all: '5953q',
    },
    bridgeTo: (to) => {
        with (MyjsonBridge) {
            return base + '/' + paths[to]
        }
    }
})