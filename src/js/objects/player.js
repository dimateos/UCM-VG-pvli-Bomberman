'use strict';

var  Bombable = require('./bombable.js'); //father

var Point = require('../point.js');

var Inputs = require('../inputs.js');
var Bomb = require('./bomb.js');

//spawns are in baseMapData (the info is shared with the map)
var playerSpawns = require("../maps/baseMapData.js").playerSpawns;

//default player values
var playerSpritePath = 'player_'; //partial, to complete with numPlayer

var playerBodySize = new Point(60, 60); //little smaller
var playerBodyOffset = new Point(-8,  32);
var playerExtraOffset = new Point(6, -20); //reaquired because player body is not full res

var playerImmovable = false;
var playerInvecible = false;

var playerLives = 5;
var playerNumBombs = 1;

var playerVelocity = 250;


function Player (game, numPlayer, tileData, bombGroup, mods) {

    this.tileData = tileData;
    this.numPlayer = numPlayer;

    //produces respawn position based on playerSpawns[numPlayer]
    this.respawnPos = new Point(playerSpawns[numPlayer].x, playerSpawns[numPlayer].y)
        .applyTileData(this.tileData, playerExtraOffset);

    Bombable.call(this, game, this.respawnPos, playerSpritePath + this.numPlayer,
        tileData.Scale, playerBodySize, playerBodyOffset,
        playerImmovable, playerLives, playerInvecible);

    this.mods = mods;
    this.velocity = playerVelocity;

    this.numBombs = playerNumBombs;
    this.bombGroup = bombGroup;

    this.inputs = new Inputs (game, numPlayer);
};

Player.prototype = Object.create(Bombable.prototype);
Player.prototype.constructor = Player;


Player.prototype.update = function() {

    this.body.velocity.x = 0; //stops the player
    this.body.velocity.y = 0;

    //MOVEMENT
    if (this.inputs.mov.left.isDown) {
        this.body.velocity.x = -this.velocity;
    }
    else if (this.inputs.mov.right.isDown) {
        this.body.velocity.x = this.velocity;
    }
    if (this.inputs.mov.up.isDown) {
        this.body.velocity.y = -this.velocity;
    }
    else if (this.inputs.mov.down.isDown){
        this.body.velocity.y = this.velocity;
    }

    //BOMB
    if(this.inputs.bomb.button.isDown && !this.inputs.bomb.ff && this.numBombs > 0){

        this.bombs--;

        var bombPosition = new Point(this.position.x, this.position.y)
            .getMapSquareValue(this.tileData, playerExtraOffset)
            .applyTileData(this.tileData);

        this.bombGroup.add(new Bomb (this.game,
            bombPosition, this.tileData.Scale, this.bombGroup, this, {}));

        this.inputs.bomb.ff = true;
    }
    else if(this.inputs.bomb.button.isUp) //deploy 1 bomb each time
        this.inputs.bomb.ff = false;

}

module.exports = Player;
