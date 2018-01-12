'use strict';

var modsFunctions = require('./modsFunctions.js'); //all the database
//*A previous version with types of mods (instead of all functions)
//*is in "unused" folder, but the fixed applyMods was removed directly

//contains the different tiers, and inside the power ups
var idDataBase = [

    [ //tier 0 (special for next level ladder etc)
        //portal object so we can add it more logic (not just id)
        /*{   //0
            sprite: 'portal', pts: 0,
            mods: [modsFunctions.levelUp]
        },*/
    ],

    [ //tier 1 //maybe sprite more generic + add name?
        {   //0
            sprite: 'powerUpBombUp', pts: 10,
            mods: [modsFunctions.bombUp]
        },
        {   //1
            sprite: 'powerUpFlameUp', pts: 200,
            mods: [modsFunctions.flameUp]
        },
        {   //2
            sprite: 'powerUpSpeedUp', pts: 400,
            mods: [modsFunctions.speedUp]
        }
    ]
];

module.exports = idDataBase;
