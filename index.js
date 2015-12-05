/* jshint node: true */
'use strict';

module.exports = {
    name: 'eureka-widget-property-markdown',


    isDevelopingAddon: function() {
      return true;
    },

    included: function(app) {
        this._super.included(app);

        app.import(app.bowerDirectory + '/showdown/compressed/Showdown.js');
    }
};
