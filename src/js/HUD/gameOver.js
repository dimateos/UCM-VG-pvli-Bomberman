'use strict';
const config = require('../config.js');
const keys = config.keys;

const winWidth = config.winWidth;
const winHeight = config.winHeight;

//Game Over sprites data
const gmOverSignAnchor = config.gmOverSignAnchor;
const goToMenuAnchor = config.goToMenuAnchor;

const pvpOverPos = config.pvpOverPos;
const pvpOverAnchor = config.pvpOverAnchor;
const pvpOverScale = config.pvpOverScale;
const pvpOverPlayerOffset = config.pvpOverPlayerOffset;
const pvpOverPlayerScale = config.pvpOverPlayerScale;

//Game Over PVP texts Offset
const pvpOverText0Offset = config.pvpOverText0Offset;
const pvpOverText1Offset = config.pvpOverText1Offset;
const pvpOverText2Offset = config.pvpOverText2Offset;
const pvpOverText3Offset = config.pvpOverText3Offset;

//contains all the functions required, each gamemode calls them as needed
var gameOver = {

    //Checks how many deaths happen in PVE
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

    //Checks how many wins have the players in PVP
    checkPvp: function (game, players, winsNec) {

        for (var i = 0; i < players.length; i++) {
            if (players[i].wins === winsNec) //end of the match
                this.menuPvp(game, players, i);
        }
    },

    //Go to menu and Game Over sign creation (PVE)
    menuPve: function (game) {

        var gmOverSign = game.add.sprite(winWidth / 2, winHeight / 2, keys.gameOver);
        gmOverSign.anchor.setTo(gmOverSignAnchor.x, gmOverSignAnchor.y);

        var goToMenu = game.add.button(winWidth, winHeight,
            keys.quitToMenu, function () { game.state.start(keys.mainMenu); }, game);
        goToMenu.anchor.setTo(goToMenuAnchor.x, goToMenuAnchor.y);
    },

    //Go to menu, Game Over sign and ending stats texts creation (PVP)
    menuPvp: function (game, players, numPlayer) {

        //Stops death zone
        players[0].level.deathZoneStop();

        for (var i = 0; i < players.length; i++)
            players[i].dead = true; //no one moves

        //back pannel
        var pvpOver = game.add.sprite(pvpOverPos.x, pvpOverPos.y, keys.gameOverPvpBg);
        pvpOver.anchor.setTo(pvpOverAnchor.x, pvpOverAnchor.y);
        pvpOver.scale.setTo(pvpOverScale.x, pvpOverScale.y);

        //specific winner sprite
        var playerino = game.add.sprite(pvpOverPos.x + pvpOverPlayerOffset.x, pvpOverPos.y + pvpOverPlayerOffset.y,
            keys.player + numPlayer + 'Clock');
        playerino.anchor.setTo(pvpOverAnchor.x, pvpOverAnchor.y);
        playerino.scale.setTo(pvpOverPlayerScale.x, pvpOverPlayerScale.y);

        //all the texts (player winner, kills, selfkills, pts...)
        var winner = game.add.text(pvpOverPos.x + pvpOverText0Offset.x, pvpOverPos.y + pvpOverText0Offset.y,
            "The player " + (numPlayer+1) + " wins!", { font: "40px Comic Sans MS", fill: "#f9e000", align: "right" });

        var winner = game.add.text(pvpOverPos.x + pvpOverText1Offset.x, pvpOverPos.y + pvpOverText1Offset.y,
            "Kills: " + players[numPlayer].kills, { font: "35px Comic Sans MS", fill: "#f9e000", align: "right" });

        var winner = game.add.text(pvpOverPos.x + pvpOverText2Offset.x, pvpOverPos.y + pvpOverText2Offset.y,
            "Selfkills: " + players[numPlayer].selfKills, { font: "35px Comic Sans MS", fill: "#f9e000", align: "right" });

        var winner = game.add.text(pvpOverPos.x + pvpOverText3Offset.x, pvpOverPos.y + pvpOverText3Offset.y,
            "Pts: " + players[numPlayer].points, { font: "35px Comic Sans MS", fill: "#f9e000", align: "right" });

        //also draws the go to menu button
        var goToMenu = game.add.button(winWidth, winHeight,
            keys.quitToMenu, function () { game.state.start(keys.mainMenu); }, game);
        goToMenu.anchor.setTo(goToMenuAnchor.x, goToMenuAnchor.y);
    },
}

module.exports = gameOver;
