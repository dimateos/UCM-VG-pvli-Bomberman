'use strict';

var  Bombable = require('./bombable.js'); //father

var Point = require('../point.js');

var Inputs = require('../inputs.js');
var Bomb = require('./bomb.js');


//spawns are in baseMapData (the info is shared with the map)
var playerSpawns = require("../maps/baseMapData.js").playerSpawns;

var extraOffset = {x: 7.5, y: -19}; //required because player body is not 64x64


function Player (game, numPlayer, tileData, bodySize, bodyOffSet, immovable, lives, invencible, bombs, bombGroup, mods) {

    //produces respawn position based on playerSpawns[numPlayer]
    this.respawnPos = new Point(playerSpawns[numPlayer].x, playerSpawns[numPlayer].y)
        .applyTileData(tileData).add(extraOffset.x, extraOffset.y);

    Bombable.call(this, game, this.respawnPos, 'player_'+ numPlayer,
        tileData.Scale, bodySize, bodyOffSet, immovable, lives, invencible);

    this.numPlayer = numPlayer;

    this.bombs = bombs;
    this.bombGroup = bombGroup;
    this.mods = mods;

    this.inputs = new Inputs (game, numPlayer);
};

Player.prototype = Object.create(Bombable.prototype);
Player.prototype.constructor = Player;


Player.prototype.update = function() {

    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    //MOVEMENT
    if (this.inputs.mov.left.isDown) {
      this.body.velocity.x = -250;
    }
    else if (this.inputs.mov.right.isDown) {
        this.body.velocity.x = 250;
    }
    if (this.inputs.mov.up.isDown) {
        this.body.velocity.y = -250;
    }
    else if (this.inputs.mov.down.isDown){
        this.body.velocity.y = 250;
    }

    //BOMB
    if(this.inputs.bomb.button.isDown && !this.inputs.bomb.ff){
        this.bombGroup.add(new Bomb (this.game, {x: this.position.x, y: this.position.y+22},
            'bomb', this.scale, {x: 64, y: 64}, {x: 0, y: 0}, true, 1, false, 3000, 1, this.bombGroup));

        this.inputs.bomb.ff = true;
    }
    else if(this.inputs.bomb.button.isUp) //deploy 1 bomb each time
        this.inputs.bomb.ff = false;

}

module.exports = Player;
