'use strict';

var solid = require('./gameObject.js');

//dos clases hijas de GO, diferentes
function solid(graphic, position) {
    gameObject.apply(this, [graphic, position]);
    }
    solid.prototype = Object.create(gameObject.prototype); //link the prototypes
    solid.prototype.constructor = solid;                   //correct the property
    solid.prototype.beSolid = function () {};              //specific solid behavior

module.exports = solid;
