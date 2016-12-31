"use strict";

var ScrollObserver = require('../../base/controller/ScrollObserver');
var modernizr = require('modernizr');

module.exports = ScrollObserver.extend({

    modelConstructor: ScrollObserver.prototype.modelConstructor.extend({
        session: {
            offset: {
                type: 'number',
                default: 0
            }
        }
    }),

    initialize: function() {
        ScrollObserver.prototype.initialize.apply(this, arguments);

        var picture = this.el.querySelector('picture');
        if(picture) {
            this.pictureStyle = picture.style;
            this.prefixedAttr = modernizr.prefixedCSS('box-shadow');
        }
    },

    onActive: function(info) {
        this.model.offset = info.y;
        if(this.pictureStyle) {
            this.pictureStyle.cssText = this.prefixedAttr + ': 0px ' + (info.y * 10) + 'px 10px rgba(0, 0, 0, 0.5);';
        }
    },

    onInactive: function() {
        // console.log('inactive');
    }
});
