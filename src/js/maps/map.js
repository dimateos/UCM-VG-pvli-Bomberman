'use strict';

var GameObject = require('../objects/gameObject.js');
var Physical = require('../objects/physical.js');
var Bombable = require('../objects/bombable.js');

var Point = require('../point.js')
var snippetMap = require("./snippetMap.js"); //base map

function isOdd(num) { return (num % 2) == 1;};

function Map (game, worldNum, levelNum, groups, tileRes, tileScale, offset) {

    this.game = game;
    this.worldNum = worldNum;
    this.levelNum = levelNum;

    //this.groups = groups; no need to extra atributes

    //Always same base map
    this.map = snippetMap;

    this.developMap(8,33); //should depend on the level
    console.log(this.map.squares);

    this.buildMap(groups, tileRes, tileScale, offset);
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


Map.prototype.buildMap = function (groups, tileRes, tileScale, offset) {

    var squareScaled = Phaser.Point.multiply(tileScale,tileRes); //??

    for (var i = 0; i < this.map.cols; i++) {
        for (var j = 0; j < this.map.fils; j++) {

            var squareIndex = Point.Add(offset, Point.multiply(new Point(i,j), squareScaled));

            switch(this.map.squares[j][i]) {
                case 3:
                    groups.box.add(new Bombable(this.game,
                        squareIndex, 'box', tileScale, tileRes, new Point(0,0), true, 1, false));
                case 0: //(i*48+40, j*40+80)
                    groups.background.add(new GameObject(this.game, new Point(48 * i + 40, 40 * j + 80),
                    'background', new Point(0.75, 0.625)));
                    break;
                case 1:
                case 2:
                    groups.wall.add(new Physical(this.game,
                    new Point(i*48+40, j*40+80), 'wall', tileScale, tileRes, new Point(0,0), true));
                    break;
            }
        }
    }
};

module.exports = Map;
