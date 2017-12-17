(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//Creates a super group to contain all of the game's groups
//and it's a group itself (extends Phaser.Group) - not really used now
function Groups(game) {

    Phaser.Group.call(this, game);

    //groups for tiles
    this.background = game.add.group();
    this.wall = game.add.group();
    this.bombable = game.add.group();

    this.bomb = game.add.group();
    this.flame = game.add.group();

    this.powerUp = game.add.group();
    this.player = game.add.group();
    this.enemy = game.add.group();

}
Groups.prototype = Object.create(Phaser.Group.prototype);
Groups.prototype.constructor = Groups;

module.exports = Groups;

},{}],2:[function(require,module,exports){
'use strict';

var Physical = require('../objects/physical.js');
var Point = require('../point.js');

//default flameentifiable values
var flameBodySize = new Point(48, 48); //little smaller
var flameBodyOffset = new Point(0, 0);
var flameExtraOffset = new Point(5, 5); //flame body is not full res
var flameImmovable = true;
var flameSprite = 'flame';

function Flame (game, position, scale) {

    var flamePosition = position.add(flameExtraOffset.x, flameExtraOffset.y);

    Physical.call(this, game, position, flameSprite, scale,
        flameBodySize, flameBodyOffset, flameImmovable);

}

Flame.prototype = Object.create(Physical.prototype);
Flame.prototype.constructor = Flame;

module.exports = Flame;

},{"../objects/physical.js":15,"../point.js":17}],3:[function(require,module,exports){
'use strict';

var modsFunctions = require('./modsFunctions.js'); //all the database
//*A previous version with types of mods (instead of all functions)
//*is in "unused" folder, but the fixed applyMods was removed directly

//contains the different tiers, and inside the power ups
var idDataBase = [

    [ //tier 0 (special for next level ladder etc)

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

},{"./modsFunctions.js":5}],4:[function(require,module,exports){
'use strict';

var Physical = require('../objects/physical.js');
var Point = require('../point.js');

var idDataBase = require('./idDataBase.js'); //all the database

//default identifiable values
var idBodySize = new Point(48, 48); //little smaller
var idBodyOffset = new Point(0, 0);
var idExtraOffset = new Point(14, 10); //id body is not full res
var idImmovable = true;


function Identifiable(game, position, scale, id) {

    var idPosition = position.add(idExtraOffset.x, idExtraOffset.y);

    Physical.call(this, game, position, idDataBase[id.tier][id.num].sprite,
      scale, idBodySize, idBodyOffset, idImmovable);

    this.id = id;
}

Identifiable.prototype = Object.create(Physical.prototype);
Identifiable.prototype.constructor = Identifiable;


//method used by players ti pick powerUps (so they do not need idDataBase)
Identifiable.pickPowerUp = function(powerUp, player) {
    var mods = idDataBase[powerUp.id.tier][powerUp.id.num].mods;
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

Identifiable.applyMods = function(mods, target, reverseMode) {
  for (var i = 0; i < mods.length; i++) {
      //console.log(target[mods[i].key]);
      //console.log(mods[i].key, mods[i].mod);
      mods[i].call(target, reverseMode);
  }
  //console.log(target.mods);
}

module.exports = Identifiable;

},{"../objects/physical.js":15,"../point.js":17,"./idDataBase.js":3}],5:[function(require,module,exports){
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

//very common power up behavior
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

},{}],6:[function(require,module,exports){
'use strict';

//returns the inputs for player 0-3
//can be mixed/changed, repeat menu controls?
//sort of data storage/factory (it needs game's reference)

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
    // this.pMenu = {
    //     button: game.input.keyboard.addKey(Phaser.Keyboard.P),
    //     ff: false,
    //     paused: false
    // }
    this.addPlayer = {
        button: game.input.keyboard.addKey(Phaser.Keyboard.X),
        ff: false
    }
    this.debug = {
        button: game.input.keyboard.addKey(Phaser.Keyboard.C),
        ff: false,
        state: false
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

            console.log(" - Controls P"+numPlayer+": WASD + E");
            break;

        case 1:
            this.mov = game.input.keyboard.createCursorKeys();

            this.bomb.button = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_1)

            console.log(" - Controls P"+numPlayer+": ARROWS + Numpad_1");
            break;

        case 2:
            this.mov = {
                up: game.input.keyboard.addKey(Phaser.Keyboard.T),
                down: game.input.keyboard.addKey(Phaser.Keyboard.G),
                left: game.input.keyboard.addKey(Phaser.Keyboard.F),
                right: game.input.keyboard.addKey(Phaser.Keyboard.H),
            },

            this.bomb.button = game.input.keyboard.addKey(Phaser.Keyboard.Y)

            console.log(" - Controls P"+numPlayer+": TFGH + Y");
            break;

        case 3:
            this.mov = {
                up: game.input.keyboard.addKey(Phaser.Keyboard.I),
                down: game.input.keyboard.addKey(Phaser.Keyboard.K),
                left: game.input.keyboard.addKey(Phaser.Keyboard.J),
                right: game.input.keyboard.addKey(Phaser.Keyboard.L),
            },

            this.bomb.button = game.input.keyboard.addKey(Phaser.Keyboard.O)

            console.log(" - Controls P"+numPlayer+": IJKL + O");
            break;
    }
}

module.exports = Inputs;

},{}],7:[function(require,module,exports){
'use strict';
const DEBUG = true;

const winWith = 800;
const winHeight = 600;

var BootScene = require('./states/boot_scene.js');

var PreloaderScene = require('./states/preloader_scene.js');

var MainMenu = require('./states/main_menu.js');

var PlayScene = require('./states/play_scene.js');

window.onload = function () {
  var game = new Phaser.Game(winWith, winHeight, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('mainMenu', MainMenu);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};

},{"./states/boot_scene.js":18,"./states/main_menu.js":19,"./states/play_scene.js":20,"./states/preloader_scene.js":21}],8:[function(require,module,exports){
'use strict';

var baseMapData = {

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
        wallSP: {value: 2, sprite: "wallSP"},
        wall: {value: 1, sprite: "wall"},

        free: {value: 0, sprite: "background"},

        bombable: {value: 3, sprite: "bombable"},
        bombableDrop: {value: 4, sprite: "bombableDrop"},

        enemy: {value: 5, sprite: null},
        enemyDrop: {value: 6, sprite: null}
    },

    squares:
    [
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], //2: Wall with special sprite (optional)
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2], //1: Normal wall
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2], //0: Free square
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2], //3: Bombable
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ]
};

