'use strict';

function gameObject (position, scale, sprite, game) {
  //this = game.add.sprite(position.x, position.y, sprite);

  Phaser.Sprite.call(this, game, position.x, position.y, sprite);
  game.add.existing(this);
  this.scale.setTo(scale.x, scale.y);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

module.exports = gameObject;
