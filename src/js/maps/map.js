'use strict';

var GameObject = require('../objects/gameObject.js');
var Physical = require('../objects/physical.js');
var Bombable = require('../objects/bombable.js');

var Point = require('../point.js')
var baseMapData = require("./baseMapData.js"); //base map and spawns

function isOdd(num) { return (num % 2) == 1;};

function Map (game, worldNum, levelNum, groups, tileData, maxPlayers) {

    this.game = game;
    this.worldNum = worldNum;
    this.levelNum = levelNum;

    this.maxPlayers = maxPlayers;
    //this.groups = groups; no need to extra atributes?

    //Always same base map
    this.map = baseMapData;

    this.developMap(8,33); //will depend on the level

    this.buildMap(groups, tileData);
};


//Adds all the extra bombables and walls
Map.prototype.developMap = function(numWall, numBombable) {
    var self = this;
    var freeSquares = this.getFreeSquares(this.map,this.maxPlayers);
    console.log(freeSquares);

    insertRnd(numBombable, 3);
    insertRnd(numWall, 1);

    function insertRnd (numElem, type) {
        for (var i = 0; i < numElem; i++) {
            //between and including min and max (Phaser)
            var rnd = self.game.rnd.integerInRange(0,freeSquares.length-1)
            var x = freeSquares[rnd].x;
            var y = freeSquares[rnd].y;

            self.map.squares[y][x] = type;

            freeSquares.splice(rnd,1); //removes from list

            //special wall placement to avoid wrong generation
            if (type === 1 && x%2 != 0 && y%2 != 0) {
                var index; //searches and removes possible squares that could lead to a blocked zone

                index = freeSquares.findIndex(function equal (e) { return e.x === x-2 && e.y === y});
                if (index > -1) freeSquares.splice(index, 1);

                index = freeSquares.findIndex(function equal (e) { return e.x === x+2 && e.y === y});
                if (index > -1) freeSquares.splice(index, 1);

                index = freeSquares.findIndex(function equal (e) { return e.x === x && e.y === y-2});
                if (index > -1) freeSquares.splice(index, 1);

                index = freeSquares.findIndex(function equal (e) { return e.x === x && e.y === y+2});
                if (index > -1) freeSquares.splice(index, 1);
            }
        }
    }
};

//gets the free squares of map excluding player pos
Map.prototype.getFreeSquares = function(map,maxPlayers) {
    var freeSquares = [];

    for (var i = 0; i < map.fils; i++)
        for (var j = 0; j < map.cols; j++)
            if (map.squares[i][j] == 0 /*&& !checkPlayerSquare(j,i,maxPlayers)*/)
                freeSquares.push({x: j, y: i});

    var index; //now we search and remove the players spawns (and souroundings?)
    for (var numPlayer = 0; numPlayer < maxPlayers; numPlayer++) {
        index = freeSquares.findIndex(function equal (e) {
            return e.x === map.playerSpawns[numPlayer].x
                && e.y === map.playerSpawns[numPlayer].y});
        if (index > -1) freeSquares.splice(index, 1);

        index = freeSquares.findIndex(function equal (e) {
            return e.x === map.playerSpawns[numPlayer].x-1
                && e.y === map.playerSpawns[numPlayer].y});
        if (index > -1) freeSquares.splice(index, 1);

        index = freeSquares.findIndex(function equal (e) {
            return e.x === map.playerSpawns[numPlayer].x+1
                && e.y === map.playerSpawns[numPlayer].y});
        if (index > -1) freeSquares.splice(index, 1);

        index = freeSquares.findIndex(function equal (e) {
            return e.x === map.playerSpawns[numPlayer].x
                && e.y === map.playerSpawns[numPlayer].y-1});
        if (index > -1) freeSquares.splice(index, 1);

        index = freeSquares.findIndex(function equal (e) {
            return e.x === map.playerSpawns[numPlayer].x
                && e.y === map.playerSpawns[numPlayer].y+1});
        if (index > -1) freeSquares.splice(index, 1);
    }

    return freeSquares;

    //maybe better to search afterwars and remove them? this seems perfectly smooth anyway
    //this just allows to move the players around instead of the original fixed squares
    //BOTH are implemented, so just need to choose based on performance
    function checkPlayerSquare (x,y,maxPlayers) {
        for (var numPlayer = 0; numPlayer < maxPlayers; numPlayer++)
            if ((x == map.playerSpawns[numPlayer].x && y == map.playerSpawns[numPlayer].y)
                || (x == map.playerSpawns[numPlayer].x-1 && y == map.playerSpawns[numPlayer].y)
                || (x == map.playerSpawns[numPlayer].x+1 && y == map.playerSpawns[numPlayer].y)
                || (x == map.playerSpawns[numPlayer].x && y == map.playerSpawns[numPlayer].y-1)
                || (x == map.playerSpawns[numPlayer].x && y == map.playerSpawns[numPlayer].y+1))
                    return true;
    }
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
