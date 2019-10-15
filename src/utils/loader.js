/**
 * Lazy load for JS files and modular functions.
 * @author Robin Gonzalez, r1.ochoa@samsung.com.
 */
(function(window) {
  "use strict";
  /**
   * This class allows lazy load and module functions in JS files.
   * @class LoaderJS.
   * @constructor {string} version - JS file version to save on browser cache.
   * Example: new LoaderJS('0.0.3').require({angular:'js/angular.js'});
   */
    window.LoaderJS = function(version) {
        var className = 'LoaderJS';
        this.version = version || '0.0.1';
        this.totalRequired = 0;
        this.fails = [];
        var _this = this;
        var onSucess = function(modrequests) { console.log("{0}: {1}".format(className,"All scripts were loaded.")); };
        var onFail = function() { console.log("{0}: {1} [{2}]".format(className,"Some scripts were not loaded.",this.fails.toString()));};
        
        /**
         * Lazyload of javascript dependencies
         * @param  {Array} deps List of JS dependencies
         * @param  {function} callback onSucess callback
         * @param  {function} onError callback error
         */
        this.load = function(deps, callback, onError) {            
            if(deps instanceof Array) {
                var scripts = {};                
                for(var i=0; i<deps.length; i++) {
                    var name = deps[i].split('/');
                    name = name[name.length - 1].split('.')[0];
                    scripts[name] = deps[i];
                }
                this.require(scripts, callback, onError);
            } else {
                throw "Dependencies must be an Array, see document";
            }            
        }

        /**
         * Request the JS files to server.
         * @param {Object} scripts - Object with module name and JS file path, i.e. {jquery:'jquery.js'}.
         * @param {function} callback - Callback onSucess load.
         * @param {function} onError - Callback when some JS file fails to load.
         */
        this.require = function(scripts, callback, onError) {		
            cacheLJS.modrequests = {};
            this.fails = [];
            this.totalRequired = 0;
            this.callback = callback || onSucess;
            this.onError = onError || onFail;
            for(var mod in scripts) {
                if(scripts[mod] instanceof Array) {
                    this.load(scripts[mod], callback, onError);
                } else {
                    this.totalRequired++;
                    cacheLJS.modrequests[mod] = false;
                    if(cacheLJS.scripts.hasOwnProperty(mod)) {
                        onFinish(mod);
                    } else {
                        writeScript(mod, scripts[mod] + '?' + this.version);
                    }
                }
            }
        }
        
        /**
         * This function write script tag with its url source in the dom.
         * @param  {string} modname Module's name.
         * @param  {string} src Url src of the module.
         */
        var writeScript = function(modname, src) {
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = src;
            s.onload = function (e) { onFinish(modname); };
            s.addEventListener("error", function() { onErrorLoad(src); });
            (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(s);
        }
        
        /**
         * Makes an error list per each JS file that failed.
         */
        var onErrorLoad = function(src) {
            _this.fails.push(src);
            onFinish();
        }
        
        /**
         * This function is called once JS file was loaded.
         * @param {string} moduleName Module's name of JS file. 
         */
        var onFinish = function(moduleName) {
            if(moduleName) {	  
                cacheLJS.modrequests[moduleName] = cacheLJS.scripts[moduleName];
            }
            _this.totalRequired--;
            if(!_this.totalRequired) {
                if(_this.fails.length) {
                    _this.onError();
                } else {
                    _this.callback(cacheLJS.modrequests);
                }
            }		
        }
    };

    /**
     * Register the modules when are loaded.
     * @param {string} name Module's name.
     * @param {Object} fn Object with module properties.
     */
    window.defineJS = function(name, fn) {
        cacheLJS.scripts[name] = fn;
    }
    
    /**
     * JS files Cache.
     * @private.
     * @type {Object}
     */
    var cacheLJS = {
        scripts : {},     //Cache all modules
        modrequests: {}   //Modules requested
    }

})(window);