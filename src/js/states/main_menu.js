'use strict';

const DEBUG = true;

const winWith = 800;
const winHeight = 600;

var MainMenu = {
    preload: function() {
        if (DEBUG) this.startTime = Date.now(); //to calculate booting time etc
        
        this.game.load.image('mMenuBG', 'images/Sprites/Menu/title_background.jpg');

        var mMenuBG = this.game.add.sprite(winWith/2, winHeight/2, 'mMenuBG');
        mMenuBG.anchor.setTo(0.5, 0.5);
        mMenuBG.scale.x = 800;
        mMenuBG.scale.y = 600;
    },

    create: function() {        
    },

    update: function() {
        this.game.state.start('play');
    }

};

module.exports = MainMenu;
