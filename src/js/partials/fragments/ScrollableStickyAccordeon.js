"use strict";

var Controller = require('../../base/Controller');
var DomModel = require('../../base/DomModel');
var dataTypeDefinition = require('../../base/dataTypeDefinition');
var Vector = require('../../base/Vector');
var Bounds = require('../../base/Bounds');

var element = require('../../utils/element');
var viewport = require('../../services/viewport');

var viewportDimension = new Vector();
var objectDimension = new Vector();

module.exports = Controller.extend({
    operation: 'subtractLocal',

    modelConstructor: DomModel.extend(dataTypeDefinition, {
        session: {
            extendedRange: {
                type: 'boolean',
                required: true,
                default: function() {
                    return false;
                }
            }
        }
    }),

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        this.header = this.el.querySelector('.top');
        this.footer = this.el.querySelector('.bottom');
        this.contentBounds = new Bounds();
        this.contentBoundsHeader = new Bounds();
        this.contentBoundsFooter = new Bounds();
        this.headerBounds = new Bounds();
        this.footerBounds = new Bounds();
        this.headerOutOfViewportInfo = null;
        this.footerOutOfViewportInfo = null;

        if(this.model.extendedRange) {
            this.operation = 'addLocal';
        }

        this.onInit = onInit.bind(this);
        this.onResize = onResize.bind(this);
        this.onScroll = onScroll.bind(this);

        viewport
            .on(viewport.EVENT_TYPES.INIT, this.onInit)
            .on(viewport.EVENT_TYPES.RESIZE, this.onResize)
            .on(viewport.EVENT_TYPES.SCROLL, this.onScroll);
    },

    onActive: function(infoFooter, infoHeader) {
        if(infoFooter.y === 1) {
            this.footer.classList.remove('js-scroll-sticky-bottom');
        } else if(infoFooter.y > -1) {
            this.footer.classList.remove('out-of-screen');
            this.footer.classList.add('js-scroll-sticky-bottom');
        } else {
            this.footer.classList.remove('js-scroll-sticky-bottom');
        }

        if(infoHeader.y === 1) {
            this.header.classList.remove('js-scroll-sticky-top');
        } else if(infoHeader.y > -1) {
            this.header.classList.remove('out-of-screen');
            this.header.classList.add('js-scroll-sticky-top');

        } else {
            this.header.classList.remove('js-scroll-sticky-top');
        }
    },

    onInactive: function(infoFooter) {
        if(infoFooter.y === -1) {
            this.footer.classList.add('out-of-screen');
        }

        if(infoFooter.y === 1) {
            this.header.classList.add('out-of-screen');
        }

        this.footer.classList.remove('js-scroll-sticky-bottom');
        this.header.classList.remove('js-scroll-sticky-top');
    },

    destroy: function() {
        viewport
            .off(viewport.EVENT_TYPES.INIT, this.onInit)
            .off(viewport.EVENT_TYPES.RESIZE, this.onResize)
            .off(viewport.EVENT_TYPES.SCROLL, this.onScroll);
        Controller.prototype.destroy.apply(this, arguments);
    }
});

function onScroll(viewportBounds, direction) {
    if(this.contentBoundsFooter.intersects(viewportBounds) || this.contentBoundsHeader.intersects(viewportBounds)) {
        this.headerOutOfViewportInfo = null;
        this.footerOutOfViewportInfo = null;
        this.onActive(getIntersectionInfo(this.contentBoundsFooter, objectDimension, viewportBounds, 'addLocal').clampLocal(-1, 1), getIntersectionInfo(this.contentBoundsHeader, objectDimension, viewportBounds, 'addLocal').clampLocal(-1, 1), direction);
    } else {
        if(!this.headerOutOfViewportInfo && !this.footerOutOfViewportInfo) {
            this.headerOutOfViewportInfo = new Vector();
            this.headerOutOfViewportInfo.reset(getIntersectionInfo(this.contentBoundsHeader, objectDimension, viewportBounds, 'addLocal')).clampLocal(-1, 1);
            this.footerOutOfViewportInfo = new Vector();
            this.footerOutOfViewportInfo.reset(getIntersectionInfo(this.contentBoundsFooter, objectDimension, viewportBounds, 'addLocal')).clampLocal(-1, 1);
            this.onInactive(this.footerOutOfViewportInfo, this.headerOutOfViewportInfo, direction);
        }
    }
}

function onInit(viewportBounds, direction) {
    element.updateBounds(this.el, this.contentBounds);
    element.updateBounds(this.header, this.headerBounds);
    element.updateBounds(this.footer, this.footerBounds);

    this.contentBoundsHeader.reset(this.contentBounds.min, this.contentBounds.max);
    this.contentBoundsHeader.min.addValuesLocal(0, viewportBounds.max.y - viewportBounds.min.y, 0);
    this.contentBoundsHeader.max.subtractValuesLocal(0, this.footerBounds.max.y - this.footerBounds.min.y, 0);
    this.contentBoundsHeader.max.subtractValuesLocal(0, this.headerBounds.max.y - this.headerBounds.min.y, 0);

    this.contentBoundsFooter.reset(this.contentBounds.min, this.contentBounds.max);
    this.contentBoundsFooter.min.addValuesLocal(0, this.headerBounds.max.y - this.headerBounds.min.y, 0);
    this.contentBoundsFooter.min.addValuesLocal(0, this.footerBounds.max.y - this.footerBounds.min.y, 0);
    this.contentBoundsFooter.max.subtractValuesLocal(0, viewportBounds.max.y - viewportBounds.min.y, 0);

    viewportDimension = viewportBounds.getDimension(viewportDimension);
    onScroll.bind(this)(viewportBounds, direction);
}

function onResize(viewportBounds, direction) {
    element.updateBounds(this.el, this.contentBounds);
    element.updateBounds(this.header, this.headerBounds);
    element.updateBounds(this.footer, this.footerBounds);

    this.contentBoundsHeader.reset(this.contentBounds.min, this.contentBounds.max);
    this.contentBoundsHeader.min.addValuesLocal(0, viewportBounds.max.y - viewportBounds.min.y, 0);
    this.contentBoundsHeader.max.subtractValuesLocal(0, this.footerBounds.max.y - this.footerBounds.min.y, 0);
    this.contentBoundsHeader.max.subtractValuesLocal(0, this.headerBounds.max.y - this.headerBounds.min.y, 0);

    this.contentBoundsFooter.reset(this.contentBounds.min, this.contentBounds.max);
    this.contentBoundsFooter.min.addValuesLocal(0, this.headerBounds.max.y - this.headerBounds.min.y, 0);
    this.contentBoundsFooter.min.addValuesLocal(0, this.footerBounds.max.y - this.footerBounds.min.y, 0);
    this.contentBoundsFooter.max.subtractValuesLocal(0, viewportBounds.max.y - viewportBounds.min.y, 0);

    viewportDimension = viewportBounds.getDimension(viewportDimension);
    onScroll.bind(this)(viewportBounds, direction);
}

function getIntersectionInfo(bounds, dimension, viewportBounds, operation) {
    return normalizeIntersectionInfoByRange(bounds.getIntersectionInfo(viewportBounds), getRange(bounds, dimension, operation));
}

function getRange(bounds, dimension, operation) {
    return bounds.getDimension(dimension)[operation](viewportDimension);
}

function normalizeIntersectionInfoByRange(intersectionInfo, range) {
    return intersectionInfo.divideLocal(range.absLocal());
}
