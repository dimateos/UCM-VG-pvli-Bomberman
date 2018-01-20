'use strict';
const config = require('../../config.js');
const keys = config.keys;

const winWidth = config.winWidth;
const winHeight = config.winHeight;


var gameOver = {

    check: function (game, players) {

        var deathCount = 0;
        for (var i = 0; i < players.length; i++) {
            if (players[i].lives <= 0 && deathCount < players.length)
                deathCount++;
        }

        if (deathCount === players.length) {
            this.menu(game);
        }
    },

    menu: function (game) {
        // var gmOverBg = this.game.add.sprite(0, 0, 'mMenuBG');

        var gmOverSign = game.add.sprite(winWidth / 2, winHeight / 2, keys.gameOver);
        gmOverSign.anchor.setTo(0.5, 0.5);

        var goToMenu = game.add.button(winWidth, winHeight,
            keys.quitToMenu, function () { game.state.start(keys.mainMenu); }, game);
        goToMenu.anchor.setTo(1, 1);
    },

}

module.exports = gameOver;
