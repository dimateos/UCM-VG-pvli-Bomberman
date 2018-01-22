'use strict';
var config = require('../config.js');


var modsFunctions = require('./modsFunctions.js'); //all the database
//*A previous version with types of mods (instead of all functions)
//*is in "unused" folder, but the fixed applyMods was removed directly

//contains the different tiers, and inside the power ups
var idDataBase = [

    [ //tier 0 reserved for the portal to next level
        //not power up but the id (0,0) is reserved for the map generation
        /*{   //0
            sprite: 'portal', pts: 0,
            mods: [modsFunctions.levelUp]
        },*/
    ],

    [ //tier 1
        {   //0
            sprite: config.keys.powerUpBombUp, pts: 200,
            mods: [modsFunctions.bombUp]
        },
        {   //1
            sprite: config.keys.powerUpFlameUp, pts: 300,
            mods: [modsFunctions.flameUp]
        },
        {   //2
            sprite: config.keys.powerUpSpeedUp, pts: 100,
            mods: [modsFunctions.speedUp]
        }
    ],

    [ //tier 2 //only points items
        {   //0
            sprite: config.keys.pointsUp, pts: 50,
            mods: []
        },
        {   //1
            sprite: config.keys.pointsUpPlus, pts: 500,
            mods: []
        },
    ]
];

module.exports = idDataBase;
