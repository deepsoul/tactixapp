"use strict";

var StateObserver = require('../../base/scroll/StateObserver');
var modernizr = require('modernizr');
var TweenMax = require('gsap');

module.exports = StateObserver.extend({
    tween: null,

    modelConstructor: StateObserver.prototype.modelConstructor.extend({
        session: {
            offset: {
                type: 'number',
                default: 0
            }
        }
    }),

    initialize: function() {
        StateObserver.prototype.initialize.apply(this, arguments);

        var picture = this.el.querySelector('picture svg image, picture img');
        this.tween = new TweenMax(this.el.querySelector('figcaption'), 0.35, {
            y:'0%',
            paused: true,
            yoyo:true,
            ease: 'linear'
        });

        this.model.on('change:triggered', function(model, value) {
            if(value) {
                this.tween.play();
            } else {
                this.tween.reverse();
            }
        }.bind(this));

        this.pictureStyle = picture.style;
        this.prefixedAttr = modernizr.prefixedCSS('transform');
    },

    onActive: function(info) {
        StateObserver.prototype.onActive.apply(this, arguments);
        if(this.pictureStyle) {
            this.pictureStyle.cssText = this.prefixedAttr + ': translateY(' + info.y * -10 + '%);';
        }
    },

    onInactive: function() {
        StateObserver.prototype.onInactive.apply(this, arguments);
        // console.log('inactive',info);
    }
});
