'use strict';
const DEBUG = true;

var BootScene = {
    
      preload: function () {
        if (DEBUG) this.startTime = Date.now(); //to calculate booting time etc
    
        // load here assets required for the loading screen
        this.game.load.image('preloader_logo', 'images/phaser.png');
        // TODO: image not centered, almost off the canvas I think
      },
    
      create: function () {
    
        //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //this.scale.pageAlignHorizontally = true;
        //this.scale.setScreenSize();
    
        this.game.state.start('preloader');
        if (DEBUG) console.log("Booting...", Date.now()-this.startTime, "ms");
      }
    };

    module.exports = BootScene;