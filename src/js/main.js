'use strict';
const DEBUG = true;

const winWith = 800;
const winHeight = 600;

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


var PreloaderScene = {
  preload: function () {
    if (DEBUG) this.startTime = Date.now();

    //this.game.stage.backgroundColor = '#E80C94';
    this.loadingBar = this.game.add.sprite(winWith/2, winHeight/2, 'preloader_logo');
    this.loadingBar.anchor.setTo(0.5, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game
    //this.game.load.image('logo', 'images/readme/arena.png');

    this.game.load.image('player_0', 'images/Sprites/Bomberman/Bman_0.png');
    this.game.load.image('player_1', 'images/Sprites/Bomberman/Bman_1.png');

    this.game.load.image('wall', 'images/Sprites/Blocks/SolidBlock.png');

    this.game.load.image('box', 'images/Sprites/Blocks/ExplodableBlock.png');

    this.game.load.image('bomb', 'images/Sprites/Bomb/Bomb_f01.png');

    this.game.load.image('background', 'images/Sprites/Blocks/BackgroundTile.png');
  },

  create: function () {
    this.game.state.start('play');
    if (DEBUG) console.log("Preloading...", Date.now()-this.startTime, "ms");
  }
};

var PlayScene = require('./states/play_scene.js');

window.onload = function () {
  var game = new Phaser.Game(winWith, winHeight, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};
