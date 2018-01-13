'use strict';

var globalControls = {

    //allow to add extra players
    addPlayerControl: function (gInputs, players, maxPlayers) {
        if (gInputs.addPlayer.button.isDown && !gInputs.addPlayer.ff && players.length < maxPlayers) {
            gInputs.addPlayer.ff = true;

            //adapt lives of the rest of the players
            for (var numPlayer = 0; numPlayer < players.length; numPlayer++) {
                //divides by 2 all players' lives (integers) but only down to 1
                if (players[numPlayer].lives > 1) {
                    players[numPlayer].lives -= players[numPlayer].lives % 2;
                    players[numPlayer].lives /= 2;
                }
            }

            var pSample = players[0]; //to use its values

            //even use its constructor to create the new  player
            players.push(new pSample.constructor(pSample.game, pSample.level,
                players.length, pSample.tileData, pSample.groups))

            //adapt the new player's lives
            players[players.length - 1].lives = pSample.lives;
        }

        else if (gInputs.addPlayer.button.isUp)
            gInputs.addPlayer.ff = false;
    },

    //shows hitboxes and allows movement through the boxes
    debugModeControl: function (gInputs, game) {
        if (gInputs.debug.button.isDown && !gInputs.debug.ff) {

            // players[0].invencible = true;
            gInputs.debug.state = !gInputs.debug.state; //toggle state
            gInputs.debug.ff = true;

            if (!gInputs.debug.state) {
                // players[0].endInvencibility();
                game.debug.reset(); //reset whole debug render
            }
        }

        else if (gInputs.debug.button.isUp)
            gInputs.debug.ff = false;

    },

    //resets the actual level
    resetLevelControl: function (gInputs, level) {
        if (gInputs.resetLevel.button.isDown && !gInputs.resetLevel.ff) {
            gInputs.resetLevel.ff = true;

            level.regenerateMap();

            // level.groups.clearGroups(level.game); //clears all grups but player
            // level.groups.player.callAll('respawn'); //resets players' pos

            // //creates the new map
            // level = new level.constructor(level.game, level.mapNumber.world,
            //     level.mapNumber.level, level.groups, level.tileData, level.maxPlayers);
        }

        else if (gInputs.resetLevel.button.isUp)
            gInputs.resetLevel.ff = false;
    }
}

module.exports = globalControls;
