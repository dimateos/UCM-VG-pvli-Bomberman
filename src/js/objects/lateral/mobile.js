'use strict';

var bombable = require('./bombable.js');

//hija de bombable
function mobile(lives, vel, dir) {
    bombable.apply(this, [lives]);
    this.vel = vel;
    this.dir = dir;
}
mobile.prototype = Object.create(bombable.prototype);
mobile.prototype.constructor = mobile;
mobile.prototype.translate = function () {};

module.exports = mobile;
