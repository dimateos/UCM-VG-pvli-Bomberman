'use strict';

var GameObject = require('../objects/gameObject.js');

var livesHUD;
var pointsHUD;
var HUDBg;
var HUDPoints;
var HUDBombHead;
var HUD2;
var HUDBomb;

var muteMusicButton;
var mutedMusicButton;
var lessVolButton;
var moreVolButton;

var width = 800;
var height = 600;

function HUD(game, position, sprite, scale, type, buttonCallback, player) {

    if (type === 0) {
        GameObject.call(this, game, position, sprite, scale);
    }
    else if (type === 1) {
        this.game.add.button(position.x, position.y, sprite, buttonCallback, this);
        this.scale.setTo(scale.x, scale.y);
    }
    else if (type === 2) {
        this.game.add.text(position.x, position.y, "",
            { font: "45px Comic Sans MS", fill: "#f9e000", align: "center" });
        this.anchor.setTo(0.2, 0);
    }
};

// HUD.prototype = Object.create(GameObject.prototype);
HUD.prototype.constructor = HUD;

HUD.prototype.update = function () {
    if (type === 2) {
        livesHUD.text = player.lives;
        pointsHUD.text = player.points;
    }
}

HUD.prototype.lessVol = function () { if (this.game.sound.volume > 0.2) this.game.sound.volume -= 0.1; }
HUD.prototype.moreVol = function () { if (this.game.sound.volume < 1) this.game.sound.volume += 0.1; }
HUD.prototype.toggleMute = function () { this.game.sound.mute = !this.game.sound.mute; }

module.exports = HUD;



