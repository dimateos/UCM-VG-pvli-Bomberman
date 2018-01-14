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
