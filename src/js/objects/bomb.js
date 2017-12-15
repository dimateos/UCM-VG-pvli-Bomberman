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

    //this.flamesEvent = undefined; //need to create it for die()
    this.xplosionEvent =
        game.time.events.add(this.timer, this.xplode, this);
};

Bomb.prototype = Object.create(Bombable.prototype);
Bomb.prototype.constructor = Bomb;


Bomb.prototype.die = function () {
    //console.log("checkin bomb die");
    this.lives--;

    //cancels the standard callbacks
    if (this.lives <= 0) {
        this.game.time.events.remove(this.xplosionEvent);
        //this.game.time.events.remove(this.flamesEvent);
        this.destroy();
    }

    this.tmpInven = false; //vulneable again
}


//removes the bomb, spawns the fames and then removes them
Bomb.prototype.xplode = function() {
    this.groups.bomb.remove(this); //removes and destroys the bomb
    this.player.numBombs++; //adds a bomb back to the player

    var flames = this.spawnFlames();

    //pushes the flames into map.flames
    for(var i = 0; i < flames.length; i++) this.groups.flame.add(flames[i]);

    //console.log(this.groups.flame.children);

    //callback to destroy the flames
    this.game.time.events.add(this.flameTimer, removeFlames, this);
    //this.game.time.events.remove(lul);

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
        var obstacle = false, bombable = false;
        var tmpPositionMap = new Point (positionMap.x, positionMap.y);

        while(expansion <= this.power && !obstacle && !bombable) {

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

                //if it touches a bombable it stops propagation
                bombable = this.game.physics.arcade.overlap(newFlame, this.groups.bombable);
                //Seems cleaner than updating the map each bombable is destroyed
                //and then using getNextSquare to check for bombables.
                //This seems worse for performance but doesnt feel like it;
                //we could change it at any momment ofc

                //not checking for other bombs cause atm flame sprite is static
                //so there is no difference

                //we could add a timer to delay the expansions
            }
            else obstacle = true;
        }
    }
    return flames;
}


module.exports = Bomb;
