'use strict';
const config = require('../config.js');

const audioHUD = require('../HUD/audioHUD.js');

const DEBUG = config.DEBUG;
const winWidth = config.winWidth;
const winHeight = config.winHeight;

var mMenuTitle; //super bomboooooozle man

var mMenuBG;
var mMenuPVE;
var mMenuPVP;
var buttonCount = 1;

var lessWinsButton;
var moreWinsButton;
var doneButton;
var howManyWins;
var numbers;

var winsNecessary = 1;
var minWinsNec = 1;
var maxWinsNec = 9;


var MainMenu = {

    preload: function() {
        if (DEBUG) this.startTime = Date.now(); //to calculate booting time etc

    },

    create: function() {

        mMenuBG = this.game.add.sprite(0, 0, 'mMenuBG');
        mMenuBG.scale.y = 1.05; //just a little bigger
        mMenuPVE = this.game.add.button(winWidth/2, winHeight/2 + 90, 'mMenuButton1', this.nextStatePVE, this);
        mMenuPVP = this.game.add.button(winWidth/2, winHeight/2 + 160, 'mMenuButton2', this.createWinsChoice, this);

        mMenuBG.width = winWidth;
        mMenuBG.heigth = winHeight;

        mMenuPVE.scale.setTo(0.7, 0.7);
        mMenuPVE.anchor.setTo(0.5, 0.5);

        mMenuPVP.scale.setTo(0.7, 0.7);
        mMenuPVP.anchor.setTo(0.5, 0.5);

        audioHUD.init(this.game);
        audioHUD.creation(this.game);

        mMenuTitle = this.game.add.sprite(50, winHeight/2 -175, 'mMenuTitle');
    },

    nextStatePVE: function() { this.game.state.start('pve');  },
    nextStatePVP: function() { this.game.state.start('pvp', true, false, winsNecessary);  },

    changeNumber: function(frame) { numbers.loadTexture(config.keys.numbers, frame); },

    lessWins: function() { if(winsNecessary > minWinsNec) winsNecessary--; this.changeNumber(winsNecessary); },
    moreWins: function() { if(winsNecessary < maxWinsNec) winsNecessary++; this.changeNumber(winsNecessary); },

    //only used in the menu
    createWinsChoice: function() {
        mMenuPVP.inputEnabled = false;

        numbers = this.game.add.sprite(mMenuPVP.position.x + 260, mMenuPVP.y, config.keys.numbers, winsNecessary);
        numbers.scale.setTo(0.5, 0.5);
        numbers.anchor.setTo(0.4, 0.4);

        lessWinsButton = this.game.add.button(mMenuPVP.position.x + 230, mMenuPVP.position.y, config.keys.volArrow, this.lessWins, this);
        lessWinsButton.scale.setTo(config.lessVolButtonScale.x, config.lessVolButtonScale.y);

        moreWinsButton = this.game.add.button(mMenuPVP.position.x + 290, mMenuPVP.position.y, config.keys.volArrow, this.moreWins, this);
        moreWinsButton.anchor.setTo(config.moreVolButtonAnchor.x, config.moreVolButtonAnchor.y);
        moreWinsButton.scale.setTo(config.moreVolButtonScale.x, config.moreVolButtonScale.y);
        moreWinsButton.angle = config.moreVolButtonAngle;

        doneButton = this.game.add.button(numbers.position.x, numbers.position.y + 50, config.keys.done, this.nextStatePVP, this);
        doneButton.scale.setTo(0.5, 0.5);
        doneButton.anchor.setTo(0.5, 0.5);

        howManyWins = this.game.add.sprite(numbers.position.x, numbers.position.y - 50, config.keys.manyWins);
        howManyWins.scale.setTo(0.3, 0.3);
        howManyWins.anchor.setTo(0.5, 0.5);
    },

    // over: function() { buttonCount++; },

    // out: function() { buttonCount--; },

    update: function() {

        audioHUD.checkVisible();
    }

};

module.exports = MainMenu;
