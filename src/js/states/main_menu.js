'use strict';
const config = require('../config.js');

const DEBUG = config.DEBUG;
const winWidth = config.winWidth;
const winHeight = config.winHeight;

var mMenuBG;
var mMenuPVE;
var mMenuPVP;
var buttonCount = 1;

var mMenuTitle; //super bomboooooozle man

var MainMenu = {
    preload: function() {
        if (DEBUG) this.startTime = Date.now(); //to calculate booting time etc

    },

    nextStatePVE: function() { this.game.state.start('pve');  },
    nextStatePVP: function() { this.game.state.start('pvp');  },

    // over: function() { buttonCount++; },

    // out: function() { buttonCount--; },

    create: function() {

        mMenuBG = this.game.add.sprite(0, 0, 'mMenuBG');
        mMenuBG.scale.y = 1.05; //just a little bigger
        mMenuPVE = this.game.add.button(winWidth/2, winHeight/2 + 70, 'mMenuButton1', this.nextStatePVE, this);
        mMenuPVP = this.game.add.button(winWidth/2, winHeight/2 + 140, 'mMenuButton2', this.nextStatePVP, this);

        mMenuBG.width = winWidth;
        mMenuBG.heigth = winHeight;

        mMenuPVE.scale.setTo(0.7, 0.7);
        mMenuPVE.anchor.setTo(0.5, 0.5);

        mMenuPVP.scale.setTo(0.7, 0.7);
        mMenuPVP.anchor.setTo(0.5, 0.5);

        // mMenuButton.onInputOver.add(this.over, this);

        mMenuTitle = this.game.add.sprite(50,100, 'mMenuTitle');
    },

    update: function() {

        // if(this.game.input.mousePointer.leftButton.isDown && this.game.input.mousePointer.position.x == this.mMenuButton.x
        //     && this.game.input.mousePointer.position.y == this.mMenuButton.y)
        //     this.game.state.start('pve');
    }

};

module.exports = MainMenu;
