var appConfig = {
    front: {
        styles: [
            'style',
            'vendor/bootstrap.min',
            'vendor/font-awesome.min'
        ],
        scripts: [
            'utils',
            'vendor/jquery.min',
            'vendor/bootstrap.min',
        ],
        externalScripts: [
            'libs/frgg/frgg.js'
        ]
    },
    back: {
        full: ['user'],
        controllers: ['home', 'subscription', 'login'],
        services: ['phpbridge', 'subscription'],
        bwfDomains: ['user', 'subscription'],
        views: ['home', 'join', 'status', 'admin', 'login']
    },
    conf: {
        appName: 'hardStone',
        dependencies: [
            'libs/bwf/bwf.full.js',
            'libs/bhdr/bhdr.js'
        ],
        dataPool: 'Bhdr',
        classLoader: 'Bwf',
        bwfDomain: true,
        bootstrap: true
    }
}