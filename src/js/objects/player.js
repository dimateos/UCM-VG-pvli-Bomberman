'use strict';

var Bombable = require('./bombable.js'); //father
var Point = require('../point.js');

var Inputs = require('../inputs.js');
var Bomb = require('./bomb.js');
var Identifiable = require('../id/identifiable.js');

//default player values
var playerSpritePath = 'player_'; //partial, to complete with numPlayer

// var playerBodySize = new Point(48, 48); //little smaller
// var playerBodyOffset = new Point(0, 40);
var playerBodySize = new Point(40, 32); //little smaller
var playerBodyOffset = new Point(3, 48);
var playerExtraOffset = new Point(6, -20); //reaquired because player body is not full res

var playerImmovable = false;

var playerLives = 5;
var playerNumBombs = 5;

//140 105
var playerVelocity = 140; //max=playerVelocity+5*10 (depends on powerUps)
//reduced velocity for the turn so the alignment is much smoother
//does not change with playerVelocity, so what changes is the relative reduction
//a starting -25% playerVelocity, and a max of ~45% (or less)
var playerVelocityTurning = 105;

var playerInvencibleTime = 5000;
var playerDeathTimer = 1500;

var Id = Identifiable.Id; //the mini factory is in Identifiable
var playerInitialModsIds = [/*new Id(1,2),*/ new Id(1, 1), /*new Id(1,0)*/];


function Player(game, level, numPlayer, tileData, groups) {

    this.numPlayer = numPlayer;
    this.inputs = new Inputs(game, numPlayer); //based on numPlayer
    this.tileData = tileData;

    //produces respawn position based on playerSpawns[numPlayer]
    this.respawnPos = new Point(level.playerSpawns[numPlayer].x, level.playerSpawns[numPlayer].y)
        .applyTileData(this.tileData, playerExtraOffset);

    Bombable.call(this, game, level, groups, this.respawnPos, playerSpritePath + this.numPlayer,
        tileData.Scale, playerBodySize, playerBodyOffset,
        playerImmovable, playerLives, playerInvencibleTime);

    this.velocity = playerVelocity;
    this.numBombs = playerNumBombs;

    this.dirs = { dirX: new Point(), dirY: new Point };
    this.prioritizedDirs = { first: this.dirs.dirX, second: this.dirs.dirY };
    this.fixedDir = new Point();
    this.blockedBacktrack = { x: false, y: false, turn: false };

    this.groups = groups;
    this.groups.player.add(this); //adds itself to the group

    this.mods = [];
    this.bombMods = [];
    Identifiable.addPowerUps(playerInitialModsIds, this);
};

Player.prototype = Object.create(Bombable.prototype);
Player.prototype.constructor = Player;

//Calls all methods
Player.prototype.update = function () {

    this.checkFlames(); //bombable method
    //if dead or invencible already no need to check
    if (!this.dead && !this.invencible) this.checkEnemy();

    //if dead somehow yo do nothing
    if (!this.dead) {
        this.checkPowerUps();
        this.movementLogic();
        this.bombLogic();
    }
}

//checks for powerUps and takes them
Player.prototype.checkPowerUps = function () {

    this.game.physics.arcade.overlap(this, this.groups.powerUp, takePowerUp);

    function takePowerUp(player, powerUp) {
        //console.log("takin powerUp");
        player.mods.push(powerUp.id);

        Identifiable.pickPowerUp(powerUp, player);

        powerUp.destroy();
    }
}

//atm simply checks overlapping
Player.prototype.checkEnemy = function () {

    this.game.physics.arcade.overlap(this, this.groups.enemy, this.die, null, this);
}

