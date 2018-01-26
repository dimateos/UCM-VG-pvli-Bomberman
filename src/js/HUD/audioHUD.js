'use strict';
const config = require('../config.js');
const keys = config.keys;

const winWidth = config.winWidth;
const winHeight = config.winHeight;

//Audio control buttons data
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

//Audio control buttons
var muteMusicButton;
var mutedMusicButton;
var lessVolButton;
var moreVolButton;

//Audio variables
const defaultVolume = config.default_volume;
const volume_increment = config.volume_increment;
const volume_Max = config.volume_Max;
const volume_Min = config.volume_Min;

//Initial audio setup
var muted = config.default_muted;

var audioHUD = {

    music: {},

    //Adds the music and sets it up to loop forever
    init: function (game) {

        //music
        this.music = game.add.audio('music');
        this.music.loopFull(0.4);
        game.sound.volume = defaultVolume;
        game.sound.mute = muted; 
    },

    //Creation of the buttons
    creation: function (game) {

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

    //Destruction of the music. Called when coming back to the Main Menu
    destruction: function (game) {
        muted = game.sound.mute;
        this.music.destroy();
    },

    //Swaps visibility of the mute button
    checkVisible: function () {
        if (this.music.mute) muteMusicButton.visible = false;
        else muteMusicButton.visible = true;

        if (!this.music.mute) mutedMusicButton.visible = false;
        else mutedMusicButton.visible = true;
    },

    //Toggles mute
    //Game is the context
    toggleMute: function () { this.sound.mute = !this.sound.mute; },

    //Increases volume
    moreVol: function () {
        if (!this.sound.mute && this.sound.volume < volume_Max)
            this.sound.volume += volume_increment;
    },

    //Decreases volume
    lessVol: function () {
        if (!this.sound.mute && this.sound.volume > volume_Min)
            this.sound.volume -= volume_increment;
    },

}

module.exports = audioHUD;
