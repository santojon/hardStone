/**
 * PHP bridgeTo
 * Local database
 */
var PhpBridge = new Sgfd.Bridge({
    metaName: 'PhpBridge',
    type: 'php',
    base: 'data/bridges/php',
    paths: {
        save: 'save',
        dump: 'dump',
        getDb: 'getDb'
    },
    bridgeTo: (to) => {
        with (PhpBridge) {
            return base + '/' + paths[to] + '.' + type
        }
    }
})