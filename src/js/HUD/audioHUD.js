'use strict';
const config = require('../config.js');
const keys = config.keys;

const winWidth = config.winWidth;
const winHeight = config.winHeight;

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
        muteMusicButton = game.add.button(10, 40, 'unmuted', this.toggleMute, game);
        muteMusicButton.scale.setTo(0.1, 0.1);
        mutedMusicButton = game.add.button(10, 40, 'muted', this.toggleMute, game);
        mutedMusicButton.scale.setTo(0.1, 0.1);

        lessVolButton = game.add.button(10, 10, 'volArrow', this.lessVol, game);
        lessVolButton.scale.setTo(0.04, 0.04);

        moreVolButton = game.add.button(30, 10, 'volArrow', this.moreVol, game);
        moreVolButton.anchor.setTo(1, 1);
        moreVolButton.scale.setTo(0.04, 0.04);
        moreVolButton.angle = 180;

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
