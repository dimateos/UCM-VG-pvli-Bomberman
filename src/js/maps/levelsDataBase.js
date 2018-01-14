'use strict';

//right now it's implemented that a power up can affect multiple player keys
//maybe we need that feature, atm we do not need it (simple power ups)
function Mod(type, key, mod) {
    this.type = type; //number, bool, bomb, function
    this.key = key;
    this.mod = mod;
}

//contains the different tiers, and inside the power ups
var levelDataBase = [

    [ //world 0, used for the presentation - to showcase stuff
        {   //0 - just nothing
            extraWalls: 0,
            bombables: 0,
            powerUps: [0],
            enemies: [0],
            enemiesDrops: [0],
            theme: "basic"
        },
        {   //1 - basic generation
            extraWalls: 8,
            bombables: 33,
            powerUps: [1, 15],
            enemies: [0],
            enemiesDrops: [0],
            theme: "basic"
        },
        {   //2 - enemy IA
            extraWalls: 6,
            bombables: 1,
            powerUps: [1],
            enemies: [6],
            enemiesDrops: [0, 3],
            theme: "basic"
        },
    ],

    [ //world 1, actually there is only 1 atm
        {   //0 - PVP with basic theme
            extraWalls: 0,      //always 0 too, so no unfairness
            bombables: 80,      //some bombables drop power ups
            powerUps: [0, 20],  //always 0 stairs //[0, 15, 5]
            enemies: [0],       //always 0
            enemiesDrops: [0],
            theme: "basic"
        },
        {   //1
            extraWalls: 8,
            bombables: 33,      //some bombables drop power ups
            powerUps: [1, 2],    //first 1 portal, 2 tier 1 power ups...
            enemies: [3],       //3 tier 0 enemies
            enemiesDrops: [0, 2],//they could drop portals but nope
            theme: "basic"
        },
        {   //2
            extraWalls: 6,
            bombables: 35,
            powerUps: [1, 2],
            enemies: [5], //[3,2]
            enemiesDrops: [0, 2],
            theme: "basic"
        },
        {   //3
            extraWalls: 6,
            bombables: 35,
            powerUps: [1], //?
            enemies: [7], //[0,0,9]
            enemiesDrops: [0, 1], //?
            theme: "basic" //"wood"
        },
    ]
];

module.exports = levelDataBase;