//reads inputs, fixes direction and moves
Player.prototype.movementLogic = function () {
    this.body.velocity.x = 0; //stops the player
    this.body.velocity.y = 0;

    this.readInput(); //read the input (prioritize it etc)
    var fixedFinalDir = new Point(), fixedExtraDir = new Point();

    //proceed to fix the dir of the first dir
    if (this.prioritizedDirs.first.x !== 0 || this.prioritizedDirs.first.y !== 0) {
        fixedFinalDir = this.fixedDirMovement(this.prioritizedDirs.first);

        //if turning is not blocked we check the second dir
        //if it is not null ofc; we treat it as the extra
        if (!this.blockedBacktrack.turn && (this.prioritizedDirs.second.x !== 0 || this.prioritizedDirs.second.y !== 0)) {
            fixedExtraDir = this.fixedDirMovement(this.prioritizedDirs.second);

            //now if the second fixed dir is different and not null or reversed
            //it is going to substitute the finalDir plus changes the preference
            if ((fixedExtraDir.x !== -fixedFinalDir.x || fixedExtraDir.y !== -fixedFinalDir.y)
                && (fixedExtraDir.x !== fixedFinalDir.x || fixedExtraDir.y !== fixedFinalDir.y)
                && (fixedExtraDir.x !== 0 || fixedExtraDir.y !== 0)) {

                fixedFinalDir.x = fixedExtraDir.x;
                fixedFinalDir.y = fixedExtraDir.y;

                //we block the turn and use a callback, required to get smoothness
                this.blockedBacktrack.turn = true;
                this.game.time.events.add(playerVelocityTurning, unlockTurning, this);

                //switching the preference
                if (this.prioritizedDirs.first === this.dirs.dirX) {
                    this.prioritizedDirs.first = this.dirs.dirY;
                    this.prioritizedDirs.second = this.dirs.dirX;
                }
                else {
                    this.prioritizedDirs.first = this.dirs.dirX;
                    this.prioritizedDirs.second = this.dirs.dirY;
                }
            }
        }
    }

    this.fixedDir.x = fixedFinalDir.x;
    this.fixedDir.y = fixedFinalDir.y;

    // if (fixedFinalDir.x !== 0 && fixedFinalDir.y !== 0)
    //     console.log(fixedFinalDir,fixedExtraDir,this.prioritizedDirs);

    console.log(fixedFinalDir.x, fixedFinalDir.y, " - ", fixedExtraDir.x, fixedExtraDir.y);
    //console.log(this.dirs.dirX.x, this.dirs.dirX.y, " - ", this.dirs.dirY.x, this.dirs.dirY.y);
    //console.log(this.prioritizedDirs.first.x, this.prioritizedDirs.first.y, " - ", this.prioritizedDirs.second.x, this.prioritizedDirs.second.y);

    //fixes the dir only if not null
    if ((fixedFinalDir.x !== 0 || fixedFinalDir.y !== 0)) {
        // console.log(fixedFinalDir.x, fixedFinalDir.y);

        //moves the player
        if (fixedFinalDir.x === 1) this.body.velocity.x = this.velocity;
        else if (fixedFinalDir.x === -1) this.body.velocity.x = -this.velocity;
        else if (fixedFinalDir.y === 1) this.body.velocity.y = this.velocity;
        else if (fixedFinalDir.y === -1) this.body.velocity.y = -this.velocity;
    }

    function unlockTurning() {this.blockedBacktrack.turn = false}

}

//reads the input, handles multiple keys
//prioritizes keys of the same axis them (last key pressed rules)
Player.prototype.readInput = function () {

    var nextDirX = new Point(); //sparate axis
    var nextDirY = new Point();
    var inputX = [];
    var inputY = [];

    //inputs are stored
    if (this.inputs.mov.left.isDown) inputX.push(-1);
    if (this.inputs.mov.right.isDown) inputX.push(1);
    if (this.inputs.mov.up.isDown) inputY.push(-1);
    if (this.inputs.mov.down.isDown) inputY.push(1);

    //handle double inputX (no backtracking)
    if (inputX.length === 2) { //if two inputs, reverse direction once
        if (this.blockedBacktrack.x) nextDirX = new Point(this.dirs.dirX.x, 0);
        else {
            nextDirX = new Point(-this.dirs.dirX.x, 0);
            this.blockedBacktrack.x = true;
        }
    } //only 1 input, remove blockedBacktrack
    else if (inputX.length === 1) {
        this.blockedBacktrack.x = false;
        nextDirX = new Point(inputX.pop(), 0);
    }

    //handle double inputY (no backtracking)
    if (inputY.length === 2) {
        if (this.blockedBacktrack.y) nextDirY = new Point(0, this.dirs.dirY.y);
        else {
            nextDirY = new Point(0, -this.dirs.dirY.y);
            this.blockedBacktrack.y = true;
        }
    }
    else if (inputY.length === 1) {
        this.blockedBacktrack.y = false;
        nextDirY = new Point(0, inputY.pop());
    }

    // console.log("X ", nextDirX.x, nextDirX.y, " - ", "Y ", nextDirY.x, nextDirY.y);
    this.prioritizeInputs(nextDirX, nextDirY);
}

