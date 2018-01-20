'use strict';
const config = require('../config.js');
const keys = config.keys;

const Point = require('../general/point.js');

const winWidth = config.winWidth;
const winHeight = config.winHeight;

const HUDbombHeadPos = new Point(60, 10);

var HUDPressX;
var HUDBomb;


var playerInfoHUD = function (game, HUDbombHead, playerNum, pvpMode) {

    var posX;
    if (!pvpMode) posX = HUDbombHeadPos.x + ((winWidth / 2) * playerNum);
    else posX = HUDbombHeadPos.x + ((winWidth / 4) * playerNum);

    HUDbombHead[playerNum] = game.add.sprite(posX, HUDbombHeadPos.y, 'player_' + playerNum + 'Clock');
    HUDbombHead[playerNum].scale.setTo(0.75, 0.70);

    this.HUD2 = game.add.sprite(posX + 35, -5, 'HUD2');
    this.HUD2.scale.setTo(0.75, 0.75);

    this.HUDlives = game.add.text(this.HUD2.position.x + 42, 15, "",
        { font: "45px Comic Sans MS", fill: "#f9e000", align: "center" });
    this.HUDlives.anchor.setTo(0.2, 0);

    if (!pvpMode) {
        // this.HUDPointsWord = game.add.sprite(posX + 100, -5, 'HUDPoints');
        // this.HUDPointsWord.scale.setTo(0.45, 0.7);

        this.HUDPointsNumber = game.add.text(posX + 170, 8, "",
            { font: "50px Comic Sans MS", fill: "#f9e000", align: "right" });
        this.HUDPointsNumber.anchor.setTo(0.2, 0);

        if (playerNum === 1 && HUDPressX !== undefined) HUDPressX.destroy();
    }

}

playerInfoHUD.prototype.updatePlayerInfoHud = function (player) {
    this.HUDlives.text = player.lives;
    this.HUDPointsNumber.text = player.points;
}

playerInfoHUD.drawPressX = function (game) {

    HUDPressX = game.add.sprite(winWidth / 2 + 90, -10, 'HUDPressX');
    HUDPressX.scale.setTo(0.75, 0.75);
    HUDPressX.visible = true;
}

playerInfoHUD.drawBombHud = function (game) {

    HUDBomb = game.add.sprite(winWidth/2, 10, 'bomb');
    HUDBomb.anchor.setTo(0.5, 0);
    HUDBomb.scale.setTo(1.2, 1.2);
}

module.exports = playerInfoHUD;
