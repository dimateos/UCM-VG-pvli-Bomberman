'use strict';
const config = require('../config.js');

const Bombable = require('../objects/bombable.js'); //father
const Flame = require('../enemy/flame.js');

const Point = require('../general/point.js');
const Identifiable = require('../id/identifiable.js');


//default bomb values
const bombBodySize = config.bombBodySize; //little smaller
const bombBodyOffset = config.bombBodyOffset;
const bombExtraOffset = config.bombExtraOffset; //reaquired because bomb body is not full res

const bombImmovable = config.bombImmovable;
const bombInvecibleTime = config.bombInvecibleTime;

const bombLives = config.bombLives;
const bombPower = config.bombPower;
const bombTimer = config.bombTimer;
const bombFlameTimer = config.bombFlameTimer;

const bombSpritePath = config.keys.bomb;

//Bomb constructor. Inherits from Bombable
//The player creates bombs, with given mods such as +flames (more radius)
//after some time explodes and creates flames, bombs can explode each other
function Bomb (game, level, position, tileData, groups, player, bombMods) {

    var bombPosition = new Point (position.x, position.y)
        .add(bombExtraOffset.x, bombExtraOffset.y); //add extra offset

    Bombable.call(this, game, level, groups, bombPosition, bombSpritePath,
        tileData.Scale, bombBodySize, bombBodyOffset, bombImmovable,
        bombLives, bombInvecibleTime);

    this.timer = bombTimer;
    this.flameTimer = bombFlameTimer;
    this[config.flameKey] = bombPower;

    this.groups = groups;
    this.player = player; //link to restore bomb etc
    this.level = level;
    this.tileData = tileData;

    this.animations.add("red"); //animations
    this.animations.play("red", 3/2);
    this.xplosionSound = game.add.audio('xplosion'); //sound

    this.mods = [];
    Identifiable.applyMods(bombMods, this);

    this.xploded = false;
    // // //this.flamesEvent = undefined; //need to create it for die()
    this.xplosionEvent =
        game.time.events.add(this.timer, this.xplode, this);

    level.updateSquare(position, level.types.bomb.value); //need to update mapsquare
};

Bomb.prototype = Object.create(Bombable.prototype);
Bomb.prototype.constructor = Bomb;

//in case of bombs, die makes them cancel xplosion and xplode sooner
Bomb.prototype.die = function () {

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

    this.xploded = true;
    this.groups.bomb.remove(this); //removes and destroys the bomb
    this.player.numBombs++; //adds a bomb back to the player

    this.xplosionSound.play("", 0, 0.1); //sound

    var flames = this.spawnFlames();

    //pushes the flames into map.flames
    for(var i = 0; i < flames.length; i++) this.groups.flame.add(flames[i]);

    //callback to destroy the flames
    this.game.time.events.add(this.flameTimer, removeFlames, this);

    function removeFlames () {
        //.destroy() removes them from the group too
        for(var i = 0; i < flames.length; i++) flames[i].destroy();

        //update map
        this.level.updateSquare(this.position, this.level.types.free.value, bombExtraOffset);
        this.destroy(); //destroy the bomb object
    }
}

//spawns the first flame and calls expandFlames
Bomb.prototype.spawnFlames = function() {

    //initial flame postion (corrected offset even though then is the same)
    var positionMap = new Point (this.position.x, this.position.y)
        .subtract(bombExtraOffset.x, bombExtraOffset.y);

    var flames = [new Flame(this.game, positionMap, this.scale, this.player)];

    //xpand flames (instantly) expands the flames to the max radius
    return this.expandFlames(flames, positionMap);
}

//expands (and creates) the extra flames
Bomb.prototype.expandFlames = function(flames, positionMap) {

    //Tries to expand in each direction one by one
    var directions = [new Point(-1,0), new Point(1,0), new Point(0,-1), new Point(0,1)];
    for (var i = 0; i < directions.length; i++) {

        var expansion = 1;
        //these all could be the same, but allow us to know exactly what fails
        var obstacle = false, bombable = false, bomb = false;

        //tmp Position for the initial expanded flame
        var tmpPositionMap = new Point (positionMap.x, positionMap.y)
            .reverseTileData(this.tileData, bombExtraOffset);

        while(expansion <= this[config.flameKey] && !obstacle && !bombable && !bomb) {

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

                // // //but it case of the flame over flame, no new one is generated
                // // //In the original game yes, aswell as there is no delay
                // // /*flame = this.game.physics.arcade.overlap(newFlame, this.groups.flame);
                // // if (!flame) flames.push(newFlame);
                // // else newFlame.destroy();*/
            }
            else {
                obstacle = true; //if obstacle no more expansion
            }
        }
    }
    return flames; //just need to delay this somehow
}


module.exports = Bomb;
