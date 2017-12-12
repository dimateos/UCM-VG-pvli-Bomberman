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
var playerBodyOffset = new Point(-7,  32);
var playerExtraOffset = new Point(6, -20); //reaquired because player body is not full res

var playerImmovable = false;
var playerInvecible = true;

var playerLives = 5;
var playerNumBombs = 3;

var playerVelocity = 250;
var playerInvencibleTime = 5000;


function Player (game, level, numPlayer, tileData, groups, mods) {

    this.level = level;
    this.tileData = tileData;
    this.numPlayer = numPlayer;

    //produces respawn position based on playerSpawns[numPlayer]
    this.respawnPos = new Point(playerSpawns[numPlayer].x, playerSpawns[numPlayer].y)
        .applyTileData(this.tileData, playerExtraOffset);

    Bombable.call(this, game, groups.flame, this.respawnPos, playerSpritePath + this.numPlayer,
        tileData.Scale, playerBodySize, playerBodyOffset,
        playerImmovable, playerLives, playerInvecible);

    this.mods = mods;
    this.velocity = playerVelocity;

    this.numBombs = playerNumBombs;
    this.groups = groups;

    this.inputs = new Inputs (game, numPlayer);

    //Initial invencible time
    this.game.time.events.add(playerInvencibleTime, this.endInvencibility, this);
};

Player.prototype = Object.create(Bombable.prototype);
Player.prototype.constructor = Player;


Player.prototype.update = function() {

    this.checkFlames(); //bombable method

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

        this.numBombs--;

        var bombPosition = new Point(this.position.x, this.position.y)
            .getMapSquareValue(this.tileData, playerExtraOffset)
            .applyTileData(this.tileData);

        this.groups.bomb.add(new Bomb (this.game, this.level,
            bombPosition, this.tileData, this.groups, this, {}));

        this.inputs.bomb.ff = true;
    }
    else if(this.inputs.bomb.button.isUp) //deploy 1 bomb each time
        this.inputs.bomb.ff = false;

}

//player concrete logic for die
Player.prototype.die = function () {
    //console.log("checkin player die");

    this.lives--;
    this.respawn();

    if (this.lives <= 0) console.log("You ded, 0 lives");

    this.tmpInven = false; //vulneable again
}

//needs improvements ofc, atm only moves the player
Player.prototype.respawn = function () {
    this.position = this.respawnPos;
    this.invencible = true;

    this.game.time.events.add(playerInvencibleTime, this.endInvencibility, this);
}

Player.prototype.endInvencibility  = function () {
    console.log("Invencible ended");
    this.invencible = false;
}

module.exports = Player;
