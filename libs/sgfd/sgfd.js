/**
 * Class responsible to create an configurable application
 * @param appConfig: the application configuration (an object or path to js file with 'appConfig' variable)
 * @param [optional] options: the options used in initialization, if needed
 */
function Sgfd(appConfig, options) {
    var sgfd = this;
    var options = options || {};
    if (!options['container']) options.container = window;

    /**
     * Load all needed data here. Chain order is very important!
     */
    var loader = function() {
        with (Sgfd.Base) {
            var loadList = [];

            if (options.externalSettings) {
                loadList.push(options.externalSettings);
            }

            if (typeof appConfig === 'string') loadList.push(appConfig);
            progressiveLoad(loadList, loadScript, function() {
                if (options.container.appConfig) {
                    appConfig = options.container.appConfig;
                }

                with (appConfig) {
                    // verify nullities
                    if (!back['domainClasses']) back['domainClasses'] = [];
                    if (!back['bwfDomains']) back['bwfDomains'] = [];
                    if (!back['controllers']) back['controllers'] = [];
                    if (!back['services']) back['services'] = [];
                    if (!back['views']) back['views'] = [];
                    if (!back['bridges']) back['bridges'] = [];

                    if (!front['externalScripts']) front['externalScripts'] = [];
                    if (!front['externalStyles']) front['externalStyles'] = [];
                    if (!front['scripts']) front['scripts'] = [];
                    if (!front['styles']) front['styles'] = [];

                    if (!conf['dependencies']) conf['dependencies'] = [];
                    if (!conf['bwfDomain']) conf['bwfDomain'] = false;
                    if (!conf['language']) conf['language'] = null;
                    if (!conf['appName']) conf['appName'] = 'New Sgfd Application';

                    // Verifies if has any full loading
                    if (back['full']) {
                        back.full.forEach(function(conf) {
                            back.domainClasses.push(conf);
                            back.bwfDomains.push(conf);
                            back.controllers.push(conf);
                            back.services.push(conf);
                            back.views.push(conf);
                        });
                    }
                    
                    // if not profuction flag, set to false
                    if (conf['production'] === undefined) conf.production = false;

                    // set production flags if true
                    if (conf.production) {
                        conf.bootstrap = false;
                        conf['debug'] = {
                            controllers: false,
                            services: false,
                            bridges: false
                        };
                        conf['transactional'] = {
                            controllers: false,
                            services: false,
                            bridges: false
                        };
                    }

                    // if no container, it will be the window
                    if (!conf['container']) conf.container = window;
                }

                // Then load all things
                with (autoMerge(appConfig.front, appConfig.back, appConfig.conf)) {
                    // Set default app title
                    document.title = appName;

                    // Load bwf domain files
                    if (bwfDomain) {
                        progressiveLoad(bwfDomains, loadBwfDomain);
                    }

                    if (language !== null) {
                        progressiveLoad(['data/languages/' + language + '.js'], loadScript);
                    }

                    // Load project dependencies
                    progressiveLoad(dependencies, loadScript, function() {
                        // Inject 'classLoader'
                        if (appConfig.conf['classLoader']) container['classLoader'] = new container[classLoader]();

                        // Inject 'database' access
                        if (appConfig.conf['dataPool']) container['dataPool'] = new container[dataPool]();

                        // Inject 'pages' manager
                        // TODO: create a page loader
                        container['pages'] = new Object();

                        // Inject views names
                        container['views'] = [];
                        views.forEach(function(view) {
                            container.views.push(view);
                        });

                        // Load back-end files
                        progressiveLoad(domainClasses, loadDomain, function() {
                            progressiveLoad(bridges, loadBridge, function() {
                                progressiveLoad(services, loadService, function() {
                                    progressiveLoad(controllers, loadController, function() {

                                        // Map the classes to 'database'
                                        // TODO: change how to make this
                                        progressiveLoad(['dataMappings.js'], loadScript, function() {
                                            // If bootstrap data is set on
                                            if (bootstrap) {
                                                progressiveLoad(['bootstrap.js'], loadScript);
                                            }
                                        });

                                        // Load front-end files
                                        progressiveLoad(externalScripts, loadScript, function() {
                                            progressiveLoad(scripts, loadScriptAsset, function() {
                                                progressiveLoad(externalStyles, loadStyle, function() {
                                                    progressiveLoad(styles, loadStyleAsset, function() {
                                                        progressiveLoad(views, loadView, function() {
                                                            // Run main script
                                                            progressiveLoad(['main.js'], loadScript, function() {
                                                                // Set translated app title (if exsists)
                                                                if (container['__']) document.title = __(appName);
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                })
                            });
                        });
                    });
                }
            });
        }
    };

    /**
     * Load file from an url and returns a string with its content
     * @param url: the url to fetch data.
     */
    var requireFile = function(url, fn) {
        var xhr;
        if(this.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else if(this.ActiveXObject) {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        } else {
            return false;
        }
        xhr.open('GET', url, false);
        if(xhr.overrideMimeType) {
            xhr.overrideMimeType('text/plain');
        }
        xhr.send(null);
        if(xhr.status == 200) {
            if (fn) {
                return fn(xhr.responseText);
            } else {
                return xhr.responseText;
            }
        }
        return false;
    };

    // instance related things
    sgfd.prototype = {
        /**
         * Initilizes the app
         */
        init: function() {
            return this;
        },
        /**
         * Load the app using given configs
         */
        load: function() {
            loader();
        },
        /**
         * Create view and add to config file of current application
         * This creates a view download and a cnew config file download
         * @param name: the view name
         */
        addView: function(name) {
            // Generate files to save
            requireFile('conf.js', function(v) {
                if (v.indexOf('views') != -1) {
                    v = v.replace(/views: \[[\n\ \'\"\,a-zA-Z0-9_-]*\]/, function(m) {
                        return m.replace(/]/, ', \'' + name + '\']')
                            .replace(/,\n[\ ]*}/, function(m) { return m.substring(1); });
                    });
                } else {
                    v = v.replace(/back: {/, 'back: {\n\
        views: [\'' + name + '\'],\n\
    ').replace(/\n[\ ]*\n/, '\n').replace(/,\n[\ ]*}/, function(m) { return m.substring(1); });
                }
                
                Sgfd.Cli.generateFile('conf', 'js', 'application/javascript', v);
            });
            
            Sgfd.Cli.generateView(name);
        },
        /**
         * Create controller and add to config file of current application
         * This creates a controller download and a cnew config file download
         * @param name: the controller name
         */
        addController: function(name) {
            // Generate files to save
            requireFile('conf.js', function(v) {
                if (v.indexOf('controllers') != -1) {
                    v = v.replace(/controllers: \[[\n\ \'\"\,a-zA-Z0-9_-]*\]/, function(m) {
                        return m.replace(/]/, ', \'' + name + '\']')
                            .replace(/,\n[\ ]*}/, function(m) { return m.substring(1); });
                    });
                } else {
                    v = v.replace(/back: {/, 'back: {\n\
        controllers: [\'' + name + '\'],\n\
    ').replace(/\n[\ ]*\n/, '\n').replace(/,\n[\ ]*}/, function(m) { return m.substring(1); });
                }
                
                Sgfd.Cli.generateFile('conf', 'js', 'application/javascript', v);
            });
            
            Sgfd.Cli.generateController(name);
        },
        /**
         * Create service and add to config file of current application
         * This creates a service download and a cnew config file download
         * @param name: the service name
         */
        addService: function(name) {
            // Generate files to save
            requireFile('conf.js', function(v) {
                if (v.indexOf('services') != -1) {
                    v = v.replace(/services: \[[\n\ \'\"\,a-zA-Z0-9_-]*\]/, function(m) {
                        return m.replace(/]/, ', \'' + name + '\']')
                            .replace(/,\n[\ ]*}/, function(m) { return m.substring(1); });
                    });
                } else {
                    v = v.replace(/back: {/, 'back: {\n\
        services: [\'' + name + '\'],\n\
    ').replace(/\n[\ ]*\n/, '\n').replace(/,\n[\ ]*}/, function(m) { return m.substring(1); });
                }

                Sgfd.Cli.generateFile('conf', 'js', 'application/javascript', v);
            });
            
            Sgfd.Cli.generateService(name);
        },
        /**
         * Create bridge and add to config file of current application
         * This creates a bridge download and a cnew config file download
         * @param name: the bridge name
         */
        addBridge: function(name) {
            // Generate files to save
            requireFile('conf.js', function(v) {
                if (v.indexOf('bridges') != -1) {
                    v = v.replace(/bridges: \[[\n\ \'\"\,a-zA-Z0-9_-]*\]/, function(m) {
                        return m.replace(/]/, ', \'' + name + '\']')
                            .replace(/,\n[\ ]*}/, function(m) { return m.substring(1); });
                    });
                } else {
                    v = v.replace(/back: {/, 'back: {\n\
        bridges: [\'' + name + '\'],\n\
    ').replace(/\n[\ ]*\n/, '\n').replace(/,\n[\ ]*}/, function(m) { return m.substring(1); });
                }

                Sgfd.Cli.generateFile('conf', 'js', 'application/javascript', v);
            });
            
            Sgfd.Cli.generateBridge(name);
        }
    };

    return sgfd.prototype.init();
}

/**
 * Base functions to load a sort of things into app
 */
Sgfd.Base = {
    /**
     * Function responsible to load an Array of files in chain
     * @param lst: the array of files
     * @param func: the load function to be used
     * @param callback: an optional callback to run in the end of the chain
     * 
     * TODO: work for custom containers (now only for window)
     */
    progressiveLoad: function(lst, func, callback) {
        if (lst instanceof Array) {
            if (lst.length > 1) {
                func(lst[0], function(){
                    lst.shift();
                    Sgfd.Base.progressiveLoad(lst, func, callback);
                });
            } else if (lst.length === 1) {
                func(lst[0], callback || function(){});
            } else {
                callback();
            }
        } else {
            if (callback) {
                callback();
            }
        }
    },
    /**
     * Function responsible to fetch a custom file
     */
    loadCustomFile: function(url, type, callback) {
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/' + type;
        script.src = url;

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        //script.onreadystatechange = callback;
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    },
    /**
     * Function responsible to fetch custom files
     */
    loadCustomFiles: function(urls, type, callback) {
        urls.forEach(function(url, i) {
            // Adding the script tag to the head as suggested before
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/' + type;
            script.src = url;

            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            if (i === (urls.length - 1)) {
                //script.onreadystatechange = callback;
                script.onload = callback;
            }

            // Fire the loading
            head.appendChild(script);
        });
    },
    /**
     * Function responsible to fetch scripts
     */
    loadScript: function(url, callback) {
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        //script.onreadystatechange = callback;
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    },
    /**
     * Function responsible to fetch asset scripts
     */
    loadScriptAsset: function(url, callback) {
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'assets/js/' + url + '.js';

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        //script.onreadystatechange = callback;
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    },
    /**
     * Function responsible to fetch asset scripts
     */
    loadScriptAssets: function(urls, callback) {
        urls.forEach(function(url, i) {
            // Adding the script tag to the head as suggested before
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'assets/js/' + url + '.js';

            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            if (i === (urls.length - 1)) {
                //style.onreadystatechange = callback;
                script.onload = callback;
            }

            // Fire the loading
            head.appendChild(script);
        });
    },
    /**
     * Function responsible to fetch scripts
     */
    loadScripts: function(urls, callback) {
        urls.forEach(function(url, i) {
            // Adding the script tag to the head as suggested before
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;

            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            if (i === (urls.length - 1)) {
                //script.onreadystatechange = callback;
                script.onload = callback;
            }

            // Fire the loading
            head.appendChild(script);
        });
    },
    /**
     * Function responsible to fetch bridge scripts
     */
    loadBridge: function(url, callback) {
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'data/bridges/' + url + 'bridge.js';

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        //script.onreadystatechange = callback;
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    },
    /**
     * Function responsible to fetch service scripts
     */
    loadBridges: function(urls, callback) {
        urls.forEach(function(url, i) {
            // Adding the script tag to the head as suggested before
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'data/bridges/' + url + 'bridge.js';

            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            if (i === (urls.length - 1)) {
                //script.onreadystatechange = callback;
                script.onload = callback;
            }

            // Fire the loading
            head.appendChild(script);
        });
    },
    /**
     * Function responsible to fetch service scripts
     */
    loadService: function(url, callback) {
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'services/' + url + 'service.js';

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        //script.onreadystatechange = callback;
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    },
    /**
     * Function responsible to fetch service scripts
     */
    loadServices: function(urls, callback) {
        urls.forEach(function(url, i) {
            // Adding the script tag to the head as suggested before
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'services/' + url + 'service.js';

            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            if (i === (urls.length - 1)) {
                //script.onreadystatechange = callback;
                script.onload = callback;
            }

            // Fire the loading
            head.appendChild(script);
        });
    },
    /**
     * Function responsible to fetch controller scripts
     */
    loadController: function(url, callback) {
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'controllers/' + url + 'controller.js';

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        //script.onreadystatechange = callback;
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    },
    /**
     * Function responsible to fetch controller scripts
     */
    loadControllers: function(urls, callback) {
        urls.forEach(function(url, i) {
            // Adding the script tag to the head as suggested before
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'controllers/' + url + 'controller.js';

            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            if (i === (urls.length - 1)) {
                //script.onreadystatechange = callback;
                script.onload = callback;
            }

            // Fire the loading
            head.appendChild(script);
        });
    },
    /**
     * Function responsible to fetch view scripts
     */
    loadView: function(url, callback) {
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'views/' + url + '.js';

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        //script.onreadystatechange = callback;
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    },
    /**
     * Function responsible to fetch view scripts
     */
    loadViews: function(urls, callback) {
        urls.forEach(function(url, i) {
            // Adding the script tag to the head as suggested before
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'views/' + url + '.js';

            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            if (i === (urls.length - 1)) {
                //script.onreadystatechange = callback;
                script.onload = callback;
            }

            // Fire the loading
            head.appendChild(script);
        });
    },
    /**
     * Function responsible to fetch domain scripts
     */
    loadDomain: function(url, callback) {
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'domain/' + url + '.js';

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        //script.onreadystatechange = callback;
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    },
    /**
     * Function responsible to fetch domain scripts
     */
    loadDomains: function(urls, callback) {
        urls.forEach(function(url, i) {
            // Adding the script tag to the head as suggested before
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'domain/' + url + '.js';

            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            if (i === (urls.length - 1)) {
                //script.onreadystatechange = callback;
                script.onload = callback;
            }

            // Fire the loading
            head.appendChild(script);
        });
    },
    /**
     * Function responsible to fetch bwf domain scripts
     */
    loadBwfDomain: function(url, callback) {
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/beowulf';
        script.src = 'domain/' + url + '.bwf';

        // Fire the loading
        head.appendChild(script);

        // call the callback function
        callback();
    },
    /**
     * Function responsible to fetch bwf domain scripts
     */
    loadBwfDomains: function(urls, callback) {
        urls.forEach(function(url, i) {
            // Adding the script tag to the head as suggested before
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/beowulf';
            script.src = 'domain/' + url + '.bwf';

            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            if (i === (urls.length - 1)) {
                // call the callback function
                callback();
            }

            // Fire the loading
            head.appendChild(script);
        });
    },
    /**
     * Function responsible to fetch stylesheets
     */
    loadStyle: function(url, callback) {
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.type = 'text/css';
        style.href = url;

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        //style.onreadystatechange = callback;
        style.onload = callback;

        // Fire the loading
        head.appendChild(style);
    },
    /**
     * Function responsible to fetch stylesheets
     */
    loadStyles: function(urls, callback) {
        urls.forEach(function(url, i) {
            // Adding the script tag to the head as suggested before
            var head = document.getElementsByTagName('head')[0];
            var style = document.createElement('link');
            style.rel = 'stylesheet';
            style.type = 'text/css';
            style.href = url;

            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            if (i === (urls.length - 1)) {
                //style.onreadystatechange = callback;
                style.onload = callback;
            }

            // Fire the loading
            head.appendChild(style);
        });
    },
    /**
     * Function responsible to fetch asset stylesheets
     */
    loadStyleAsset: function(url, callback) {
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.type = 'text/css';
        style.href = 'assets/css/' + url + '.css';

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        //style.onreadystatechange = callback;
        style.onload = callback;

        // Fire the loading
        head.appendChild(style);
    },
    /**
     * Function responsible to fetch asset stylesheets
     */
    loadStyleAssets: function(urls, callback) {
        urls.forEach(function(url, i) {
            // Adding the script tag to the head as suggested before
            var head = document.getElementsByTagName('head')[0];
            var style = document.createElement('link');
            style.rel = 'stylesheet';
            style.type = 'text/css';
            style.href = 'assets/css/' + url + '.css';

            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            if (i === (urls.length - 1)) {
                //style.onreadystatechange = callback;
                style.onload = callback;
            }

            // Fire the loading
            head.appendChild(style);
        });
    },
    /**
     * Used to merge many objects into a single one
     */
    merge: function() {
        var args = Array.prototype.slice.call(arguments);
        var result = {};

        var merge_options = function(obj1, obj3){
            for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
            return obj3;
        };

        args.forEach(function(argument) {
            result = merge_options(argument, result);
        });

        return result;
    },
    /**
     * Used to merge many objects into a single one adding self
     */
    autoMerge: function() {
        var args = Array.prototype.slice.call(arguments);
        var result = {};

        var merge_options = function(obj1, obj3){
            for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
            return obj3;
        };

        args.forEach(function(argument) {
            result = merge_options(argument, result);
        });

        return merge_options(Sgfd.Base, result);
    },
    /**
     * Used for debug purposes
     */
    trace: function(obj, key, args, callback) {
        var metaName = ((obj.metaName !== undefined)
            && (obj.metaName !== null)
                && (obj.metaName !== '')) ?
                    obj.metaName : 'NonMetaNamedClass';
        console.log(metaName + '.' + key + '(', args, ')');
        if (callback) callback();
    }
};

/**
 * Client used to create / generate files in Sgfd structure
 */
Sgfd.Cli = {
    /**
     * Templates os Files to generate
     */
    templates: {
        /**
         * Configuration file template generator
         * 
         * -- Identation is very important! Don't change it! --
         */
        conf: function(name) {
            return 'var appConfig = {\n\
    front: {},\n\
    back: {},\n\
    conf: {\n\
        appName: \'' + name + '\',\n\
        dependencies: [\n\
            // Your needed libs locations\n\
        ],\n\
        bootstrap: false\n\
    }\n\
};';
        },
        /**
         * TODO: dataMappings script template
         */
        dataMappings: '// The mappings to database goes here',
        /**
         * TODO: main script template
         */
        main: '// First script to run when app is fully loaded\n\
document.body.innerHTML = \'Hello world!\';',
        /**
         * Index page template
         * 
         * -- Identation is very important! Don't change it! --
         */
        index: function(sgfdPath) {
            return '<!DOCTYPE html>\n\
<html lang="en">\n\
    <head>\n\
        <meta charset="UTF-8">\n\
    </head>\n\
    <body>\n\
        <script type="text/javascript" src="' + sgfdPath + '"></script>\n\
        <script type="text/javascript">\n\
            // Loads all needed things to run app. It need \'sgfd.js\' loaded to work\n\
            var app = new Sgfd(\'conf.js\');\n\
            app.load();\n\
        </script>\n\
    </body>\n\
</html>';
        },
        /**
         * View file template generator
         * 
         * -- Identation is very important! Don't change it! --
         */
        view: function(name) {
            name = name.charAt(0).toUpperCase() + name.substring(1);
            return 'pages.' + name + ' = function(params) {\n\
    with (Sgfd.Base) {\n\
        // Put this file in \'views\' diretory\n\
    };\n\
};';
        },
        /**
         * Controller file template generator
         * 
         * -- Identation is very important! Don't change it! --
         */
        controller: function(name) {
            name = name.charAt(0).toUpperCase() + name.substring(1);
            return 'with (Sgfd.Base) {\n\
    var ' + name + 'Controller = new Sgfd.Controller({\n\
        metaName: \'' + name + 'Controller\',\n\
        index: function() {\n\
            // A function to be used in views etc\n\
            // Put it into \'controllers\' folder of your app\n\
        }\n\
    });\n\
};';
        },
        /**
         * Service file template generator
         * 
         * -- Identation is very important! Don't change it! --
         */
        service: function(name) {
            name = name.charAt(0).toUpperCase() + name.substring(1);
            return 'with (Sgfd.Base) {\n\
    var ' + name + 'Service = new Sgfd.Service({\n\
        metaName: \'' + name + 'Service\',\n\
        index: function() {\n\
            // A function to be used in controllers etc\n\
            // Put it into \'services\' folder of your app\n\
        }\n\
    });\n\
};';
        },
        /**
         * Bridge file template generator
         * 
         * -- Identation is very important! Don't change it! --
         */
        bridge: function(name) {
            name = name.charAt(0).toUpperCase() + name.substring(1);
            return 'with (Sgfd.Base) {\n\
    var ' + name + 'Bridge = new Sgfd.Bridge({\n\
        metaName: \'' + name + 'Bridge\',\n\
        index: function() {\n\
            // A function to be used in services etc\n\
            // Put it into \'data/bridges\' folder of your app\n\
        }\n\
    });\n\
};';
        }
    },
    /**
     * Generate view file and starts download of it
     */
    generateView: function(name) {
        var b = document.createElement('a');
        b.download = name + '.js';
        b.href = 'data:application/javascript;charset=utf-8,' +
            encodeURIComponent(Sgfd.Cli.templates.view(name));
        b.click();
    },
    /**
     * Generate controler file and starts download of it
     */
    generateController: function(name) {
        var b = document.createElement('a');
        b.download = name + 'controller.js';
        b.href = 'data:application/javascript;charset=utf-8,' +
            encodeURIComponent(Sgfd.Cli.templates.controller(name));
        b.click();
    },
    /**
     * Generate service file and starts download of it
     */
    generateService: function(name) {
        var b = document.createElement('a');
        b.download = name + 'service.js';
        b.href = 'data:application/javascript;charset=utf-8,' +
            encodeURIComponent(Sgfd.Cli.templates.service(name));
        b.click();
    },
    /**
     * Generate bridge file and starts download of it
     */
    generateBridge: function(name) {
        var b = document.createElement('a');
        b.download = name + 'bridge.js';
        b.href = 'data:application/javascript;charset=utf-8,' +
            encodeURIComponent(Sgfd.Cli.templates.bridge(name));
        b.click();
    },
    /**
     * Generate a file and starts download of it
     */
    generateFile: function(name, type, mime, templateFn, params) {
        var f = params ? templateFn(params) : templateFn;
        var b = document.createElement('a');
        b.download = name + '.' + type;
        b.href = 'data:' + mime + ';charset=utf-8,' +
            encodeURIComponent(f);
        b.click();
    },
    /**
     * Generate a sample app with options (controllers, views etc) and download all the files
     */
    scafold: function(name, options, sgfdPath) {
        var c = Sgfd.Cli.templates.conf(name);
        if (options) {
            if (options['views']) {
                options.views.forEach(function(v) {
                    if (c.indexOf('views') != -1) {
                        c = c.replace(/views: \[[\n\ \'\"\,a-zA-Z0-9_-]*\]/, function(m) {
                            return m.replace(/]/, ', \'' + v + '\']')
                                .replace(/,\n[\ ]*}/, function(m) { return m.substring(1); });
                        });
                    } else {
                    c = c.replace(/back: {/, 'back: {\n\
        views: [\'' + v + '\'],\n\
    ').replace(/\n[\ ]*\n/, '\n').replace(/,\n[\ ]*}/, function(m) { return m.substring(1); });
                    }

                    Sgfd.Cli.generateView(v);
                });
            }
            if (options['controllers']) {
                options.controllers.forEach(function(v) {
                    if (c.indexOf('controllers') != -1) {
                        c = c.replace(/controllers: \[[\n\ \'\"\,a-zA-Z0-9_-]*\]/, function(m) {
                            return m.replace(/]/, ', \'' + v + '\']')
                                .replace(/,\n[\ ]*}/, function(m) { return m.substring(1); });
                        });
                    } else {
                    c = c.replace(/back: {/, 'back: {\n\
        controllers: [\'' + v + '\'],\n\
    ').replace(/\n[\ ]*\n/, '\n').replace(/,\n[\ ]*}/, function(m) { return m.substring(1); });
                    }
                    Sgfd.Cli.generateController(v);
                });
            }
            if (options['services']) {
                options.services.forEach(function(v) {
                    if (c.indexOf('services') != -1) {
                        c = c.replace(/services: \[[\n\ \'\"\,a-zA-Z0-9_-]*\]/, function(m) {
                            return m.replace(/]/, ', \'' + v + '\']')
                                .replace(/,\n[\ ]*}/, function(m) { return m.substring(1); });
                        });
                    } else {
                    c = c.replace(/back: {/, 'back: {\n\
        services: [\'' + v + '\'],\n\
    ').replace(/\n[\ ]*\n/, '\n').replace(/,\n[\ ]*}/, function(m) { return m.substring(1); });
                    }

                    Sgfd.Cli.generateService(v);
                });
            }
            if (options['bridges']) {
                options.bridges.forEach(function(v) {
                    if (c.indexOf('bridges') != -1) {
                        c = c.replace(/bridges: \[[\n\ \'\"\,a-zA-Z0-9_-]*\]/, function(m) {
                            return m.replace(/]/, ', \'' + v + '\']')
                                .replace(/,\n[\ ]*}/, function(m) { return m.substring(1); });
                        });
                    } else {
                    c = c.replace(/back: {/, 'back: {\n\
        bridges: [\'' + v + '\'],\n\
    ').replace(/\n[\ ]*\n/, '\n').replace(/,\n[\ ]*}/, function(m) { return m.substring(1); });
                    }

                    Sgfd.Cli.generateBridge(v);
                });
            }
        }

        with (Sgfd.Cli) {
            generateFile('conf', 'js', 'application/javascript', c);
            generateFile('index', 'html', 'text/html', templates.index, sgfdPath || '{{ Sgfd location goes here! }}');
            generateFile('dataMappings', 'js', 'application/javascript', templates.dataMappings);
            generateFile('main', 'js', 'application/javascript', templates.main);
        }
    },
    /**
     * Generate a sample app and download all the files
     */
    init: function(name, sgfdPath) {
        with (Sgfd.Cli) {
            generateFile('conf', 'js', 'application/javascript', templates.conf, name);
            generateFile('index', 'html', 'text/html', templates.index, sgfdPath || '{{ Sgfd location goes here! }}');
            generateFile('dataMappings', 'js', 'application/javascript', templates.dataMappings);
            generateFile('main', 'js', 'application/javascript', templates.main);
        }
    }
};

/**
 * Represents a class to be used in routed objects creation
 * Is used by default to create Controllers, Services etc.
 */
Sgfd.ConfigurableRoutedClass = function(routes, options) {
    var c = this;
    c.prototype = {};
    var cbk = null;

    if (options['callback']) {
        cbk = options.callback;
    }

    c.prototype.init = function(op) {
        Object.keys(routes).forEach(function(key) {
            if (routes[key] instanceof Function) {
                // If is debuggable
                if (op.debug) {
                    // If dumps the database
                    if (op.transactional) {
                        c.prototype[key] = function(args) {
                             Sgfd.Base.trace(this, key, arguments, cbk);
                            //dump(dataPool.export('json'));

                            return routes[key].apply(this, arguments);
                        };
                    // Not dump
                    } else {
                        c.prototype[key] = function(args) {
                            Sgfd.Base.trace(this, key, arguments, cbk);
                            return routes[key].apply(this, arguments);
                        };
                    }
                // Not debuggable
                } else {
                    // transactional
                    if (op.transactional) {
                        c.prototype[key] = function(args) {
                            //dump(dataPool.export('json'));

                            return routes[key].apply(this, arguments);
                        };
                    // not transactional
                    } else {
                        c.prototype[key] = routes[key];
                    }
                }
            } else {
                c.prototype[key] = routes[key];
            }
        });
        return this;
    }

    return c.prototype.init(options);
};

/**
 * Create a controller object based in ConfigurableRoutedClass
 */
Sgfd.Controller = function(routes, options) {
    var _debug = undefined
    var _trans = undefined
    if (appConfig['conf']) {
        if (appConfig.conf['debug']) {
            if (appConfig.conf.debug['controllers']) {
                _debug = appConfig.conf.debug.controllers
            }
        }
    }
    if (appConfig['conf']) {
        if (appConfig.conf['transactional']) {
            if (appConfig.conf.transactional['controllers']) {
                _debug = appConfig.conf.transactional.controllers
            }
        }
    }
    var defaultOp = {
        debug: _debug || false,
        transactional: _trans || false
    };
    if ((options === null) || (options === undefined)) options = defaultOp;

    return new Sgfd.ConfigurableRoutedClass(routes, options);
};

/**
 * Create a service object based in ConfigurableRoutedClass
 */
Sgfd.Service = function(routes, options) {
    var _debug = undefined
    var _trans = undefined
    if (appConfig['conf']) {
        if (appConfig.conf['debug']) {
            if (appConfig.conf.debug['services']) {
                _debug = appConfig.conf.debug.services
            }
        }
    }
    if (appConfig['conf']) {
        if (appConfig.conf['transactional']) {
            if (appConfig.conf.transactional['services']) {
                _debug = appConfig.conf.transactional.services
            }
        }
    }
    var defaultOp = {
        debug: _debug || false,
        transactional: _trans || false
    };
    if ((options === null) || (options === undefined)) options = defaultOp;

    return new Sgfd.ConfigurableRoutedClass(routes, options);
};

/**
 * Create a controller object based in ConfigurableRoutedClass
 */
Sgfd.Bridge = function(routes, options) {
    var _debug = undefined
    var _trans = undefined
    if (appConfig['conf']) {
        if (appConfig.conf['debug']) {
            if (appConfig.conf.debug['bridges']) {
                _debug = appConfig.conf.debug.bridges
            }
        }
    }
    if (appConfig['conf']) {
        if (appConfig.conf['transactional']) {
            if (appConfig.conf.transactional['bridges']) {
                _debug = appConfig.conf.transactional.bridges
            }
        }
    }
    var defaultOp = {
        debug: _debug || false,
        transactional: _trans || false
    };
    if ((options === null) || (options === undefined)) options = defaultOp;

    return new Sgfd.ConfigurableRoutedClass(routes, options);
};

/**
 * @Override: Avoid others to get the code by this function
 */
Sgfd.toString = function() {
    return 'function Sgfd() { [native code] }';
};