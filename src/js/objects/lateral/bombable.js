'use strict';

//clases a añadir lateralmente
function bombable(lives) {
    this.lives = lives;
}
bombable.prototype.beBombable = function () {};

module.exports = bombable;