Player.prototype.prioritizeInputs = function (nextDirX, nextDirY) {

    //reset dirs now (had to compare with previous)
    //we do not reset prioritized dirs
    this.dirs.dirX.x = 0;
    this.dirs.dirY.y = 0;

    //if there has been only one input
    if (nextDirX.x === 0 || nextDirY.y === 0) {
        if (nextDirX.x !== 0) {
            this.dirs.dirX.x = nextDirX.x;
            this.prioritizedDirs.first = this.dirs.dirX;
            this.prioritizedDirs.second = this.dirs.dirY;
        }
        else {
            this.dirs.dirY.y = nextDirY.y;
            this.prioritizedDirs.first = this.dirs.dirY;
            this.prioritizedDirs.second = this.dirs.dirX;
        }
    }
    //but if both are defined...
    else if (nextDirX.x !== 0 && nextDirY.y !== 0) {
        this.dirs.dirX.x = nextDirX.x;
        this.dirs.dirY.y = nextDirY.y;
    }

    // console.log(this.dirs.dirX.x, this.dirs.dirX.y, " - ", this.dirs.dirY.x, this.dirs.dirY.y);
    // console.log(this.prioritizedDirs.first.x, this.prioritizedDirs.first.y, " - ", this.prioritizedDirs.second.x, this.prioritizedDirs.second.y);
}

//very important, and documented... makes the player movement fixed
Player.prototype.fixedDirMovement = function (dir) {

    var fixedDir;
    this.velocity = playerVelocity; //mey be slowed down

    //virtual map pos and extra pos
    var positionMap = new Point(this.position.x, this.position.y)
        .getMapSquarePos(this.tileData, playerExtraOffset);
    var extraPosMap = new Point(this.position.x, this.position.y)
        .getMapSquareExtraPos(this.tileData, playerExtraOffset);

    //first chechs if the virtual map pos + dir is free
    if (this.level.isNextSquareFree(positionMap, dir)) {

        //if the player is perfectly aligned, moves along
        if (extraPosMap.x === 0 && extraPosMap.y === 0) {
            // console.log("1"); //all cases
            fixedDir = new Point(dir.x, dir.y);
        }
        //if dir and extra pos are parallel, moves along
        else if (extraPosMap.isParallel(dir)) {
            // console.log("2");
            fixedDir = new Point(dir.x, dir.y);
        }
        else { //next square is free but the player is not aligned
            //needs to be aligned, moves in negative extraPosMap
            // console.log("3");
            this.velocity = playerVelocityTurning;
            fixedDir = new Point(-extraPosMap.x, -extraPosMap.y);
        }
    }
    else { //the next square is blocked
        //if the player is perfectly aligned, does nothing
        if (extraPosMap.x === 0 && extraPosMap.y === 0) {
            // console.log("4");
            fixedDir = new Point();
        }
        //the player is not aligned, so it means there is room to move
        //it moves along (dir) and gets closer to the blocked square
        else if (extraPosMap.isParallel(dir)) {
            // console.log("5");
            this.velocity = playerVelocityTurning;
            fixedDir = new Point(dir.x, dir.y);
        }
        else {//if not aligned, moves towards the direction it's leaning to
            //so moves in extraPosMap trying to get around the blocked square
            //**is the only case that needs extra checking the map
            // console.log("6");

            var diagonalDir = new Point(dir.x, dir.y) //calculate diagonal
                .add(extraPosMap.x, extraPosMap.y);

            //check the diagonal square
            if (this.level.isNextSquareFree(positionMap, diagonalDir)) {
                this.velocity = playerVelocityTurning;
                fixedDir = new Point(extraPosMap.x, extraPosMap.y);
            }
            else fixedDir = new Point(); //if diagonal is blocked too, do nothing
        }
    }
    //console.log(fixedDir);
    return fixedDir;
}

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
    this.body.velocity = new Point(); //stops the player

    this.game.time.events.add(playerDeathTimer, this.respawn, this);

    if (this.lives <= 0) {
        console.log("P" + this.numPlayer + ", you ded (0 lives)");
    }

    else this.game.time.events.add(playerDeathTimer, flipInven, this);
    function flipInven() { this.tmpInven = false; }
}

//needs improvements, atm only moves the player
Player.prototype.respawn = function () {
    this.position = new Point(this.respawnPos.x, this.respawnPos.y);
    this.body.velocity = new Point(); //sometimes the player gets in the wall
    this.invencible = true;
    this.dead = false;

    this.game.time.events.add(playerInvencibleTime, this.endInvencibility, this);
}

//just extended to see the player number
Player.prototype.endInvencibility = function () {
    console.log("P" + this.numPlayer + " invencibility ended");
    this.invencible = false;
}

module.exports = Player;
