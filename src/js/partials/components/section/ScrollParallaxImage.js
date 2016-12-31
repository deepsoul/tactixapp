"use strict";

var PositionObserver = require('../../../base/scroll/PositionObserver');
var modernizr = require('modernizr');

module.exports = PositionObserver.extend({

    modelConstructor: PositionObserver.prototype.modelConstructor.extend({
        session: {
            offset: {
                type: 'number',
                default: 0
            }
        }
    }),

    initialize: function() {
        var picture = this.el.querySelector('picture');

        this.pictureStyle = picture.style;
        this.prefixedAttr = modernizr.prefixedCSS('box-shadow');

        PositionObserver.prototype.initialize.apply(this, arguments);
    },

    onActive: function(info) {        
        this.pictureStyle.cssText = this.prefixedAttr + ': 0px ' + (info.y * 10) + 'px 10px rgba(0, 0, 0, 0.5);';
    },

    onInactive: function() {
        // console.log('inactive',info);
    }
});
