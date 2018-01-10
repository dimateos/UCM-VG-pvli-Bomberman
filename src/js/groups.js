'use strict';

//Creates all the games's group
function Groups(game) {

    this.game = game;

    //groups for tiles
    this.background = game.add.group();
    this.wall = game.add.group();
    this.box = game.add.group();

    this.portal = game.add.group();
    this.bomb = game.add.group();
    this.flame = game.add.group();

    this.powerUp = game.add.group();
    this.player = game.add.group();
    this.enemy = game.add.group();

    console.log(Object.keys(this))
}

//draws all elemnts bodies
Groups.prototype.drawDebug = function () {

    var keys = Object.keys(this); //gets all the groups

    for (let i = 0; i < keys.length; i++) {

        for (let j = 0; j < this[keys[i]].length; j++)
            this.game.debug.body(this[keys[i]].children[j]);
    }
}

module.exports = Groups;
