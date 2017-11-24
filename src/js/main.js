'use strict';

var PlayScene = require('./play_scene.js');

var BootScene = {

  preload: function () {
    this.startTime = Date.now(); //to calculate booting time

    // load here assets required for the loading screen
    this.game.load.image('preloader_logo', 'images/phaser.png');
},

  create: function () {

    //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //this.scale.pageAlignHorizontally = true;
    //this.scale.setScreenSize();

    this.game.state.start('preloader');
    console.log("Booting...", Date.now()-this.startTime, "ms");
  }
};


var PreloaderScene = {
  preload: function () {
    this.startTime = Date.now(); //to calculate booting time

    this.loadingBar = this.game.add.sprite(0, 0, 'preloader_logo');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game
    this.game.load.image('logo', 'images/readme/portada.jpg');
  },

  create: function () {
    this.game.state.start('play');
    console.log("Preloading...", Date.now()-this.startTime, "ms");
  }
};


window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};
