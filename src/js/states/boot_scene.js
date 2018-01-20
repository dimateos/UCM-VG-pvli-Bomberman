'use strict';
const config = require('../config.js');
const keys = config.keys;

const DEBUG = config.DEBUG;
const winWidth = config.winWidth;
const winHeight = config.winHeight;

var BootScene = {

      preload: function () {
        if (DEBUG) this.startTime = Date.now(); //to calculate booting time etc

        // load here assets required for the loading screen
        this.game.load.image(keys.preloader_logo, 'images/phaser.png');
      },

      create: function () {

        //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //this.scale.pageAlignHorizontally = true;
        //this.scale.setScreenSize();

        this.game.state.start(keys.preloader);
        if (DEBUG) console.log("Booting...", Date.now()-this.startTime, "ms");
      }
    };

    module.exports = BootScene;
