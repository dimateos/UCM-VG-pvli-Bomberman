'use strict';
const config = require('./config.js');
const keys = config.keys;

const DEBUG = config.DEBUG;
const winWidth = config.winWidth;
const winHeight = config.winHeight;

var BootScene = require('./states/boot_scene.js');

var PreloaderScene = require('./states/preloader_scene.js');

var MainMenu = require('./states/main_menu.js');

var PVEmode = require('./states/pve_mode.js');
var PVPmode = require('./states/pvp_mode.js');

//Adding states
window.onload = function () {
  var game = new Phaser.Game(winWidth, winHeight, Phaser.AUTO, 'game');

  game.state.add(keys.boot, BootScene);
  game.state.add(keys.preloader, PreloaderScene);
  game.state.add(keys.mainMenu, MainMenu);
  game.state.add(keys.pve, PVEmode);
  game.state.add(keys.pvp, PVPmode);

  //and launching
  game.state.start(keys.boot);
};
