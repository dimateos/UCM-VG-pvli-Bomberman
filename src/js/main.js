'use strict';
const DEBUG = true;

const winWith = 800;
const winHeight = 600;

var BootScene = require('./states/boot_scene.js');

var PreloaderScene = require('./states/preloader_scene.js');

var MainMenu = require('./states/main_menu.js');

var PlayScene = require('./states/play_scene.js');

window.onload = function () {
  var game = new Phaser.Game(winWith, winHeight, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('mainMenu', MainMenu);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};
