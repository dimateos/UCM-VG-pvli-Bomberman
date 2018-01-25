'use strict';
const config = require('../config.js');
const keys = config.keys;

const winWidth = config.winWidth;
const winHeight = config.winHeight;

const gmOverSignAnchor = config.gmOverSignAnchor;
const goToMenuAnchor = config.goToMenuAnchor;

const pvpOverPos = config.pvpOverPos;
const pvpOverAnchor = config.pvpOverAnchor;
const pvpOverScale = config.pvpOverScale;
const pvpOverPlayerOffset = config.pvpOverPlayerOffset;
const pvpOverPlayerScale = config.pvpOverPlayerScale;

const pvpOverText0Offset = config.pvpOverText0Offset;
const pvpOverText1Offset = config.pvpOverText1Offset;
const pvpOverText2Offset = config.pvpOverText2Offset;
const pvpOverText3Offset = config.pvpOverText3Offset;

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
                this.menuPvp(game, players, i);
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

    menuPvp: function (game, players, numPlayer) {

        players[0].level.deathZoneStop();

        for (var i = 0; i < players.length; i++)
            players[i].dead = true; //no one moves

        //cambiar por winner
        var pvpOver = game.add.sprite(pvpOverPos.x, pvpOverPos.y, keys.gameOverPvpBg);
        pvpOver.anchor.setTo(pvpOverAnchor.x, pvpOverAnchor.y);
        pvpOver.scale.setTo(pvpOverScale.x, pvpOverScale.y);

        var playerino = game.add.sprite(pvpOverPos.x + pvpOverPlayerOffset.x, pvpOverPos.y + pvpOverPlayerOffset.y,
            keys.player + numPlayer + 'Clock');
        playerino.anchor.setTo(pvpOverAnchor.x, pvpOverAnchor.y);
        playerino.scale.setTo(pvpOverPlayerScale.x, pvpOverPlayerScale.y);

        var winner = game.add.text(pvpOverPos.x + pvpOverText0Offset.x, pvpOverPos.y + pvpOverText0Offset.y,
            "The player " + (numPlayer+1) + " wins!", { font: "40px Comic Sans MS", fill: "#f9e000", align: "right" });

        var winner = game.add.text(pvpOverPos.x + pvpOverText1Offset.x, pvpOverPos.y + pvpOverText1Offset.y,
            "Kills: " + players[numPlayer].kills, { font: "35px Comic Sans MS", fill: "#f9e000", align: "right" });

        var winner = game.add.text(pvpOverPos.x + pvpOverText2Offset.x, pvpOverPos.y + pvpOverText2Offset.y,
            "Selfkills: " + players[numPlayer].selfKills, { font: "35px Comic Sans MS", fill: "#f9e000", align: "right" });

        var winner = game.add.text(pvpOverPos.x + pvpOverText3Offset.x, pvpOverPos.y + pvpOverText3Offset.y,
            "Pts: " + players[numPlayer].points, { font: "35px Comic Sans MS", fill: "#f9e000", align: "right" });


        var goToMenu = game.add.button(winWidth, winHeight,
            keys.quitToMenu, function () { game.state.start(keys.mainMenu); }, game);
        goToMenu.anchor.setTo(goToMenuAnchor.x, goToMenuAnchor.y);
    },
}

module.exports = gameOver;