module.exports = baseMapData;

},{}],9:[function(require,module,exports){
'use strict';

//right now it's implemented that a power up can affect multiple player keys
//maybe we need that feature, atm we do not need it (simple power ups)
function Mod (type, key, mod) {
    this.type = type; //number, bool, bomb, function
    this.key = key;
    this.mod = mod;
}

//contains the different tiers, and inside the power ups
var levelDataBase = [

    [ //world 0, reserved?
    ],

    [ //world 1, actually there is only 1 atm
        {}, //0 not used atm
        {   //1
            extraWalls: 8,
            bombables: 33,      //some bombables drop power ups
            powerUps: [0,15],   //0 tier 0, and 2 tier 1
            enemies: [3],       //3 tier 0 enemies
            enemiesDrops: [0,2],//same as powerUps
            theme: "basic"
        },
        {   //2
            extraWalls: 6,
            bombables: 35,
            powerUps: [0,2],
            enemies: [3,2],
            enemiesDrops: [0,2],
            theme: "basic"
        },
        {   //3
            extraWalls: 6,
            bombables: 35,
            powerUps: [], //?
            enemies: [0,0,9],
            enemiesDrops: [], //?
            theme: "wood"
        },
    ]
];

module.exports = levelDataBase;

},{}],10:[function(require,module,exports){
'use strict';

var GameObject = require('../objects/gameObject.js');
var Physical = require('../objects/physical.js');
var Bombable = require('../objects/bombable.js');
var Enemy = require('../objects/enemy.js');

var Id = require('../id/identifiable.js').Id; //for bombable id
var tierSize = require('../id/identifiable.js').tierSize; //for the rnd gen

var Point = require('../point.js');
var baseMapData = require("./baseMapData.js"); //base map and spawns
var levelsDataBase = require("./levelsDataBase.js"); //base map and spawns

//default map tiles values
var defaultBodyOffset = new Point();
var defaultImmovable = true;
var defaultBombableLives = 1;
var defaultBombableInvencible = false;


function Map (game, worldNum, levelNum, groups, tileData, maxPlayers) {

    this.game = game;
    this.levelData = levelsDataBase[worldNum][levelNum];

    this.maxPlayers = maxPlayers;
    //this.groups = groups; //no need to extra atributes?

    //Always same base map
    this.map = baseMapData.squares;
    this.cols = baseMapData.cols;
    this.fils = baseMapData.fils;
    this.types = baseMapData.squaresTypes;
    this.playerSpawns = baseMapData.playerSpawns;

    this.bombableIdsPowerUps = this.generateIdsPowerUps(this.levelData.powerUps);
    this.enemiesIdsPowerUps = this.generateIdsPowerUps(this.levelData.enemiesDrops);

    this.generateMap();
    this.buildMap(groups, tileData);
};


//Adds all the extra bombables and walls
Map.prototype.generateMap = function() {
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
    insertRnd(this.levelData.enemies[0]-enemiesDrops, this.types.enemy.value);

    function insertRnd (numElem, type) {
        for (var i = 0; i < numElem; i++) {
            //between and including min and max (Phaser)
            var rnd = self.game.rnd.integerInRange(0,freeSquares.length-1)
            var x = freeSquares[rnd].x;
            var y = freeSquares[rnd].y;

            self.map[y][x] = type;

            //special odd wall placement to avoid wrong generation
            if (type === 1 && x%2 != 0 && y%2 != 0)
                self.removeSurroundingSquares(x,y,2,freeSquares)
            else freeSquares.splice(rnd,1); //removes from list
        }
    }
};

//gets the free squares of map excluding player pos
Map.prototype.getFreeSquares = function(maxPlayers) {
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
};

//generates the array of random powerUps based on levelsDataBase info
Map.prototype.generateIdsPowerUps = function (powerUps) {

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
};

//given a free square {x: x, y: y} in a freeSquares[] and a radius
//searches and removes (real map) surroundings squares of that radius
//removes the given square too? atm yes
Map.prototype.removeSurroundingSquares = function(x, y, radius, freeSquares) {

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
};

//creates all elements in their respective positions etc
Map.prototype.buildMap = function (groups, tileData) {

    for (var i = 0; i < this.cols; i++) {
        for (var j = 0; j < this.fils; j++) {

            //new point each time is bad? auto deletes trash?
            var squareIndexPos = new Point(i,j).applyTileData(tileData);
            var bombableIdPowerUp, enemyIdPowerUp;

            switch(this.map[j][i]) {

                case this.types.bombableDrop.value:
                    bombableIdPowerUp = this.bombableIdsPowerUps.pop(); //gets an Id

                case this.types.bombable.value:
                    groups.bombable.add(new Bombable (this.game, groups, squareIndexPos,
                        this.types.bombable.sprite, tileData.Scale, tileData.Res,
                        defaultBodyOffset, defaultImmovable,
                        defaultBombableLives, defaultBombableInvencible, bombableIdPowerUp));

                    bombableIdPowerUp = undefined; //resets the id

                    //no break so there is background underneath
                case this.types.free.value:
                    groups.background.add(new GameObject (this.game, squareIndexPos,
                        this.types.free.sprite, tileData.Scale));

                    break;


                case this.types.enemyDrop.value: //TODO: enemies type not based on level info
                    enemyIdPowerUp = this.enemiesIdsPowerUps.pop(); //gets an Id

                case this.types.enemy.value:
                    //adding floor too
                    groups.background.add(new GameObject (this.game, squareIndexPos,
                        this.types.free.sprite, tileData.Scale));

                    groups.enemy.add(new Enemy (this.game, squareIndexPos,
                        this, 0, tileData, groups, enemyIdPowerUp));

                    enemyIdPowerUp = undefined; //resets the id
                    break;


                case this.types.wallSP.value: //no special tile atm
                case this.types.wall.value:
                    groups.wall.add(new Physical (this.game, squareIndexPos,
                        this.types.wall.sprite, tileData.Scale, tileData.Res,
                        defaultBodyOffset, defaultImmovable));

                    break;
            }
        }
    }
};


//given a square position returns true if in given direction there is not a wall
//return if there was a bombable too
Map.prototype.getNextSquare = function (position, direction, /*bombable*/) {

    var x = position.x + direction.x;
    var y = position.y + direction.y;

    //not used atm, to use needs bombable to update map in die();
    //bombable = (this.map[y][x] === this.types.bombable.value);

    return (this.map[y][x] !== this.types.wallSP.value
        && this.map[y][x] !== this.types.wall.value);
}


module.exports = Map;

},{"../id/identifiable.js":4,"../objects/bombable.js":12,"../objects/enemy.js":13,"../objects/gameObject.js":14,"../objects/physical.js":15,"../point.js":17,"./baseMapData.js":8,"./levelsDataBase.js":9}],11:[function(require,module,exports){
'use strict';

var Bombable = require('./bombable.js'); //father
var Flame = require('../id/flame.js');

var Point = require('../point.js');
var Identifiable = require('../id/identifiable.js');


//default bomb values
var bombBodySize = new Point(48, 48); //little smaller
var bombBodyOffset = new Point(0, 0);
var bombExtraOffset = new Point(5, 5); //reaquired because bomb body is not full res

var bombImmovable = true;
var bombInvecible = false;

var bombLives = 1;
var bombPower = 1;
var bombTimer = 2000;
var bombFlameTimer = 500;

var bombSpritePath = 'bomb';
var flameId = {tier: 0, num: 0};


function Bomb (game, level, position, tileData, groups, player, bombMods) {

    var bombPosition = position.add(bombExtraOffset.x, bombExtraOffset.y);

    Bombable.call(this, game, groups, bombPosition, bombSpritePath,
        tileData.Scale, bombBodySize, bombBodyOffset, bombImmovable, bombLives, bombInvecible);

    this.timer = bombTimer;
    this.flameTimer = bombFlameTimer;
    this.power = bombPower;

    this.level = level;
    this.groups = groups;
    this.player = player; //atm not really required
    this.tileData = tileData;

    this.mods = [];
    Identifiable.applyMods(bombMods, this);

    this.xploded = false;
    //this.flamesEvent = undefined; //need to create it for die()
    this.xplosionEvent =
        game.time.events.add(this.timer, this.xplode, this);

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

    var flames = this.spawnFlames();

    //pushes the flames into map.flames
    for(var i = 0; i < flames.length; i++) this.groups.flame.add(flames[i]);

    //console.log(this.groups.flame.children);

    //callback to destroy the flames
    this.game.time.events.add(this.flameTimer, removeFlames, this);

    function removeFlames () {
        //.destroy() removes them from the group too
        for(var i = 0; i < flames.length; i++) flames[i].destroy();
        this.destroy();
    }
}

//spawns the first flame and calls expandFlames
Bomb.prototype.spawnFlames = function() {

    //initial flame postion (corrected offset even though then is the same)
    var cleanPosition = new Point (this.position.x, this.position.y)
        .subtract(bombExtraOffset.x, bombExtraOffset.y);

    var flames = [new Flame(this.game, cleanPosition, this.scale)];

    //get the virtual map position
    var positionMap = cleanPosition.reverseTileData(this.tileData, bombExtraOffset);

    return this.expandFlames(flames, positionMap);
}

//expands (and creates) the extra flames
Bomb.prototype.expandFlames = function(flames, positionMap) {

    //Tries to expand in each direction one by one
    var directions = [new Point(-1,0), new Point(1,0), new Point(0,-1), new Point(0,1)];
    for (var i = 0; i < directions.length; i++) {

        var expansion = 1;
        //these all could be the same, but allow us to know exactly waht
        var obstacle = false, bombable = false, bomb = false/*, flame = false*/;
        var tmpPositionMap = new Point (positionMap.x, positionMap.y);

        while(expansion <= this.power && !obstacle && !bombable && !bomb/* && !flame*/) {

            //checks if the next square is free
            if (this.level.getNextSquare(tmpPositionMap, directions[i])) {

                //updates tmp position
                tmpPositionMap.add(directions[i].x, directions[i].y);

                //creates the real one for the flame
                var flamePos = new Point (tmpPositionMap.x, tmpPositionMap.y)
                    .applyTileData(this.tileData);

                //creates the flame
                var newFlame = new Flame(this.game, flamePos, this.scale)
                flames.push(newFlame);
                expansion++;

                //if it touches a bombable or bomb (or a flame) it stops propagation
                bombable = this.game.physics.arcade.overlap(newFlame, this.groups.bombable);
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

},{"../id/flame.js":2,"../id/identifiable.js":4,"../point.js":17,"./bombable.js":12}],12:[function(require,module,exports){
'use strict';

var Physical = require('./physical.js'); //father
//some drop powerUps
var Identifiable = require('../id/identifiable.js');

//default bombable values
var bombableTimer = 500; //to sync with flames

//var Id = Identifiable.Id; //the mini factory is in Identifiable
//var bombableDropId = new Id (1,1);


function Bombable(game, groups, position, sprite, scale, bodySize, bodyOffSet, immovable, lives, invencible, dropId) {

    Physical.call(this, game, position, sprite, scale, bodySize, bodyOffSet, immovable);

    this.groups = groups;
    this.tmpInven = false; //flip flop

    //not really needed atm, but allows special blocks
    //this could be handled in the player
    this.lives = lives;
    this.invencible = invencible;
    this.dead = false;

    this.dropId = dropId;
}

Bombable.prototype = Object.create(Physical.prototype);
Bombable.prototype.constructor = Bombable;


Bombable.prototype.update = function() {
    this.checkFlames(); //player and bomb rewrite (extend) update
}

//common for all bombables
Bombable.prototype.checkFlames = function() {

    //console.log(this.flamesGroup);
    if (!this.dead) //maybe a invencible player puts a bomb on just a bomb
    this.game.physics.arcade.overlap(this, this.groups.flame, onFire, checkVulnerability, this);

    function checkVulnerability () {
        //console.log("checkin vulv");
        return (!this.invencible && !this.tmpInven);
    }

    function onFire () {
        //console.log("on fire");
        this.tmpInven = true;

        //die should be insta and then in die handle sync
        //so the player can die insta etc (block mov)
        //this.game.time.events.aadd(bombableTimer, this.die, this);
        this.die();
    }
}

//player, bomb, enemie, etc will extend this
Bombable.prototype.die = function () {
    //console.log("checkin die");
    this.lives--;

    if (this.lives <= 0) {
        this.dead = true;
        this.visible = false;

        //if it has a power up, drops it
        if (this.dropId !== undefined)
            this.game.time.events.add(bombableTimer-5, drop, this);

        //the destroy the bombable
        this.game.time.events.add(bombableTimer+5, this.destroy, this);
    }
    else this.game.time.events.add(bombableTimer, flipInven, this);


    function flipInven () { this.tmpInven = false; }
    function drop() {
        this.groups.powerUp.add(
            new Identifiable(this.game, this.position, this.scale, this.dropId));
    }
}


module.exports = Bombable;

},{"../id/identifiable.js":4,"./physical.js":15}],13:[function(require,module,exports){
'use strict';

var Bombable = require('./bombable.js'); //father
var Point = require('../point.js');


//default enemy values
var enemySpritePath = 'enemy';

var enemyBodySize = new Point(64, 64); //TODO: should be smaller
var enemyBodyOffset = new Point(0, 0);
var enemyExtraOffset = new Point(0, 0); //to center it

var enemyImmovable = false;
var enemyInvecible = false;

var enemyLives = 1;
var enemyVelocity = 100;


function Enemy (game, position, level, enemyType, tileData, groups, dropId) {

    this.level = level;
    this.groups = groups;
    this.tileData = tileData;
    this.enemyType = enemyType;

    var enemyPosition = position.add(enemyExtraOffset.x, enemyExtraOffset.y);

    Bombable.call(this, game, groups, enemyPosition, enemySpritePath,
        tileData.Scale, enemyBodySize, enemyBodyOffset,
        enemyImmovable, enemyLives, enemyInvecible, dropId);

    this.body.bounce.setTo(1,1);
    this.body.velocity.x = enemyVelocity;
};

Enemy.prototype = Object.create(Bombable.prototype);
Enemy.prototype.constructor = Enemy;


Enemy.prototype.hey = function() {console.log(this);};

Enemy.prototype.update = function() {

    this.checkFlames(); //bombable method

    if (this.dead) {
        this.body.immovable = true;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }
    else {
        this.game.physics.arcade.collide(this, this.groups.wall, logic, null, this);
        this.game.physics.arcade.collide(this, this.groups.bombable, logic, null, this);
        this.game.physics.arcade.collide(this, this.groups.bomb, logic, null, this);
        //not sure in the original
        this.game.physics.arcade.collide(this, this.groups.enemy, logic, null, this);
    }

    //atm no logic nopie
    function logic () {
        //console.log("bounce")
        //this.body.velocity.x=-this.body.velocity.x;
    }
}

module.exports = Enemy;

},{"../point.js":17,"./bombable.js":12}],14:[function(require,module,exports){
'use strict';

function GameObject (game, position, sprite, scale) {

    Phaser.Sprite.call(this, game, position.x, position.y, sprite);

    game.add.existing(this);
    this.scale.setTo(scale.x, scale.y);

};

GameObject.prototype = Object.create(Phaser.Sprite.prototype);
GameObject.prototype.constructor = GameObject;

module.exports = GameObject;

},{}],15:[function(require,module,exports){
'use strict';

var GameObject = require('./gameObject.js');

function Physical(game, position, sprite, scale, bodySize, bodyOffSet, immovable) {

    GameObject.call(this, game, position, sprite, scale);

    game.physics.arcade.enable(this);
    this.body.setSize(bodySize.x, bodySize.y, bodyOffSet.x, bodyOffSet.y);
    this.body.collideWorldBounds = true;

    this.body.immovable = immovable; //if static then immovable

    //vel y dir?

}

Physical.prototype = Object.create(GameObject.prototype);
Physical.prototype.constructor = Physical;

module.exports = Physical;

},{"./gameObject.js":14}],16:[function(require,module,exports){
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
        playerImmovable, playerLives, playerInvecible);

    this.velocity = playerVelocity;
    this.numBombs = playerNumBombs;

    this.inputs = new Inputs (game, numPlayer); //based on numPlayer
    this.groups.player.add(this); //adds itself to the group

    this.mods = [];
    this.bombMods = [];
    Identifiable.addPowerUps(playerInitialModsIds, this);

    //Initial invencible time
    this.game.time.events.add(playerInvencibleTime, this.endInvencibility, this);
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
Player.prototype.endInvencibility  = function () {
    console.log("P" + this.numPlayer + " invencibility ended");
    this.invencible = false;
}

module.exports = Player;

},{"../id/identifiable.js":4,"../inputs.js":6,"../point.js":17,"./bomb.js":11,"./bombable.js":12}],17:[function(require,module,exports){
'use strict';

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
Point.prototype.getMapSquareValue = function (tileData, extraOffset) {

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

module.exports = Point;

},{}],18:[function(require,module,exports){
'use strict';
const DEBUG = true;

var BootScene = {
    
      preload: function () {
        if (DEBUG) this.startTime = Date.now(); //to calculate booting time etc
    
        // load here assets required for the loading screen
        this.game.load.image('preloader_logo', 'images/phaser.png');
        // TODO: image not centered, almost off the canvas I think
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
},{}],19:[function(require,module,exports){
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

    nextState: function() { this.game.state.start('play');  },

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
        //     this.game.state.start('play');
    }

};

module.exports = MainMenu;

},{}],20:[function(require,module,exports){
'use strict';
const DEBUG = true;

var Point = require('../point.js');

var Groups = require('../groups.js')
var groups;
var Map = require('../maps/map.js');
var level;
var initialMap = {world: 1, level: 1};

var Inputs = require('../inputs.js');
var gInputs; //global inputs

var Player = require('../objects/player.js');
var players = []; //2 max for this mode but meh
var initialPlayers = 1;
var maxPlayers = 4; //needed for the map generation

const width = 800;
const height = 600;

const tileData = {
  Res: new Point(64, 64),
  Scale: new Point(0.75, 0.625), //64x64 to 48x40
  Offset: new Point(40, 80), //space for hud
};

var mMenuTitle;

var PlayScene = {

  preload: function () {
    //this.game.stage.backgroundColor = '#E80C94';
    if (DEBUG) this.startTime = Date.now(); //to calculate booting time
  },

  create: function () {
    mMenuTitle = this.game.add.sprite(50,0, 'mMenuTitle'); //vital for life on earth
    mMenuTitle.scale = new Point(0.9, 0.75); //nah just for presentation

    //map
    groups = new Groups (this.game); //first need the groups
    level = new Map(this.game, initialMap.world, initialMap.level, groups, tileData, maxPlayers);

    //global controls
    gInputs = new Inputs (this.game, -1);

    //player/s (initialPlayers) //maybe player group instead?
    for (var numPlayer = 0; numPlayer < initialPlayers; numPlayer++)
      players.push(new Player(this.game, level, numPlayer, tileData, groups));

    if (DEBUG) {
      console.log("Loaded...", Date.now()-this.startTime, "ms");
      console.log("\n PLAYER: ", players[0]);
      console.log("\n MAP: ", level.map);
    }
  },


  update: function(){
    //maybe in some object update?

    this.game.physics.arcade.collide(groups.player, groups.wall);
    if (!gInputs.debug.state) {
      this.game.physics.arcade.collide(groups.player, groups.bombable);
      this.game.physics.arcade.collide(groups.player, groups.bomb);
    }
    else this.game.physics.arcade.collide(players[0], groups.enemy);

    this.game.world.bringToTop(groups.flame);
    this.game.world.bringToTop(groups.player);

    //but full array bringToTop doesnt work
    //for (var numPlayer = 0; numPlayer < players.length; numPlayer++)
      //this.game.world.bringToTop(players[numPlayer]);

    addPlayerControl(this.game);
    debugModeControl(this.game);
    // pauseMenuControl(this.game);

    //rest in player and id etc
  },


  render: function(){

    //only debugging stuff atm
    if (gInputs.debug.state) {
      this.game.debug.bodyInfo(players[0], 32, 32);

      for (let i = 0; i < groups.player.length; i++)
        this.game.debug.body(groups.player.children[i]);

      for (let i = 0; i < groups.bomb.length; i++)
        this.game.debug.body(groups.bomb.children[i]);

      for (let i = 0; i < groups.wall.length; i++)
        this.game.debug.body(groups.wall.children[i]);

      for (let i = 0; i < groups.bombable.length; i++)
        this.game.debug.body(groups.bombable.children[i]);

      for (let i = 0; i < groups.flame.length; i++)
        this.game.debug.body(groups.flame.children[i]);

      for (let i = 0; i < groups.powerUp.length; i++)
        this.game.debug.body(groups.powerUp.children[i]);

      for (let i = 0; i < groups.enemy.length; i++)
        this.game.debug.body(groups.enemy.children[i]);
    }
  }

};


//this two methods may could go into some globalInputs.js update? but seems good
//allow to add extra players
var addPlayerControl = function (game) {
  if(gInputs.addPlayer.button.isDown && !gInputs.addPlayer.ff && players.length < maxPlayers)
  {
    gInputs.addPlayer.ff = true;

    console.log(groups.enemy.children)

    //logic for new player
    for (var numPlayer = 0; numPlayer < players.length; numPlayer++) {
      //divides by 2 all players' lives (integers) but only down to 1
      if (players[numPlayer].lives > 1) {
        players[numPlayer].lives -= players[numPlayer].lives % 2;
        players[numPlayer].lives /= 2;
      }
    }
    players.push(new Player (game, level, players.length, tileData, groups))
    players[players.length-1].lives = players[0].lives;
    //new player's lives = player0; maybe a little unfair, but the real mode only allows 2 players
  }

  else if(gInputs.addPlayer.button.isUp)
    gInputs.addPlayer.ff = false;
};

//shows hitboxes and allows movement through the boxes
var debugModeControl = function (game) {
  if(gInputs.debug.button.isDown && !gInputs.debug.ff)
  {
    //while debug player 0 is invecible and can push enemies
    players[0].invencible = true;

    gInputs.debug.state = !gInputs.debug.state; //toggle state
    gInputs.debug.ff = true;

    if (!gInputs.debug.state) {
      players[0].endInvencibility();
      game.debug.reset(); //reset whole debug render
    }
  }

  else if(gInputs.debug.button.isUp)
    gInputs.debug.ff = false;

};

// var pauseMenuControl = function (game) {
//   if(gInputs.pMenu.button.isDown && !gInputs.pMenu.ff)
//   {
//     gInputs.pMenu.ff = true;
//     game.paused = !game.paused;
//   }
// //MIRAR DOCUMENTACION DE PHASER.SIGNAL
//   else if(game.onPause || game.onResume)
//     gInputs.pMenu.ff = false;
//   console.log(gInputs.pMenu.ff)
// }

module.exports = PlayScene;

},{"../groups.js":1,"../inputs.js":6,"../maps/map.js":10,"../objects/player.js":16,"../point.js":17}],21:[function(require,module,exports){
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

        this.game.load.image('powerUpBombUp', 'images/Sprites/Powerups/BombPowerup.png');
        this.game.load.image('powerUpFlameUp', 'images/Sprites/Powerups/FlamePowerup.png');
        this.game.load.image('powerUpSpeedUp', 'images/Sprites/Powerups/SpeedPowerup.png');

        this.game.load.image('bomb', 'images/Sprites/Bomb/Bomb_f01.png');
        this.game.load.image('flame', 'images/Sprites/Flame/Flame_f00.png');
        this.game.load.image('enemy', 'images/Sprites/Creep/Creep_F_f00.png');

        //Main Menu sprites
        this.game.load.image('mMenuBG', 'images/Sprites/Menu/title_background.jpg');
        this.game.load.image('mMenuButton1', 'images/Sprites/Menu/One_Player_Normal.png');
        this.game.load.image('mMenuButton2', 'images/Sprites/Menu/One_Player_Hover.png');
        this.game.load.image('mMenuTitle', 'images/Sprites/Menu/title.png');
    },

    create: function () {
        this.game.state.start('mainMenu');
        if (DEBUG) console.log("Preloading...", Date.now()-this.startTime, "ms");
    }
  };
  module.exports = PreloaderScene;

},{}]},{},[7]);
