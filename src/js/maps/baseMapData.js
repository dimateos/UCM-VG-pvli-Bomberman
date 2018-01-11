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
        enemyDrop: {value: 6, sprite: null},

        bomb: {value: 7, sprite: null},
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
