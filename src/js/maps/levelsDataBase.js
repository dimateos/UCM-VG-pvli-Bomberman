'use strict';

//right now it's implemented that a power up can affect multiple player keys
//maybe we need that feature, atm we do not need it (simple power ups)
function Mod (type, key, mod) {
    this.type = type; //number, bool, bomb, function
    this.key = key;
    this.mod = mod;
}

//contains the different tiers, and inside the power ups
var levelDataBase = [

    [ //world 0, reserved?
    ],

    [ //world 1, actually there is only 1 atm
        {}, //0 not used atm
        // {   //1
        //     extraWalls: 8,
        //     bombables: 33,      //some bombables drop power ups
        //     powerUps: [1,2],   //1 tier 0 (always stairs), and 2 tier 1
        //     enemies: [3],       //3 tier 0 enemies
        //     enemiesDrops: [0,2],//same as powerUps
        //     theme: "basic"
        // },
        {   //1
            extraWalls: 2,
            bombables: 10,      //some bombables drop power ups
            powerUps: [5,5],   //1 stairs, and 1 tier 1
            enemies: [10],       //3 tier 0 enemies
            enemiesDrops: [0],  //tirectly tier 1 powerUps (no stairs)
            theme: "basic"
        },
        {   //2
            extraWalls: 6,
            bombables: 35,
            powerUps: [1,2],
            enemies: [3,2],
            enemiesDrops: [0,2],
            theme: "basic"
        },
        {   //3
            extraWalls: 6,
            bombables: 35,
            powerUps: [1], //?
            enemies: [0,0,9],
            enemiesDrops: [], //?
            theme: "wood"
        },
    ]
];

module.exports = levelDataBase;
