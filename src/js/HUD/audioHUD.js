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

const defaultVolume = config.default_volume;
const volume_increment = config.volume_increment;
const volume_Max = config.volume_Max;
const volume_Min = config.volume_Min;

var muted = config.default_muted;

var audioHUD = {

    music: {},

    init: function (game) {

        //music
        this.music = game.add.audio('music');
        this.music.loopFull(0.4);
        game.sound.volume = defaultVolume;
        game.sound.mute = muted; //la pauso que me morido quedo loco

    },

    creation: function (game) {

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

    destruction: function (game) {
        muted = game.sound.mute;
        this.music.destroy();
    },

    checkVisible: function () {
        if (this.music.mute) muteMusicButton.visible = false;
        else muteMusicButton.visible = true;

        if (!this.music.mute) mutedMusicButton.visible = false;
        else mutedMusicButton.visible = true;
    },

    //game is the context
    toggleMute: function () { this.sound.mute = !this.sound.mute; },

    moreVol: function () {
        if (!this.sound.mute && this.sound.volume < volume_Max)
            this.sound.volume += volume_increment;
    },

    lessVol: function () {
        if (!this.sound.mute && this.sound.volume > volume_Min)
            this.sound.volume -= volume_increment;
    },

}

module.exports = audioHUD;
