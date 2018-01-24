'use strict';
const config = require('../config.js');

const Bombable = require('../objects/bombable.js'); //father
const Point = require('../general/point.js');

const Inputs = require('../general/inputs.js');
const Identifiable = require('../id/identifiable.js');
const Bomb = require('./bomb.js');

//default player values
const playerSpritePath = config.keys.player; //partial, to complete with numPlayer

// const playerBodySize = config.playerBodySize; //little smaller
// const playerBodyOffset = config.playerBodyOffset;
const playerBodySize = config.playerBodySize; //little smaller
const playerBodyOffset = config.playerBodyOffset;
const playerExtraOffset = config.playerExtraOffset; //reaquired because player body is not full res

const playerImmovable = config.playerImmovable;

const playerLives = config.playerLives;
const playerExtraLifePoints = config.playerExtraLifePoints;
const playerNumBombs = config.playerNumBombs;

const playerInvencibleTime = config.playerInvencibleTime;
const playerRespawnedStoppedTime = config.playerRespawnedStoppedTime;
const playerDeathTime = config.playerDeathTime;
const playerLifeTime = config.playerLifeTime;

const Id = Identifiable.Id; //the mini factory is in Identifiable
const playerInitialModsIds = [/*new Id(1,2), new Id(1, 1), new Id(1,0)*/];
const playerPVPModsIds = [new Id(1, 2), new Id(1, 1)];

const playerMovAndInputs = require('./playerMovAndInputs.js'); //big chunk of code
var bodyVelocity;


