var appConfig = {
    front: {
        styles: ['style'],
        scripts: ['utils'],
        externalStyles: [
            'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css',
            'https://netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css'
        ],
        externalScripts: [
            'https://code.jquery.com/jquery-2.2.3.min.js',
            'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js',
            'https://use.fontawesome.com/670555b458.js',
            'libs/frgg/frgg.js'
        ]
    },
    back: {
        full: ['user'],
        controllers: ['home', 'subscription'],
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