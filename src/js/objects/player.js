'use strict';

var Bombable = require('./bombable.js'); //father
var Point = require('../point.js');

var Inputs = require('../inputs.js');
var Bomb = require('./bomb.js');
var Identifiable = require('../id/identifiable.js');

//default player values
var playerSpritePath = 'player_'; //partial, to complete with numPlayer

var playerBodySize = new Point(60, 60); //little smaller
var playerBodyOffset = new Point(-7, 32);
var playerExtraOffset = new Point(6, -20); //reaquired because player body is not full res

var playerImmovable = false;
var playerInvecible = true;

var playerLives = 5;
var playerNumBombs = 5;

var playerVelocity = 200;
var playerInvencibleTime = 5000;
var playerDeathTimer = 1500;

var Id = Identifiable.Id; //the mini factory is in Identifiable
var playerInitialModsIds = [/*new Id(1,2),*/ new Id (1,1), /*new Id(1,0)*/];


function Player (game, level, numPlayer, tileData, groups) {

    this.level = level;
    this.numPlayer = numPlayer;
    this.tileData = tileData;
    this.groups = groups;

    //produces respawn position based on playerSpawns[numPlayer]
    this.respawnPos = new Point(level.playerSpawns[numPlayer].x, level.playerSpawns[numPlayer].y)
        .applyTileData(this.tileData, playerExtraOffset);

    Bombable.call(this, game, groups, this.respawnPos, playerSpritePath + this.numPlayer,
        tileData.Scale, playerBodySize, playerBodyOffset,
        playerImmovable, playerLives, playerInvencibleTime);

    this.velocity = playerVelocity;
    this.numBombs = playerNumBombs;

    this.inputs = new Inputs (game, numPlayer); //based on numPlayer
    this.groups.player.add(this); //adds itself to the group

    this.mods = [];
    this.bombMods = [];
    Identifiable.addPowerUps(playerInitialModsIds, this);
};

Player.prototype = Object.create(Bombable.prototype);
Player.prototype.constructor = Player;


Player.prototype.update = function() {

    this.checkFlames(); //bombable method
    //if dead already no need to check
    if (!this.dead) this.checkEnemy();

    //if dead somehow yo do nothing
    if (!this.dead) {
        this.checkPowerUps();
        this.movementLogic()
        this.bombLogic();
    }
}

//checks for the next level portal too
Player.prototype.checkPowerUps = function() {

    this.game.physics.arcade.overlap(this, this.groups.powerUp, takePowerUp);

    function takePowerUp (player, powerUp) {
        //console.log("takin powerUp");
        player.mods.push(powerUp.id);

        Identifiable.pickPowerUp(powerUp, player);

        powerUp.destroy();
    }
}


Player.prototype.checkEnemy = function() {

    this.game.physics.arcade.overlap(this, this.groups.enemy, this.die, null, this);
}


Player.prototype.movementLogic = function() {
    this.body.velocity.x = 0; //stops the player
    this.body.velocity.y = 0;

    //input controls
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
}


//all the bomb deploying logic
Player.prototype.bombLogic = function() {
    if(this.inputs.bomb.button.isDown && !this.inputs.bomb.ff && this.numBombs > 0
        && !this.game.physics.arcade.overlap(this, this.groups.bomb)){

        //console.log(this.groups.bomb.children)
        //console.log(this.groups.flame.children)

        this.numBombs--;

        var bombPosition = new Point(this.position.x, this.position.y)
            .getMapSquareValue(this.tileData, playerExtraOffset)
            .applyTileData(this.tileData);

        var bombie = new Bomb (this.game, this.level,
            bombPosition, this.tileData, this.groups, this, this.bombMods)
        this.groups.bomb.add(bombie);

        //console.log(bombie)

        this.inputs.bomb.ff = true;
    }
    else if(this.inputs.bomb.button.isUp) //deploy 1 bomb each time
        this.inputs.bomb.ff = false;
}


//player concrete logic for die
Player.prototype.die = function () {
    //console.log("checkin player die");
    this.lives--;
    this.dead = true; //to disable movement
    this.body.velocity = new Point(); //stops the player

    this.game.time.events.add(playerDeathTimer, this.respawn, this);

    if (this.lives <= 0) {
        console.log("P" + this.numPlayer + ", you ded (0 lives)");
    }

    else this.game.time.events.add(playerDeathTimer, flipInven, this);
    function flipInven () { this.tmpInven = false; }
}

//needs improvements, atm only moves the player
Player.prototype.respawn = function () {
    this.position = new Point (this.respawnPos.x, this.respawnPos.y);
    this.body.velocity = new Point(); //sometimes the player gets in the wall
    this.invencible = true;
    this.dead = false;

    this.game.time.events.add(playerInvencibleTime, this.endInvencibility, this);
}

//just extended to see the player number
Player.prototype.endInvencibility  = function () {
    console.log("P" + this.numPlayer + " invencibility ended");
    this.invencible = false;
}

module.exports = Player;
