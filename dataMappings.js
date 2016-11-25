/**
 * Mappings to in-memory dataPool
 */
dataPool.map(
    User,
    Subscription
)


/**
 * Map paths to bridges
 * External and/or not in-memory databases
 */

// PHP bridge
// Local database
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

// Myjson API bridge
// Database in [http://myjson.com/5953q]
var Myjson_bridge = {
    type: 'json',
    base: 'https://api.myjson.com/bins',
    paths: {
        all: '5953q',
    },
    bridgeTo: (to) => {
        with (Myjson_bridge) {
            return base + '/' + paths[to]
        }
    }
}

/**
 * Import existent databases to in-memory
 */
// PhpbridgeService.getDb()
// MyjsonbridgeService.getDb()