'use strict';

function Identifiable(id, timer) {
    this.id = id;
    this.timer = timer;

    //deactivate its collisions
    this.body.checkCollision.up = false;
    this.body.checkCollision.down = false;
    this.body.checkCollision.left = false;
    this.body.checkCollision.right = false;
  }

Identifiable.prototype.countDown = function() {};

module.exports = Identifiable;
