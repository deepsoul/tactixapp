"use strict";

function Dimension(width, height, depth){
    if (!(this instanceof Dimension)) {
        return new Dimension(width, height, depth);
    }

    this.width = width || 0;
    this.height = height || 0;
    this.depth = depth || 0;
}

Dimension.prototype.width = 0;
Dimension.prototype.height = 0;
Dimension.prototype.depth = 0;

Dimension.prototype.setWidth = function(value){
    this.width = value;
    return this;
};

Dimension.prototype.setHeight = function(value){
    this.height = value;
    return this;
};

Dimension.prototype.setDepth = function(value){
    this.depth = value;
    return this;
};

Dimension.prototype.resetValues = function(width, height, depth){
    this.width = width;
    this.height = height;
    this.depth = depth;
    return this;
};

Dimension.prototype.reset = function(dimension){
    this.width = dimension.width;
    this.height = dimension.height;
    this.depth = dimension.depth;
    return this;
};

Dimension.prototype.add = function(dimension){
    return add(this, dimension.width, dimension.height, dimension.depth, new Dimension());
};

Dimension.prototype.addValues = function(width, height, depth){
    return add(this, width, height, depth, new Dimension());
};

Dimension.prototype.addLocal = function(dimension){
    return add(this, dimension.width, dimension.height, dimension.depth, this);
};

Dimension.prototype.addValuesLocal = function(width, height, depth){
    return add(this, width, height, depth, this);
};

function add(left, width, height, depth, result) {
    return result.reset(left.width + width, left.height + height, left.depth + (depth || 0));
}

Dimension.prototype.subtract = function(dimension){
    return subtract(this, dimension.width, dimension.height, dimension.depth, new Dimension());
};

Dimension.prototype.subtractValues = function(width, height, depth){
    return subtract(this, width, height, depth, new Dimension());
};

Dimension.prototype.subtractLocal = function(dimension){
    return subtract(this, dimension.width, dimension.height, dimension.depth, this);
};

Dimension.prototype.subtractValuesLocal = function(width, height, depth){
    return subtract(this, width, height, depth, this);
};

function subtract(left, width, height, depth, result) {
    return result.reset(left.width - width, left.height - height, left.depth - depth);
}

Dimension.prototype.multiply = function(dimension){
    return multiply(this, dimension.width, dimension.height, dimension.depth, new Dimension());
};

Dimension.prototype.multiplyValues = function(width, height, depth){
    return multiply(this, width, height, depth, new Dimension());
};

Dimension.prototype.multiplyLocal = function(dimension){
    return multiply(this, dimension.width, dimension.height, dimension.depth, this);
};

Dimension.prototype.multiplyValuesLocal = function(width, height, depth){
    return multiply(this, width, height, depth, this);
};

function multiply(left, width, height, depth, result) {
    return result.reset(left.width * width, left.height * height, left.depth * depth);
}

Dimension.prototype.divide = function(dimension){
    return divide(this, dimension.width, dimension.height, dimension.depth, new Dimension());
};

Dimension.prototype.divideValues = function(width, height, depth){
    return divide(this, width, height, depth, new Dimension());
};

Dimension.prototype.divideLocal = function(dimension){
    return divide(this, dimension.width, dimension.height, dimension.depth, this);
};

Dimension.prototype.divideValuesLocal = function(width, height, depth){
    return divide(this, width, height, depth, this);
};

function divide(left, width, height, depth, result) {
    return result.reset(left.width / width, left.height / height, left.depth / depth);
}

Dimension.prototype.equal = function() {
    var result = this;
    return validateValues(arguments, function(width, height, depth) {
        return result.width !== width || result.height !== height || result.depth !== depth;
    });
};

function validateValues(args, func) {
    if(args[0] && args[0].constructor === Dimension) {
        return func(args[0].width, args[0].height, args[0].depth);
    } else {
        return func(args[0] || 0, args[1] || 0, args[2] || 0);
    }
}

module.exports = Dimension;
