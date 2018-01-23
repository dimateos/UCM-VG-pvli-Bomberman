'use strict';
const pvpMode = true;
const config = require('../config.js');
const keys = config.keys;

const DEBUG = config.DEBUG;
const winWidth = config.winWidth;
const winHeight = config.winHeight;

const debugPos = config.debugPos;
const debugColor = config.debugColor;

const Point = require('../general/point.js');

const globalControls = require('../general/globalControls.js');
const pauseMenu = require('../HUD/pauseMenu.js');
const gameOver = require('../HUD/gameOver.js');
const audioHUD = require('../HUD/audioHUD.js');

const playerInfoHUD = require('../HUD/playerInfoHUD.js');
var playerInfoHUDs;
var HUDBombHead = [];

const Groups = require('../general/groups.js');
var groups;

const Map = require('../maps/map.js');
var level;

var initialMap = config.initialMapPvP;

const Inputs = require('../general/inputs.js');
var gInputs; //global inputs

const Player = require('../player/player.js');
const initialPlayers = config.pvp_initialPlayers;
const maxPlayers = config.pvp_maxPlayers; //needed for the map generation
var players;

const tileData = config.tileData;

var winsNec;

var PlayScene = {

  //parameter sent from the menu
  init: function (winsNecessary) {
    winsNec = winsNecessary;
  },

  preload: function () {
    this.game.stage.backgroundColor = 'black';
    if (DEBUG) this.startTime = Date.now(); //to calculate booting time
  },

  endGameScreen: function () {
    //Cosas del endGame.
    console.log("AND THE WINNER IS PIPO");

  },


  create: function () {

    //audio
    audioHUD.creation(this.game);

    //map
    groups = new Groups(this.game); //first need the groups
    level = new Map(this.game, initialMap.world, initialMap.level, groups, tileData, maxPlayers, pvpMode);

    //global controls
    gInputs = new Inputs(this.game, -1);

    //playerInfoHuds
    playerInfoHUDs = [];
    for (var numPlayer = 0; numPlayer < initialPlayers; numPlayer++) {
      playerInfoHUDs.push(new playerInfoHUD(this.game, HUDBombHead, numPlayer, pvpMode));
    }
    if (initialPlayers <= 2) playerInfoHUD.drawPressX(this.game, true);    
    playerInfoHUD.drawBombHud(this.game, pvpMode); //little bomb at the right

    //player/s (initialPlayers)
    players = [];
    for (var numPlayer = 0; numPlayer < initialPlayers; numPlayer++)
      players.push(new Player(this.game, level, numPlayer, tileData, groups, HUDBombHead));

    if (DEBUG) {
      console.log("Loaded...", Date.now() - this.startTime, "ms");
      console.log("\n PLAYER: ", players[0]);
      console.log("\n MAP: ", level.map);
    }

  },


  update: function () {

    this.game.physics.arcade.collide(groups.player, groups.wall);
    this.game.physics.arcade.collide(groups.player, groups.box);
    this.game.physics.arcade.collide(groups.player, groups.bomb);

    this.game.world.bringToTop(groups.flame);
    this.game.world.bringToTop(groups.player); //array doesnt work so group

    //update HUD + check for win (so no iterate players twice)
    for (var numPlayer = 0; numPlayer < playerInfoHUDs.length; numPlayer++) {

      playerInfoHUDs[numPlayer].updatePlayerInfoHud(players[numPlayer], pvpMode);

      if(players[numPlayer].wins === winsNec) //end of the match
      {
        this.endGameScreen();
      }
    }

    // gameOver.check(this.game, players);
    audioHUD.checkVisible();

    globalControls.addPlayerControl(gInputs, players, maxPlayers, playerInfoHUDs);
    if (config.HACKS) {
      globalControls.debugModeControl(gInputs, this.game, groups.player);
      globalControls.resetLevelControl(gInputs, level);
    }

    pauseMenu.offPauseMenuControl(this.game, gInputs);
  },


  paused: function () {
    pauseMenu.pausedCreate(audioHUD.music, this.game);
  },


  resumed: function () {
    pauseMenu.resumedMenu(audioHUD.music, gInputs, this.game);
  },


  render: function () {

    if (gInputs.debug.state) {
      groups.drawDebug(this.game);
      this.game.debug.bodyInfo(players[0], debugPos.x, debugPos.y, debugColor);
    }

  },

  shutdown: function () {
    audioHUD.destruction(this.game);
  },
};

module.exports = PlayScene;
