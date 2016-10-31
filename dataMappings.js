dataPool.map(
    User,
    Subscription
)

/**
 * Map paths to bridges
 */

// PHP bridge
var Php_bridge = {
    type: 'php',
    base: 'data/php_bridge',
    paths: {
        save: 'save',
        dump: 'dump',
        getDb: 'getDb'
    },
    bridgeTo: (to) => {
        with (Php_bridge) {
            return base + '/' + paths[to] + '.' + type
        }
    }
}


/**
 * Import existent databases
 */
PhpbridgeService.getDb()