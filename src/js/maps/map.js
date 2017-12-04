'use strict';

var GameObject = require('../objects/gameObject.js');
var Physical = require('../objects/physical.js');
var Bombable = require('../objects/bombable.js');

var snippetMap = require("./snippetMap.js"); //base map

function Map (game, worldNum, levelNum, bgGroup, wallGroup, boxGroups, bombGroup) {

    this.game = game;
    this.worldNum = worldNum;
    this.levelNum = levelNum;

    //Always same map
    this.map = snippetMap;

    this.developMap(8,33);
    console.log(this.map.squares);
    this.buildMap();
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


Map.prototype.buildMap = function () {
    for (var i = 0; i < this.map.fils; i++) {
        for (var j = 0; j < this.map.cols; j++) {
            switch(this.map.squares[j][i]) {
                case 3:
                case 0:
                this.bgGroup.add(new GameObject(this.game, new Point(i * 1.2, j * 1.6),
                'background', new Point(1, 1)));
                case 1:
                case 2:
                    break;
    // //instead of a map.dat now we just insert them
    // for (let i = - 25; i < width + 25; i += 50)
    //   for (let j = 0; j < height ; j += 40)
    //     background.add(new GameObject(this.game,
    //       new Point(i * 1.2, j * 1.6), 'background', new Point(1, 1)));

    // for (let i = 25; i < width-25; i += 50) {
    //   for (let j = 0; j < height; j += 40) {
    //     if ((i==25||j==0||i==width-75||j==height-40)||(!this.isOdd((i-25)/50) && !this.isOdd(j/40))) {
    //       //wall.create(i, j,'wall');
    //       wallGroup.add(new Physical(this.game,
    //          new Point(i, j), 'wall', new Point(1/1.2, 1/1.6), new Point(64,64), new Point(0,0), true));
    //     }
    //     if ((this.isOdd((i-25)/50) && i!=75 && i!=width-125 && !this.isOdd(j/40) && j!=0 && j!=height-40&&j!=height-80&&j!=40)
    //   || (!this.isOdd((i-25)/50) && i!=75 && i!=width-125 && i!=25 && i!=width-75 && this.isOdd(j/40) && j!=height-80 && j!=40))
    //     {
    //        boxGroups.add(new Bombable(this.game,
    //           new Point(i, j), 'box', new Point(1/1.2, 1/1.6), new Point(64,64), new Point(0,0), true, 1, false));
    //     }
    //   }
    // }
            }
        }
    }
};

module.exports = Map;
