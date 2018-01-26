'use strict';
const config = require('../config.js');

const Point = require('../general/point.js'); //required

//default movement values
const playerVelocity = config.playerVelocity; //max=playerVelocity+5*10 (depends on powerUps)
const playerVelocityTurning = config.playerVelocityTurning; //140 105
//reduced velocity for the turn so the alignment is much smoother
//does not change with playerVelocity, so what changes is the relative reduction
//a starting -25% playerVelocity, and a max of ~45% (or less)

const playerExtraOffset = config.playerExtraOffset;

//big chunk of code imported by the player
var playerMoveAndInputs = {

//Information required by the player
getVel: function () {return playerVelocity},

//reads inputs, fixes direction and moves
movementLogic: function () {
    this.body.velocity.x = 0; //stops the player
    this.body.velocity.y = 0;

    this.readInput(); //read the input (prioritize it etc)
    var fixedFinalDir = new Point(), fixedExtraDir = new Point();

    //proceed to fix the dir of the first dir
    if (!this.prioritizedDirs.first.isNull()) {
        fixedFinalDir = this.fixedDirMovement(this.prioritizedDirs.first);

        //if turning is not blocked we check the second dir
        //if it is not null ofc; we treat it as the extra
        if (!this.blockedBacktrack.turn && !this.prioritizedDirs.second.isNull()) {
            fixedExtraDir = this.fixedDirMovement(this.prioritizedDirs.second);

            //now if the second fixed dir is different and not null or reversed
            //it is going to substitute the finalDir plus changes the preference
            if (!fixedExtraDir.isEqual(fixedFinalDir) && !fixedExtraDir.isNull()
                && !fixedExtraDir.isEqual(fixedFinalDir.inversed())) {

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

    //moves the player (only if dir is not null)
    if (fixedFinalDir.x === 1) this.body.velocity.x = this[config.speedKey];
    else if (fixedFinalDir.x === -1) this.body.velocity.x = -this[config.speedKey];
    else if (fixedFinalDir.y === 1) this.body.velocity.y = this[config.speedKey];
    else if (fixedFinalDir.y === -1) this.body.velocity.y = -this[config.speedKey];

    //callback
    function unlockTurning() { this.blockedBacktrack.turn = false }

    return this.body.velocity;
},

//reads the input, handles multiple keys
//prioritizes keys of the same axis them (last key pressed rules)
readInput: function () {

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

    this.prioritizeInputs(nextDirX, nextDirY);
},

prioritizeInputs: function (nextDirX, nextDirY) {

    //reset dirs now (had to compare with previous)
    //we do not reset prioritized dirs
    this.dirs.dirX.x = 0;
    this.dirs.dirY.y = 0;

    //if there has been only one input
    //(only really need to compare x or y not both)
    if (nextDirX.isNull() || nextDirY.isNull()) {
        if (!nextDirX.isNull()) {
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
    else if (!nextDirX.isNull() && !nextDirY.isNull()) {
        this.dirs.dirX.x = nextDirX.x;
        this.dirs.dirY.y = nextDirY.y;
    }
},

//very important, and documented... makes the player movement fixed
fixedDirMovement: function (dir) {

    var fixedDir;
    this[config.speedKey] = playerVelocity; //mey be slowed down

    //virtual map pos and extra pos
    var positionMap = new Point(this.position.x, this.position.y)
        .getMapSquarePos(this.tileData, playerExtraOffset);
    var extraPosMap = new Point(this.position.x, this.position.y)
        .getMapSquareExtraPos(this.tileData, playerExtraOffset);

    //first chechs if the virtual map pos + dir is free
    if (this.level.isNextSquareFree(positionMap, dir)) {

        //if the player is perfectly aligned, moves along
        if (extraPosMap.isNull()) {
            fixedDir = new Point(dir.x, dir.y);
        }
        //if dir and extra pos are parallel, moves along
        else if (extraPosMap.isParallel(dir)) {
            fixedDir = new Point(dir.x, dir.y);
        }
        else { //next square is free but the player is not aligned
            //needs to be aligned, moves in negative extraPosMap
            this[config.speedKey] = playerVelocityTurning;
            fixedDir = new Point(-extraPosMap.x, -extraPosMap.y);
        }
    }
    else { //the next square is blocked
        //if the player is perfectly aligned, does nothing
        if (extraPosMap.isNull()) {
            fixedDir = new Point();
        }
        //the player is not aligned, so it means there is room to move
        //it moves along (dir) and gets closer to the blocked square
        else if (extraPosMap.isParallel(dir)) {
            this[config.speedKey] = playerVelocityTurning;
            fixedDir = new Point(dir.x, dir.y);
        }
        else {//if not aligned, moves towards the direction it's leaning to
            //so moves in extraPosMap trying to get around the blocked square
            //**is the only case that needs extra checking the map

            var diagonalDir = new Point(dir.x, dir.y) //calculate diagonal
                .add(extraPosMap.x, extraPosMap.y);

            //check the diagonal square
            if (this.level.isNextSquareFree(positionMap, diagonalDir)) {
                this[config.speedKey] = playerVelocityTurning;
                fixedDir = new Point(extraPosMap.x, extraPosMap.y);
            }
            else fixedDir = new Point(); //if diagonal is blocked too, do nothing
        }
    }
    return fixedDir;
}

}

module.exports = playerMoveAndInputs;
