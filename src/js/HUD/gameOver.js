'use strict';
const config = require('../config.js');
const keys = config.keys;

const winWidth = config.winWidth;
const winHeight = config.winHeight;

const gmOverSignAnchor = config.gmOverSignAnchor;
const goToMenuAnchor = config.goToMenuAnchor;

var gameOver = {

    checkPve: function (game, players) {

        var deathCount = 0;
        for (var i = 0; i < players.length; i++) {
            if (players[i].lives <= 0 && deathCount < players.length)
                deathCount++;
        }

        if (deathCount === players.length) {
            this.menuPve(game);
        }
    },

    checkPvp: function (game, players, winsNec) {

        for (var i = 0; i < players.length; i++) {
            if (players[i].wins === winsNec) //end of the match
                this.menuPvp(players);
        }
    },

    menuPve: function (game) {
        // var gmOverBg = this.game.add.sprite(0, 0, 'mMenuBG');

        var gmOverSign = game.add.sprite(winWidth / 2, winHeight / 2, keys.gameOver);
        gmOverSign.anchor.setTo(gmOverSignAnchor.x, gmOverSignAnchor.y);

        var goToMenu = game.add.button(winWidth, winHeight,
            keys.quitToMenu, function () { game.state.start(keys.mainMenu); }, game);
        goToMenu.anchor.setTo(goToMenuAnchor.x, goToMenuAnchor.y);
    },

    menuPvp: function (players) {

        for (var i = 0; i < players.length; i++)
            players[i].dead = true; //no one moves

        console.log("AND THE WINNER IS PIPO");
    },
}

module.exports = gameOver;
