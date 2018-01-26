'use strict';
const config = require('../config.js');

const audioHUD = require('../HUD/audioHUD.js');

const DEBUG = config.DEBUG;
const winWidth = config.winWidth;
const winHeight = config.winHeight;

//Menu sprites data
var mMenuTitle; //super bomboooooozle man
const mMenuTitlePos = config.mMenuTitlePos;
const mMenuTitleKey = config.keys.mMenuTitle;

var mMenuBG;
const mMenuBGPos = config.mMenuBGPos;
const mMenuBGScale = config.mMenuBGScale;
const mMenuBGKey = config.keys.mMenuBG;

var mMenuPVE;
const mMenuPVEPos = config.mMenuPVEPos;
const mMenuPVEScale = config.mMenuPVEScale;
const mMenuPVEAnchor = config.mMenuPVPAnchor;
const mMenuPVEKey = config.keys.mMenuButton1;
var mMenuPVP;
const mMenuPVPPos = config.mMenuPVPPos;
const mMenuPVPScale = config.mMenuPVPScale;
const mMenuPVPAnchor = config.mMenuPVPAnchor;
const mMenuPVPKey = config.keys.mMenuButton2;
const buttonCount = config.buttonCount;
//

//Wins selector sprites and other data
var lessWinsButton;
var moreWinsButton;
var doneButton;
var howManyWins;
var numbers;
const numberData = config.numbers;
const doneData = config.doneButton;
const HMWData = config.howManyWins;
//

//These are the variables of the selector of PVP needed wins to finish the game
const winsNecessary = config.initWinsNecessary;
const minWinsNec = config.minWinsNec;
const maxWinsNec = config.maxWinsNec;
//

var MainMenu = {

    preload: function() {
        if (DEBUG) this.startTime = Date.now(); //to calculate booting time etc

    },

    create: function() {

        mMenuBG = this.game.add.sprite(mMenuBGPos.x, mMenuBGPos.y, mMenuBGKey);
        mMenuBG.scale.y = mMenuBGScale.y; //just a little bigger
        mMenuBG.width = winWidth;
        mMenuBG.heigth = winHeight;

        mMenuPVE = this.game.add.button(winWidth/2 + mMenuPVEPos.x, winHeight/2 + mMenuPVEPos.y, mMenuPVEKey, this.nextStatePVE, this);
        mMenuPVE.scale.setTo(mMenuPVEScale.x, mMenuPVEScale.y);
        mMenuPVE.anchor.setTo(mMenuPVEAnchor.x, mMenuPVEAnchor.y);
        
        mMenuPVP = this.game.add.button(winWidth/2 + mMenuPVPPos.x, winHeight/2 + mMenuPVPPos.y, mMenuPVPKey, this.createWinsChoice, this);
        mMenuPVP.scale.setTo(mMenuPVPScale.x, mMenuPVPScale.y);
        mMenuPVP.anchor.setTo(mMenuPVPAnchor.x, mMenuPVPAnchor.y);

        audioHUD.init(this.game);
        audioHUD.creation(this.game);

        mMenuTitle = this.game.add.sprite(mMenuTitlePos.x, winHeight/2 + mMenuTitlePos.y, mMenuTitleKey);
    },

    //Both of them change states
    nextStatePVE: function() { this.game.state.start('pve');  },
    nextStatePVP: function() { this.game.state.start('pvp', true, false, winsNecessary);  },

    //Changes the number of the selector
    changeNumber: function(frame) { numbers.loadTexture(config.keys.numbers, frame); },

    //Logic of the buttons of the selector
    lessWins: function() { if(winsNecessary > minWinsNec) winsNecessary--; this.changeNumber(winsNecessary); },
    moreWins: function() { if(winsNecessary < maxWinsNec) winsNecessary++; this.changeNumber(winsNecessary); },

    //only used in the menu
    createWinsChoice: function() {
        mMenuPVP.inputEnabled = false;

        numbers = this.game.add.sprite(mMenuPVP.position.x + numberData.pos.x, mMenuPVP.y + numberData.pos.y, config.keys.numbers, winsNecessary);
        numbers.scale.setTo(numberData.scale.x, numberData.scale.y);
        numbers.anchor.setTo(numberData.anchor.x, numberData.anchor.y);

        lessWinsButton = this.game.add.button(mMenuPVP.position.x + 230, mMenuPVP.position.y, config.keys.volArrow, this.lessWins, this);
        lessWinsButton.scale.setTo(config.lessVolButtonScale.x, config.lessVolButtonScale.y);

        moreWinsButton = this.game.add.button(mMenuPVP.position.x + 290, mMenuPVP.position.y, config.keys.volArrow, this.moreWins, this);
        moreWinsButton.anchor.setTo(config.moreVolButtonAnchor.x, config.moreVolButtonAnchor.y);
        moreWinsButton.scale.setTo(config.moreVolButtonScale.x, config.moreVolButtonScale.y);
        moreWinsButton.angle = config.moreVolButtonAngle;

        doneButton = this.game.add.button(numbers.position.x + doneData.pos.x, numbers.position.y + doneData.pos.y, config.keys.done, this.nextStatePVP, this);
        doneButton.scale.setTo(doneData.scale.x, doneData.scale.y);
        doneButton.anchor.setTo(doneData.anchor.x, doneData.anchor.y);

        howManyWins = this.game.add.sprite(numbers.position.x + HMWData.pos.x, numbers.position.y + HMWData.pos.y, config.keys.manyWins);
        howManyWins.scale.setTo(HMWData.scale.x, HMWData.scale.y);
        howManyWins.anchor.setTo(HMWData.anchor.x, HMWData.anchor.y);
    },

    //Updates the audio sprite manager
    update: function() {
        audioHUD.checkVisible();
    }

};

module.exports = MainMenu;
