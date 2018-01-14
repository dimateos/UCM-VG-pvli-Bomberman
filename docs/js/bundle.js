(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Bombable = require('../objects/bombable.js'); //father
var Point = require('../general/point.js');

var Identifiable = require('../id/identifiable.js'); //deploy power ups


//default enemy values
var enemySpritePath = 'enemy';
var enemyExtraOffset = new Point(0, 0);

var enemyImmovable = false;
var enemyInvecibleTime = 2500; //maybe reduce
var bombableTimer = 500; //to sync with flames

var enemyDataBase = require('./enemyDataBase.js');

function Enemy (game, position, level, enemyType, tileData, groups, dropId) {
    console.log("lul");
    this.groups = groups;
    this.tileData = tileData;
    this.level = level;

    this.enemyType = enemyType;
    this.pts = enemyDataBase[enemyType].pts;

    var enemyBodySize = enemyDataBase[enemyType].bodySize;
    var enemyBodyOffset = enemyDataBase[enemyType].bodyOffset;

    var enemySprite = enemySpritePath + "_" + enemyType; //constructed
    var enemyPosition = position.add(enemyExtraOffset.x, enemyExtraOffset.y);

    Bombable.call(this, game, level, groups, enemyPosition, enemySprite,
        tileData.Scale, enemyBodySize, enemyBodyOffset, enemyImmovable,
        enemyDataBase[enemyType].lives, enemyInvecibleTime, dropId);

    level.updateSquare(position, level.types.free.value); //clears the map square

    //starting the movement
    this.dir = new Point();
    this.velocity = enemyDataBase[enemyType].velocity;
    this.pickDirection();
    this.setSpeed(this.dir);
};

Enemy.prototype = Object.create(Bombable.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {

    this.checkFlames(); //bombable method

    if (this.dead) {
        this.body.immovable = true;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }
    else this.logicMovement();
}


//player, bomb, enemie, etc will extend this
Enemy.prototype.die = function (flame) {
    // console.log("checkin enemie die");
    this.lives--;

    if (this.lives <= 0) {
        this.dead = true;

        //if it has a power up, drops it
        if (this.dropId !== undefined)
            this.game.time.events.add(bombableTimer - 5, drop, this);

        flame.player.addPoints(this.pts);

        //then destroy itself
        this.game.time.events.add(bombableTimer + 5, this.destroy, this);
    }
    else this.game.time.events.add(bombableTimer, flipInven, this);

    function flipInven() { this.tmpInven = false; }
    function drop() {

        this.groups.powerUp.add(
            new Identifiable(this.game, this.position, this.scale, this.dropId));
    }
}


//all the IA is just movement
Enemy.prototype.logicMovement = function() {

    //virtual map pos and extra pos to cehck collisions
    var positionMap = new Point(this.position.x, this.position.y)
        .getMapSquarePos(this.tileData, enemyExtraOffset);
    var extraPosMap = new Point (this.position.x, this.position.y)
        .getMapSquareExtraPos(this.tileData, enemyExtraOffset);

    //first we check if the path is blocked
    if (this.checkCollision(positionMap, extraPosMap)) {

        this.body.velocity.x = 0; //stops the enemy
        this.body.velocity.y = 0;

        this.pickDirection(); //simple AI to change direction

        //moves the enemy (if it is not totally blocked) **may change this
        if (this.dir.x !== 0 || this.dir.y !== 0)
            this.setSpeed(this.dir);
    }
    //and then we check if some enemy is on the path
    else if (this.checkEnemyOverlap(positionMap)) {
        this.body.velocity.x *= -1; //inverts its velocity
        this.body.velocity.y *= -1;
        this.dir.multiply(-1,-1); //and dir accordingly too
    }
}

//Picks a new rnd direction (free)
Enemy.prototype.pickDirection = function() {

    var positionMap = new Point(this.position.x, this.position.y)
        .getMapSquarePos(this.tileData, enemyExtraOffset);

    var freeSurroungings = this.level.getSurroundingFreeSquares(positionMap);

    var rnd = this.game.rnd.integerInRange(0,freeSurroungings.length-1);

    // console.log(positionMap, freeSurroungings[rnd]);

    if (freeSurroungings.length === 0) this.dir = new Point();
    else this.dir = freeSurroungings[rnd];
}

//Simple method to set speed
Enemy.prototype.setSpeed = function(dir) {
    if (this.dir.x ===1) this.body.velocity.x = this.velocity;
    else if (this.dir.x ===-1) this.body.velocity.x = -this.velocity;
    else if (this.dir.y ===1) this.body.velocity.y = this.velocity;
    else if (this.dir.y ===-1) this.body.velocity.y = -this.velocity;
}

//checks if the enmy is getting closer to a block
Enemy.prototype.checkCollision = function(positionMap, extraPosMap) {
    var blocked = false;

    //checks if the next square is free and if the enemy is in the center
    if ((!this.level.isNextSquareFree(positionMap, this.dir))
    && extraPosMap.isNull()) {
        // console.log("Enemy turning");
        blocked = true;
    }

    return blocked;
}

//checks for enemies blocking the path
Enemy.prototype.checkEnemyOverlap = function(positionMap) {

    var enemyBlocking = false;
    this.game.physics.arcade.overlap(this, this.groups.enemy, checkPositions);

    return enemyBlocking;

    //only matters if the other enemy is blocking the path
    //(we do nothing if thisEnemy is the onw blocking otherEnemy)
    function checkPositions (thisEnemy, otherEnemy) {

        if (thisEnemy !== otherEnemy) { //not overlap with itself
            //console.log("Enemy overlapping");

            var otherEnemyPos = new Point(otherEnemy.position.x, otherEnemy.position.y)
                .getMapSquarePos(otherEnemy.tileData, enemyExtraOffset);

            //first calculates the next position
            var nextPos = new Point(positionMap.x, positionMap.y)
                .add(thisEnemy.dir.x, thisEnemy.dir.y)

            var positionsToCheck = getPositionsToCheck (nextPos, thisEnemy);
            // console.log(positionsToCheck);

            for (var i = 0; i < positionsToCheck.length; i++) {

                if (positionsToCheck[i].isEqual(otherEnemyPos))
                        enemyBlocking = true;
            }
        }
    }

    //returns an array with the next dir and the diagonals
    function getPositionsToCheck (nextPos, thisEnemy) {

        var positions = [positionMap, nextPos]; //array container

        //then both diagonals
        positions.push(getDiagonal(1));
        positions.push(getDiagonal(-1));

        return positions;

        //calculates the diagonal by adding and then fixing
        function getDiagonal(parameter) {

            var diagonalDir = new Point (thisEnemy.dir.x, thisEnemy.dir.y)
                .add(parameter, parameter);

            if (diagonalDir.x%2 === 0) diagonalDir.x = 0;
            if (diagonalDir.y%2 === 0) diagonalDir.y = 0;

            return new Point(nextPos.x, nextPos.y)
                .add(diagonalDir.x, diagonalDir.y);
        }
    }

}

module.exports = Enemy;

},{"../general/point.js":7,"../id/identifiable.js":9,"../objects/bombable.js":17,"./enemyDataBase.js":2}],2:[function(require,module,exports){
'use strict';

var Point = require('../general/point.js');

const basicVelocity = 90;

var enemyDataBase = [

    {
        lives: 1,
        velocity: basicVelocity,
        pts: 100,
        bodySize: new Point(48, 48),
        bodyOffset: new Point(8, 8),
    },
    {
        lives: 2,
        velocity: basicVelocity,
        pts: 400,
        bodySize: new Point(50, 50),
        bodyOffset: new Point(6, 6),
    },
    {
        lives: 1,
        velocity: basicVelocity*1.1,
        pts: 200,
        bodySize: new Point(42, 42),
        bodyOffset: new Point(10, 10),
    },

]

module.exports = enemyDataBase;

},{"../general/point.js":7}],3:[function(require,module,exports){
'use strict';

var Physical = require('../objects/physical.js');
var Point = require('../general/point.js');

//default flameentifiable values
var flameBodySize = new Point(48, 48); //little smaller
var flameBodyOffset = new Point(0, 0);
var flameExtraOffset = new Point(5, 5); //flame body is not full res
var flameImmovable = true;
var flameSprite = 'flame';

function Flame (game, position, scale, player) {

    this.player = player; //link to reward the kill/points

    var flamePosition = position.add(flameExtraOffset.x, flameExtraOffset.y);

    Physical.call(this, game, position, flameSprite, scale,
        flameBodySize, flameBodyOffset, flameImmovable);

}

Flame.prototype = Object.create(Physical.prototype);
Flame.prototype.constructor = Flame;

module.exports = Flame;

},{"../general/point.js":7,"../objects/physical.js":19}],4:[function(require,module,exports){
'use strict';

var globalControls = {

    //allow to add extra players
    addPlayerControl: function (gInputs, players, maxPlayers) {
        if (gInputs.addPlayer.button.isDown && !gInputs.addPlayer.ff && players.length < maxPlayers) {
            gInputs.addPlayer.ff = true;

            //adapt lives of the rest of the players
            for (var numPlayer = 0; numPlayer < players.length; numPlayer++) {
                //divides by 2 all players' lives (integers) but only down to 1
                if (players[numPlayer].lives > 1) {
                    players[numPlayer].lives -= players[numPlayer].lives % 2;
                    players[numPlayer].lives /= 2;
                }
            }

            var pSample = players[0]; //to use its values

            //even use its constructor to create the new  player
            players.push(new pSample.constructor(pSample.game, pSample.level,
                players.length, pSample.tileData, pSample.groups))

            //adapt the new player's lives
            players[players.length - 1].lives = pSample.lives;
        }

        else if (gInputs.addPlayer.button.isUp)
            gInputs.addPlayer.ff = false;
    },

    //shows hitboxes and allows movement through the boxes
    debugModeControl: function (gInputs, game, players) {
        if (gInputs.debug.button.isDown && !gInputs.debug.ff) {

            gInputs.debug.state = !gInputs.debug.state; //toggle state
            gInputs.debug.ff = true;

            players.callAll("endlessInvencibility");

            if (!gInputs.debug.state) {
                players.callAll("endInvencibility");
                game.debug.reset(); //reset whole debug render
            }
        }

        else if (gInputs.debug.button.isUp)
            gInputs.debug.ff = false;

    },

    //resets the actual level
    resetLevelControl: function (gInputs, level) {
        if (gInputs.resetLevel.button.isDown && !gInputs.resetLevel.ff) {
            gInputs.resetLevel.ff = true;

            level.regenerateMap();
        }

        else if (gInputs.resetLevel.button.isUp)
            gInputs.resetLevel.ff = false;
    },

    //loads next level
    nextLevelControl: function (gInputs, level) {
        if (gInputs.nextLevel.button.isDown && !gInputs.nextLevel.ff) {
            gInputs.nextLevel.ff = true;

            level.generateNextMap();
        }

        else if (gInputs.nextLevel.button.isUp)
            gInputs.nextLevel.ff = false;
    },

}

module.exports = globalControls;

},{}],5:[function(require,module,exports){
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
                // console.log(this[keys[i]].children);
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

},{}],6:[function(require,module,exports){
'use strict';

//returns the inputs for player 0-3
//sort of data storage/factory (it needs game's reference)

const debugPosX = 40;
const debugPosY = 600 - 96;
const debugPosSeparation = 15;
const debugColor = "yellow";

var debugCallback;

function Inputs(game, numPlayer) {

    if (numPlayer === -1) this.globalControls(game);
    else {

        //needed to be created first (atm it creates this.bomb)
        this.bomb = {ff: false}; //bomb flip flop (not really a control)

        this.switchControls(game, numPlayer);

    }
};

//all global inputs
Inputs.prototype.globalControls = function(game) {
    this.pMenu = {
        button: game.input.keyboard.addKey(Phaser.Keyboard.P),
        ff: false
    }
    this.addPlayer = {
        button: game.input.keyboard.addKey(Phaser.Keyboard.X),
        ff: false
    }
    this.debug = {
        button: game.input.keyboard.addKey(Phaser.Keyboard.C),
        ff: false,
        state: false
    }
    this.resetLevel = {
        button: game.input.keyboard.addKey(Phaser.Keyboard.B),
        ff: false,
    },
    this.nextLevel = {
        button: game.input.keyboard.addKey(Phaser.Keyboard.N),
        ff: false,
    }
}

//selects specific controls
Inputs.prototype.switchControls = function (game, numPlayer) {
    switch (numPlayer) {
        case 0:
            this.mov = {
                up: game.input.keyboard.addKey(Phaser.Keyboard.W),
                down: game.input.keyboard.addKey(Phaser.Keyboard.S),
                left: game.input.keyboard.addKey(Phaser.Keyboard.A),
                right: game.input.keyboard.addKey(Phaser.Keyboard.D),
            },

            this.bomb.button = game.input.keyboard.addKey(Phaser.Keyboard.E)

            this.drawDebug(game, numPlayer);
            break;

        case 1:
            this.mov = game.input.keyboard.createCursorKeys();

            this.bomb.button = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_1)

            this.drawDebug(game, numPlayer);
            break;

        case 2:
            this.mov = {
                up: game.input.keyboard.addKey(Phaser.Keyboard.T),
                down: game.input.keyboard.addKey(Phaser.Keyboard.G),
                left: game.input.keyboard.addKey(Phaser.Keyboard.F),
                right: game.input.keyboard.addKey(Phaser.Keyboard.H),
            },

            this.bomb.button = game.input.keyboard.addKey(Phaser.Keyboard.Y)

            this.drawDebug(game, numPlayer);
            break;

        case 3:
            this.mov = {
                up: game.input.keyboard.addKey(Phaser.Keyboard.I),
                down: game.input.keyboard.addKey(Phaser.Keyboard.K),
                left: game.input.keyboard.addKey(Phaser.Keyboard.J),
                right: game.input.keyboard.addKey(Phaser.Keyboard.L),
            },

            this.bomb.button = game.input.keyboard.addKey(Phaser.Keyboard.O)

            this.drawDebug(game, numPlayer);
            break;
    }
}

//writes the controls for a specific player
var stringsControls = ["WASD + E","ARROWS + Numpad_1","TFGH + Y","IJKL + O"]
Inputs.prototype.drawDebug = function(game, numPlayer) {

    if (debugCallback !== undefined) game.time.events.remove(debugCallback);

    game.debug.text(" - Controls P" +numPlayer+ ": " +stringsControls[numPlayer],
        debugPosX, debugPosY + debugPosSeparation * numPlayer, debugColor);

    // console.log(" - Controls P"+numPlayer+": " +stringsControls[numPlayer]);
    debugCallback = game.time.events.add(5000, function reset () {this.debug.reset();}, game);
}

module.exports = Inputs;

},{}],7:[function(require,module,exports){
'use strict';

//Used at aligment calculation, makes the center wide (instead of puntual)
var centerMarginPercentage = 0.001; //Will be multiplied for the square size

//Extends Phaser.Point
function Point(x, y) {

    Phaser.Point.call(this, x, y);
}
Point.prototype = Object.create(Phaser.Point.prototype);
Point.prototype.constructor = Point;


//calculates real position of a map point based on tileData
Point.prototype.applyTileData = function (tileData, extraOffset) {

    this.multiply(tileData.Res.x,tileData.Res.y)
    .multiply(tileData.Scale.x,tileData.Scale.y)
    .add(tileData.Offset.x, tileData.Offset.y);

    if (extraOffset !== undefined)
        return this.add(extraOffset.x, extraOffset.y);
    else return this;
}
//gets the calculated real position of a map point based on tileData
Point.prototype.getAppliedTileData = function (tileData, extraOffset) {

    var tmp = new Point(this.x, this.y)
        .multiply(tileData.Res.x,tileData.Res.y)
        .multiply(tileData.Scale.x,tileData.Scale.y)
        .add(tileData.Offset.x, tileData.Offset.y);

    if (extraOffset !== undefined)
        return tmp.add(extraOffset.x, extraOffset.y);
    else return tmp;
}

//calculates map position of a real point based on tileData
//** not the exact square **
Point.prototype.reverseTileData = function (tileData, extraOffset) {

    if (extraOffset !== undefined)
        this.subtract(extraOffset.x, extraOffset.y);

    this.subtract(tileData.Offset.x, tileData.Offset.y)
        .divide(tileData.Scale.x,tileData.Scale.y)
        .divide(tileData.Res.x,tileData.Res.y);

    return this;
}
//gets the calculated map position of a real point based on tileData
Point.prototype.getReversedTileData = function (tileData, extraOffset) {

    var tmp = new Point(this.x, this.y);
    //console.log(tmp);

    if (extraOffset !== undefined)
        tmp.subtract(extraOffset.x, extraOffset.y);

    tmp.subtract(tileData.Offset.x, tileData.Offset.y)
        .divide(tileData.Scale.x, tileData.Scale.y)
        .divide(tileData.Res.x, tileData.Res.y);

    return tmp;
}


//gets rounded map square value
Point.prototype.getMapSquarePos = function (tileData, extraOffset) {

    var exactMapValue = this.getReversedTileData(tileData, extraOffset);
    //console.log(exactMapValue);

    var difX = exactMapValue.x % 1;
    exactMapValue.x -= difX;
    if (difX >= 0.5) exactMapValue.x++;

    var difY = exactMapValue.y % 1;
    exactMapValue.y -= difY;
    if (difY >= 0.5) exactMapValue.y++;

    //console.log(exactMapValue);
    return exactMapValue;
}

//gets the relative normalized dir of the extra square the player is touching
//compares the real position and the calculated by getMapSquarePos
//there is some margin to detect being centered
Point.prototype.getMapSquareExtraPos = function (tileData, extraOffset) {

    var exactMapValue = this.getReversedTileData(tileData, extraOffset);
    var virtualMapValue = this.getMapSquarePos(tileData, extraOffset);
    var extraDir = new Point();
    // console.log(exactMapValue);
    // console.log(virtualMapValue);

    //margin to consider the center wide (not just a point)
    var margin = (tileData.Res.x*tileData.Scale.x+tileData.Res.y*tileData.Scale.y)/2;
    margin *= centerMarginPercentage;
    //console.log(margin);

    var difX = exactMapValue.x - virtualMapValue.x;
    //console.log(difX);
    if (difX < 0-margin) extraDir.x = -1;
    else if (difX > 0+margin) extraDir.x = 1;

    var difY = exactMapValue.y - virtualMapValue.y;
    if (difY < 0-margin) extraDir.y = -1;
    else if (difY > 0+margin) extraDir.y = 1;

    //console.log(extraDir);
    return extraDir;
}


//returns true if the directions are parallel (only normalized dirs)
Point.prototype.isParallel = function (dir) {
    return (this.isEqual(dir)) || (this.isEqual(dir.inversed()));
}

//return true if the points are equal
Point.prototype.isEqual = function (otherPoint) {
    return (this.x === otherPoint.x && this.y === otherPoint.y)
}

//returns the inverse of the point
Point.prototype.inversed = function (otherPoint) {
    return new Point(-this.x, -this.y);
}

//returns true if the point is null
Point.prototype.isNull = function () {
    return this.isEqual(new Point());
}

module.exports = Point;

},{}],8:[function(require,module,exports){
'use strict';

var modsFunctions = require('./modsFunctions.js'); //all the database
//*A previous version with types of mods (instead of all functions)
//*is in "unused" folder, but the fixed applyMods was removed directly

//contains the different tiers, and inside the power ups
var idDataBase = [

    [ //tier 0 reserved for the portal to next level
        //not power up but the id (0,0) is used by the map
        /*{   //0
            sprite: 'portal', pts: 0,
            mods: [modsFunctions.levelUp]
        },*/
    ],

    [ //tier 1 //maybe sprite more generic + add name?
        {   //0
            sprite: 'powerUpBombUp', pts: 10,
            mods: [modsFunctions.bombUp]
        },
        {   //1
            sprite: 'powerUpFlameUp', pts: 200,
            mods: [modsFunctions.flameUp]
        },
        {   //2
            sprite: 'powerUpSpeedUp', pts: 400,
            mods: [modsFunctions.speedUp]
        }
    ]
];

module.exports = idDataBase;

},{"./modsFunctions.js":10}],9:[function(require,module,exports){
'use strict';

var Physical = require('../objects/physical.js');
var Point = require('../general/point.js');

var idDataBase = require('./idDataBase.js'); //all the database

//default identifiable values
var idBodySize = new Point(32, 32); //little smaller
var idBodyOffset = new Point(0, 0);
var idExtraOffset = new Point(14, 10); //id body is not full res
var idImmovable = true;

var powerUpSound;

function Identifiable(game, position, scale, id) {

    var idPosition = new Point (position.x, position.y).add(idExtraOffset.x, idExtraOffset.y);

    Physical.call(this, game, idPosition, idDataBase[id.tier][id.num].sprite,
      scale, idBodySize, idBodyOffset, idImmovable);

    powerUpSound = this.game.add.audio('powerup');

    this.id = id;
    this.pts = idDataBase[id.tier][id.num].pts;
}

Identifiable.prototype = Object.create(Physical.prototype);
Identifiable.prototype.constructor = Identifiable;


//method used by players to pick powerUps (so they do not need idDataBase)
Identifiable.pickPowerUp = function(powerUp, player) {
    var mods = idDataBase[powerUp.id.tier][powerUp.id.num].mods;
    powerUpSound.play();
    Identifiable.applyMods(mods, player);
}


//generic base id factorie
Identifiable.Id = function (tier, num) {this.tier = tier; this.num = num;}
//get tier size (for the map rnd generation)
Identifiable.tierSize = function (tier) {return idDataBase[tier].length}


Identifiable.addPowerUps = function(powerUpIds, target, reverseMode) {
  //Adds the id of the mods to the player.mods (so we can reverse them, etc)
  for (var i = 0; i < powerUpIds.length; i++) {
      if (!reverseMode)target.mods.push(powerUpIds[i]);
      //else target.mods.pop(); //ordered. NOT SURE if we should keep them
      //we do not pop, we keep target.mods as a log of powerUps

      var mods = idDataBase[powerUpIds[i].tier][powerUpIds[i].num].mods;
      Identifiable.applyMods(mods, target, reverseMode);
  }
}

//call respectives functions applied to the player
Identifiable.applyMods = function(mods, target, reverseMode) {
  for (var i = 0; i < mods.length; i++) {
      //console.log(target[mods[i].key]);
      //console.log(mods[i].key, mods[i].mod);
      mods[i].call(target, reverseMode);
  }
  //console.log(target.mods);
}

module.exports = Identifiable;

},{"../general/point.js":7,"../objects/physical.js":19,"./idDataBase.js":8}],10:[function(require,module,exports){
'use strict';

//they all look the same xd should improve it
//but allows modifications

//this should all be based on player
//so maybe add references (min values etc)

var bombsKey = "numBombs";
var bombsAdd = 1;
var bombsMin = 1;
var bombsMax = 10;

var flameKey = "power";
var flameAdd = 1;
var flameMax = 10; //no flame min needed

var speedKey = "velocity";
var speedAdd = 25;
var speedMin = 200;
var speedLimit = speedMin + speedAdd*8;


//contains the different powerUp's functions. Unordered.
var modsFunctions = {

    // levelUp: function () {
    //     console.log("Next level!");
    // },

    bombUp: function (reverseMode) {
        basicStatChange.call(this,
            reverseMode, bombsKey, bombsAdd, bombsMin, bombsMax);
    },

    flameUp: function (reverseMode) {
        if (!reverseMode) this.bombMods.push(bombMods.flameUp);
        else this.bombMods.pop(); //follows an order
    },

    speedUp: function (reverseMode) {
        basicStatChange.call(this,
            reverseMode, speedKey, speedAdd, speedMin, speedLimit);
    },
}

//contains the different bomb functions
//as they are short I could put the in the push()
//but this way maybe a single power Up can do more the one of these
var bombMods = {
    flameUp: function () {
        basicAddition.call(this, flameKey, flameAdd, flameMax)
    }
}

//very common power up behavior (add, sub with min max and reverse mode)
function basicStatChange (reverseMode, stat, value, min, max) {
    if (!reverseMode) basicAddition.call(this, stat, value, max)
    else basicSubtraction.call(this, stat, value, min)
}
function basicAddition (stat, add, max) {
    if (this[stat]+add <= max) this[stat]+=add;
    else this[stat] = max;
}
function basicSubtraction (stat, sub, min) {
    if (this[stat]-sub >= min) this[stat]-=sub;
    else this[stat] = min;
}

module.exports = modsFunctions;

},{}],11:[function(require,module,exports){
'use strict';
const DEBUG = true;

const winWith = 800;
const winHeight = 600;

var BootScene = require('./states/boot_scene.js');

var PreloaderScene = require('./states/preloader_scene.js');

var MainMenu = require('./states/main_menu.js');

var PVEmode = require('./states/pve_mode.js');
var PVPmode = require('./states/pvp_mode.js');

window.onload = function () {
  var game = new Phaser.Game(winWith, winHeight, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('mainMenu', MainMenu);
  game.state.add('pve', PVEmode);
  game.state.add('pvp', PVPmode);

  game.state.start('boot');
};

},{"./states/boot_scene.js":23,"./states/main_menu.js":24,"./states/preloader_scene.js":25,"./states/pve_mode.js":26,"./states/pvp_mode.js":27}],12:[function(require,module,exports){
'use strict';

var baseMapData = {

    //required as the map is a [[]] and we need to splice each []
    copyMap: function(map) {
        var copiedMap = [];

        for (var i = 0; i < map.length; i++)
            copiedMap.push(map[i].slice());

        return copiedMap;
    },

    cols: 15, fils: 13, //not really necessary

    playerSpawns:
    [
        {x: 1, y: 1}, //(squares[1][1])
        {x: 13, y: 1},
        {x: 1, y: 11},
        {x: 13, y: 11},
    ],

    squaresTypes:
    {
        wall: {value: 1, sprite: "wall"},
        wallSP: {value: 2, sprite: "wallSP"},

        free: {value: 0, sprite: "background"},

        bombable: {value: 3, sprite: "bombable"},
        bombableDrop: {value: 4, sprite: "bombableDrop"},

        enemy: {value: 5, sprite: null}, //defined at their factories
        enemyDrop: {value: 6, sprite: null},

        bomb: {value: 7, sprite: null},
    },

    squares: //all values at squaresTypes ^
    [
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ]
};

module.exports = baseMapData;

},{}],13:[function(require,module,exports){
'use strict';

//right now it's implemented that a power up can affect multiple player keys
//maybe we need that feature, atm we do not need it (simple power ups)
function Mod(type, key, mod) {
    this.type = type; //number, bool, bomb, function
    this.key = key;
    this.mod = mod;
}

//contains the different tiers, and inside the power ups
var levelDataBase = [

    [ //world 0, used for the presentation - to showcase stuff
        {   //0 - just nothing
            extraWalls: 0,
            bombables: 1,
            powerUps: [1],
            enemies: [0],
            enemiesDrops: [0],
            theme: "basic"
        },
        {   //1 - basic generation
            extraWalls: 8,
            bombables: 33,
            powerUps: [1, 15],
            enemies: [0],
            enemiesDrops: [0],
            theme: "basic"
        },
        {   //2 - enemy IA
            extraWalls: 6,
            bombables: 1,
            powerUps: [1],
            enemies: [3, 2, 4],
            enemiesDrops: [0, 3],
            theme: "basic"
        },
    ],

    [ //world 1, actually there is only 1 atm
        {   //0 - PVP with basic theme
            extraWalls: 0,      //always 0 too, so no unfairness
            bombables: 80,      //some bombables drop power ups
            powerUps: [0, 20],  //always 0 stairs //[0, 15, 5]
            enemies: [0],       //always 0
            enemiesDrops: [0],
            theme: "basic"
        },
        {   //1
            extraWalls: 8,
            bombables: 33,      //some bombables drop power ups
            powerUps: [1, 2],    //first 1 portal, 2 tier 1 power ups...
            enemies: [3],       //3 tier 0 enemies
            enemiesDrops: [0, 2],//they could drop portals but nope
            theme: "basic"
        },
        {   //2
            extraWalls: 6,
            bombables: 35,
            powerUps: [1, 2],
            enemies: [3, 2], //[3,2]
            enemiesDrops: [0, 2],
            theme: "basic"
        },
        {   //3
            extraWalls: 6,
            bombables: 35,
            powerUps: [1], //?
            enemies: [0, 0, 9], //[0,0,9]
            enemiesDrops: [0, 1], //?
            theme: "basic" //"wood"
        },
    ]
];

module.exports = levelDataBase;

},{}],14:[function(require,module,exports){
'use strict';

var GameObject = require('../objects/gameObject.js');
//var Physical = require('../objects/physical.js'); //no more needed
var Bombable = require('../objects/bombable.js');
var Enemy = require('../enemy/enemy.js');

var Id = require('../id/identifiable.js').Id; //for bombable id

var Portal = require('./portal.js'); //next level portal
var portalId = new Id(0, 0); //specific id for the portal

var Point = require('../general/point.js');
var baseMapData = require("./baseMapData.js"); //base map and spawns
var levelsDataBase = require("./levelsDataBase.js"); //base map and spawns

const debugPosX = 40;
const debugPosY = 600 - 96;
const debugColor = "yellow";

//default map tiles values
var defaultBodyOffset = new Point();
var defaultImmovable = true;
var defaultBombableLives = 1;
var defaultBombableInvencibleTime = 0;

//too import a big chunk of code
var mapCooking = require('./mapCooking.js');

function Map(game, worldNum, levelNum, groups, tileData, maxPlayers) {

    this.game = game;
    this.groups = groups;
    this.tileData = tileData;
    this.maxPlayers = maxPlayers;

    //Always same base map values
    this.cols = baseMapData.cols;
    this.fils = baseMapData.fils;
    this.types = baseMapData.squaresTypes;
    this.playerSpawns = baseMapData.playerSpawns;

    this.generateMap(worldNum, levelNum);
};

//gets data of specified map from levelsDataBase and then cooks+build
Map.prototype.generateMap = function (worldNum, levelNum) {

    this.map = baseMapData.copyMap(baseMapData.squares); //copy

    this.mapNumber = { world: worldNum, level: levelNum };
    this.levelData = levelsDataBase[worldNum][levelNum];

    this.bombableIdsPowerUps = this.generateIdsPowerUps(this.levelData.powerUps);
    this.enemiesIdsPowerUps = this.generateIdsPowerUps(this.levelData.enemiesDrops);
    this.enemiesTypeNumbers = this.generateEnemiesTypeNumbers(this.levelData.enemies);

    this.cookMap();
    this.buildMap(this.groups, this.tileData); //shorter with this.
}

//generates a new map (resets groups and players'positions)
Map.prototype.generateNewMap = function (worldNum, levelNum) {
    this.game.time.events.removeAll(); //required cause we are going to destry
    this.groups.clearGroups(this.game); //clears all grups but player
    // console.log(this.game.time.events.events);

    this.mapNumber = { world: worldNum, level: levelNum };
    this.levelData = levelsDataBase[worldNum][levelNum];
    this.generateMap(worldNum, levelNum);

    this.groups.player.callAll('respawn'); //resets players' pos
};
Map.prototype.regenerateMap = function () {
    this.generateNewMap(this.mapNumber.world, this.mapNumber.level)
};
Map.prototype.generateNextMap = function () { //based on number of levels in the world

    if (levelsDataBase[this.mapNumber.world].length === this.mapNumber.level + 1) {
        if (levelsDataBase.length === this.mapNumber.world + 1)
            this.game.debug.text(this.mapNumber.world + " , " + this.mapNumber.level
                + " is the last map...", debugPosX, debugPosY, debugColor);

        else this.generateNewMap(this.mapNumber.world + 1, 0);
    }

    else this.generateNewMap(this.mapNumber.world, this.mapNumber.level + 1);
};


//Adds all the extra bombables (drop too) and walls into the map
Map.prototype.cookMap = mapCooking.cookMap;
//gets the free squares of map excluding player pos
Map.prototype.getFreeSquares = mapCooking.getFreeSquares;
//generates the array of random powerUps based on levelsDataBase info
Map.prototype.generateIdsPowerUps = mapCooking.generateIdsPowerUps;
//given a free square {x: x, y: y} in a freeSquares[] and a radius
//searches and removes (real map) surroundings squares of that radius
Map.prototype.removeSurroundingSquares = mapCooking.removeSurroundingSquares;
//generates the list of enemies based on levelsDataBase
Map.prototype.generateEnemiesTypeNumbers = mapCooking.generateEnemiesTypeNumbers;


//creates all elements in their respective positions etc
Map.prototype.buildMap = function (groups, tileData) {

    for (var i = 0; i < this.cols; i++) {
        for (var j = 0; j < this.fils; j++) {

            //new point each time is bad? auto deletes trash?
            var squareIndexPos = new Point(i, j).applyTileData(tileData);
            var bombableIdPowerUp, enemyIdPowerUp;

            switch (this.map[j][i]) {

                case this.types.bombableDrop.value:
                    bombableIdPowerUp = this.bombableIdsPowerUps.pop(); //gets an Id

                case this.types.bombable.value:
                    //exception for the nextlevel portal creation -> Id tier 0 num 0
                    if (!checkPortal.call(this, tileData))
                        groups.box.add(new Bombable(this.game, this, groups, squareIndexPos,
                            this.types.bombable.sprite, tileData.Scale, tileData.Res,
                            defaultBodyOffset, defaultImmovable,
                            defaultBombableLives, defaultBombableInvencibleTime, bombableIdPowerUp));

                    bombableIdPowerUp = undefined; //resets the id

                //no break so there is background underneath
                case this.types.free.value:
                    groups.background.add(new GameObject(this.game, squareIndexPos,
                        this.types.free.sprite, tileData.Scale));

                    break;


                case this.types.enemyDrop.value: //TODO: enemies type not based on level info
                    enemyIdPowerUp = this.enemiesIdsPowerUps.pop(); //gets an Id

                case this.types.enemy.value:
                    //adding floor too
                    groups.background.add(new GameObject(this.game, squareIndexPos,
                        this.types.free.sprite, tileData.Scale));

                    groups.enemy.add(new Enemy(this.game, squareIndexPos,
                        this, this.enemiesTypeNumbers.pop(), tileData, groups, enemyIdPowerUp));

                    enemyIdPowerUp = undefined; //resets the id
                    break;


                case this.types.wallSP.value: //no special tile atm
                case this.types.wall.value:
                    // groups.wall.add(new Physical (this.game, squareIndexPos,
                    //     this.types.wall.sprite, tileData.Scale, tileData.Res,
                    //     defaultBodyOffset, defaultImmovable)); //no more needed
                    groups.wall.add(new GameObject(this.game, squareIndexPos,
                        this.types.wall.sprite, tileData.Scale));

                    break;
            }
        }
    }

    //checks and creates the portal
    function checkPortal(tileData) {
        var portal = (bombableIdPowerUp !== undefined
            && bombableIdPowerUp.tier === portalId.tier
            && bombableIdPowerUp.num === portalId.num);

        if (portal) //creates the portal too
            groups.box.add(new Portal(this.game, this, groups,
                squareIndexPos, this.types.bombable.sprite, tileData,
                defaultBodyOffset, defaultImmovable,
                defaultBombableLives, defaultBombableInvencibleTime));

        return portal;
    }
};


//updates the virtual map data of a static object*
Map.prototype.updateSquare = function (position, squareType, extraOffset) {
    // console.log(position);
    // console.log(squareType);
    // console.log(extraOffset);

    //calculate the map position
    var mapPosition = new Point(position.x, position.y);
    mapPosition.reverseTileData(this.tileData, extraOffset);

    this.map[mapPosition.y][mapPosition.x] = squareType;
    // console.log(this.map);
}

//given a square position returns true if given direction is free
Map.prototype.isNextSquareFree = function (positionMap, direction) {

    var x = positionMap.x + direction.x;
    var y = positionMap.y + direction.y;

    return this.map[y][x] === this.types.free.value;
}

//given a square position returns an array of the surrounding free ones
Map.prototype.getSurroundingFreeSquares = function (positionMap) {

    var surroundings = [];
    const dirs = [new Point(1, 0), new Point(-1, 0), new Point(0, 1), new Point(0, -1)];

    //checks all the dirs
    for (var i = 0; i < dirs.length; i++)
        if (this.isNextSquareFree(positionMap, dirs[i]))
            surroundings.push(dirs[i]);

    // console.log(surroundings);
    return surroundings;
}

//given a square position returns true if in given direction there is not a wall
//not merged with nextPos or isNextFree because the flame expansion is partucular
Map.prototype.isNextSquareNotWall = function (positionMap, direction) {

    var x = positionMap.x + direction.x;
    var y = positionMap.y + direction.y;

    return (this.map[y][x] !== this.types.wallSP.value
        && this.map[y][x] !== this.types.wall.value);
}

module.exports = Map;

},{"../enemy/enemy.js":1,"../general/point.js":7,"../id/identifiable.js":9,"../objects/bombable.js":17,"../objects/gameObject.js":18,"./baseMapData.js":12,"./levelsDataBase.js":13,"./mapCooking.js":15,"./portal.js":16}],15:[function(require,module,exports){
'use strict';

var Point = require('../general/point.js');

var Id = require('../id/identifiable.js').Id; //for bombable id
var tierSize = require('../id/identifiable.js').tierSize; //for the rnd gen

//will be imported by the map
var mapCooking = {

//Adds all the extra bombables (drop too) and walls into the map
cookMap: function() {

    var self = this; //instead of apply
    var freeSquares = this.getFreeSquares(this.maxPlayers);

    //first generates the bombables with the drops
    var bombableDrops = this.bombableIdsPowerUps.length;
    insertRnd(bombableDrops, this.types.bombableDrop.value);
    insertRnd(this.levelData.bombables-bombableDrops, this.types.bombable.value);

    insertRnd(this.levelData.extraWalls, this.types.wall.value);

    //last the enemies, staring with the drops
    var enemiesDrops = this.enemiesIdsPowerUps.length;
    insertRnd(enemiesDrops, this.types.enemyDrop.value);
    insertRnd(this.enemiesTypeNumbers.length-enemiesDrops, this.types.enemy.value);

    function insertRnd (numElem, type) {
        for (var i = 0; i < numElem; i++) {
            //between and including min and max (Phaser)
            var rnd = self.game.rnd.integerInRange(0,freeSquares.length-1);
            var x = freeSquares[rnd].x;
            var y = freeSquares[rnd].y;

            self.map[y][x] = type;

            //special odd wall placement to avoid wrong generation
            if (type === 1 && x%2 != 0 && y%2 != 0)
                self.removeSurroundingSquares(x,y,2,freeSquares)
            else freeSquares.splice(rnd,1); //removes from list
        }
    }
},

//gets the free squares of map excluding player pos
getFreeSquares: function(maxPlayers) {
    var freeSquares = [];

    for (var i = 0; i < this.fils; i++)
        for (var j = 0; j < this.cols; j++)
            if (this.map[i][j] == 0 /*&& !checkPlayerSquare(j,i,maxPlayers)*/)
                freeSquares.push({x: j, y: i});

    //now we search and remove the players spawns and surroundings
    for (var numPlayer = 0; numPlayer < maxPlayers; numPlayer++)
        this.removeSurroundingSquares(
            this.playerSpawns[numPlayer].x, this.playerSpawns[numPlayer].y, 1, freeSquares);

    return freeSquares;

    //to compare directly instead of searching after (was my first aproach)
    //the newer implementation searches and removes, so worse case => as complex as this
    //the newer is better too because is a shared method (used in map generation)
    /*function checkPlayerSquare (x,y,maxPlayers) {
        for (var numPlayer = 0; numPlayer < maxPlayers; numPlayer++)
            if ((x == map.playerSpawns[numPlayer].x && y == map.playerSpawns[numPlayer].y)
            || (x == map.playerSpawns[numPlayer].x-1 && y == map.playerSpawns[numPlayer].y)
            || (x == map.playerSpawns[numPlayer].x+1 && y == map.playerSpawns[numPlayer].y)
            || (x == map.playerSpawns[numPlayer].x && y == map.playerSpawns[numPlayer].y-1)
            || (x == map.playerSpawns[numPlayer].x && y == map.playerSpawns[numPlayer].y+1))
                return true;
    }*/
},

//generates the array of random powerUps based on levelsDataBase info
generateIdsPowerUps: function (powerUps) {

    var Ids = [];

    for (var tier = 0; tier < powerUps.length; tier++) {
        for (var n = 0; n < powerUps[tier]; n++) {
            //between and including min and max (Phaser)
            var rnd = this.game.rnd.integerInRange(0, tierSize(tier)-1);
            Ids.push(new Id(tier, rnd));
        }
    }
    //for (var i = 0; i < Ids.length; i++) console.log(Ids[i]);

    return Ids;
},

//given a free square {x: x, y: y} in a freeSquares[] and a radius
//searches and removes (real map) surroundings squares of that radius
//removes the given square too? atm yes
removeSurroundingSquares: function(x, y, radius, freeSquares) {

    //Will be used with findIndex *(not supported in IE)*
    function equal (e) {
        return e.x === x_toFind
            && e.y === y_toFind;
    };

    var index; //search and store index
    var x_toFind = x, y_toFind = y; //tmp

    //first search: given square
    index = freeSquares.findIndex(equal);
    if (index > -1) freeSquares.splice(index, 1);

    //second and third searches: horizontal
    x_toFind = x - radius;
    index = freeSquares.findIndex(equal);
    if (index > -1) freeSquares.splice(index, 1);

    x_toFind = x + radius;
    index = freeSquares.findIndex(equal);
    if (index > -1) freeSquares.splice(index, 1);

    //last two: vertical (reset x required)
    x_toFind = x; y_toFind = y - radius;
    index = freeSquares.findIndex(equal);
    if (index > -1) freeSquares.splice(index, 1);

    y_toFind = y + radius;
    index = freeSquares.findIndex(equal);
    if (index > -1) freeSquares.splice(index, 1);
},

//generates the list of enemies based on levelsDataBase
generateEnemiesTypeNumbers: function (enemies) {
    var typeNumbers = [];

    for (var type = 0; type < enemies.length; type++)
    for (var n = 0; n < enemies[type]; n++)
    typeNumbers.push(type);

    // console.log(enemies);
    // console.log(typeNumbers);
    return typeNumbers;
},

}

module.exports = mapCooking;

},{"../general/point.js":7,"../id/identifiable.js":9}],16:[function(require,module,exports){
'use strict';

var Bombable = require('../objects/bombable.js');
var Point = require('../general/point.js');
var Enemy = require('../enemy/enemy.js'); //to spawn them
var defaultEnemyType = 0;

var portalImmovable = true;
var portalInvencible = true;

var portalSprite = "portal";
var portalDropId = undefined; //always
var portalSpinVel = 0.05;

var portalBombTimer = 500; //to sync with flames
var portalSpawnTimer = 1500; //cooldown to spawn enemies

function Portal (game, level, groups, position, sprite, tileData, bodyOffSet, immovable, lives, invencibleTime) {

    //var portalPosition = position.add(portalExtraOffset.x, portalExtraOffset.y);

    //var portalBodySize = new Point(bodySize.x/2, bodySize.y/2); //so you get to the center
    //var bodyOffSet = portalBodySize; //the half too
    this.tileData = tileData;

    Bombable.call(this, game, level, groups, position, sprite,
        this.tileData.Scale, this.tileData.Res, bodyOffSet, immovable,
        lives, invencibleTime, portalDropId)

    this.spawned = false;
}

Portal.prototype = Object.create(Bombable.prototype);
Portal.prototype.constructor = Portal;


Portal.prototype.update = function() {
    this.checkFlames(); //player and bomb rewrite (extend) update

    if (this.spawned) {
        this.rotation+= portalSpinVel;

        if (this.groups.enemy.children.length === 0)
            this.game.physics.arcade.overlap(this, this.groups.player, nextLevel);
    }

    function nextLevel(portal, player) {
        player.level.generateNextMap();
    }
}

//player, bomb, enemie, etc will extend this
Portal.prototype.die = function () {
    //console.log("checkin die");

    if (this.spawned) this.game.time.events.add(portalBombTimer+5, this.spawnEnemie, this);

    else {
        this.lives--;

        if (this.lives <= 0) //spawn the portal
            this.game.time.events.add(portalBombTimer+5, this.spawnPortal, this);
    }
    this.game.time.events.add(portalSpawnTimer, flipInven, this);

    function flipInven () { this.tmpInven = false; }
}

//switches the box into the portal
Portal.prototype.spawnPortal = function () {

    this.spawned = true; //bool for the state
    this.groups.portal.add(this); //changes its group
    this.level.updateSquare(this.position, this.level.types.free.value); //update map

    this.body.width /= 2; //changes its body (smaller)
    this.body.height /= 2;
    this.body.offset = new Point (
        this.body.width*this.tileData.Scale.y,
        this.body.height*this.tileData.Scale.x);

    this.position = new Point ( //moves and anchors to rotate
        this.body.position.x+this.body.width,
        this.body.position.y+this.body.height);
    this.anchor.setTo(0.5, 0.5);

    this.loadTexture(portalSprite); //change sprite
}

//spawns an enemie
Portal.prototype.spawnEnemie = function () {
    //console.log(this.groups.enemy.children);

    var enemyPos = new Point(
        this.position.x-this.body.width, //corrects the anchor
        this.position.y-this.body.height);

    this.groups.enemy.add(new Enemy (this.game, enemyPos,
        this.level, defaultEnemyType, this.tileData, this.groups, portalDropId));
}


module.exports = Portal;

},{"../enemy/enemy.js":1,"../general/point.js":7,"../objects/bombable.js":17}],17:[function(require,module,exports){
'use strict';

var Physical = require('./physical.js'); //father
//some drop powerUps
var Identifiable = require('../id/identifiable.js');

//default bombable values
var bombableTimer = 500; //to sync with flames

//var Id = Identifiable.Id; //the mini factory is in Identifiable
//var bombableDropId = new Id (1,1);


function Bombable(game, level, groups, position, sprite, scale, bodySize, bodyOffSet, immovable, lives, invencibleTime, dropId) {

    Physical.call(this, game, position, sprite, scale, bodySize, bodyOffSet, immovable);

    this.groups = groups;
    this.level = level;

    //allows special blocks, enemies, etc
    this.lives = lives;
    this.tmpInven = false; //flip flop
    this.dead = false;

    //Initial invencible time or not
    this.endInvencibilityCallback = undefined;
    if (invencibleTime === 0) this.invencible = false;
    else if (invencibleTime === -1) this.invencible = true; //invencible 4ever
    else {
        this.invencible = true;
        this.endInvencibilityCallback = this.game.time.events.add(invencibleTime, this.endInvencibility, this);
    }

    this.dropId = dropId;
}

Bombable.prototype = Object.create(Physical.prototype);
Bombable.prototype.constructor = Bombable;


Bombable.prototype.update = function () {
    this.checkFlames(); //player and bomb rewrite (extend) update
}

//common for all bombables
Bombable.prototype.checkFlames = function () {

    //console.log(this.flamesGroup);
    if (!this.dead) //maybe a invencible player puts a bomb on just a bomb
        this.game.physics.arcade.overlap(this, this.groups.flame, onFire, checkVulnerability, this);

    function checkVulnerability() {
        // console.log("checkin vulv");
        return (!this.invencible && !this.tmpInven);
    }

    function onFire(bombable, flame) {
        // console.log("on fire");
        this.tmpInven = true;

        //die should be insta and then in die handle sync
        //so the player can die insta etc (block mov)
        //this.game.time.events.add(bombableTimer, this.die, this);
        this.die(flame);
    }
}

//player, bomb, enemie, etc will extend this
Bombable.prototype.die = function () {
    // console.log("checkin die");
    this.lives--;

    if (this.lives <= 0) {
        this.dead = true;
        // this.visible = false;

        //if it has a power up, drops it
        if (this.dropId !== undefined)
            this.game.time.events.add(bombableTimer - 5, drop, this);

        //then destroy the bombable
        this.game.time.events.add(bombableTimer + 5, updateAndDestroy, this);
    }
    else this.game.time.events.add(bombableTimer, flipInven, this);


    function flipInven() { this.tmpInven = false; }
    function drop() {

        this.groups.powerUp.add(
            new Identifiable(this.game, this.position, this.scale, this.dropId));
    }
    function updateAndDestroy() {
        // console.log("update and destroy");

        this.level.updateSquare(this.position, this.level.types.free.value)

        this.destroy();
    }
}

//Usesd as callback to remove te temporal inbvulnerability
Bombable.prototype.endInvencibility = function () {
    this.invencible = false;
}
//To correctly cancel the callback (if exists)
Bombable.prototype.endlessInvencibility = function () {

    if (this.endInvencibilityCallback !== undefined)

        this.game.time.events.remove(this.endInvencibilityCallback);

    this.invencible = true;
}

module.exports = Bombable;

},{"../id/identifiable.js":9,"./physical.js":19}],18:[function(require,module,exports){
'use strict';

function GameObject (game, position, sprite, scale) {

    Phaser.Sprite.call(this, game, position.x, position.y, sprite);

    game.add.existing(this);
    this.scale.setTo(scale.x, scale.y);

};

GameObject.prototype = Object.create(Phaser.Sprite.prototype);
GameObject.prototype.constructor = GameObject;

module.exports = GameObject;

},{}],19:[function(require,module,exports){
'use strict';

var GameObject = require('./gameObject.js');

function Physical(game, position, sprite, scale, bodySize, bodyOffSet, immovable) {

    GameObject.call(this, game, position, sprite, scale);

    game.physics.arcade.enable(this);
    this.body.setSize(bodySize.x, bodySize.y, bodyOffSet.x, bodyOffSet.y);
    this.body.collideWorldBounds = true;

    this.body.immovable = immovable; //if static then immovable
}

Physical.prototype = Object.create(GameObject.prototype);
Physical.prototype.constructor = Physical;

module.exports = Physical;

},{"./gameObject.js":18}],20:[function(require,module,exports){
'use strict';

var Bombable = require('../objects/bombable.js'); //father
var Flame = require('../enemy/flame.js');

var Point = require('../general/point.js');
var Identifiable = require('../id/identifiable.js');


//default bomb values
var bombBodySize = new Point(48, 48); //little smaller
var bombBodyOffset = new Point(0, 0);
var bombExtraOffset = new Point(5, 5); //reaquired because bomb body is not full res

var bombImmovable = true;
var bombInvecibleTime = 0;

var bombLives = 1;
var bombPower = 1;
var bombTimer = 2000;
var bombFlameTimer = 500;

var xplosionSound;

var bombSpritePath = 'bomb';
var flameId = {tier: 0, num: 0};


function Bomb (game, level, position, tileData, groups, player, bombMods) {

    var bombPosition = new Point (position.x, position.y)
        .add(bombExtraOffset.x, bombExtraOffset.y); //add extra offset

    Bombable.call(this, game, level, groups, bombPosition, bombSpritePath,
        tileData.Scale, bombBodySize, bombBodyOffset, bombImmovable,
        bombLives, bombInvecibleTime);

    this.timer = bombTimer;
    this.flameTimer = bombFlameTimer;
    this.power = bombPower;

    this.groups = groups;
    this.player = player; //link to restore bomb etc
    this.level = level;
    this.tileData = tileData;

    this.mods = [];
    Identifiable.applyMods(bombMods, this);

    this.xploded = false;
    //this.flamesEvent = undefined; //need to create it for die()
    this.xplosionEvent =
        game.time.events.add(this.timer, this.xplode, this);

    this.xplosionSound = game.add.audio('xplosion');

    level.updateSquare(position, level.types.bomb.value);
    //console.log(bombTimer, bombFlameTimer, bombPower, level, groups, player, tileData, bombMods, this.xploded, this.xplosionEvent);
};

Bomb.prototype = Object.create(Bombable.prototype);
Bomb.prototype.constructor = Bomb;


Bomb.prototype.die = function () {
    //console.log("checkin bomb die");
    this.lives--;

    //cancels the standard callbacks
    if (this.lives <= 0) {
        if (!this.xploded) {
            this.game.time.events.remove(this.xplosionEvent);
            //the bomb doesnt insta xplode but xplodes before the flames are gone
            this.game.time.events.add(bombFlameTimer/2, this.xplode, this);
        }
        //no need to destroy because xplde already destroys
    }

    else this.game.time.events.add(this.bombDieTimer, flipInven, this);
    function flipInven () { this.tmpInven = false; }
}


//removes the bomb, spawns the fames and then removes them
Bomb.prototype.xplode = function() {
    //console.log("xploded");
    this.xploded = true;
    this.groups.bomb.remove(this); //removes and destroys the bomb
    this.player.numBombs++; //adds a bomb back to the player

    this.xplosionSound.play();

    var flames = this.spawnFlames();

    //pushes the flames into map.flames
    for(var i = 0; i < flames.length; i++) this.groups.flame.add(flames[i]);

    //console.log(this.groups.flame.children);

    //callback to destroy the flames
    this.game.time.events.add(this.flameTimer, removeFlames, this);

    function removeFlames () {
        //.destroy() removes them from the group too
        for(var i = 0; i < flames.length; i++) flames[i].destroy();

        //update map
        this.level.updateSquare(this.position, this.level.types.free.value, bombExtraOffset);
        this.destroy();
    }
}

//spawns the first flame and calls expandFlames
Bomb.prototype.spawnFlames = function() {

    //initial flame postion (corrected offset even though then is the same)
    var positionMap = new Point (this.position.x, this.position.y)
        .subtract(bombExtraOffset.x, bombExtraOffset.y);

    var flames = [new Flame(this.game, positionMap, this.scale, this.player)];

    return this.expandFlames(flames, positionMap);
}

//expands (and creates) the extra flames
Bomb.prototype.expandFlames = function(flames, positionMap) {

    //Tries to expand in each direction one by one
    var directions = [new Point(-1,0), new Point(1,0), new Point(0,-1), new Point(0,1)];
    for (var i = 0; i < directions.length; i++) {

        var expansion = 1;
        //these all could be the same, but allow us to know exactly what fails
        var obstacle = false, bombable = false, bomb = false/*, flame = false*/;

        //tmp Position for the initial expanded flame
        var tmpPositionMap = new Point (positionMap.x, positionMap.y)
            .reverseTileData(this.tileData, bombExtraOffset);

        while(expansion <= this.power && !obstacle && !bombable && !bomb/* && !flame*/) {

            //checks if the next square is free
            if (this.level.isNextSquareNotWall(tmpPositionMap, directions[i])) {

                //updates tmp position
                tmpPositionMap.add(directions[i].x, directions[i].y);

                //creates the real one for the flame
                var flamePos = new Point (tmpPositionMap.x, tmpPositionMap.y)
                    .applyTileData(this.tileData);

                //creates the flame
                var newFlame = new Flame(this.game, flamePos, this.scale, this.player)
                flames.push(newFlame);
                expansion++;

                //if it touches a box or bomb (or a flame) it stops propagation
                bombable = this.game.physics.arcade.overlap(newFlame, this.groups.box);
                bomb = this.game.physics.arcade.overlap(newFlame, this.groups.bomb);

                //but it case of the flame over flame, no new one is generated
                //In the original game yes, aswell as there is no delay
                /*flame = this.game.physics.arcade.overlap(newFlame, this.groups.flame);
                if (!flame) flames.push(newFlame);
                else newFlame.destroy();*/

                //console.log("bombable ", bombable);
                //console.log("bomb ", bomb);
                //console.log("flame ", flame);
            }
            else {
                obstacle = true;
                //console.log("obstacle", obstacle);
            }
        }
    }
    //console.log(flames)
    return flames; //just need to delay this somehow
}


module.exports = Bomb;

},{"../enemy/flame.js":3,"../general/point.js":7,"../id/identifiable.js":9,"../objects/bombable.js":17}],21:[function(require,module,exports){
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
var playerBodyOffset = new Point(3, 48);
var playerExtraOffset = new Point(6, -20); //reaquired because player body is not full res

var playerImmovable = false;

var playerLives = 5;
var playerNumBombs = 1;

var playerInvencibleTime = 5000;
var playerRespawnedStoppedTime = 1000;
var playerDeathTime = 1500;
var playerLifeTime = 3*60*1000;

var Id = Identifiable.Id; //the mini factory is in Identifiable
var playerInitialModsIds = [/*new Id(1,2), new Id(1, 1), new Id(1,0)*/];
var playerMovAndInputs = require('./playerMovAndInputs.js'); //big chunk of code

function Player(game, level, numPlayer, tileData, groups) {

    this.numPlayer = numPlayer;
    this.points = 0;
    this.inputs = new Inputs(game, numPlayer); //based on numPlayer

    //produces respawn position based on playerSpawns[numPlayer]
    this.respawnPos = new Point(level.playerSpawns[numPlayer].x, level.playerSpawns[numPlayer].y)
        .applyTileData(tileData, playerExtraOffset);

    Bombable.call(this, game, level, groups, this.respawnPos, playerSpritePath + this.numPlayer,
        tileData.Scale, playerBodySize, playerBodyOffset, playerImmovable, playerLives, playerInvencibleTime);

    this.restartMovement();

    this.tileData = tileData;
    this.level = level;
    this.groups = groups;
    this.groups.player.add(this); //adds itself to the group

    this.numBombs = playerNumBombs;
    this.mods = [];
    this.bombMods = [];
    Identifiable.addPowerUps(playerInitialModsIds, this);
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

//Starts the countdown to finish life
Player.prototype.startCountdown = function () {
    this.game.time.events.add(playerLifeTime, this.restartCoundown, this);
}
Player.prototype.restartCoundown = function () {
    this.die();
    this.game.time.events.add(playerDeathTime + playerRespawnedStoppedTime,
        this.startCountdown, this);
}


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

    console.log(this.points, " + ", pts);
    this.points += pts;

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
}


module.exports = Player;

},{"../general/inputs.js":6,"../general/point.js":7,"../id/identifiable.js":9,"../objects/bombable.js":17,"./bomb.js":20,"./playerMovAndInputs.js":22}],22:[function(require,module,exports){
'use strict';

var Point = require('../general/point.js'); //required

//default movement values
var playerVelocity = 140; //max=playerVelocity+5*10 (depends on powerUps)
var playerVelocityTurning = 105; //140 105
//reduced velocity for the turn so the alignment is much smoother
//does not change with playerVelocity, so what changes is the relative reduction
//a starting -25% playerVelocity, and a max of ~45% (or less)

var playerExtraOffset = new Point(6, -20); //need to took from config file

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

    //console.log(fixedFinalDir.x, fixedFinalDir.y, " - ", fixedExtraDir.x, fixedExtraDir.y);
    //console.log(this.dirs.dirX.x, this.dirs.dirX.y, " - ", this.dirs.dirY.x, this.dirs.dirY.y);
    //console.log(this.prioritizedDirs.first.x, this.prioritizedDirs.first.y, " - ", this.prioritizedDirs.second.x, this.prioritizedDirs.second.y);

    //moves the player (only if dir is not null)
    if (fixedFinalDir.x === 1) this.body.velocity.x = this.velocity;
    else if (fixedFinalDir.x === -1) this.body.velocity.x = -this.velocity;
    else if (fixedFinalDir.y === 1) this.body.velocity.y = this.velocity;
    else if (fixedFinalDir.y === -1) this.body.velocity.y = -this.velocity;

    //callback
    function unlockTurning() { this.blockedBacktrack.turn = false }
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

    // console.log("X ", nextDirX.x, nextDirX.y, " - ", "Y ", nextDirY.x, nextDirY.y);
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

    // console.log(this.dirs.dirX.x, this.dirs.dirX.y, " - ", this.dirs.dirY.x, this.dirs.dirY.y);
    // console.log(this.prioritizedDirs.first.x, this.prioritizedDirs.first.y, " - ", this.prioritizedDirs.second.x, this.prioritizedDirs.second.y);
},

//very important, and documented... makes the player movement fixed
fixedDirMovement: function (dir) {

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
        if (extraPosMap.isNull()) {
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
        if (extraPosMap.isNull()) {
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

}

module.exports = playerMoveAndInputs;

},{"../general/point.js":7}],23:[function(require,module,exports){
'use strict';
const DEBUG = true;

var BootScene = {

      preload: function () {
        if (DEBUG) this.startTime = Date.now(); //to calculate booting time etc

        // load here assets required for the loading screen
        this.game.load.image('preloader_logo', 'images/phaser.png');
      },

      create: function () {

        //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //this.scale.pageAlignHorizontally = true;
        //this.scale.setScreenSize();

        this.game.state.start('preloader');
        if (DEBUG) console.log("Booting...", Date.now()-this.startTime, "ms");
      }
    };

    module.exports = BootScene;

},{}],24:[function(require,module,exports){
'use strict';

const DEBUG = true;

const winWidth = 800;
const winHeight = 600;

var mMenuBG;
var mMenuButton;
var buttonCount = 1;

var mMenuTitle; //super bomboooooozle man

var MainMenu = {
    preload: function() {
        if (DEBUG) this.startTime = Date.now(); //to calculate booting time etc

    },

    nextState: function() { this.game.state.start('pve');  },

    // over: function() { buttonCount++; },

    // out: function() { buttonCount--; },

    create: function() {
        mMenuBG = this.game.add.sprite(0, 0, 'mMenuBG');
        mMenuBG.scale.y = 1.05; //just a little bigger
        mMenuButton = this.game.add.button(winWidth/2, winHeight/2 + 100, 'mMenuButton' + buttonCount, this.nextState, this);

        mMenuBG.width = winWidth;
        mMenuBG.heigth = winHeight;

        mMenuButton.anchor.setTo(0.5, 0.5);
        //mMenuButton.scale.x = 100;
        //mMenuButton.scale.y = 75;

        // mMenuButton.onInputOver.add(this.over, this);

        mMenuTitle = this.game.add.sprite(50,100, 'mMenuTitle');
    },

    update: function() {

        // if(this.game.input.mousePointer.leftButton.isDown && this.game.input.mousePointer.position.x == this.mMenuButton.x
        //     && this.game.input.mousePointer.position.y == this.mMenuButton.y)
        //     this.game.state.start('pve');
    }

};

module.exports = MainMenu;

},{}],25:[function(require,module,exports){
'use strict';
var DEBUG = true;

const winWith = 800;
const winHeight = 600;

var PreloaderScene = {
    preload: function () {
        if (DEBUG) this.startTime = Date.now();

        //this.game.stage.backgroundColor = '#E80C94';
        this.loadingBar = this.game.add.sprite(winWith/2, winHeight/2, 'preloader_logo');
        this.loadingBar.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(this.loadingBar);

        // TODO: load here the assets for the game
        //this.game.load.image('logo', 'images/readme/arena.png');

        for (var numPlayers = 0; numPlayers < 4; numPlayers++)
            this.game.load.image('player_'+numPlayers, 'images/Sprites/Bomberman/Bman_'+numPlayers+'.png');

        this.game.load.image('background', 'images/Sprites/Blocks/BackgroundTile.png');
        this.game.load.image('bombable', 'images/Sprites/Blocks/ExplodableBlock.png');
        this.game.load.image('wall', 'images/Sprites/Blocks/SolidBlock.png');
        this.game.load.image('portal', 'images/Sprites/Blocks/Portal.png');

        this.game.load.image('powerUpBombUp', 'images/Sprites/Powerups/BombPowerup.png');
        this.game.load.image('powerUpFlameUp', 'images/Sprites/Powerups/FlamePowerup.png');
        this.game.load.image('powerUpSpeedUp', 'images/Sprites/Powerups/SpeedPowerup.png');

        this.game.load.image('bomb', 'images/Sprites/Bomb/Bomb_f01.png');
        this.game.load.image('flame', 'images/Sprites/Flame/Flame_f00.png');

        this.game.load.image('enemy_0', 'images/Sprites/Creep/Creep_0.png');
        this.game.load.image('enemy_1', 'images/Sprites/Creep/Creep_1.png');
        this.game.load.image('enemy_2', 'images/Sprites/Creep/Creep_2.png');

        //Main Menu sprites
        this.game.load.image('mMenuBG', 'images/Sprites/Menu/title_background.jpg');
        this.game.load.image('mMenuButton1', 'images/Sprites/Menu/One_Player_Normal.png');
        this.game.load.image('mMenuButton2', 'images/Sprites/Menu/One_Player_Hover.png');
        this.game.load.image('mMenuTitle', 'images/Sprites/Menu/title.png');

        this.game.load.image('pausePanel', 'images/Sprites/Menu/White_Panel.png');
        this.game.load.image('quitToMenu', 'images/Sprites/Menu/Two_Players_Hover.png');

        //Music and audio
        this.game.load.audio('music', 'audio/music.ogg');
        this.game.load.audio('xplosion', 'audio/explosion.ogg');
        this.game.load.audio('powerup', 'audio/powerup.ogg');

    },

    create: function () {
        this.game.state.start('mainMenu');
        if (DEBUG) console.log("Preloading...", Date.now()-this.startTime, "ms");
    }
  };
  module.exports = PreloaderScene;

},{}],26:[function(require,module,exports){
'use strict';
const DEBUG = true;

var Point = require('../general/point.js');
var globalControls = require('../general/globalControls.js');

var Groups = require('../general/groups.js');
var groups;
var Map = require('../maps/map.js');
var level;
var initialMap = { world: 0, level: 0 };

var Inputs = require('../general/inputs.js');
var gInputs; //global inputs

var Player = require('../player/player.js');
var players = []; //2 max for this mode but meh
var initialPlayers = 1;
var maxPlayers = 4; //needed for the map generation

var music;

const width = 800;
const height = 600;
const debugPos = new Point(32, height - 96);
const debugColor = "yellow";

const tileData = {
  Res: new Point(64, 64),
  Scale: new Point(0.75, 0.625), //64x64 to 48x40
  Offset: new Point(40, 80), //space for hud
};

var mMenuTitle;
var livesHUD;

var pausePanel;
var unpauseButton;
var gotoMenuButton;

var PlayScene = {

  preload: function () {
    //this.game.stage.backgroundColor = '#E80C94';
    if (DEBUG) this.startTime = Date.now(); //to calculate booting time
  },

  create: function () {
    //menu stuff
    mMenuTitle = this.game.add.sprite(50, 0, 'mMenuTitle'); //vital for life on earth
    mMenuTitle.scale = new Point(0.4, 0.75); //nah just for presentation


    //map
    groups = new Groups(this.game); //first need the groups
    level = new Map(this.game, initialMap.world, initialMap.level, groups, tileData, maxPlayers);

    //global controls
    gInputs = new Inputs(this.game, -1);

    //music
    music = this.game.add.audio('music');
    //music.loopFull(); //la pauso que me morido quedo loco

    //player/s (initialPlayers)
    for (var numPlayer = 0; numPlayer < initialPlayers; numPlayer++) {
      players.push(new Player(this.game, level, numPlayer, tileData, groups));
      players[numPlayer].startCountdown();
    }

    livesHUD = this.game.add.text(width/2, height/2, players[0].playerLives,
        { font: "65px Arial", fill: "#f9e000", align: "center"});

    if (DEBUG) {
      console.log("Loaded...", Date.now() - this.startTime, "ms");
      console.log("\n PLAYER: ", players[0]);
      console.log("\n MAP: ", level.map);
    }

  },


  update: function () {

    //No longer needed
    // this.game.physics.arcade.collide(groups.player, groups.wall);
    // if (!gInputs.debug.state) {
    //   this.game.physics.arcade.collide(groups.player, groups.box);
    //   this.game.physics.arcade.collide(groups.player, groups.bomb);
    // }
    // else this.game.physics.arcade.collide(players[0], groups.enemy);

    this.game.world.bringToTop(groups.flame);
    this.game.world.bringToTop(groups.player); //array doesnt work

    globalControls.addPlayerControl(gInputs, players, maxPlayers);
    globalControls.debugModeControl(gInputs, this.game, groups.player);
    globalControls.resetLevelControl(gInputs, level);
    globalControls.nextLevelControl(gInputs, level);
    offPauseMenuControl(this.game);
  },

  paused: function () {
    music.pause();
    this.game.stage.disableVisibilityChange = true;
    this.game.input.onDown.add(unPause, this);

    pausePanel = this.game.add.sprite(width / 2, height / 2, 'pausePanel');
    pausePanel.anchor.setTo(0.5, 0.5);
    pausePanel.alpha = 0.5;

    unpauseButton = this.game.add.sprite(width / 2, height / 2 - 50, 'mMenuButton2');
    unpauseButton.anchor.setTo(0.5, 0.5);

    gotoMenuButton = this.game.add.sprite(width / 2, height / 2 + 50, 'quitToMenu');
    gotoMenuButton.anchor.setTo(0.5, 0.5);

    function unPause() {
      if (this.game.paused) {
        if (this.game.input.mousePointer.position.x > unpauseButton.position.x - unpauseButton.texture.width / 2
          && this.game.input.mousePointer.position.x < unpauseButton.position.x + unpauseButton.texture.width / 2
          && this.game.input.mousePointer.position.y > unpauseButton.position.y - unpauseButton.texture.height / 2
          && this.game.input.mousePointer.position.y < unpauseButton.position.y + unpauseButton.texture.height / 2)
          this.game.paused = false;

        //We need to fix the remake of maps before this fully works. But it does what it has to.
        else if (this.game.input.mousePointer.position.x > gotoMenuButton.position.x - gotoMenuButton.texture.width / 2
          && this.game.input.mousePointer.position.x < gotoMenuButton.position.x + gotoMenuButton.texture.width / 2
          && this.game.input.mousePointer.position.y > gotoMenuButton.position.y - gotoMenuButton.texture.height / 2
          && this.game.input.mousePointer.position.y < gotoMenuButton.position.y + gotoMenuButton.texture.height / 2)
          { this.game.state.start('mainMenu'); this.game.paused = false; }
      }
    };

  },

  //NOT FULLY NECESSARY BUT MAY BE USEFUL IN THE FUTURE
  // pauseUpdate: function () {
  //  // console.log(this);

  //   //if(gInputs)
  //     // console.log(gInputs);
  //     // gInputs.pMenu.ff = false;
  //   // onPauseMenuControl(this.game);

  //   // console.log(gInputs.pMenu.ff)
  // },

  resumed: function () {
    music.resume();
    this.game.stage.disableVisibilityChange = false;
    gInputs.pMenu.ff = false;

    pausePanel.destroy();
    unpauseButton.destroy();
    gotoMenuButton.destroy();
  },

  render: function () {

    if (gInputs.debug.state) {
      groups.drawDebug(this.game);
      this.game.debug.bodyInfo(players[0], debugPos.x, debugPos.y, debugColor);
    }

  },
};


var offPauseMenuControl = function (game) {
  if (gInputs.pMenu.button.isDown && !gInputs.pMenu.ff) {
    gInputs.pMenu.ff = true;
    game.paused = true;
  }
  //MIRAR DOCUMENTACION DE PHASER.SIGNAL
  else if (gInputs.pMenu.isUp)
    gInputs.pMenu.ff = false;
  //console.log(gInputs.pMenu.ff)
}

module.exports = PlayScene;

},{"../general/globalControls.js":4,"../general/groups.js":5,"../general/inputs.js":6,"../general/point.js":7,"../maps/map.js":14,"../player/player.js":21}],27:[function(require,module,exports){
'use strict';
const DEBUG = true;

var Point = require('../general/point.js');
var globalControls = require('../general/globalControls.js');

var Groups = require('../general/groups.js');
var groups;
var Map = require('../maps/map.js');
var level;
var initialMap = { world: 1, level: 0 };

var Inputs = require('../general/inputs.js');
var gInputs; //global inputs

var Player = require('../player/player.js');
var players = []; //2 max for this mode but meh
var initialPlayers = 4;
var maxPlayers = 4; //needed for the map generation

const width = 800;
const height = 600;
const debugPos = new Point(32, height - 96);
const debugColor = "yellow";

const tileData = {
  Res: new Point(64, 64),
  Scale: new Point(0.75, 0.625), //64x64 to 48x40
  Offset: new Point(40, 80), //space for hud
};

var mMenuTitle; //still not definitive

var PlayScene = {

  preload: function () {
    //this.game.stage.backgroundColor = '#E80C94';
    if (DEBUG) this.startTime = Date.now(); //to calculate booting time
  },

  create: function () {
    //menu stuff
    mMenuTitle = this.game.add.sprite(50, 0, 'mMenuTitle'); //vital for life on earth
    mMenuTitle.scale = new Point(0.9, 0.75);                //nah just for presentation

    //map
    groups = new Groups(this.game); //first need the groups
    level = new Map(this.game, initialMap.world, initialMap.level, groups, tileData, maxPlayers);

    //global controls
    gInputs = new Inputs(this.game, -1);

    //player/s (initialPlayers)
    for (var numPlayer = 0; numPlayer < initialPlayers; numPlayer++)
      players.push(new Player(this.game, level, numPlayer, tileData, groups));

    if (DEBUG) {
      console.log("Loaded...", Date.now() - this.startTime, "ms");
      console.log("\n PLAYER: ", players[0]);
      console.log("\n MAP: ", level.map);
    }

  },

  update: function () {

    this.game.world.bringToTop(groups.flame);
    this.game.world.bringToTop(groups.player); //array doesnt work

    globalControls.debugModeControl(gInputs, this.game, groups.player);
    globalControls.resetLevelControl(gInputs, level);
  },

  render: function () {

    if (gInputs.debug.state) {
      groups.drawDebug(this.game);
      this.game.debug.bodyInfo(players[0], debugPos.x, debugPos.y, debugColor);
    }

  },
};


module.exports = PlayScene;

},{"../general/globalControls.js":4,"../general/groups.js":5,"../general/inputs.js":6,"../general/point.js":7,"../maps/map.js":14,"../player/player.js":21}]},{},[11]);
