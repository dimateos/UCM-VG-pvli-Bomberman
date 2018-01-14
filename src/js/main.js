'use strict';
const DEBUG = true;

const winWith = 800;
const winHeight = 600;

var BootScene = require('./states/boot_scene.js');

var PreloaderScene = require('./states/preloader_scene.js');

var MainMenu = require('./states/main_menu.js');

var PVEmode = require('./states/pve_mode.js');
var PVPmode = require('./states/pvp_mode.js');

window.onload = function () {
  var game = new Phaser.Game(winWith, winHeight, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('mainMenu', MainMenu);
  game.state.add('pve', PVEmode);
  game.state.add('pvp', PVPmode);

  game.state.start('boot');
};