function Player(game, level, numPlayer, tileData, groups, hudVidas) {

    this.numPlayer = numPlayer;
    this.points = 0;
    this.extraLives = 0;

    this.hudVidas = hudVidas;
    this.hudVidaAnim = hudVidas[numPlayer].animations.add('Clock');

    if (level.pvpMode) var animSpeed = config.hudAnimSpeedPvp;
    else var animSpeed = config.hudAnimSpeed;
    this.hudVidaAnim.play(animSpeed, true);
    this.hudVidaAnim.onLoop.add(this.die, this, 0, 0);

    this.wins = 0; //for pvp
    this.selfKills = 0;
    this.kills = 0;

    this.inputs = new Inputs(game, numPlayer); //based on numPlayer

    //produces respawn position based on playerSpawns[numPlayer]
    this.respawnPos = new Point(level.playerSpawns[numPlayer].x, level.playerSpawns[numPlayer].y)
        .applyTileData(tileData, playerExtraOffset);

    Bombable.call(this, game, level, groups, this.respawnPos, playerSpritePath + this.numPlayer,
        tileData.Scale, playerBodySize, playerBodyOffset, playerImmovable, playerLives, playerInvencibleTime);

    // this.anchor.setTo(0.3, 0);

    this.animations.add("walking_left", [24, 25, 26, 27, 28, 29, 30, 31], 10, true);
    this.animations.add("walking_right", [16, 17, 18, 19, 20, 21, 22, 23], 10, true);
    this.animations.add("walking_up", [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    this.animations.add("walking_down", [8, 9, 10, 11, 12, 13, 14, 15], 10, true);

    this.animations.add("dying", [32, 33, 34, 35, 36], 10);
    this.animations.add("spawn", [8], 15);
    this.animations.add("respawn", [36, 35, 34, 33, 32], 10);

    this.animations.play("spawn");

    this.restartMovement();

    this.tileData = tileData;
    this.level = level;
    this.groups = groups;
    this.groups.player.add(this); //adds itself to the group

    this[config.bombsKey] = playerNumBombs;
    this.mods = [];
    this.bombMods = [];
    Identifiable.addPowerUps(playerInitialModsIds, this);

    this.deathCallback = undefined;

    // this.counterAngle = playerInitialAlphaAngle * step;
};

Player.prototype = Object.create(Bombable.prototype);
Player.prototype.constructor = Player;


//Restarts all movements variables
Player.prototype.restartMovement = function () {
    this[config.speedKey] = playerMovAndInputs.getVel();
    this.dirs = { dirX: new Point(), dirY: new Point };
    this.prioritizedDirs = { first: this.dirs.dirX, second: this.dirs.dirY };
    this.blockedBacktrack = { x: false, y: false, turn: false };
    this.body.velocity = new Point();
}

//Starts the countdown to finish life, false if just starting
Player.prototype.restartCountdown = function (restarting) {
    if (this.deathCallback !== undefined) this.game.time.events.remove(this.deathCallback);

    var time = playerLifeTime;
    if (restarting) time += playerRespawnedStoppedTime;

    this.hudVidaAnim.restart();

    this.deathCallback = this.game.time.events.add(time, this.die, this);
    // console.log("countdown", this.deathCallback);
}


//Calls all methods
Player.prototype.update = function () {

    this.checkFlames(); //bombable method

    //if dead or invencible already no need to check
    if (!this.dead && !this.invencible) this.checkEnemy();

    //if dead somehow player does nothing
    if (!this.dead) {
        this.checkPowerUps();
        bodyVelocity = this.movementLogic();
        this.bombLogic();

        if (this.invencible) this.invencibleAlpha();

        if (bodyVelocity.x > 0) {
            // this.scale.setTo(this.tileData.Scale.x, this.tileData.Scale.y);
            this.animations.play("walking_right");
        }
        else if (bodyVelocity.x < 0) {
            // this.scale.setTo(this.tileData.Scale.x*-1, this.tileData.Scale.y);
            this.animations.play("walking_left");
        }
        else if (bodyVelocity.y > 0)
            this.animations.play("walking_down");
        else if (bodyVelocity.y < 0)
            this.animations.play("walking_up");
        else {
            this.animations.stop();
            this.frame = this.stopped_frames;
        }

    }
}


//checks for powerUps and takes them
Player.prototype.checkPowerUps = function () {

    this.game.physics.arcade.overlap(this, this.groups.powerUp, takePowerUp);

    function takePowerUp(player, powerUp) {
        //console.log("takin powerUp");
        player.mods.push(powerUp.id);

        player.addPoints(powerUp.pts); //add points too

        Identifiable.pickPowerUp(powerUp, player);

        powerUp.destroy();
    }
}

//atm simply checks overlapping
Player.prototype.checkEnemy = function () {
    this.game.physics.arcade.overlap(this, this.groups.enemy, this.die, null, this);
}

//adds points and lives if required
Player.prototype.addPoints = function (pts) {

    // console.log(this.points, " + ", pts);
    this.points += pts;

    if (this.points >= playerExtraLifePoints) {
        var n = (this.points - this.points % playerExtraLifePoints) / playerExtraLifePoints;

        if (n > this.extraLives) {

            this.extraLives++;
            this.lives++;
            // console.log(n, this.extraLives,  this.lives);
        }
    }
}

//reads inputs, fixes direction and then moves
Player.prototype.movementLogic = playerMovAndInputs.movementLogic;
//reads the input, handles multiple keys
//prioritizes keys of the same axis them (last key pressed rules)
Player.prototype.readInput = playerMovAndInputs.readInput;
Player.prototype.prioritizeInputs = playerMovAndInputs.prioritizeInputs;
//very important, and documented... makes the player movement fixed
Player.prototype.fixedDirMovement = playerMovAndInputs.fixedDirMovement;


//all the bomb deploying logic
Player.prototype.bombLogic = function () {
    if (this.inputs.bomb.button.isDown && !this.inputs.bomb.ff && this[config.bombsKey] > 0
        && !this.game.physics.arcade.overlap(this, this.groups.bomb)) {
        //checks if the player is over a bomb

        //console.log(this.groups.bomb.children)
        //console.log(this.groups.flame.children)

        this[config.bombsKey]--;

        var bombPosition = new Point(this.position.x, this.position.y)
            .getMapSquarePos(this.tileData, playerExtraOffset)
            .applyTileData(this.tileData);

        var bombie = new Bomb(this.game, this.level,
            bombPosition, this.tileData, this.groups, this, this.bombMods)
        this.groups.bomb.add(bombie);

        //console.log(bombie)

        this.inputs.bomb.ff = true;
    }
    else if (this.inputs.bomb.button.isUp) //deploy 1 bomb each time
        this.inputs.bomb.ff = false;
}


//player concrete logic for die
Player.prototype.die = function (flame) {
    console.log("checkin player die", this.level.pvpMode);

    this.dead = true; //to disable movement

    this.animations.play("dying");

    if (flame !== undefined && flame !== this.hudVidas[this.numPlayer] && flame.player !== undefined) {
        if (flame.player !== this) flame.player.kills++;
        else {
            flame.player.selfKills++; //for the show
            this.game.debug.text(" LOL", config.debugPos.x, config.debugPos.y, config.debugColor);
            this.game.time.events.add(playerInvencibleTime, function reset() { this.debug.reset(); }, this.game);
        }
    }
    // console.log(this.kills, this.selfKills);

    if (!this.level.pvpMode) {
        this.lives--;
        this.restartMovement();
        this.game.time.events.add(playerDeathTime, this.respawn, this);
        if (this.lives <= 0) {
            console.log("P" + this.numPlayer + ", you ded (0 lives)");
        }
    }
    else this.pvpModeDeath();

    this.game.time.events.add(playerDeathTime, flipInven, this);
    function flipInven() { this.tmpInven = false; }
}

//different behavior
Player.prototype.pvpModeDeath = function () {

    this.visible = false;

    var alive = 0;
    for (var i = 0; i < this.groups.player.children.length; i++) {
        if ((this.groups.player.children[i] !== this) && (!this.groups.player.children[i].dead))
            alive++;
    }

    if (alive <= 1) {
        for (var i = 0; i < this.groups.player.children.length; i++) {
            if (!this.groups.player.children[i].dead)
                this.groups.player.children[i].wins++;
        }
        this.level.regenerateMap();
    }

}

//Resets the player basically
Player.prototype.respawn = function () {

    this.invencible = true;
    this.dead = true; //so he cannot move

    if (this.lives > 0) {
        this.visible = true;
    this.animations.play("respawn");

        this.animations.play("spawn");

        this.restartMovement(); //so it doesnt move inside walls
        this.restartCountdown(true);
        this.position = new Point(this.respawnPos.x, this.respawnPos.y);

        //callback to make end player's invulnerability
        this.game.time.events.add(playerInvencibleTime, this.endInvencibility, this);

        //callback used to give back the control to the player
        this.game.time.events.add(playerRespawnedStoppedTime, revive, this);
    }
    else this.visible = false;

    function revive() {
        //fix for a bug: sometimes the position recives a tick of the velocity...
        //...after the respawn; so we double reset it
        this.position = new Point(this.respawnPos.x, this.respawnPos.y);
        this.dead = false;
    }
}

//just extended to see the player number
Player.prototype.endInvencibility = function () {
    console.log("P" + this.numPlayer + " invencibility ended");
    this.invencible = false;
    this.alpha = 1;
}


module.exports = Player;
