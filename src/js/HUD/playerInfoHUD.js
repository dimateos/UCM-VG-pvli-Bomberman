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

const HUDBombPos = config.HUDBombPos;
const HUDBombAnchor = config.HUDBombAnchor;
const HUDBombScale = config.HUDBombScale;

const HUDBombPosText = config.HUDBombPosText;

var HUDPressX;
var HUDBomb;
var HUDBombText;


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

}

playerInfoHUD.prototype.updatePlayerInfoHud = function (player, pvpMode) {
    if (!pvpMode) {
        this.HUDlives.text = player.lives;
        this.HUDPointsNumber.text = player.points;

        if (config.endless_rnd_map_gen) HUDBombText.text = player.level.rndGen;
    }
    else this.HUDlives.text = player.wins;
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

playerInfoHUD.drawBombHud = function (game, pvpMode) {

    var posX;
    if (pvpMode) posX = winWidth - winWidth/10;
    else posX = winWidth/2;

    HUDBomb = game.add.sprite(posX + HUDBombPos.x, HUDBombPos.y, config.keys.HUDbomb);
    HUDBomb.anchor.setTo(HUDBombAnchor.x, HUDBombAnchor.y);
    HUDBomb.scale.setTo(HUDBombScale.x, HUDBombScale.y);

    if (!pvpMode && config.endless_rnd_map_gen)
        HUDBombText = game.add.text(posX + HUDBombPosText.x, HUDBombPos.y + HUDBombPosText.y, "",
        { font: "30px Comic Sans MS", fill: "#f9e000", align: "center" });
}

module.exports = playerInfoHUD;
