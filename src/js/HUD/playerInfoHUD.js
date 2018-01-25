'use strict';
const config = require('../config.js');
const keys = config.keys;

const Point = require('../general/point.js');

const winWidth = config.winWidth;
const winHeight = config.winHeight;

const HUDbombHeadPos = config.HUDbombHeadPos;
const HUDbombHeadScale = config.HUDbombHeadScale;

const HUD2Pos = config.HUD2Pos;
const HUD2Scale = config.HUD2Scale;

const HUDlivesPos = config.HUDlivesPos;
const HUDlivesScale = config.HUDlivesScale;

const HUDPointsNumberPos = config.HUDPointsNumberPos;
const HUDPointsNumberScale = config.HUDPointsNumberScale;

const HUDPressXPos = config.HUDPressXPos;
const HUDPressXScale = config.HUDPressXScale;

var HUDPressX;


var playerInfoHUD = function (game, HUDbombHead, playerNum, pvpMode) {

    var posX;
    if (!pvpMode) posX = HUDbombHeadPos.x + ((winWidth / 2) * playerNum);
    else posX = HUDbombHeadPos.x + ((winWidth / 5) * playerNum);

    HUDbombHead[playerNum] = game.add.sprite(posX, HUDbombHeadPos.y, 'player_' + playerNum + 'Clock');
    HUDbombHead[playerNum].scale.setTo(HUDbombHeadScale.x, HUDbombHeadScale.y);

    this.HUD2 = game.add.sprite(posX + HUD2Pos.x, HUD2Pos.y, 'HUD2');
    this.HUD2.scale.setTo(HUD2Scale.x, HUD2Scale.y);

    this.HUDlives = game.add.text(this.HUD2.position.x + HUDlivesPos.x, HUDlivesPos.y, "",
        { font: "45px Comic Sans MS", fill: "#f9e000", align: "center" });
    this.HUDlives.anchor.setTo(HUDlivesScale.x, HUDlivesScale.y);


    if (!pvpMode) {
        // this.HUDPointsWord = game.add.sprite(posX + 100, -5, 'HUDPoints');
        // this.HUDPointsWord.scale.setTo(0.45, 0.7);

        this.HUDPointsNumber = game.add.text(posX + HUDPointsNumberPos.x, HUDPointsNumberPos.y, "",
            { font: "50px Comic Sans MS", fill: "#f9e000", align: "right" });
        this.HUDPointsNumber.anchor.setTo(HUDPointsNumberScale.x, HUDPointsNumberScale.y);

        if (playerNum === 1 && HUDPressX !== undefined) HUDPressX.destroy();
    }

    else if (playerNum === 2 && HUDPressX !== undefined) {
        HUDPressX.destroy();
    }

}

playerInfoHUD.prototype.updatePlayerInfoHud = function (player, pvpMode) {

    if (pvpMode) this.HUDlives.text = player.wins;
    else {
        this.HUDlives.text = player.lives;
        this.HUDPointsNumber.text = player.points;
    }
}

playerInfoHUD.drawPressX = function (game, pvpMode) {
    if (!pvpMode) {
        HUDPressX = game.add.sprite(winWidth / 2 + HUDPressXPos.x, HUDPressXPos.y, 'HUDPressX');
    }
    else {
        HUDPressX = game.add.sprite(winWidth / 2 + HUDPressXPos.x - 100, HUDPressXPos.y, 'HUDPressX');
    }
    HUDPressX.scale.setTo(HUDPressXScale.x, HUDPressXScale.y);
    HUDPressX.visible = true;
}


module.exports = playerInfoHUD;
