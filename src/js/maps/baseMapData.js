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
