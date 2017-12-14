'use strict';

//they all look the same xd should improve it
//but allows modifications

//this should all be based on player
//so maybe add references (min values etc)

var bombsKey = "numBombs";
var bombsAdd = 1;
var bombsMin = 1;
var bombsMax = 10;

var flameKey = "power";
var flameAdd = 1;
var flameMax = 10; //no flame min needed

var speedKey = "velocity";
var speedAdd = 25;
var speedMin = 200;
var speedLimit = speedMin + speedAdd*8;


//contains the different powerUp's functions
var modsFunctions = {

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

//very common power up behavior
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
