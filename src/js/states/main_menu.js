'use strict';

const DEBUG = true;

const winWidth = 800;
const winHeight = 600;

var mMenuBG;
var mMenuButton;
var buttonCount = 1;

var MainMenu = {
    preload: function() {
        if (DEBUG) this.startTime = Date.now(); //to calculate booting time etc
        
        this.game.load.image('mMenuBG', 'images/Sprites/Menu/title_background.jpg');
        this.game.load.image('mMenuButton1', 'images/Sprites/Menu/One_Player_Normal.png');
        this.game.load.image('mMenuButton2', 'images/Sprites/Menu/One_Player_Hover.png');

        
    },

    nextState: function() { this.game.state.start('play');  },

    over: function() { buttonCount++; },

    out: function() { buttonCount--; },

    create: function() {      
        mMenuBG = this.game.add.sprite(0, 0, 'mMenuBG');
        mMenuButton = this.game.add.button(winWidth/2, winHeight/2 + 100, 'mMenuButton' + buttonCount, this.nextState, this);

        
        mMenuBG.width = winWidth;
        mMenuBG.heigth = winHeight; 
        
        mMenuButton.anchor.setTo(0.5, 0.5);
        //mMenuButton.scale.x = 100;
        //mMenuButton.scale.y = 75;

        mMenuButton.onInputOver.add(this.over, this);        
    },

    update: function() {

        // if(this.game.input.mousePointer.leftButton.isDown && this.game.input.mousePointer.position.x == this.mMenuButton.x 
        //     && this.game.input.mousePointer.position.y == this.mMenuButton.y)
        //     this.game.state.start('play');
    }

};

module.exports = MainMenu;
