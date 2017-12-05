'use strict';

var GameObject = require('../objects/gameObject.js');
var Physical = require('../objects/physical.js');
var Bombable = require('../objects/bombable.js');

var Point = require('../point.js')
var snippetMap = require("./snippetMap.js"); //base map

function isOdd(num) { return (num % 2) == 1;};

function Map (game, worldNum, levelNum, groups, tileData) {

    this.game = game;
    this.worldNum = worldNum;
    this.levelNum = levelNum;

    //this.groups = groups; no need to extra atributes

    //Always same base map
    this.map = snippetMap;

    this.developMap(8,33); //should depend on the level

    this.buildMap(groups, tileData);
};
//Map.prototype = Object.create(Phaser.Sprite.prototype);
//Map.prototype.constructor = Map;

//Adds all the extra bombables and walls
Map.prototype.developMap = function(numWall, numBombable) {
    var self = this;
    var freeSquares = this.getFreeSquares(this.map);

    insertRnd(numWall, 1);
    insertRnd(numBombable, 3);

    function insertRnd (numElem, type) {
        for (var i = 0; i < numElem; i++) {
            //between and including min and max (Phaser)
            var rnd = self.game.rnd.integerInRange(0,freeSquares.length-1)

            self.map.squares[freeSquares[rnd].y][freeSquares[rnd].x] = type;
            freeSquares.splice(rnd,1); //removes from list
        }
    }
};

//gets the free squares of map excluding player pos
Map.prototype.getFreeSquares = function(map) {
    var freeSquares = [];

    for (var i = 0; i < map.fils; i++)
        for (var j = 0; j < map.cols; j++)
            if (map.squares[i][j] == 0 && !(j == map.player.x && i == map.player.y))
                freeSquares.push({x: j, y: i});

    return freeSquares;
};


Map.prototype.buildMap = function (groups, tileData) {

    for (var i = 0; i < this.map.cols; i++) {
        for (var j = 0; j < this.map.fils; j++) {

            //new point each time is bad? auto deletes trash?
            var squareIndex = new Point(i,j).applyTileData(tileData);

            switch(this.map.squares[j][i]) {

                case 3: groups.box.add(new Bombable
                    (this.game, squareIndex, 'box', tileData.Scale, tileData.Res, new Point(), true, 1, false));

                    //no break so there is background underneath

                case 0: groups.background.add(new GameObject
                    (this.game, squareIndex, 'background', tileData.Scale));

                    break;

                case 1: //no special tile for now
                case 2: groups.wall.add(new Physical
                    (this.game, squareIndex, 'wall', tileData.Scale, tileData.Res, new Point(), true));

                    break;
            }
        }
    }
};

module.exports = Map;
