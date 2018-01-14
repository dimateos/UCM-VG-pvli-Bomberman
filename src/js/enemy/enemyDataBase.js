'use strict';

var basicVelocity = 90;

var enemyDataBase = [

    {
        lives: 1,
        velocity: basicVelocity,
        pts: 100,
    },
    {
        lives: 2,
        velocity: basicVelocity,
        pts: 400,
    },
    {
        lives: 1,
        velocity: basicVelocity*1.25,
        pts: 200,
    },

]

module.exports = enemyDataBase;
