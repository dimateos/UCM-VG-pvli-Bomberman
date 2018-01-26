'use strict';
const config = require('../config.js');
const keys = config.keys;

const Point = require('../general/point.js');

const winWidth = config.winWidth;
const winHeight = config.winHeight;

//Bomb HUD objects' data
const HUDBombPos = config.HUDBombPos;
const HUDBombAnchor = config.HUDBombAnchor;
const HUDBombScale = config.HUDBombScale;

const HUDFlameOffset = config.HUDFlameOffset;
const HUDFlameScale = config.HUDFlameScale;

const HUDBombPosText = config.HUDBombPosText;
const HUDBombPosOffset = config.HUDBombPosOffset;

//Bomb HUD constructor
var bombHUD = function (game, pvpMode) {

    var posX;
    if (pvpMode) posX = winWidth - winWidth / 10;
    else posX = winWidth / 2;

    this.HUDFlame = game.add.sprite(posX + HUDBombPos.x, HUDBombPos.y + HUDFlameOffset.y, config.keys.flame);
    this.HUDFlame.anchor.setTo(HUDBombAnchor.x, HUDBombAnchor.y);
    this.HUDFlame.scale.setTo(HUDFlameScale.x, HUDFlameScale.y);
    this.HUDFlame.animations.add("flaming", [0, 1, 2, 3, 4], 9, true);
    this.HUDFlame.animations.play("flaming");

    this.HUDBomb = game.add.sprite(posX + HUDBombPos.x, HUDBombPos.y, config.keys.bomb);
    this.HUDBomb.anchor.setTo(HUDBombAnchor.x, HUDBombAnchor.y);
    this.HUDBomb.scale.setTo(HUDBombScale.x, HUDBombScale.y);
    this.HUDBomb.animations.add("red");
    this.HUDBomb.animations.add("static", [0]);

    this.HUDBombTextFF = false;
    this.HUDBombFF = false;

    if (config.endless_rnd_map_gen || pvpMode) {
        if (pvpMode) posX += HUDBombPosOffset.x;
        this.HUDBombText = game.add.text(posX + HUDBombPosText.x, HUDBombPos.y + HUDBombPosText.y, "",
            { font: "30px Comic Sans MS", fill: "#f9e000", align: "center" });
    }
};

//Updates HUD depending on game mode
bombHUD.prototype.updateBombHud = function (map, pvpMode) {

    if (!pvpMode) this.updateBombHudPve(map);
    else this.updateBombHudPvp(map);
}

//Updates HUD on PVE mode
bombHUD.prototype.updateBombHudPve = function (map) {

    if (config.endless_rnd_map_gen) {
        this.HUDBombText.text = map.rndGen;

        if (map.rndGen > 9 && !this.HUDBombTextFF) {
            this.HUDBombTextFF = true;
            this.HUDBombText.position.x += HUDBombPosOffset.x;
        }
    }
}

//Updares HUD on PVP mode
bombHUD.prototype.updateBombHudPvp = function (map) {

    if (map.deathZoneStarted) { //If death zone has already started displays red bomb animation
        if (!this.HUDBombFF) {
            this.HUDBombFF = true;
            this.HUDBombText.visible = false;
            this.HUDBomb.animations.play("red", 4, true);
        }
    }
    else { //If death zone hasn't started displays countdown until it does
        this.HUDBombText.visible = true;
        this.HUDBombFF = false;
        this.HUDBomb.animations.play("static");
    }

    var time = (map.deathZoneTimerEvent.delay - map.deathZoneTimer.ms) / 1000;
    this.HUDBombText.text = Math.round(time);
}

module.exports = bombHUD;
