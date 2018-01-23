'use strict';

var Point = require('../general/point.js');

const basicVelocity = 90;

var enemyDataBase = [

    {
        lives: 1,
        velocity: basicVelocity,
        pts: 100,
        bodySize: new Point(48, 48),
        bodyOffset: new Point(8, 8),
    },
    {
        lives: 2,
        velocity: basicVelocity,
        pts: 250,
        bodySize: new Point(50, 50),
        bodyOffset: new Point(6, 6),
    },
    {
        lives: 1,
        velocity: basicVelocity*1.1,
        pts: 150,
        bodySize: new Point(42, 42),
        bodyOffset: new Point(10, 10),
    },

]

module.exports = enemyDataBase;
