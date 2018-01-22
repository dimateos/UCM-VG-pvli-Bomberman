'use strict';
const config = require('../config.js');

var bombsKey = config.bombsKey;
var bombsAdd = config.bombsAdd;
var bombsMin = config.bombsMin;
var bombsMax = config.bombsMax;

var flameKey = config.flameKey;
var flameAdd = config.flameAdd;
var flameMax = config.flameMax; //no flame min needed

var speedKey = config.speedKey;
var speedAdd = config.speedAdd;
var speedMin = config.speedMin;
var speedLimit = config.speedLimit;


//contains the different powerUp's functions. Unordered.
var modsFunctions = {

    // levelUp: function () {
    //     console.log("Next level!");
    // },

    bombUp: function (reverseMode) {
        basicStatChange.call(this,
            reverseMode, bombsKey, bombsAdd, bombsMin, bombsMax);
    },

    flameUp: function (reverseMode) {
        if (!reverseMode) this.bombMods.push(bombMods.flameUp);
        else this.bombMods.pop(); //follows an order
    },

    speedUp: function (reverseMode) {
        basicStatChange.call(this,
            reverseMode, speedKey, speedAdd, speedMin, speedLimit);
    },
}

//contains the different bomb functions
//as they are short I could put the in the push()
//but this way maybe a single power Up can do more the one of these
var bombMods = {
    flameUp: function () {
        basicAddition.call(this, flameKey, flameAdd, flameMax)
    }
}

//very common power up behavior (add, sub with min max and reverse mode)
function basicStatChange (reverseMode, stat, value, min, max) {
    if (!reverseMode) basicAddition.call(this, stat, value, max)
    else basicSubtraction.call(this, stat, value, min)
}
function basicAddition (stat, add, max) {
    if (this[stat]+add <= max) this[stat]+=add;
    else this[stat] = max;
}
function basicSubtraction (stat, sub, min) {
    if (this[stat]-sub >= min) this[stat]-=sub;
    else this[stat] = min;
}

module.exports = modsFunctions;
