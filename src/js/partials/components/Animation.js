"use strict";

var Controller = require('../../base/Controller');

module.exports = Controller.extend({

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        if(this.targetModel) {
            this.targetModel.on('change:offset', update.bind(this));
            update.bind(this)(this.targetModel, this.targetModel.offset);
        }
    }
});

function update(model, value) {
    this.el.style.cssText = 'background-color: hsl(' + (180 + value * 180) + ',100%, 50%);';
}
