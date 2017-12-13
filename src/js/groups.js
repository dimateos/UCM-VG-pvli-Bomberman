'use strict';

//Creates a super group to contain all of the game's groups
//and it's a group itself (extends Phaser.Group) - not really used now
function Groups(game) {

    Phaser.Group.call(this, game);

    //groups for tiles
    this.background = game.add.group();
    this.wall = game.add.group();
    this.box = game.add.group();

    this.bomb = game.add.group();
    this.flame = game.add.group();

    this.powerUp = game.add.group();
    this.player = game.add.group();

}
Groups.prototype = Object.create(Phaser.Group.prototype);
Groups.prototype.constructor = Groups;

module.exports = Groups;
