'use strict';
const config = require('../config.js');
const keys = config.keys;

const Point = require('../general/point.js');

const winWidth = config.winWidth;
const winHeight = config.winHeight;

//Player info HUD objects' data (sprites)
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

var HUDPressX; //extra object (logic stored here)

//Contructor. Creates all sprites and texts
//each mode needs to call the updatePlayerInfoHud
var playerInfoHUD = function (game, HUDbombHead, playerNum, pvpMode) {

    var posX; //depends on pvpMode
    if (!pvpMode) posX = HUDbombHeadPos.x + ((winWidth / 2) * playerNum);
    else posX = HUDbombHeadPos.x + ((winWidth / 5) * playerNum);

    //little player sprite to use as clock when required
    HUDbombHead[playerNum] = game.add.sprite(posX, HUDbombHeadPos.y, keys.player + playerNum + 'Clock');
    HUDbombHead[playerNum].scale.setTo(HUDbombHeadScale.x, HUDbombHeadScale.y);

    //two points + text for lives
    this.HUD2 = game.add.sprite(posX + HUD2Pos.x, HUD2Pos.y, keys.HUD2);
    this.HUD2.scale.setTo(HUD2Scale.x, HUD2Scale.y);

    this.HUDlives = game.add.text(this.HUD2.position.x + HUDlivesPos.x, HUDlivesPos.y, "",
        { font: "45px Comic Sans MS", fill: "#f9e000", align: "center" });
    this.HUDlives.anchor.setTo(HUDlivesScale.x, HUDlivesScale.y);

    //draw points on pve
    if (!pvpMode) {

        this.HUDPointsNumber = game.add.text(posX + HUDPointsNumberPos.x, HUDPointsNumberPos.y, "",
            { font: "50px Comic Sans MS", fill: "#f9e000", align: "right" });
        this.HUDPointsNumber.anchor.setTo(HUDPointsNumberScale.x, HUDPointsNumberScale.y);

        if (playerNum === 1 && HUDPressX !== undefined) HUDPressX.destroy();
    }

    //if only 1 player then draw the "press X"
    else if (playerNum === 2 && HUDPressX !== undefined) {
        HUDPressX.destroy();
    }

}

//Updates player info
playerInfoHUD.prototype.updatePlayerInfoHud = function (player, pvpMode) {

    if (pvpMode) this.HUDlives.text = player.wins;
    else {
        this.HUDlives.text = player.lives;
        this.HUDPointsNumber.text = player.points;
    }
}

//Draws the 'Press X' sign when needed
playerInfoHUD.drawPressX = function (game, pvpMode) {
    var posX = winWidth / 2 + HUDPressXPos.x;
    if (pvpMode) posX -=  100; //position depends on the mode

    HUDPressX = game.add.sprite(posX, HUDPressXPos.y, keys.HUDPressX);

    HUDPressX.scale.setTo(HUDPressXScale.x, HUDPressXScale.y);
    HUDPressX.visible = true;
}


module.exports = playerInfoHUD;
