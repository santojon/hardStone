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

                    if (!front['externalScripts']) front['externalScripts'] = [];
                    if (!front['externalStyles']) front['externalStyles'] = [];
                    if (!front['scripts']) front['scripts'] = [];
                    if (!front['styles']) front['styles'] = [];

                    if (!conf['dependencies']) conf['dependencies'] = [];

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
                    
                    // if no container, it will be the window
                    if (!conf['container']) conf.container = window;
                }

                // Then load all things
                with (autoMerge(appConfig.front, appConfig.back, appConfig.conf)) {
                    // Load bwf domain files
                    if (bwfDomain) {
                        progressiveLoad(bwfDomains, loadBwfDomain);
                    }

                    // Load project dependencies
                    progressiveLoad(dependencies, loadScript, function() {
                        // Inject 'classLoader'
                        container['classLoader'] = new container[classLoader]();

                        // Inject 'database' access
                        container['dataPool'] = new container[dataPool]();

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
                                                        progressiveLoad(['main.js'], loadScript);
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                }
            });
        }
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
    }
};