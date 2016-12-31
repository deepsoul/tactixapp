"use strict";

var Controller = require('../Controller');
var DomModel = require('../DomModel');
var dataTypeDefinition = require('../dataTypeDefinition');

var viewport = require('../../services/viewport');

module.exports = Controller.extend({
    $el: null,

    directionCallbacks: {},

    modelConstructor: DomModel.extend(dataTypeDefinition, {
        session: {
            bounds: {
                type: 'Bounds',
                required: true
            },

            position:  {
                type: 'Vector',
                required: true
            },

            dimension:  {
                type: 'Vector',
                required: true
            }
        }
    }),

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        this.$el = $(this.el);

        this.callbacks = [this.onUp, this.onInit, this.onDown];

        viewport.register({
            INIT: onInit.bind(this),
            RESIZE: onResize.bind(this),
            SCROLL: onScroll.bind(this)
        }, this);

    },

    onInit: function() {
        console.log('init');
    },

    onUp: function() {
        console.log('scroll up');
    },

    onDown: function() {
        console.log('scroll down');
    },

    destroy: function() {
        viewport.unregister(this);
        Controller.prototype.destroy.apply(this, arguments);
    }
});

function onInit(viewportBounds, direction) {
    updateBounds(this.$el, this.model.position, this.model.dimension, this.model.bounds);
    this.callbacks[1].bind(this)(viewportBounds, direction);
}

function onResize(viewportBounds, direction) {
    updateBounds(this.$el, this.model.position, this.model.dimension, this.model.bounds);
    this.callbacks[direction.y + 1].bind(this)(viewportBounds, direction);
}

function onScroll(viewportBounds, direction) {
    this.callbacks[direction.y + 1].bind(this)(viewportBounds, direction);
}

function updateBounds(node, position, dimension, bounds) {
    var offset = node.offset();
    position.resetValues(offset.left, offset.top, 0);
    dimension.resetValues(node.outerWidth(), node.outerHeight(), 0);
    bounds.setMin(position).max.resetValues(dimension.x + position.x, dimension.y + position.y, dimension.z + position.z);
}
