"use strict";

var Controller = require('../Controller');
var DomModel = require('../DomModel');
var dataTypeDefinition = require('../dataTypeDefinition');
var Vector = require('../Vector');

var viewport = require('../../services/viewport');

var viewportDimension = new Vector();
var objectDimension = new Vector();
var abs = Math.abs;

module.exports = Controller.extend({
    $el: null,
    operation: 'subtractLocal',

    modelConstructor: DomModel.extend(dataTypeDefinition, {
        session: {
            extendedRange: {
                type: 'boolean',
                required: true,
                default: function() {
                    return false;
                }
            },

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


        if(this.model.extendedRange) {
            this.operation = 'addLocal';
        }

        viewport.register({
            INIT: onInit.bind(this),
            RESIZE: onResize.bind(this),
            SCROLL: onScroll.bind(this)
        }, this);
    },

    onActive: function(info, direction) {
        console.log('HUI', info.y, direction.y);
    },

    onInactive: function() {
//        console.log('BOOM', info.y);
    },

    destroy: function() {
        viewport.unregister(this);
        Controller.prototype.destroy.apply(this, arguments);
    }
});

function onScroll(viewportBounds, direction) {
    var bounds = this.model.bounds;
    // console.log(bounds.min,bounds.max, viewportBounds.min,viewportBounds.max);
    if(bounds.intersects(viewportBounds)) {
        this.onActive(getIntersectionInfo(bounds, viewportBounds, this.operation), direction);
    } else {
//        console.log((viewportBounds.max.x < bounds.min.x || viewportBounds.max.y < bounds.min.y || viewportBounds.max.z < bounds.min.z));
//        console.log(bounds.max.x < viewportBounds.min.x || bounds.max.y < viewportBounds.min.y || bounds.max.z < viewportBounds.min.z);
        this.onInactive(direction);
    }
}

function onInit(viewportBounds, direction) {
    var bounds = this.model.bounds;
    updateBounds(this.$el, this.model.position, this.model.dimension, bounds);
    viewportDimension = viewportBounds.getDimension(viewportDimension);
    onScroll.bind(this)(viewportBounds, direction);
}

function onResize(viewportBounds, direction) {
    var bounds = this.model.bounds;
    updateBounds(this.$el, this.model.position, this.model.dimension, bounds);
    viewportDimension = viewportBounds.getDimension(viewportDimension);
    onScroll.bind(this)(viewportBounds, direction);
}

function updateBounds(node, position, dimension, bounds) {
    var el = node.get(0);
    position.resetValues(el.offsetLeft, el.offsetTop, 0);
    dimension.resetValues(node.outerWidth(), node.outerHeight(), 0);
    bounds.setMin(position).max.resetValues(dimension.x + position.x, dimension.y + position.y, dimension.z + position.z);
}

function getIntersectionInfo(bounds, viewportBounds, operation) {
    return normalizeIntersectionInfoByRange(bounds.getIntersectionInfo(viewportBounds), getRange(bounds, operation));
}

function getRange(bounds, operation) {
    return bounds.getDimension(objectDimension)[operation](viewportDimension);
}

function normalizeIntersectionInfoByRange(intersectionInfo, range) {
    return intersectionInfo.divideValuesLocal(abs(range.x), abs(range.y), abs(range.z));
}
