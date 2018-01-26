'use strict';

//Creates all the games's group
function Groups(game) {

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

}

//clears all but players (destroy + creates)
Groups.prototype.clearGroups = function (game) {

    var keys = Object.keys(this); //gets all the groups keys

        for (let i = 0; i < keys.length; i++) {
            if (keys[i] !== "player") {
                this[keys[i]].destroy(true);
                this[keys[i]] = game.add.group();
            }
        }
}

//draws all elemnts bodies
Groups.prototype.drawDebug = function (game) {

    var keys = Object.keys(this); //gets all the groups keys

    for (let i = 0; i < keys.length; i++) {

        for (let j = 0; j < this[keys[i]].length; j++)
            game.debug.body(this[keys[i]].children[j]);
    }
}

module.exports = Groups;
