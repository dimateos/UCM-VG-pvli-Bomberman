'use strict';
const DEBUG = true;

var Point = require('../general/point.js');
var globalControls = require('../general/globalControls.js');

var Groups = require('../general/groups.js');
var groups;
var Map = require('../maps/map.js');
var level;
var initialMap = { world: 0, level: 0 };

var Inputs = require('../general/inputs.js');
var gInputs; //global inputs

var Player = require('../player/player.js');
var players = []; //2 max for this mode but meh
var initialPlayers = 1;
var maxPlayers = 4; //needed for the map generation

var pauseMenu = require('./pauseMenu.js');

var music;

const width = 800;
const height = 600;
const debugPos = new Point(32, height - 96);
const debugColor = "yellow";

const tileData = {
  Res: new Point(64, 64),
  Scale: new Point(0.75, 0.625), //64x64 to 48x40
  Offset: new Point(40, 80), //space for hud
};

var mMenuTitle;
var livesHUD;
var pointsHUD;
var HUDBg;
var HUDPoints;
var HUDBombHead;
var HUD2;
var HUDBomb;

var muteMusicButton;
var mutedMusicButton;
var lessVolButton;
var moreVolButton;

var HUD = require('../general/HUD.js');
var hud;


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
    
    //menu stuff
    hud = new HUD(this.game, true, music);

    HUDBg = this.game.add.sprite(0, 0, 'HUDBg');
    HUDPoints = this.game.add.sprite(500, -10, 'HUDPoints');
    HUDPoints.scale.setTo(0.75, 0.75);
    HUDBombHead = this.game.add.sprite(100, 10, 'player_0', 8);
    HUDBombHead.scale.setTo(0.75, 0.75);
    HUD2 = this.game.add.sprite(100+HUDBombHead.width, -5, 'HUD2');
    HUD2.scale.setTo(0.75, 0.75);
    HUDBomb = this.game.add.sprite(width/2, 10, 'bomb');
    HUDBomb.anchor.setTo(0.5, 0);
    HUDBomb.scale.setTo(1.2, 1.2);
  
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

    livesHUD = this.game.add.text(HUD2.position.x + HUD2.texture.width, 15, "",
        { font: "45px Comic Sans MS", fill: "#f9e000", align: "center"});
    livesHUD.anchor.setTo(0.2, 0);
    pointsHUD = this.game.add.text(HUDPoints.position.x + HUDPoints.texture.width - 60, 12, "",
        { font: "45px Comic Sans MS", fill: "#f9e000", align: "center"});
    pointsHUD.anchor.setTo(0.2, 0);

    //map
    groups = new Groups(this.game); //first need the groups
    level = new Map(this.game, initialMap.world, initialMap.level, groups, tileData, maxPlayers);

    //global controls
    gInputs = new Inputs(this.game, -1);


    //player/s (initialPlayers)
    players = [];
    for (var numPlayer = 0; numPlayer < initialPlayers; numPlayer++) {
      players.push(new Player(this.game, level, numPlayer, tileData, groups));
      players[numPlayer].startCountdown();
    }


    if (DEBUG) {
      console.log("Loaded...", Date.now() - this.startTime, "ms");
      console.log("\n PLAYER: ", players[0]);
      console.log("\n MAP: ", level.map);
    }

  },


  update: function () {

    //No longer needed
    // this.game.physics.arcade.collide(groups.player, groups.wall);
    // if (!gInputs.debug.state) {
    //   this.game.physics.arcade.collide(groups.player, groups.box);
    //   this.game.physics.arcade.collide(groups.player, groups.bomb);
    // }
    // else this.game.physics.arcade.collide(players[0], groups.enemy);

    this.game.world.bringToTop(groups.flame);
    this.game.world.bringToTop(groups.player); //array doesnt work

    globalControls.addPlayerControl(gInputs, players, maxPlayers);
    globalControls.debugModeControl(gInputs, this.game, groups.player);
    globalControls.resetLevelControl(gInputs, level);
    globalControls.nextLevelControl(gInputs, level);
    pauseMenu.offPauseMenuControl(this.game, gInputs);
  },

  paused: function() {
    pauseMenu.pausedCreate(music, this.game);
  },

  resumed: function () {
    pauseMenu.resumedMenu(music, gInputs, this.game);
  },

  render: function () {
  
    livesHUD.text = players[0].lives;
    pointsHUD.text = players[0].points;

    if(music.mute) muteMusicButton.visible = false;
    else   muteMusicButton.visible = true;
    if(!music.mute) mutedMusicButton.visible = false;    
    else mutedMusicButton.visible = true;
    if (gInputs.debug.state) {
      groups.drawDebug(this.game);
      this.game.debug.bodyInfo(players[0], debugPos.x, debugPos.y, debugColor);
    }

  },
};

module.exports = PlayScene;
