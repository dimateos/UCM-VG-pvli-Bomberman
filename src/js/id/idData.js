'use strict';

//right now it's implemented that a power up can affect multiple player keys
//maybe we need that feature, atm we do not need it (simple power ups)
function Mod (key, mod) {
    this.key = key;
    this.mod = mod;
}

//contains the different tiers, and inside the power ups
var idData = [

    [ //tier 0 (special for enemie and flames)
        {sprite: 'flame'} //0
    ],

    [ //tier 1 //maybe sprite mas generico + añadir name?
        {   //0
            sprite: 'powerUpBombUp', pts: 10,
            mods: [new Mod("numBombs", -2)]
        },
        {   //1
            sprite: 'powerUpFlameUp', pts: 200,
            mods: [new Mod("numBombs", 1)]
        },
        {   //2
            sprite: 'powerUpSpeedUp', pts: 400,
            mods: [new Mod("velocity", -150)]
        }
    ]
];

module.exports = idData;
