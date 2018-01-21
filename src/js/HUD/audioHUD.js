'use strict';
const config = require('../config.js');
const keys = config.keys;

const winWidth = config.winWidth;
const winHeight = config.winHeight;

const muteMusicButtonPos = config.muteMusicButtonPos;
const muteMusicButtonScale = config.mutedMusicButtonScale;
const mutedMusicButtonPos = config.mutedMusicButtonPos;
const mutedMusicButtonScale = config.mutedMusicButtonScale;
const lessVolButtonPos = config.lessVolButtonPos;
const lessVolButtonScale = config.lessVolButtonScale;
const moreVolButtonPos = config.moreVolButtonPos;
const moreVolButtonScale = config.moreVolButtonScale;
const moreVolButtonAnchor = config.moreVolButtonAnchor;
const moreVolButtonAngle = config.moreVolButtonAngle;

var muteMusicButton;
var mutedMusicButton;
var lessVolButton;
var moreVolButton;


var audioHUD = {

    music: {},

    creation: function (game) {

        //music
        this.music = game.add.audio('music');
        this.music.loopFull(0.4);
        game.sound.mute = true; //la pauso que me morido quedo loco

        //buttons
        muteMusicButton = game.add.button(muteMusicButtonPos.x, muteMusicButtonPos.y, 'unmuted', this.toggleMute, game);
        muteMusicButton.scale.setTo(muteMusicButtonScale.x, muteMusicButtonScale.y);
        mutedMusicButton = game.add.button(mutedMusicButtonPos.x, mutedMusicButtonPos.y, 'muted', this.toggleMute, game);
        mutedMusicButton.scale.setTo(mutedMusicButtonScale.x, mutedMusicButtonScale.y);

        lessVolButton = game.add.button(lessVolButtonPos.x, lessVolButtonPos.y, 'volArrow', this.lessVol, game);
        lessVolButton.scale.setTo(lessVolButtonScale.x, lessVolButtonScale.y);

        moreVolButton = game.add.button(moreVolButtonPos.x, moreVolButtonPos.y, 'volArrow', this.moreVol, game);
        moreVolButton.anchor.setTo(moreVolButtonAnchor.x, moreVolButtonAnchor.y);
        moreVolButton.scale.setTo(moreVolButtonScale.x, moreVolButtonScale.y);
        moreVolButton.angle = moreVolButtonAngle;

    },

    checkVisible: function () {
        if(this.music.mute) muteMusicButton.visible = false;
        else   muteMusicButton.visible = true;

        if(!this.music.mute) mutedMusicButton.visible = false;
        else mutedMusicButton.visible = true;
    },

    //game is the context
    toggleMute: function () { this.sound.mute = !this.sound.mute; },

    moreVol: function () { if(this.sound.volume < 1) this.sound.volume += 0.1; },

    lessVol: function () { if(this.sound.volume > 0.2) this.sound.volume -= 0.1; },

}

module.exports = audioHUD;
