'use strict';
const DEBUG = true;
var pvpMode = true;

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
var players = [];
var initialPlayers = 4;
var maxPlayers = 4; //needed for the map generation

var music;

var pauseMenu = require('./pauseMenu.js');

var livesHUD;
var livesHUD1;
var livesHUD2;
var livesHUD3;
var HUDBg;
var HUDBombHead;
var HUDBombHead1;
var HUDBombHead2;
var HUDBombHead3;
var HUD2_0;
var HUD2_1;
var HUD2_2;
var HUD2_3;
var HUDBomb;
var HUDPressX;

var muteMusicButton;
var mutedMusicButton;
var lessVolButton;
var moreVolButton;

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

  toggleMute: function () { this.game.sound.mute = !this.game.sound.mute; },

  moreVol: function () { if(music.volume < 1) music.volume += 0.1; },

  lessVol: function () { if(music.volume > 0.2) music.volume -= 0.1; },

  create: function () {
    //music
    music = this.game.add.audio('music');
    music.loopFull(0.4); //la pauso que me morido quedo loco
    this.game.sound.mute = true;

    //menu stuff
    HUDBg = this.game.add.sprite(0, 0, 'HUDBg');
    HUDBomb = this.game.add.sprite(width/2, 10, 'bomb');
    HUDBomb.anchor.setTo(0.5, 0);
    HUDBomb.scale.setTo(1.2, 1.2);

    HUDBombHead = this.game.add.sprite(60, 10, 'player_0', 8);
    HUDBombHead.scale.setTo(0.75, 0.75);
    HUD2_0 = this.game.add.sprite(35+HUDBombHead.position.x, -5, 'HUD2');
    HUD2_0.scale.setTo(0.75, 0.75);

    HUDBombHead1 = this.game.add.sprite(HUDBomb.position.x - 150, 10, 'player_1', 8);
    HUDBombHead1.scale.setTo(0.75, 0.75);
    HUD2_1 = this.game.add.sprite(35+HUDBombHead1.position.x, -5, 'HUD2');
    HUD2_1.scale.setTo(0.75, 0.75);

    HUDBombHead2 = this.game.add.sprite(HUDBomb.position.x + 60, 10, 'player_2', 8);
    HUDBombHead2.scale.setTo(0.75, 0.75);
    HUD2_2 = this.game.add.sprite(35+HUDBombHead2.position.x, -5, 'HUD2');
    HUD2_2.scale.setTo(0.75, 0.75);

    HUDBombHead3 = this.game.add.sprite(HUDBomb.position.x + 240, 10, 'player_3', 8);
    HUDBombHead3.scale.setTo(0.75, 0.75);
    HUD2_3 = this.game.add.sprite(35+HUDBombHead3.position.x, -5, 'HUD2');
    HUD2_3.scale.setTo(0.75, 0.75);

    livesHUD = this.game.add.text(HUD2_0.position.x + 42, 15, "",
    { font: "45px Comic Sans MS", fill: "#f9e000", align: "center"});
    livesHUD.anchor.setTo(0.2, 0);

    livesHUD1 = this.game.add.text(HUD2_1.position.x + 42, 15, "",
    { font: "45px Comic Sans MS", fill: "#f9e000", align: "center"});
    livesHUD1.anchor.setTo(0.2, 0);
    // livesHUD1.visible = false;

    livesHUD2 = this.game.add.text(HUD2_2.position.x + 42, 15, "",
    { font: "45px Comic Sans MS", fill: "#f9e000", align: "center"});
    livesHUD2.anchor.setTo(0.2, 0);

    livesHUD3 = this.game.add.text(HUD2_3.position.x + 42, 15, "",
    { font: "45px Comic Sans MS", fill: "#f9e000", align: "center"});
    livesHUD3.anchor.setTo(0.2, 0);

    muteMusicButton = this.game.add.button(10, 40, 'unmuted', this.toggleMute, this);
    muteMusicButton.scale.setTo(0.1, 0.1);
    mutedMusicButton = this.game.add.button(10, 40, 'muted', this.toggleMute, this);
    mutedMusicButton.scale.setTo(0.1, 0.1);

    lessVolButton = this.game.add.button(10, 10, 'volArrow', this.lessVol, this);
    lessVolButton.scale.setTo(0.04, 0.04);

    moreVolButton = this.game.add.button(30, 10, 'volArrow', this.moreVol, this);
    moreVolButton.anchor.setTo(1, 1);
    moreVolButton.scale.setTo(0.04, 0.04);
    moreVolButton.angle = 180;

    // mMenuTitle = this.game.add.sprite(50, 0, 'mMenuTitle'); //vital for life on earth
    // mMenuTitle.scale = new Point(0.9, 0.75);                //nah just for presentation


    //map
    groups = new Groups(this.game); //first need the groups
    level = new Map(this.game, initialMap.world, initialMap.level, groups, tileData, maxPlayers, pvpMode);

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

    livesHUD.text = players[0].wins;
    livesHUD1.text = players[1].wins;
    livesHUD2.text = players[2].wins;
    livesHUD3.text = players[3].wins;

    if(music.mute) muteMusicButton.visible = false;
    else   muteMusicButton.visible = true;
    if(!music.mute) mutedMusicButton.visible = false;
    else mutedMusicButton.visible = true;

    this.game.world.bringToTop(groups.flame);
    this.game.world.bringToTop(groups.player); //array doesnt work

    globalControls.debugModeControl(gInputs, this.game, groups.player);
    globalControls.resetLevelControl(gInputs, level);
    pauseMenu.offPauseMenuControl(this.game, gInputs);
  },

  paused: function () {
    pauseMenu.pausedCreate(music, this.game);
  },

  resumed: function () {
    pauseMenu.resumedMenu(music, gInputs, this.game);
  },

  render: function () {

    if (gInputs.debug.state) {
      groups.drawDebug(this.game);
      this.game.debug.bodyInfo(players[0], debugPos.x, debugPos.y, debugColor);
    }

  },
};

module.exports = PlayScene;
