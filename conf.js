var appConfig = {
    front: {
        styles: [
            'style',
            'vendor/bootstrap.min',
            'vendor/font-awesome.min',
            'vendor/bracket.min'
        ],
        scripts: [
            'utils',
            'validators',
            'vendor/jquery.min',
            'vendor/bootstrap.min',
            'vendor/bracket.min'
        ],
        externalScripts: [
            'libs/frgg/frgg.js',
            'data/content/homecontent.js',
            'data/content/tournamentcontent.js'
        ]
    },
    back: {
        controllers: ['home', 'subscription', 'login', 'tournament', 'user'],
        services: ['phpbridge', 'myjsonbridge', 'subscription', 'user'],
        bwfDomains: ['user', 'subscription'],
        views: ['user', 'home', 'tournament', 'admin', 'login'],
        bridges: ['php', 'myjson']
    },
    conf: {
        appName: 'hardStone',
        language: navigator.language || 'pt-BR',
        dependencies: [
            'libs/bwf/bwf.full.js',
            'libs/bhdr/bhdr.js'
        ],
        dataPool: 'Bhdr',
        classLoader: 'Bwf',
        bwfDomain: true,
        bootstrap: true,
        debug: {
            controllers: true,
            services: true,
            bridges: true
        },
        transactional: {
            controllers: false,
            services: true,
            bridges: false
        },
        production: true
    }
}