'use strict';

// var mobile = require('./mobile.js');

// //dos clases hijas de mobile, diferentes
// function player(lives, vel, dir, mods) {
//     mobile.apply(this, [lives, vel, dir]);
//     this.mods = mods;
// }
// player.prototype = Object.create(mobile.prototype);
// player.prototype.constructor = player;
// player.prototype.input = function () {};

function Player (position, scale, bodySize, bodyOffSet, sprite, game) {
    //this = game.add.sprite(position.x, position.y, sprite);

    Phaser.Sprite.call(this, game, position.x, position.y, sprite);
    game.add.existing(this);
    this.scale.setTo(scale.x, scale.y);

    game.physics.arcade.enable(this);
    this.body.setSize(bodySize.x, bodySize.y, bodyOffSet.x, bodyOffSet.y);
    this.body.collideWorldBounds = true;
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {

}


module.exports = Player;
