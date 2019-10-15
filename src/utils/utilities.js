/**Utilities class */
(function(window) {
    /**
     * Enabling String.format("{0},{1}", 1, 2)
     */
    if (!String.prototype.format) {
        String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined'
                ? args[number]
                : match;
            });
        };
    };    
})(window);