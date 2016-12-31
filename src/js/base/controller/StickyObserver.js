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
    modelConstructor: DomModel.extend(dataTypeDefinition, {
        session: {
            stickyPosition: {
                type: 'String',
                required: true,
                values: ['top', 'bottom'],
                default: function() {
                    return this.values[0];
                }
            },
            extendedRange: {
                type: 'Boolean',
                required: true,
                default: function() {
                    return true;
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


        viewport.register({
            INIT: onInit.bind(this),
            RESIZE: onResize.bind(this),
            SCROLL: onScroll.bind(this)
        }, this);

        console.log(this.model.stickyPosition);
    },

    onActive: function() {
        this.$el.addClass('sticky');
    },

    onInactive: function() {
        this.$el.removeClass('sticky');
    },

    destroy: function() {
        viewport.unregister(this);
        Controller.prototype.destroy.apply(this, arguments);
    }
});

function onScroll(viewportBounds) {
    var bounds = this.model.bounds;
    if(bounds.intersects(viewportBounds)) {
        var i = getIntersectionInfo(bounds, viewportBounds, 'subtractLocal');
        console.log('INTERSECT', i.y);
//        this.onActive(getIntersectionInfo(bounds, viewportBounds, this.operation));
    } else {
        console.log((viewportBounds.max.x < bounds.min.x || viewportBounds.max.y < bounds.min.y || viewportBounds.max.z < bounds.min.z));
//        console.log(bounds.max.x < viewportBounds.min.x || bounds.max.y < viewportBounds.min.y || bounds.max.z < viewportBounds.min.z);
//        this.onInactive();
    }
}

function onInit(viewportBounds) {
    var bounds = this.model.bounds;
    updateBounds(this.$el, this.model.position, this.model.dimension, bounds);
    viewportDimension = viewportBounds.getDimension(viewportDimension);
    onScroll.bind(this)(viewportBounds);
}

function onResize(viewportBounds) {
    var bounds = this.model.bounds;
    updateBounds(this.$el, this.model.position, this.model.dimension, bounds);
    viewportDimension = viewportBounds.getDimension(viewportDimension);
    onScroll.bind(this)(viewportBounds);
}

function updateBounds(node, position, dimension, bounds) {
    var offset = node.offset();
    position.resetValues(offset.left, offset.top, 0);
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
