'use strict';

//I may change this so every mod has its own function
//I mean, almost everything needs to has a limit so a function is better
//Example: max 10 bombs, not always add 1
//and functions can do the simple add 1 always too

//right now it's implemented that a power up can affect multiple player keys
//maybe we need that feature, atm we do not need it (simple power ups)
function Mod (type, key, mod) {
    this.type = type; //number, bool, bomb, function
    this.key = key;
    this.mod = mod;
}

//contains the different tiers, and inside the power ups
var idDataBase = [

    [ //tier 0 (special for next level ladder etc)

    ],

    [ //tier 1 //maybe sprite more generic + add name?
        {   //0
            sprite: 'powerUpBombUp', pts: 10,
            mods: [new Mod("number", "numBombs", 1), new Mod("function", "hey", null)]
        },
        {   //1
            sprite: 'powerUpFlameUp', pts: 200,
            mods: [new Mod("bomb", null, new Mod("number", "power", 1)), new Mod("function", "hey", null)]
            //bombs power ups work like this
        },
        {   //2
            sprite: 'powerUpSpeedUp', pts: 400,
            mods: [new Mod("number", "velocity", 50), new Mod("function", "hey", null)]
        }
    ]
    //previous version with types of mods
    /*[ //tier 1 //maybe sprite more generic + add name?
        {   //0
            sprite: 'powerUpBombUp', pts: 10,
            mods: [new Mod("number", "numBombs", 1), new Mod("function", "hey", null)]
        },
        {   //1
            sprite: 'powerUpFlameUp', pts: 200,
            mods: [new Mod("bomb", null, new Mod("number", "power", 1)), new Mod("function", "hey", null)]
            //bombs power ups work like this
        },
        {   //2
            sprite: 'powerUpSpeedUp', pts: 400,
            mods: [new Mod("number", "velocity", 50), new Mod("function", "hey", null)]
        }
    ]*/
];

module.exports = idDataBase;
