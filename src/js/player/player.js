'use strict';

var Bombable = require('../objects/bombable.js'); //father
var Point = require('../general/point.js');

var Inputs = require('../general/inputs.js');
var Identifiable = require('../id/identifiable.js');
var Bomb = require('./bomb.js');

//default player values
var playerSpritePath = 'player_'; //partial, to complete with numPlayer

// var playerBodySize = new Point(48, 48); //little smaller
// var playerBodyOffset = new Point(0, 40);
var playerBodySize = new Point(40, 32); //little smaller
var playerBodyOffset = new Point(6, 48);
var playerExtraOffset = new Point(6, -20); //reaquired because player body is not full res

var playerImmovable = false;

var playerLives = 5;
var playerExtraLifePoints = 10;
var playerNumBombs = 1;

var playerInvencibleTime = 5000;
var playerRespawnedStoppedTime = 1000;
var playerDeathTime = 1500;
var playerLifeTime = 60*3*1000;

var Id = Identifiable.Id; //the mini factory is in Identifiable
var playerInitialModsIds = [/*new Id(1,2), new Id(1, 1), new Id(1,0)*/];
var playerMovAndInputs = require('./playerMovAndInputs.js'); //big chunk of code

var bodyVelocity;

var step = Math.PI * 2 / 360; //degrees
var playerInitialAlphaAngle = 30; //sin(playerInitialAlphaAnlge) -> alpha
var alphaWavingSpeed = 1.5;

function Player(game, level, numPlayer, tileData, groups) {

    this.numPlayer = numPlayer;
    this.points = 0;
    this.extraLives = 0;

    this.inputs = new Inputs(game, numPlayer); //based on numPlayer

    //produces respawn position based on playerSpawns[numPlayer]
    this.respawnPos = new Point(level.playerSpawns[numPlayer].x, level.playerSpawns[numPlayer].y)
        .applyTileData(tileData, playerExtraOffset);

    Bombable.call(this, game, level, groups, this.respawnPos, playerSpritePath + this.numPlayer,
        tileData.Scale, playerBodySize, playerBodyOffset, playerImmovable, playerLives, playerInvencibleTime);

    // this.anchor.setTo(0.3, 0);

    this.animations.add("walking_left", [24, 25, 26, 27, 28, 30, 31, 32], 10, true);
    this.animations.add("walking_right", [16, 17, 18, 19, 20, 21, 22, 23], 10, true);
    this.animations.add("walking_up", [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    this.animations.add("walking_down", [8, 9, 10, 11, 12, 13, 14, 15], 10, true);

    this.restartMovement();

    this.tileData = tileData;
    this.level = level;
    this.groups = groups;
    this.groups.player.add(this); //adds itself to the group

    this.numBombs = playerNumBombs;
    this.mods = [];
    this.bombMods = [];
    Identifiable.addPowerUps(playerInitialModsIds, this);

    this.deathCallback = undefined;

    this.counterAngle = playerInitialAlphaAngle*step;
};

Player.prototype = Object.create(Bombable.prototype);
Player.prototype.constructor = Player;


//Restarts all movements variables
Player.prototype.restartMovement = function () {
    this.velocity = playerMovAndInputs.getVel();
    this.dirs = { dirX: new Point(), dirY: new Point };
    this.prioritizedDirs = { first: this.dirs.dirX, second: this.dirs.dirY };
    this.blockedBacktrack = { x: false, y: false, turn: false };
    this.body.velocity = new Point();
}

//Starts the countdown to finish life, false if just starting
Player.prototype.restartCountdown = function (restarting) {
    if (this.deathCallback !== undefined) this.game.time.events.remove(this.deathCallback);

    var time = playerLifeTime;
    if (restarting) time+= playerRespawnedStoppedTime;

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

        if(bodyVelocity.x > 0){
            // this.scale.setTo(this.tileData.Scale.x, this.tileData.Scale.y);
            this.animations.play("walking_right");
        }
        else if (bodyVelocity.x < 0){
            // this.scale.setTo(this.tileData.Scale.x*-1, this.tileData.Scale.y);
            this.animations.play("walking_left");
        }
        else if (bodyVelocity.y > 0)
            this.animations.play("walking_down");
        else if (bodyVelocity.y < 0)
            this.animations.play("walking_up");
        else
            {
                this.animations.stop();
                this.frame = this.stopped_frames;
            }

    }
}

//changes alpha to simulate being invulnerable
Player.prototype.invencibleAlpha = function () {

    var tStep = Math.sin(this.counterAngle);
    // console.log(this.counterAngle/step);

    this.counterAngle += step*alphaWavingSpeed;

    //only positive sin (no negative alpha)
    if (this.counterAngle >= (180-playerInitialAlphaAngle)*step) {
        this.counterAngle = playerInitialAlphaAngle*step;
    }

    this.alpha = tStep;
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
        var n = this.points/(playerExtraLifePoints - this.points%playerExtraLifePoints);

        if (n > this.extraLives) {
            this.extraLives++;
            this.lives++;
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
    if (this.inputs.bomb.button.isDown && !this.inputs.bomb.ff && this.numBombs > 0
        && !this.game.physics.arcade.overlap(this, this.groups.bomb)) {
        //checks if the player is over a bomb

        //console.log(this.groups.bomb.children)
        //console.log(this.groups.flame.children)

        this.numBombs--;

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
Player.prototype.die = function () {
    console.log("checkin player die");
    this.lives--;
    this.dead = true; //to disable movement
    this.restartMovement();

    this.game.time.events.add(playerDeathTime, this.respawn, this);

    if (this.lives <= 0) {
        console.log("P" + this.numPlayer + ", you ded (0 lives)");
    }

    else this.game.time.events.add(playerDeathTime, flipInven, this);
    function flipInven() { this.tmpInven = false; }
}

//needs improvements, atm only moves the player
Player.prototype.respawn = function () {
    this.invencible = true;
    this.dead = true; //so he cannot move
    this.restartMovement(); //so it doesnt move inside walls
    this.restartCountdown(true);
    this.position = new Point(this.respawnPos.x, this.respawnPos.y);

    //callback to make end player's invulnerability
    this.game.time.events.add(playerInvencibleTime, this.endInvencibility, this);

    //callback used to give back the control to the player
    this.game.time.events.add(playerRespawnedStoppedTime, revive, this);
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
