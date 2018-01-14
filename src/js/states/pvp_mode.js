'use strict';
const DEBUG = true;

var Point = require('../general/point.js');
var globalControls = require('../general/globalControls.js');

var Groups = require('../general/groups.js');
var groups;
var Map = require('../maps/map.js');
var level;
var initialMap = { world: 1, level: 0 };

var Inputs = require('../general/inputs.js');
var gInputs; //global inputs

var Player = require('../player/player.js');
var players = []; //2 max for this mode but meh
var initialPlayers = 4;
var maxPlayers = 4; //needed for the map generation

const width = 800;
const height = 600;
const debugPos = new Point(32, height - 96);
const debugColor = "yellow";

const tileData = {
  Res: new Point(64, 64),
  Scale: new Point(0.75, 0.625), //64x64 to 48x40
  Offset: new Point(40, 80), //space for hud
};

var mMenuTitle; //still not definitive

var PlayScene = {

  preload: function () {
    //this.game.stage.backgroundColor = '#E80C94';
    if (DEBUG) this.startTime = Date.now(); //to calculate booting time
  },

  create: function () {
    //menu stuff
    mMenuTitle = this.game.add.sprite(50, 0, 'mMenuTitle'); //vital for life on earth
    mMenuTitle.scale = new Point(0.9, 0.75);                //nah just for presentation

    //map
    groups = new Groups(this.game); //first need the groups
    level = new Map(this.game, initialMap.world, initialMap.level, groups, tileData, maxPlayers);

    //global controls
    gInputs = new Inputs(this.game, -1);

    //player/s (initialPlayers)
    for (var numPlayer = 0; numPlayer < initialPlayers; numPlayer++)
      players.push(new Player(this.game, level, numPlayer, tileData, groups));

    if (DEBUG) {
      console.log("Loaded...", Date.now() - this.startTime, "ms");
      console.log("\n PLAYER: ", players[0]);
      console.log("\n MAP: ", level.map);
    }

  },

  update: function () {

    this.game.world.bringToTop(groups.flame);
    this.game.world.bringToTop(groups.player); //array doesnt work

    globalControls.debugModeControl(gInputs, this.game);
    globalControls.resetLevelControl(gInputs, level);
  },

  render: function () {

    if (gInputs.debug.state) {
      groups.drawDebug(this.game);
      this.game.debug.bodyInfo(players[0], debugPos.x, debugPos.y, debugColor);
    }

  },
};


module.exports = PlayScene;
