'use strict';
const pvpMode = true;
const config = require('../config.js');
const keys = config.keys;

const DEBUG = config.DEBUG;
const winWidth = config.winWidth;
const winHeight = config.winHeight;

const debugPos = config.debugPos;
const debugColor = config.debugColor;

var Point = require('../general/point.js');
var globalControls = require('../general/globalControls.js');
var pauseMenu = require('../HUD/pauseMenu.js');

var Groups = require('../general/groups.js');
var groups;
var Map = require('../maps/map.js');
var level;
var initialMap = config.initialMapPvP;

var Inputs = require('../general/inputs.js');
var gInputs; //global inputs

const Player = require('../player/player.js');
const initialPlayers = config.pvp_initialPlayers;
const maxPlayers = config.pvp_maxPlayers; //needed for the map generation
var players = [];

var music;


var livesHUD;
var livesHUD1;
var livesHUD2;
var livesHUD3;
var HUDBg;
var HUDBombHead;
var HUDBombHead1;
var HUDBombHead2;
var HUDBombHead3;
var HUDBombHeadArray = [];
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

const tileData = config.tileData;



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
    HUDBomb = this.game.add.sprite(winWidth/2, 10, 'bomb');
    HUDBomb.anchor.setTo(0.5, 0);
    HUDBomb.scale.setTo(1.2, 1.2);

    HUDBombHead = this.game.add.sprite(60, 10, 'player_0Clock', 8);
    HUDBombHead.scale.setTo(0.75, 0.75);
    HUD2_0 = this.game.add.sprite(35+HUDBombHead.position.x, -5, 'HUD2');
    HUD2_0.scale.setTo(0.75, 0.75);

    HUDBombHead1 = this.game.add.sprite(HUDBomb.position.x - 150, 10, 'player_1Clock', 8);
    HUDBombHead1.scale.setTo(0.75, 0.75);
    HUD2_1 = this.game.add.sprite(35+HUDBombHead1.position.x, -5, 'HUD2');
    HUD2_1.scale.setTo(0.75, 0.75);

    HUDBombHead2 = this.game.add.sprite(HUDBomb.position.x + 60, 10, 'player_2Clock', 8);
    HUDBombHead2.scale.setTo(0.75, 0.75);
    HUD2_2 = this.game.add.sprite(35+HUDBombHead2.position.x, -5, 'HUD2');
    HUD2_2.scale.setTo(0.75, 0.75);

    HUDBombHead3 = this.game.add.sprite(HUDBomb.position.x + 240, 10, 'player_3Clock', 8);
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
    HUDBombHeadArray = [HUDBombHead, HUDBombHead1, HUDBombHead2, HUDBombHead3];
    for (var numPlayer = 0; numPlayer < initialPlayers; numPlayer++)
      players.push(new Player(this.game, level, numPlayer, tileData, groups, HUDBombHeadArray));

    if (DEBUG) {
      console.log("Loaded...", Date.now() - this.startTime, "ms");
      console.log("\n PLAYER: ", players[0]);
      console.log("\n MAP: ", level.map);
    }

  },

  update: function () {

    //level.battleRoyale();

    livesHUD.text = players[0].wins;
    livesHUD1.text = players[1].wins;
    livesHUD2.text = players[2].wins;
    livesHUD3.text = players[3].wins;

    if(music.mute) muteMusicButton.visible = false;
    else   muteMusicButton.visible = true;
    if(!music.mute) mutedMusicButton.visible = false;
    else mutedMusicButton.visible = true;

    // for(var i = 0; i<players.length; i++){
    //   if(players.[i].wins > 1){

    //   }
    // }

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
