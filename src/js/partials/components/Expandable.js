"use strict";

var Controller = require('../../base/Controller');
// var Flip = require('FLIP/dist/flip');
var TweenMax = require('gsap');
var Viewport = require('../../base/Viewport');
var viewport = require('../../services/viewport');

module.exports = Controller.extend({

    events: {
        'click': onClick
    },

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);
        console.log(global.FLIP);

        this.elViewport = new Viewport(this.el, this.el.querySelector('.content'));



        this.elViewport.on('RESIZE', function() {
            // if(this.opened) {

            // this.el.style.height = '100%';
            // $('html').css({
            //     height: (global.screen.height -36) + 'px'
            // });
            // $('html').addClass('overflow');


            // }
        }.bind(this));

        // this.elViewport.on('SCROLL', function(bounds) {
        //     // console.log(viewport.bounds.getIntersectionInfo(bounds));
        //     // console.log(this.elViewport.bounds.min.y, viewport.bounds.min.y);
        //     // console.log('toll', this.elViewport.offset);
        // }.bind(this));
        // this.el.classList.add('end');
        // Apply the 'end' class and snapshot the last position & opacity.
        this.opened = null;



    }
});

function onClick() {

    // this.el.classList.add('end');
    // //
    // this.opened = viewport.scrollY;
    // console.log(document.documentElement);

    console.log(210/(210 * (viewport.dimension.y / this.elViewport.dimension.y)));
    var duration = 0.25;
    // console.log(viewport.scrollDimension.y / this.elViewport.dimension.y, this.elViewport.dimension.y / viewport.scrollDimension.y, viewport);
    this.test = new TweenMax(this.el.querySelector('picture'), duration, {
        css: {
            scaleY: 472/(472 * (viewport.dimension.y / this.elViewport.dimension.y)),
            transformOrigin: "top center"
        },
        ease: 'linear'
    });


    this.tween = new TweenMax(this.el, duration, {
        css: {
            scaleY: viewport.dimension.y / this.elViewport.dimension.y,
            x: this.elViewport.bounds.min.x,
            y: viewport.bounds.min.y - this.elViewport.offset.y,
            transformOrigin: "top center"
        },
        ease: 'easeOut',
        onComplete: function() {

            global.animationFrame.add(function() {
                window.scrollTo(0,0);
                document.documentElement.style.cssText = 'transform: scaleY(' + this.elViewport.dimension.y / viewport.scrollDimension.y + '); transform-origin: top;';
                this.el.querySelector('picture').style.cssText = '';
                this.el.style.cssText = 'transform: translateY(1220px) scaleY(' + (viewport.scrollDimension.y / this.elViewport.dimension.y) + ')';


                // document.documentElement.classList.add('fixed');
                // global.animationFrame.add(function() {
                //     document.documentElement.classList.remove('fixed');
                // });
            }.bind(this));

        }.bind(this)
    });

    var tl = new TimelineMax({
        paused: true,
        yoyo:true,

    })
    .add([this.tween]);


    tl.play();
}
